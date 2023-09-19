import moment = require("moment");
import { encodeKey, Endpoint, generateToken, getRef, getVal, IsBadRequest, setVal, throwError, updateVal, updateVals } from "./src/commons";
import types from "./src/commons/refGlobalTypes";
import * as admin from "firebase-admin"
import * as functions from "firebase-functions";
const bcrypt = require("bcryptjs")
const bamboo :any={} // require("./bamboo.json");
const BAMBOO_ACTIVE=[1,2,3,4,5,6,7,8,20,21,22,16,17]
const BAMBOO_NOTHIRED=[10,11,12,13,14]
const BAMBOO_HIRED=[15] 

function getStatus(statusId:number){

    return BAMBOO_ACTIVE.includes(statusId) ? "forwarded" 
            : 
           (BAMBOO_NOTHIRED.includes(statusId) ? "inactive"
            : 
            BAMBOO_HIRED.includes(statusId) ? "approved"
            : 
            "FAULTED"
           )
}
async function getReport(){

 var output="Email,Name,Email Verified,Signup Completed,Source, Bamboo Status, GO Status\n"
  const providers:types.IProvider[]= Object.values(  await getVal<{[key:string]: types.IProvider}>("providers"))

  providers.forEach(provider=>{
    output+=[provider.email,provider.name,provider.verified ? "Yes":"No",provider.name ? "Yes":"No","GO","",provider.status].join()+"\n"
  })

  return output;

}
export const updateBamboo=Endpoint<void,string | any>(async ()=>{
   
    var output=""
    if (process.env.FUNCTIONS_EMULATOR=="true") // run only on local machine
    {   const bambooProviders:Array<any>=bamboo.result.map ((x:any)=>({email:x.candidateLite.email.toLowerCase(),state:x.candidateLite.location.state,name:x.candidateLite.firstName+" "+x.candidateLite.lastName,status:getStatus(x.currentStatusId) }))
        const providers:types.IProvider[]= Object.values(  await getVal<{[key:string]: types.IProvider}>("providers")).filter(x=>x.verified && x.name )
        const map:any={}
        bambooProviders.forEach(x=>map[x.email]=true)
        providers.forEach(x=>map[x.email]=true)
        const allEmails=Object.keys(map)
        const onBoth=allEmails.filter(x=>bambooProviders.find(y=>y.email==x) && providers.find(y=>y.email==x))
        const onBamboo=allEmails.filter(x=>bambooProviders.find(y=>y.email==x) && !providers.find(y=>y.email==x))
        const onGO=allEmails.filter(x=>!bambooProviders.find(y=>y.email==x) && providers.find(y=>y.email==x))
        
        output+="Status Updated on Game On!\nEmail,Name,State,Status\n"
        for(let x of onBoth){
            let r= bambooProviders.find(y=>y.email==x)
            let existingProvider=providers.find(y=>y.email==x)

            let status=r.status

            if (existingProvider?.availability){
                status="active"
            }
            else if (existingProvider?.title) {
                status="profile_completed"
            }

            await updateVal({args:['providers',x],val:{name:r.name,state:r.state,status:status}})
            output+=[r.email,r.name,r.state,status].join()+"\n"
            

        
           
        }

        output+="Needs SignUp\nEmail,Name,Status\n"
        for(let x of onBamboo){
            let r= bambooProviders.find(y=>y.email==x)
           output+=[r.email,r.name,r.status].join()+"\n"
        }

        
        // output+="Not on Bamboo\nEmail,Name,CV/Resume,Certificate (AASP website),Certificate of master's or doctoral degree in clinical counseling or sport psychology,Additional Certificate\n"
        // for(let x of onGO){
        //     let r= providers.find(y=>y.email==x)!
        //     let out=[r.email,r.name]
        //     for (let y of  ["UPCV","UPCR","UPMA","UPAC"]){

        //         if (r.details?.[y]?.answer?.[0]){
        //           let storageRef=r.details?.[y]?.answer?.[0]
        
        //           let file=admin.storage().bucket("").file(storageRef.slice(1));
        //           await file.makePublic()
        //           out.push(file.publicUrl())       
        //         }
        //         else out.push("")
        //       }
        //    output+=out.join()+"\n"
        // }

       
        
        let bambooDB:any={}
        
        bambooProviders.forEach((x:any)=>{
            bambooDB[encodeKey(x.email)]=x
        })
        
        await setVal({ args:["bamboo"],val:bambooDB })
        
        
        return output// await getReport()
    }
    return output;
},false)


 function AdminEndpoint<P,R>(func:((parms:P & {token?:types.ITokenConent})=>R )| ((params:P & {token?:types.ITokenConent})=>Promise<R> ),IsAuthorized=true) : types.IEndPoint<P,R>
{

    return Endpoint<P,R>(async (incoming_params)=>{
            let IsAdmin=incoming_params.token?.isAdmin
            if (IsAuthorized && !IsAdmin)
            throwError({status_code:401,message:"User not permitted"})
            return await func(incoming_params)
    },IsAuthorized)

}
export const login =AdminEndpoint<{email:string,password:string},{token:string}>(async (params)=>{

    let {email,password}=params
  
    IsBadRequest({email,password})
    email=email.toLowerCase()
    let admin :types.IAdmin=await getVal("admins",email)
    const PWD_MATCHED=  await bcrypt.compare(password, admin.enc_password)
    const PWD_NOT_MATCHED=!PWD_MATCHED 
    if (!admin || PWD_NOT_MATCHED){
      throwError({status_code:401,message:"Email or password do not match!"})
    }
    
    let token= generateToken(email,false,true)
    
    
    let responseData:any={token}
    return responseData
  
  },false)


export const getUsers=AdminEndpoint<void,Array<types.IUserAudit & {key:string}>>(async ()=>{
    let lastNdays = moment.utc().subtract(95, 'days').valueOf()/1000;

    let db:any = {};
    try{
        db = (await getRef("user_audit").orderByChild('signed_on').startAfter(lastNdays).once("value")).val();
    }
    catch(err){
        functions.logger.debug(err);
    }

    return  Object.keys(db || {} ).map<types.IUserAudit & {key:string}>(k=>{
            return {...db[k],key:k}
    })
})

export const syncUserAudit = AdminEndpoint<void,string>(async ()=>{
    try{
        let users_audit: any = await getVal("user_audit") || {};
        let dbUsers: any = await getVal("users");

        let params : {args:Array<any> | string,val:any}[] = [];

        for(let email of Object.keys(dbUsers || {})) {
            if(!users_audit[email]){
                let provider_email = undefined;
                let booked_on = undefined;
                let scheduled_on = undefined;

                if(dbUsers[email].bookingId){
                    let booking: types.IBooking = await getVal("bookings", dbUsers[email].bookingId);
                    provider_email = booking.provider_email;
                    booked_on = moment.utc(booking.dateTime).valueOf()/1000;
                    if(booking.meetings){
                        let meetingKeys = Object.keys(booking.meetings || {});
                        scheduled_on = moment.utc(meetingKeys[meetingKeys.length-1]).valueOf()/1000;
                    }
                }

                let created_on: number | undefined = dbUsers[email].created_on ? moment.utc(dbUsers[email].created_on).valueOf()/1000 : undefined;
                
                let audit: any = {};
                if(dbUsers[email].full_name)
                    audit["full_name"] = dbUsers[email].full_name;
                if(dbUsers[email].img)
                    audit["img"] = dbUsers[email].img;
                if(dbUsers[email].verified && created_on)
                    audit["verified_on"] = created_on;
                if(dbUsers[email].created_on)
                    audit["created_on"] = created_on;
                if(dbUsers[email].signed_on)
                    audit["signed_on"] = moment.utc(dbUsers[email].signed_on).valueOf()/1000;
                if(dbUsers[email].deleted && created_on)
                    audit["deleted_on"] = created_on;
                if(provider_email)
                    audit["provider_email"] = provider_email;
                if(booked_on)
                    audit["booked_on"] = booked_on;
                if(scheduled_on)
                    audit["scheduled_on"] = scheduled_on;

                params.push({args: ['user_audit', email], val: audit});
            }
        }

        await updateVals(params);

        return params.length + " users synced";
    }
    catch(err: any){
        functions.logger.debug(err);
        return err;
    }
}, false)