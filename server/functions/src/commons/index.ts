import * as functions from "firebase-functions"
import env from "../../env"
import * as admin from "firebase-admin"
import * as jwt from "jsonwebtoken"
import types from "./refGlobalTypes";
import ProQuestions from "../runtime_constants/ProQuestions";

export const TestEmails={
        USERS       :   ['dev7170@yopmail.com','testuser@yopmail.com','ali.zahid173@yopmail.com','ali.zahid170@yopmail.com','ali.zahid171@yopmail.com','ali.zahid172@yopmail.com','ali.zahid174@yopmail.com','sheharyar-shahid@outlook.com','russellnotary@gmail.com','pedro.bustillo@toptal.com','julio.guerra50@yahoo.com'],
        PROVIDERS   :   ['zahid@yopmail.com','shahid.sortup@gmail.com','lorieskhoury@gmail.com']
}

export function encode(data:string){
  let e=  btoa(data)
  return e.slice(e.length/4,e.length*3/4)
}

export interface IHttpError extends types.IError{
    status_code:number
}

export function encodeKey(key: string) {
    return key.replace(/\./g, "{dot}")
}

export function decodeKey(key: string) {
    return key.replace(/\{dot}/g, ".")
}
  
function makePath(...args: any) {
  
    args = args.map((x: any) => encodeKey(x.toString()))
    let path = [env.NAME, ...args].join("/")
    functions.logger.info("makePath:", path)
    return path
  
}

export function getVal<T>(...args:any){
    return new Promise<T>(r=>{
    admin.database().ref(makePath(...args)).once( "value",x=>{
        r(x.val())    
    })
    })

}
export function getRef(...args:any){
    return admin.database().ref(makePath(...args))

}
export function setVal( { args,val}:{args:Array<any> | string,val:any}){
    return new Promise<void>(r=>{
        admin.database().ref(makePath(...args)).set(val,()=>r())
        })
}

export function pushVal( { args,val}:{args:Array<any> | string,val:any}){
    return new Promise<string>(r=>{
        admin.database().ref(makePath(...args)).push (val).then(sp=>{
        r(sp.key!)
        })
        })
}
export function updateVal( { args,val}:{args:Array<any> | string,val:any}){
    return new Promise<string>(r=>{
        admin.database().ref(makePath(...args)).update (val).then(sp=>{
        r("")
        })
        })
}

export function updateVals(params:{args:Array<any> | string,val:any}[]) {
    let updates: any = {};
    params.forEach(param => {
        updates[makePath(...param.args)] = param.val;
    })
    return new Promise<string>(r => {
        admin.database().ref().update(updates, function(error) {
            if (error) {
              r('Error updating data:' + error);
            } else {
              r('Data updated successfully!');
            }
        });
    })
}

export function IsBadRequest(notNullParams:any){
    let nullParams=Object.keys(notNullParams).filter(x=>!notNullParams[x])
    if (nullParams.length)
    
    {
        let error:IHttpError={status_code:400,message:"Bad Request Values not Found for: "+nullParams.join(",")}
        
        throw error
    }

}

export function returnError(response:any,code:number,message:string){

    response.status(code ).send(message)

}
export function returnMethodNotAllowed(request:any,response:any){
    response.status(405).send("Method not Allowed: "+request.method)
}


export function withAuth(handler:(request:functions.https.Request,response:functions.Response<any>)=>void){

    return functions.https.onRequest((req,res)=>{

        let token= req.headers["authorization"]?.replace(/Bearer /i,"")


        if (!token) {
           return returnError(res,403,"A token is required for authentication.")
        }

        try {
            const decoded:types.ITokenConent = jwt.verify(token, env.JWT_SECRET) as any;
            req.body["token"]=decoded;
        } catch (err:any) {
        
            return returnError(res,401,err.message)
        }

        handler(req,res)
    
    })
}

export function Endpoint<P,R>(func:((parms:P & {token?:types.ITokenConent})=>R )| ((params:P & {token?:types.ITokenConent})=>Promise<R> ),IsAuthorized=true) : types.IEndPoint<P,R>
{
    let internalFunction:types.IEndPoint<any,any>= functions.https.onRequest(async (req,res)=>{

       try {
        // #region CORS implementation 
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (req.method === 'OPTIONS') {
            // Send response to OPTIONS requests
            res.set('Access-Control-Allow-Methods', 'GET,POST');
            res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
            res.set('Access-Control-Max-Age', '3600');
            res.status(200).send('Ok');
            return;
          } 
        // #endregion
        if ( IsAuthorized){
            let token= req.headers["authorization"]?.replace(/Bearer /i,"")
            if (!token) {
                
                let err_code:types.IErr_Code.TOKEN_MISSING=2;
                let error:IHttpError={ status_code:403,
                    message:"A token is required for authentication.",
                    err_code
                }
                throw error
             }
             try {
                const decoded:types.ITokenConent = jwt.verify(token, env.JWT_SECRET) as any;
                req.body["token"]={...decoded,email:decoded?.email?.toLowerCase()}
            } catch (err:any) {
                let error:IHttpError={ status_code:401,message:err.message}
                throw error
            }
        }


       let p:any= req.body
       let r:R= await func(p)
  
       res.send(r)
       }
       catch(e){
        let status=(e as IHttpError).status_code || 500
        //functions.logger.error(e)
        res.status(status).send(e)
       } 


    })  as any
    internalFunction.__isAuthorized=IsAuthorized
    internalFunction.__isEndpoint=true
    return internalFunction as any as types.IEndPoint<P,R>


}

export function throwError(error:IHttpError){
    throw error
}
export function generateToken(email:string,isProvider?:boolean,isAdmin?:boolean){
    let tokenConent:types.ITokenConent={email,isProvider,isAdmin}
   return  jwt.sign(tokenConent,env.JWT_SECRET,{expiresIn:env.EXPIRATION })
  
  }

export function makeid(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function sleep(millis:number){
    return new Promise(r=>setTimeout(()=>r(null),millis))
}


export async function getBookings(provider_email:string){

   let r=await getRef("bookings").orderByChild("provider_email").equalTo(provider_email).once("value")
   let v:types.IBooking[]=Object.entries<types.IBooking>(r.val() || {}).map(([key,value])=>{

    return {...value,id:key}
   })
    v=v.filter(x=>!x.canceled_on)
    return v
}

export async function getUsersByEmails(emailsArray:string[], provider_encoded_email: string) {
    const users: types.IClientUser[] = [];

    if(emailsArray.length > 0){
        const query = await getRef("users").orderByChild("email");

        for (let email of emailsArray) {
          query.equalTo(email);
        }

        const snapshot = await query.once("value");

        snapshot.forEach((childSnapshot) => {
          const email = childSnapshot.child("email").val();

          if (emailsArray.includes(email)) {
            const threads = childSnapshot.child("threads").val();
            let providerThread =
              threads != null ? threads[provider_encoded_email] : null;

            const user: types.IClientUser = {
              full_name: childSnapshot.child("full_name").val(),
              email: childSnapshot.child("email").val(),
              last_message: providerThread?.last_msg,
              updatedAt_secs: providerThread?.updatedAt_secs,
              threadId:providerThread?.threadId,
              img: childSnapshot.child("img").val(),
            };
            users.push(user);
          }
        });
    }
  
    return users;
 }

 export function ReplaceCodes(provider:types.IProvider){

   let options= ProQuestions.find(x=>x.code=="PRIM")?.options || []
   provider.primarySpecialty=options.find(x=>x.code==provider.primarySpecialty)?.text || provider.primarySpecialty
   provider.otherSpecialties=provider.otherSpecialties?.map(x=>{
        return options.find(l=>l.code==x)?.text || x
   })
   return provider
 }


export function getAppMode(sub_status: types.ISub_Status):types.IAppMode {
    let active_statuses:Array<types.ISub_Status>=['active','app_canceled']
    if (!sub_status || sub_status=='trial'){
      return 'trial'
    }
    else if (sub_status=='trial_completed'){
      return 'trial_completed'
    }
    else if (sub_status=='no_sub'){
      return 'no_sub'
    }
    else if (active_statuses.includes(sub_status)){
      return 'active'
    }
    else return 'fault'
  }