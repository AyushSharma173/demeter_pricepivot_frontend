import * as functions from "firebase-functions";

import env from "../../env"
import Stripe from "stripe"
import { Endpoint, getVal, IHttpError, returnError, setVal, TestEmails, updateVal } from "../commons";
import moment = require("moment");
import types from "../commons/refGlobalTypes";
import { sendMail, sendTemplateEmail } from "../commons/mailer";
import EmailTemplates from "../runtime_constants/EmailTemplates";

const stripe_prod = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
  appInfo: { // For sample support and debugging, not required for production:
    name: "stripetesting",
    version: "0.0.1",
    url: env.SELF_URL
  }
});

const stripe_test = new Stripe(env.STRIPE_TEST_KEY, {
  apiVersion: '2022-08-01',
  appInfo: { // For sample support and debugging, not required for production:
    name: "stripetesting",
    version: "0.0.1",
    url: env.SELF_URL
  }
});

function getStripe(token?:types.ITokenConent,TEST_DATA?:boolean)
{
  if (TEST_DATA){
    return stripe_test;
  }
  else if (token?.email && TestEmails.USERS.includes( token?.email)){
    return stripe_test;
  }
  else {
    return stripe_prod;
  }
}

export const validateCoupon =  Endpoint<{coupon: string}, {valid: boolean}>(async (p) => {
  try {
    // Retrieve the coupon details from Stripe
    const coupon = await stripe_prod.coupons.retrieve(p.coupon?.toUpperCase());
  if (!coupon.valid) {
    return {valid: false};
  }else {
    const email = p.token?.email || "";
    let coupon: types.ICoupon = { coupon: p.coupon?.toUpperCase(), verified: false, time_secs: Math.round(moment().utc().valueOf() / 1000) };
    await setVal({args: ["userCoupons", email], val: coupon})

    return {valid: true};
  }
  } catch (err: any) {
    functions.logger.debug(">>>>>>>>>>>>>> INVALID", err)
  }
  return {valid: false};
})

//   "npm --prefix \"$RESOURCE_DIR\" run lint",
export const products = Endpoint<void,Array<{name:string,paymentLink:string}>>(async ({token}) => {
  const stripe=getStripe(token);
  let x=await stripe.products.list()
  const IS_STUDENT=token?.email && token?.email.includes(".edu")
  let response:Array<any> = []
    for (let p of x.data) {
      if (!p.metadata.paymentLink) {
        let error:IHttpError={status_code:500,message:"Payment link not found for product:" + p.name}
        throw error
        
      }
      else {
        if (IS_STUDENT){
          if (p.name.includes("#student"))
          {
            response.push({ name: p.name.replace("#student",""), paymentLink: p.metadata.paymentLink })
          }
        }
        else {
          if (!p.name.includes("#student"))
          {
            response.push({ name: p.name, paymentLink: p.metadata.paymentLink })
          }
        }
      }
    }
    return response.reverse()

})

export const _userSubscription=async ({token}:{token?:types.ITokenConent},onExpiration?:()=>void)=>{
  //functions.logger.info("Hello logs!", {structuredData: true});
  const stripe=getStripe(token);
  let id = token?.email as string
  if (!id) {
    let error:IHttpError={status_code:400,message:"id is missing"}
    throw error
  }
  else {
    let subscriptions:Array<Stripe.Subscription & {isCanceled?:boolean}>=[];
  ( (await stripe.customers.list({email:id,expand:["data.subscriptions"]})).data || []).forEach(x=>subscriptions.push(...x.subscriptions?.data!  ))

        if(!subscriptions.length){
         let canceledSubscription: Stripe.Subscription= await getVal("users",id,'canceledSubscription')
         if (canceledSubscription ){
          if( moment(canceledSubscription.current_period_end*1000).diff(moment(),"d")>0 ){
            subscriptions.push({...canceledSubscription,isCanceled:true})
          }
          else {
            onExpiration && onExpiration()
          }
         }
        }
        else {
          subscriptions.sort((a)=>(a.status=='active' ? -1:1))
        }
        if (id=='dev_pay_fail@mailinator.com'){
          
          subscriptions= subscriptions.map((x:any)=>({...x,status:"incomplete_expired"}))
          
        }
        return subscriptions
  }
}
export const userSubscription = Endpoint<{},Array<Stripe.Subscription & {isCanceled?:boolean}>>(_userSubscription);

export const buy= functions.https.onRequest(async (request,response)=>{

  let {email,link, coupon}=request.query as any
  if (!email || !link)
  {
    response.status(400).send("Bad Request"+JSON.stringify(request.query))
  }
  email=(email as string)?.toLowerCase()
  const stripe=getStripe({email});
  let stipeId=(await stripe.customers.list({email})).data.pop()?.id

  functions.logger.log("Strip ID",stipeId)
  if (!stipeId)
  {
  let stripeCustomer= await    stripe.customers.create({
      email
    })
    stipeId=stripeCustomer.id
  }

  response.redirect(link+"?"+new URLSearchParams({client_reference_id:stipeId,prefilled_email:email, prefilled_promo_code: coupon?.toUpperCase()}))

})

export const paymentCompleted=functions.https.onRequest(async (r,rs)=>{

  const stripe=getStripe(undefined,!!r.query.TEST_DATA);
  let session = await stripe.checkout.sessions.retrieve(r.query.id as string);
  let refCustomer:any =await  stripe.customers.retrieve(session.client_reference_id as string);

  if(refCustomer.email){
    await updateVal({args: ["userCoupons", refCustomer.email], val: {verified: true}})
  }else{
    functions.logger.debug(">>>>>>>>>>>>>> not verified", session.total_details?.amount_discount);
  }
  
  // @ts-ignore
  await stripe.customers.update(session.customer,{email:refCustomer.email})
  
  try {
    let time_secs: number = moment.utc().valueOf() / 1000;
    await updateVal({args:["user_audit", refCustomer.email], val:{"payment_on": time_secs}})
    sendTemplateEmail([refCustomer.email],EmailTemplates.ON_BUY,{},undefined,true)
  
  }
  catch(_){

  }
  rs.redirect("/ping")

})

export const cancelSubscription =Endpoint<{subscription:Stripe.Subscription},string>(async ({subscription,token}) => {
  //functions.logger.info("Hello logs!", {structuredData: true});
  const stripe=getStripe(token);
  const {id}=subscription
  if (!id) {
    let error:IHttpError={status_code:400,message:"id is missing"}
    throw error
  }
 await stripe.subscriptions.cancel(id)
 if (token?.email && TestEmails.USERS.includes(token?.email) )
 {
  //do nothing
 }
 else 
 await setVal({args:["users",token?.email!,"canceledSubscription"],val:{...subscription,status:"canceled"}})
return "done"
})

export  async function updateSubscriptionStatus(email:string){
  let subs=await _userSubscription({token:{email}},async ()=>{
    await updateVal({args:["users",email],val:{sub_status:'no_sub'}})
  })
  let sub=subs?.[0]
  if (sub){
    let status:types.ISub_Status= sub.isCanceled ?  'app_canceled' : sub.status
    await updateVal({args:["users",email],val:{sub_status:status}})
  } 
}

//1673768705