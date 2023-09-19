import moment = require("moment");
import env from "./env";
import { Endpoint, getVal, IHttpError, IsBadRequest, makeid, setVal, updateVal } from "./src/commons";
import types from "./src/commons/refGlobalTypes"
import * as functions from "firebase-functions"
import { sendMail, sendTemplateEmail } from "./src/commons/mailer";
import EmailTemplates from "./src/runtime_constants/EmailTemplates";
const bcrypt = require("bcryptjs")
const serialize = function(obj:any) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && !!obj[p]) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
function resposneURL(o:{error:boolean,msg:string,title:string}){

   return env.WEBSITE+"/response?"+ serialize(o)

}
// needs formatting and comments
export const sendVerificationEmail=Endpoint<{email:string,type?:'pwd',isProvider?:boolean},{sent:true}>(async ({email,type,isProvider})=>{
    IsBadRequest({email})
    email=email.toLowerCase();
    const ACCOUNT_DOES_EXIST= !!( await getVal(isProvider ? "providers":"users",email,"email") )
    if ( ! ACCOUNT_DOES_EXIST && type=='pwd'){
        let err:IHttpError={message:`Account with email ${email} does not exist.`,status_code:504}
        throw err
    }
    let pwd=type=='pwd'
    let error:IHttpError={status_code:500,message:""}
    let existingOTP:types.IOTP=await getVal("OTPs",email);
    if (existingOTP){
        if ( existingOTP.iat_secs+env.WAIT_BEFORE_RESEND_SECS>     moment().utc().valueOf()/1000){
            error.message="Please wait for a minute before sending new email link!"
            throw error
        }
    }
    let newOTP:types.IOTP={OTP:makeid(4),iat_secs:moment().utc().valueOf()/1000}
    let link=env.SELF_URL+`/verifyEmail/${email}/${newOTP.OTP}`
    if (isProvider)
    link+=`/true`
    if (pwd)
    link=env.WEBSITE+`/resetPassword?`+serialize(isProvider ? {email,otp:newOTP.OTP,isProvider}:{email,otp:newOTP.OTP})
    let hlink="<a href='"+link+"'>Verify My Email</a>"
    await sendTemplateEmail([email],
        pwd ? EmailTemplates.RESET_PASSWORD : (isProvider ? EmailTemplates.EMAIL_VERIFICATION: EmailTemplates.EMAIL_VERIFICATION_USER ),
        {link}
    );
    await setVal({args:["OTPs",email]

                ,val:newOTP})

   
    return {sent:true}
},false)

const htmlResponse=
`<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<h2>#msg</h2>
</body>
</html>
`
export const verifyEmail=functions.https.onRequest(async (req,res)=>{
   let [email,otp,isProvider] =req.path.split("/").filter(x=>!!x)
   let msg=""
   let title="Error"

   if (!email || !otp)
   {
    msg="Bad Request!"
   }
   else{
    let existingOTP:types.IOTP=await getVal("OTPs",email);
    if (existingOTP.OTP!=otp)
    {
        msg="The email can not be verified"
    }
    else if (existingOTP.iat_secs +env.OTP_EXPIRE_SECS >= moment().utc().valueOf()/1000)
    {
        msg="Thank you! Your email is verified. You can now go back to your mobile app and continue."
        title="Verified!"
        await setVal({args:[isProvider ?"providers":"users",email,"verified"],val:true})
        if(!isProvider){
            let time_secs: number = moment.utc().valueOf() / 1000;
            await updateVal({args:["user_audit", email], val:{"verified_on": time_secs}})
        }
    }
    else {
        msg="This link is expired, please use new one."
    }
   }
   let error=title=="Error"
   //res.send(htmlResponse.replace("#msg",msg))
    //res.send()
    res.redirect(resposneURL( {error,msg,title}))
})

export const changePassword=functions.https.onRequest(async (req,res)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET,POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        res.set('Access-Control-Max-Age', '3600');
        res.status(200).send('Ok');
        return;
      } 
    let [email,otp] =req.path.split("/").filter(x=>!!x)
    let password=req.query["password"]
    let isProvider=req.query["isProvider"]

    let msg=""
    let title="Error"
 
    if (!email || !otp || !password)
    {
     msg="Bad Request!"
    }
    else{
     let existingOTP:types.IOTP=await getVal("OTPs",email);
     if (existingOTP.OTP!=otp)
     {
         msg="The email can not be verified"
     }
     else if (existingOTP.iat_secs +env.OTP_EXPIRE_SECS >= moment().utc().valueOf()/1000)
     {
       
         await setVal({args:[isProvider ? "providers": "users",email,"enc_password"],val:await bcrypt.hash(password,env.SALT)})
         msg="Your password is verified. You can now go back to your mobile app and login with new password."
         title="Updated!"
     }
     else {
         msg="This link is expired, please use new one."
     }
    }
    let error=title=="Error"
    //res.send(htmlResponse.replace("#msg",msg))
     //res.send()
    res.send( {error,msg,title})
 })
 