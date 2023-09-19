import * as functions from "firebase-functions";
import types from "./src/commons/refGlobalTypes"
import { encode, encodeKey, Endpoint, generateToken, getRef, getVal, IHttpError, IsBadRequest, makeid, pushVal, ReplaceCodes, returnMethodNotAllowed, setVal, sleep, TestEmails, throwError, updateVal, getAppMode, withAuth } from "./src/commons";
import * as _stripe from "./src/stripe"
import * as _twilio from "./src/twilio"
import * as user from "./user"
import * as jwt from "jsonwebtoken"
import env from "./env";
import questions from "./src/runtime_constants/questions";
import moment = require("moment");
import { sendMail, sendTemplateEmail } from "./src/commons/mailer";
import { changePassword, sendVerificationEmail, verifyEmail } from "./verification";
import * as jobs from "./jobs";
import * as admin from "firebase-admin"
import * as providers from "./providers"
import * as adminFuntions from "./admin"
import StateTimeZone from "./src/runtime_constants/StateTimeZone";
import EmailTemplates from "./src/runtime_constants/EmailTemplates";

admin.initializeApp({
  credential: admin.credential.cert(env.SERVICE_ACCOUNT as any),
  databaseURL: env.DATABASE_URL
});

const bcrypt = require("bcryptjs");
const ics = require('ics')

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const ping = Endpoint<void,string>((p) => {

  functions.logger.info("Hello logs!", { structuredData: true });
  return pingScriptHtml
},false);

const getCloud= Endpoint<void,types.ICloud>(()=>{

  let cloudOut:types.ICloud={}

  function setPaths(node:types.ICloud,prefix="",out:types.ICloud={}){

    Object.keys(node).forEach(key=>{
       let child=  node[key]
       if (child.__isEndpoint)
       {
        let inEndpoint=child as types.IEndPoint<any,any>
        let endpoint:types.IEndPoint<any,any>={
            __path:prefix+key,
            __isAuthorized:inEndpoint.__isAuthorized,
            __isEndpoint:inEndpoint.__isEndpoint
        } as any
        out[key]=endpoint

       }
       else if (!(child as any).__endpoint) {
        out[key]={}
        setPaths(child as types.ICloud,key+"-",out[key] as any)
       }
    })
    return out;
  }
  cloudOut= setPaths(cloud as any,"")
  
  return cloudOut

},false)

 const login =Endpoint<{email:string,password:string},{token:string,user:types.IUser}>(async (params)=>{

  let {email,password}=params

  IsBadRequest({email,password})
  email=email?.toLowerCase()
  let user :types.IUser=await getVal("users",email)
  functions.logger.info("sx",user)
  if (!user || user.deleted || !(await bcrypt.compare(password, user.enc_password))){
    throwError({status_code:401,message:"Email or password do not match!"})
  }
  
  let token= generateToken(email)
  
  
  let responseData:any={token,user}
  return responseData

},false)

const getUserQuestions=Endpoint<void,typeof questions>(()=>{
  return questions
},false)

const signup=Endpoint<{email:string, password:string,source?:"apple" | "google" | "facebook"},{token:string}>(async (p)=>{
 p.email=p.email?.toLowerCase()
  let exist:types.IUser= await getVal("users",p.email)
  if (exist && !exist.deleted)
  {
    throwError({status_code:403,message:"Account with email "+p.email+" already exists"})
  }
  let user:types.IUser={ email:p.email, signed_on: moment().utc().format("YYYY-MM-DDTHH:mm") ,enc_password:await bcrypt.hash(p.password,env.SALT)}
  if (p.source){
    user.source=p.source
  }
  await setVal({args:["users",p.email],val:user})

  let time_secs: number = moment.utc().valueOf() / 1000;
  await updateVal({args:["user_audit", p.email], val:{"signed_on": time_secs}})

  return {token:generateToken(p.email)}
},false)
 const testAuth=withAuth((r,rsp)=>{

  rsp.send(r.body["token"])
})

const updateUser=Endpoint<types.IUser,types.IUser>(async user=>{
  let dbUser:types.IUser=  await getVal("users",user.email?.toLowerCase())
  
  let time_secs: number = moment.utc().valueOf() / 1000;
  let user_audit: any = null;

  if (dbUser){
    if (user.full_name!=undefined) {
       dbUser.full_name  = user.full_name
       user_audit = {full_name: user.full_name};
    }
    if (!dbUser.created_on){
      dbUser.created_on=moment().utc().format("YYYY-MM-DDTHH:mm")
      user_audit = user_audit ?? {};
      user_audit["created_on"] = time_secs
    }
    if (user.details!=undefined) dbUser.details    = user.details
    if (user.dob!=undefined) dbUser.dob  = user.dob
    if (user.state!=undefined) dbUser.state  = user.state
    if (user.img!=undefined){
      dbUser.img=user.img
      user_audit = user_audit ?? {};
      user_audit["img"] = user.img
    }  
    if (user.deleted){
      dbUser.deleted=user.deleted
      user_audit = user_audit ?? {};
      user_audit["deleted_on"] = time_secs
    } 
  }
  await setVal({args:["users",user.email?.toLowerCase()],val:dbUser})

  if(user_audit) {
    await updateVal({args:["user_audit", user.email?.toLowerCase()], val:user_audit})
  }

  return user
})

const getRecommendations=Endpoint<void,Array<types.IProvider>>(async ({token})=>{
  let arr:Array<any>=[]
  if (token?.email!='demo1@yopmail.com'){ // not equals 
  let providers:any=[]
  //if (process.env.FUNCTIONS_EMULATOR=="true")
  providers=Object.values(( await (getRef("providers").orderByChild('status').equalTo("active").limitToFirst(100).once("value")) ) .val())
  //else
  //providers=[ await getVal("providers","devP2@gmail.com") ]

  Object.values(providers).forEach(x=>{
    arr.push(x)
  })
    
    arr = await sortByRecommendations(token?.email ?? "", arr);
  if ( TestEmails.USERS.includes(token?.email!) ){
    const testingProvider=await getVal("providers",env.NAME=='DEV'  ? "dev_shahid@mailinator.com":TestEmails.PROVIDERS[0])
    if (testingProvider)
    {
      arr=[testingProvider,...arr]
    }
  }

  }
  else { // TESTING CASE
    let providers:any=[ await getVal("providers",process.env.FUNCTIONS_EMULATOR=="true"  ? "dev_shahid@mailinator.com":"devshahid@yopmail.com") ]

    Object.values(providers).forEach((x:any)=>{
      arr.push(x)
    })
  }

  arr=arr.map((x:any)=>({...x,rating:5,location:x.state,total_sessions:'-',feedbacks:[]}))
  return arr.map((x:any)=>ReplaceCodes(x))
})

async function sortByRecommendations(userEmail: string, providers: Array<any>){
  let userDetails: any=await getVal("users",userEmail,"details")
  let userState :string=await getVal("users",userEmail,"state")
  const clientPreferences = {
    //@ts-ignore
    preferredSports: userDetails?.PLAY?.answer?.join(',') ?? "",
    //@ts-ignore
    preferredLevelOfSports: userDetails?.LEVL?.answer?.join(',') ?? "",
    //@ts-ignore
    preferredAreasOfService: userDetails?.HELP?.answer?.join(',') ?? "",
    //@ts-ignore
    genderPreference: userDetails?.PROG?.answer?.join(',') ?? "",
  };

  providers.forEach(provider => {
    let score = 0;
    provider.details?.PLAY?.answer?.forEach((sport:string) => {
      if(clientPreferences.preferredSports.indexOf(sport) > -1){
        score++;
      }
    })

    provider.details?.LEVEL?.answer?.forEach((sportLevel:string) => {
      if(clientPreferences.preferredLevelOfSports.indexOf(sportLevel) > -1){
        score++;
      }
    })

    provider.details?.PRIM?.answer?.forEach((service:string) => {
      if(clientPreferences.preferredAreasOfService.indexOf(service) > -1){
        score+=2;
      }
    })

    provider.details?.SECO?.answer?.forEach((service:string) => {
      if(clientPreferences.preferredAreasOfService.indexOf(service) > -1){
        score++;
      }
    })
    
    provider.details?.GEND?.answer?.forEach((gender:string) => {
      if(clientPreferences.genderPreference.indexOf(gender) > -1){
        score+=4;
      }
    })
    
    if (provider.state==userState){
      score++
    }
    
    provider.matchingScore = score;
  })
  
  providers = providers.sort((a, b) => b.matchingScore - a.matchingScore);

  return providers.slice(0,5)
}

const bookProvider=Endpoint<{provider_email:string},{booked:boolean}>(async ({token,provider_email})=>{

  const {email}=token!

  let booking:types.IBooking={ provider_email,user_email:email,dateTime:moment().utc().format("YYYY-MM-DDTHH:mm")}
  let bookingId= await pushVal({args:["bookings"],val:booking})
  await updateVal({args:["users",email],val:{bookingId}})
  //set booking time
  let time_secs: number = moment.utc().valueOf() / 1000;
  await updateVal({args:["user_audit", email], val:{"booked_on": time_secs, "provider_email" : provider_email }})

  let userName:string =await getVal("users", email,"full_name")
  sendBookingNotification(userName, provider_email);
  return {booked:true}
})

function sendBookingNotification(name: string, email: string) {

    sendTemplateEmail([email],EmailTemplates.NEW_BOOKING,{name},undefined,true)
    
}

const cancelProvider=Endpoint<{provider_email:string,cancel_reason:string},{done:boolean}>(async ({token,provider_email,cancel_reason})=>{
  const {email}=token!
  const bookingId=await getVal("users",email,"bookingId")
  await updateVal({args:["users",email],val:{bookingId:null}})
  await updateVal({args:["bookings",bookingId],val:{canceled_on:moment().utc().format("YYYY-MM-DDTHH:mm"),cancel_reason}})
  
  const full_name: string =await getVal("users",email,"full_name")
  sendCancelBookingNotification(full_name, provider_email);

  return {done:true}
})

const rateAppAndProvider=Endpoint<{provider_email:string, bookingId: string, feedback:any},{done:boolean}>(async ({bookingId,provider_email,feedback})=>{
  await pushVal({args:["appFeedback"],val: feedback.appFeedback});
  await pushVal({args:["providers", provider_email, "feedbacks"],val: feedback.providerFeedback});
  await setVal({args:["bookings", bookingId, "feedbackReceived"],val: true});

  return {done:true}
})

function sendCancelBookingNotification(name: string, email: string) {
  sendTemplateEmail([email],EmailTemplates.BOOKING_CANCELED,{name},undefined,true)
  
}

const getUser=Endpoint<{version:string},types.IUser>(async ({token,version})=>{
  if (!version && false)
  { let error:IHttpError={status_code:500,message:"Please update your application"}
  throw error;
  }
  await _stripe.updateSubscriptionStatus(token?.email?.toLowerCase()!)
  return await getVal("users",token?.email?.toLowerCase())

})

const getProviderForBooking=Endpoint<{bookingId:string},types.IProvider &{feedbackPending?:boolean} >( async ({bookingId})=>{
  
  let booking: types.IBooking =await getVal("bookings",bookingId)
  let p=ReplaceCodes( await getVal("providers",booking.provider_email))
  
  let feedbackPending = booking.feedbackReceived != true && moment().diff(moment.utc(booking.dateTime, 'YYYY-MM-DDTHH:mm', true), 'days') >= 21
  
  return {...p, total_sessions:'-' as any,location:p.state!,feedbacks:[], feedbackPending: feedbackPending}
})

const stripe = _stripe
const twilio = _twilio

// Send message
const send=Endpoint<{to:string,time_secs:number,threadId:string,msg:string,name:string,isUser:boolean},{done:true}>(async (params)=>{

  let sender=params.token?.email
  let {threadId,time_secs,isUser,to,msg}=params
  
  if(isUser) {
    const dbUser:types.IUser            = await getVal("users", sender)
    const sub_status: types.ISub_Status = dbUser.sub_status!
    //@ts-ignore
    const app_status = getAppMode(sub_status);
    if( app_status == "no_sub" || app_status == "fault"){
      throwError({status_code:403,message:"Please buy subscription to avail the services."})
    }
    else if (app_status=='trial_completed'){
      if ( moment.utc().diff(moment( dbUser.sub_status_uat || '2023-06-10','YYYY-MM-DD'),"days") >7 ){
        throwError({status_code:403,message:"Free trial is expired. Please buy subscription to avail the services."})
      }
    }
  }

  let thread={threadId,updatedAt_secs:time_secs,last_msg:msg}
  await setVal({args:[(isUser ? "users":"providers"),sender,"threads",to],val:thread})
  await setVal({args:[(isUser ? "providers": "users"),to,"threads",sender],val:thread})
  let message={from:sender,to,time_secs,msg}
  await pushVal({args:["threads",threadId],val:message})
  
  getVal("tokens",to).then((pushToken:any)=>{
    if (pushToken)
    admin.messaging().send({
      token:pushToken,
      data:{
        isMsg:"true"
      },
      notification:{
        title:params.name,
        body:msg,
      
       
      },
      apns:{
        payload:{
          aps:{
            sound:"default"
          }
        }
      }

    })
  })


  return {done:true}
})

const addNote=Endpoint<{user_email:string,time_secs:number,msg:string},{done:true}>(async (params)=>{
  let creator_email=params.token?.email.toLowerCase() ?? ""
  let {user_email,time_secs,msg}=params
  let note: types.INote={time_secs,msg}
  await pushVal({args:["notes",creator_email,user_email],val:note})
  
  return {done:true}
})

const getNotes=Endpoint<{user_email:string}, types.INote[]>(async (params)=>{
  const query = await getRef("notes", params.token?.email?.toLowerCase(), params.user_email.toLowerCase()).once("value");
  let notes:types.INote[]=Object.entries<types.INote>(query.val() || {}).map(([key,value])=>{
      return {...value}
      })

  return notes;
})

const schedule = Endpoint<
  { bookingId?: string; dateTimeUTC: string, clientEmail?:string },
  { done: true }
>(async (r) => {
  const user: types.IUser = await getVal("users", r.clientEmail ?? r.token?.email!);  
  const scheduledByProvider: boolean = r.clientEmail != null;
  r.bookingId = r.bookingId ?? user.bookingId;
  //@ts-ignore
  const app_status = getAppMode(user.sub_status);
  if(app_status == "trial_completed" || app_status == "no_sub" || app_status == "fault"){
    throwError({status_code:403,message:scheduledByProvider ? "Client has not bought subscription." :"Please buy subscription to avail the services."})
  }
  
  let provider_email: string = scheduledByProvider
    ? (r.token?.email || "")
    : await getVal("bookings", r.bookingId, "provider_email");

  const provider: types.IProvider = await getVal("providers", provider_email);
  const sequence: number = Number(await getVal(
    "bookings",
    r.bookingId,
    "meetingInvites",
    r.dateTimeUTC,
    "sequence"
  )) ?? 0;

  //send to provider
  sendInviteEmail(r.bookingId!, user.full_name!, provider.email, r.dateTimeUTC, provider.timezone!, sequence, true);

  //send to user
  sendInviteEmail(r.bookingId!, provider.name, user.email, r.dateTimeUTC, user.timezone! || StateTimeZone[user.state! as any] || "US/Central" , sequence, false);

  let is_trial:boolean = app_status === "trial";
  let time_secs: number = moment.utc(r.dateTimeUTC).valueOf() / 1000;
  await setVal({
    args: ["bookings", r.bookingId, "meetings", r.dateTimeUTC],
      val: { active: true, is_trial: is_trial, time_secs: time_secs },
  });

  await setVal({
    args: ["bookings", r.bookingId, "meetingInvites", r.dateTimeUTC],
    val: {sequence: sequence+1},
  });

  await updateVal({args:["user_audit", user.email], val:{"scheduled_on": time_secs, "is_on_trial": is_trial, "provider_email": provider.email }})

  return { done: true };
});

const setMeetingCompleted = Endpoint<
  { bookingId: string; dateTimeUTC: string },
  { done: boolean }
>(async (r) => {
    await setVal({
      args: ["bookings", r.bookingId, "meetings", r.dateTimeUTC, "is_completed"],
      val: true,
    });
  
    return { done: true };
});


function sendInviteEmail(bookingId: string, name: string, email: string, dateTimeUTC: string, timezone: string, sequence: number, is_provider: boolean) {
  const utcTime   = moment(dateTimeUTC)
  const localTime = moment.utc(dateTimeUTC).tz(timezone!);

  const pTime = localTime
    .format("dddd, MMMM D,* hh:mm a")
    .replace("*", "by");

    const title = is_provider ? 'Client' : 'Professional'
    const details = is_provider ? `visit portal and see appointments section.<br>
    https://web.thegameonapp.com` : `visit GameOn! mobile application.`


  // Define the event details
  const event = {
    title: "Meeting with " + name,
    uid: name + bookingId + dateTimeUTC + "@gameon.com",
    sequence: sequence,
    method: "REQUEST",
    status: "CONFIRMED",
    busyStatus: 'BUSY',
    start: [
      utcTime.year(),
      utcTime.month() + 1,
      utcTime.date(),
      utcTime.hour(),
      utcTime.minute(),
    ],
    startInputType:"utc",
    startOutputType:"utc",
    duration: { hours: 1 },
    description: "Meeting with " + name+ ` @${pTime} ${timezone}`,
    location: "Game On",
    alarms: [{
      action: 'display',
      description: 'Reminder',
      trigger: {hours:0,minutes:10,before:true},
      repeat: 1,
      attachType:'VALUE=URI',
      attach: 'Glass'
    }],
  };
 // functions.logger.info("dtutc",dateTimeUTC)
 // functions.logger.info("utc",utcTime.hour())
  ics.createEvent(event, (error:any, value:any) => {
    if (error) {
      functions.logger.error("sending Failed ", error);
      return;
    }

    sendTemplateEmail(
      [email],
      EmailTemplates.MEETING_SCHEDULED,
      {pTime,timezone,title,name,details},
      {
        filename: "invite.ics",
        content: value,
      }
    );
  });

}

const cancelMeeting = Endpoint<
  { bookingId: string; dateTimeUTC: string },
  { done: true }
>(async (r) => {
  let provider_email: string = r.token?.isProvider
    ? r.token?.email
    : await getVal("bookings", r.bookingId, "provider_email");
  let user_email: string = r.token?.isProvider
    ? await getVal("bookings", r.bookingId, "user_email")
    : r.token?.email!;
  const provider: types.IProvider = await getVal("providers", provider_email);
  const user: types.IUser = await getVal("users", user_email);

  const sequence: number = Number(await getVal(
    "bookings",
    r.bookingId,
    "meetingInvites",
    r.dateTimeUTC,
    "sequence"
  )) ?? 1;

  //send to provider
  sendCancelEmail(r.bookingId, user.full_name!, provider.email, r.dateTimeUTC, provider.timezone!, sequence, true);

  //send to user
  sendCancelEmail(r.bookingId, provider.name, user.email, r.dateTimeUTC, user.timezone! || StateTimeZone[user.state! as any] || "US/Central", sequence, false);

  await setVal({
    args: ["bookings", r.bookingId, "meetings", r.dateTimeUTC],
    val: {},
  });

  await setVal({
    args: ["bookings", r.bookingId, "meetingInvites", r.dateTimeUTC],
    val: {sequence: sequence+1},
  });

  return { done: true };
});

function sendCancelEmail(bookingId: string, name: string, email: string, dateTimeUTC: string, timezone: string, sequence: number, is_provider: boolean) {
  const utcTime   = moment(dateTimeUTC)
  const localTime = moment.utc(dateTimeUTC).tz(timezone!);

  const pTime = localTime
    .format("dddd, MMMM D,* hh:mm a")
    .replace("*", "by");
  const title = is_provider ? 'Client' : 'Professional'

  // Define the event details
  const event = {
    title: "Meeting Cancelled with " + name,
    uid: name + bookingId + dateTimeUTC + "@gameon.com",
    sequence: sequence,
    method: "CANCEL",
    status: "CANCELLED",
    start: [
      utcTime.year(),
      utcTime.month() + 1,
      utcTime.date(),
      utcTime.hour(),
      utcTime.minute(),
    ],
    duration: { hours: 1 },
  };

  ics.createEvent(event, (error:any, value:any) => {
    if (error) {
      return;
    }

    sendTemplateEmail (
      [email],
      EmailTemplates.MEETING_CANCELED,
      {title,name,pTime},
      {
        filename: "cancellation.ics",
        content: value,
      }
    );
  });

}
const getSchedules=Endpoint<{bookingId:string},Array<{dateTimeUTC:string}>>(async({bookingId})=>{

  let meetings=  await getVal("bookings",bookingId,"meetings") || {}

  const activeMeetingTime = moment.utc().subtract(1, "hour").valueOf()/1000;
  let activeMeetings: Array<{dateTimeUTC:string}> = [];
  Object.keys(meetings).forEach(k => {
    //@ts-ignore
    if(meetings[k].time_secs >= activeMeetingTime){
      activeMeetings.push({dateTimeUTC:k});
    }
  });

  return activeMeetings;
})

const testMail=Endpoint<void,void>(async r=>{
  // for testing purposes
  let res= await sendMail(["sheharyar-shahid@outlook.com"],"Email Verification","Your OTP is 1231938")
  functions.logger.info(res)
  return res;
},false)

const registerToken=Endpoint<{push_token:string},void> (async(p)=>{

  const email=p?.token?.email
  await setVal({args:["tokens",email],val:p.push_token})
  

})
const unRegisterToken=Endpoint<{push_token:string},void> (async(p)=>{

  const email=p?.token?.email
  await setVal({args:["tokens",email],val:null})
  

})

const getFirebasePass=Endpoint<void,{password:string}>(async ({token})=>{

  let {email}=token!
  email=email.toLowerCase()
  var auth_user=undefined
  try {
    auth_user=await admin.auth().getUserByEmail(email)
  }
  catch(e:any){
    if (e?.code=="auth/user-not-found")
    {
      functions.logger.info("Creating user")
    
      auth_user={
        uid:encodeKey(email),
        email,
        password:encode(email)
      }
      await admin.auth().createUser(auth_user)
      functions.logger.info("User",auth_user)
    }
    else throw e;
  }

  return{password:encode(email)}
})
export const forwardApplications=Endpoint<void,string>(async ()=>{
  let output=""

  let proivders:Array<types.IProvider>=Object.values(( await (getRef("providers").orderByChild('status').equalTo(null).once("value")) ) .val())
  proivders=proivders.filter(x=>x.verified && x.name)

  const testEmails=proivders.filter(x=>x.email.startsWith("demo") || x.email.startsWith("dev") || x.email.endsWith('@yopmail') || x.email.endsWith('@mailinator') ).map(x=>x.email)
  proivders=proivders.filter(x=>!testEmails.includes(x.email))

  //proivders=[proivders[0]]
  //  sendProviderApplicationToHR(proivders
  //   ,[
  //    // "jamesettagreen@thegameonapp.com"
  //    'sheharyarshahidspace@gmail.com'
  //   ])

  output=proivders.length+"\n"+ JSON.stringify( proivders.map(x=>x.name+" "+x.email),null,4)+"\n"+JSON.stringify( testEmails,null,4)+"\n"
  return output
},false)


const runJob=Endpoint(async ()=>{

  let providers:any[]=Object.values((await getVal("providers"))as any)
  for (let p of providers){
    await setVal({args:["providers",p.email,"status"],val:null})
  }

})

const setUserSubStatus = Endpoint<
  { userEmail: string; subStatus: string },
  { done: boolean }
>(async (r) => {
  await setVal({
    args: ["users", r.userEmail, "sub_status"],
    val: r.subStatus,
  });
  await setVal({
    args: ["users", r.userEmail, "sub_status_uat"],
    val: moment.utc().format("YYYY-MM-DD")
  });
  

  return { done: true };
});
const subscribe=functions.https.onRequest(async (req,res)=>{
  res.setHeader("Access-Control-Allow-Origin", "*")
  if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET,POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      res.set('Access-Control-Max-Age', '3600');
      res.status(200).send('Ok');
      return;
    } 
  let [email] =req.path.split("/").filter(x=>!!x)
  setVal({args:["subscriptions",email],val: {email,active:true}})
  res.send("Successfully subscribed "+email)
})
const cloud={
  ping,
  getCloud,
  login,
  // testAuth,
  stripe,
  twilio,
  getUserQuestions,
  signup,
  updateUser,
  getRecommendations,
  bookProvider,
  getUser,
  getProviderForBooking,
  cancelProvider,
  send,
  addNote,
  getNotes,
  schedule,
  setMeetingCompleted,
  getSchedules,
  cancelMeeting,
  rateAppAndProvider,
  // test:(a:any)=>{
  //   return new Promise(r=>r(a))
  // }
  testMail,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  user,
  registerToken,
  unRegisterToken,
  setUserSubStatus,
  providers,
  jobs,

  getFirebasePass,

  forwardApplications,
  runJob,

  admin:adminFuntions,
  
  subscribe
}


export default cloud

const pingScriptHtml=
`
<html>
  <body>
  <p>Up!<p>
  <script>
    var isLocal=false
    fetch("http://localhost:3000/ping.html").then(()=>{
      isLocal=true
      window.location.href="http://localhost:3000/ping.html"
    })
    setTimeout(()=>{
      if (!isLocal)
      window.location.href="http://web.thegameonapp.com/ping.html"
    },1000)
  </script>
  </body>
</html>
`
// async function sendProviderApplicationToHR(providers:types.IProvider[],recipents:Array<string>){
//   try {
//   for (let p of providers){


 
//       let body=CandidateSignUpEmail
//       body=body.replace("$name",p.name).replace("$email",p.email).replace("$state",p.state || "unknown");
//       var uploads="";
//       for (let x of  ["UPCV","UPCR","UPMA","UPAC"]){

//         if (p.details?.[x]?.answer?.[0]){
//           let storageRef=p.details?.[x]?.answer?.[0]

//           let file=admin.storage().bucket("").file(storageRef.slice(1));
//           await file.makePublic()
//           uploads+=UPLOAD_KEYS[x]+"\n"+(file.publicUrl())+"\n\n"        
//         }
//       }
//       body=body.replace("$documents",uploads)
//       //not in use 
//       //await sendMail(["shahid.sortup@gmail.com",...recipents],p.name+ " Signed Up at Game On!",body)
//      // setVal({args:["providers",p.email,"status"],val:"forwarded"})
//        await sleep(5*1000)
   

//   }
// }
// catch(e){
//   functions.logger.error(e)
// }
//   functions.logger.info("Done Sending")


// }
const UPLOAD_KEYS:{[key:string]:string}={
  "UPCV": "CV/Resume",
  UPCR:"Certificate (AASP website)",
  UPMA:"Certificate of master's or doctoral degree in clinical, counseling or sport psychology",
  UPAC:"Additional Certificate"
}
const CandidateSignUpEmail=
`
Hi Jamesetta!<br><br>

A new candidate signs up on the Game On! platform. Here are their details:<br><br>

Name  : $name<br>
Email : $email<br>
State : $state<br><br>

$documents
<br><br>
Please proceed with the hiring process of Game On!<br>
`