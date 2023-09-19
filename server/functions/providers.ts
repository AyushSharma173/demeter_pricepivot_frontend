import moment = require("moment");
import env from "./env";
import { encodeKey, Endpoint, generateToken, getBookings, getUsersByEmails, getVal, IsBadRequest, setVal, throwError, updateVal, getRef, updateVals, decodeKey } from "./src/commons";
import types from "./src/commons/refGlobalTypes";
import ProQuestions from "./src/runtime_constants/ProQuestions";
import * as functions from "firebase-functions";
const bcrypt = require("bcryptjs")
const DISABLE_BAMBOO=true;
export const login =Endpoint<{email:string,password:string},{token:string,provider:types.IUser}>(async (params)=>{

    let {email,password}=params
  
    IsBadRequest({email,password})
    email=email.toLowerCase()
    let provider :types.IProvider=await getVal("providers",email)
    const PWD_MATCHED=process.env.FUNCTIONS_EMULATOR=="true"  ? true : provider && await bcrypt.compare(password, provider.enc_password)
    const PWD_NOT_MATCHED=!PWD_MATCHED 
    if (!provider || PWD_NOT_MATCHED){
      throwError({status_code:401,message:"Email or password do not match!"})
    }
    
    let token= generateToken(email,true)
    
    
    let responseData:any={token,provider: provider}
    return responseData
  
  },false)

export const signup=Endpoint<{email:string, password:string},{token:string,verified?:boolean}>(async (p)=>{
    p.email=p.email?.toLowerCase()
     let exist:types.IProvider= await getVal("providers",p.email)
     if (exist && !exist.deleted && exist.verified)
     {
       throwError({status_code:403,message:"Account with email "+p.email+" already exists"})
     }
     let provider:types.IProvider={ email:p.email,enc_password:await bcrypt.hash(p.password,env.SALT)} as any
     if (exist?.verified)
     provider.verified=true
     await setVal({args:["providers",p.email],val:provider})
   
     return {token:generateToken(p.email,true),verified:provider.verified}
   },false)


export const changeEmail=Endpoint<{newEmail:string},{done:true}>(async(p)=>{

    let {newEmail}=p
    newEmail=newEmail.toLowerCase()
    let email=p.token?.email?.toLowerCase()
    let currentUser:types.IUser=await getVal("providers",email)

    !newEmail && throwError({message:"New email can not be empty",status_code:500})
    !currentUser && throwError({message:"User not found",status_code:500})

    let existingWithNewEmail:types.IUser=await getVal("providers",newEmail)
    !!existingWithNewEmail && existingWithNewEmail.verified && !existingWithNewEmail.deleted && throwError({message:"User with email "+newEmail+" already exists. Please use different email.",status_code:500})

    currentUser.verified && throwError({message:"Can not change email of verified user",status_code:500})

    currentUser.email=newEmail
    await setVal({args:["providers",newEmail],val:currentUser})
    await setVal({args:["providers",email],val:null})

    return {done:true}
})

export const getProQuestions=Endpoint<void,typeof ProQuestions>(()=>{
  return ProQuestions
},false)

export const update=Endpoint<Partial<types.IProvider>,types.IProvider>(async (provider)=>{
  let dbProvider:types.IProvider=  await getVal("providers",provider.email?.toLowerCase())
  
  if (dbProvider){
    if (provider.first_name!=undefined)
        dbProvider.first_name = provider.first_name
    if (provider.last_name!=undefined)
        dbProvider.last_name = provider.last_name
    if (provider.name!=undefined) {
       dbProvider.name  = provider.name
      if (!dbProvider.status)
      {
        let BambooStatus=DISABLE_BAMBOO ? 'approved': await getVal("bamboo",provider.email?.toLowerCase(),"status")
        dbProvider.status=BambooStatus as any
      }
    }
    if (provider.state!=undefined) {
      dbProvider.state = provider.state
    }

    if (provider.details!=undefined)
    {
        dbProvider.details    = provider.details
        dbProvider.primarySpecialty=provider.details["PRIM"].answer[0]
        dbProvider.otherSpecialties=provider.details["SECO"].answer
    }
    if (provider.img!=undefined)  dbProvider.img=provider.img
    if (provider.title!=undefined) {
       dbProvider.title=provider.title
       if (dbProvider.status=='approved') dbProvider.status="profile_completed"
      }
    if (provider.desc!=undefined)  dbProvider.desc=provider.desc

    if (provider.deleted) dbProvider.deleted=provider.deleted
  }
  
  await setVal({args:["providers",provider.email?.toLowerCase()],val:dbProvider})
  
  return provider as types.IProvider
})

export const updateAvailability=Endpoint<{availability:{ [key:string]: Array<string>},timezone:string},{done:true}>(async ({token,availability,timezone})=>{

  const {email}=token!

  await updateVal({args:["providers",email?.toLowerCase()],val:{availability ,timezone,status:"active"}})

  return {done:true}
})

export const getProvider=Endpoint<void,types.IProvider>(async ({token})=>{

  return await getVal("providers",token?.email?.toLowerCase())

})
export const getBamboo=Endpoint<void,types.IBamboo>(async ({token})=>{

  return DISABLE_BAMBOO ? {email:token?.email!,state:"",name:"",status:"approved"}: await getVal("bamboo",token!.email)
})

export const getClients = Endpoint<void, types.IClientUser[]>(async ({ token }) => {
  const providerEmail = token?.email?.toLowerCase() ?? "";

  const bookings = await getBookings(providerEmail);
  const meetings: {[user_email:string]:any}={}
  const activeMeetingTime = moment.utc().subtract(1, "hour").valueOf()/1000;

  let userEmails: string[] = bookings.map((booking) => {
    let activeMeetings: any = {};
    if(booking.meetings){
      Object.keys(booking.meetings).forEach((k: string) => {
        //@ts-ignore
        booking.meetings[k].bookingId = booking.id
        //@ts-ignore
        if(booking.meetings[k].time_secs >= activeMeetingTime){
          //@ts-ignore
          activeMeetings[k] = booking.meetings[k];
        }
      })
    }
    meetings[booking.user_email]= activeMeetings;
    return booking.user_email;
  });

  const users: types.IClientUser[] = await getUsersByEmails(userEmails, encodeKey(providerEmail));

  users.forEach(x=>{
    x.meetings=meetings[x.email]
  })
  return users;
})

interface ProviderMessagesInfo {
  email: string | null,
  threadIds: string[],
  chatCount: number
}

export const updateProviderTrackings = Endpoint<{startDate: string, endDate: string}, void>(async ({ startDate,  endDate, token}) => {
  let params : {args:Array<any> | string,val:any}[] = [];

  let startDateTimeSeconds = moment.utc(startDate,"YYYY-MM-DD").valueOf()/1000;
  let endDateTimeSeconds = moment.utc(endDate,"YYYY-MM-DD").valueOf()/1000;

  let providerMeetings = await getProviderSessionCount(startDateTimeSeconds, endDateTimeSeconds);
  functions.logger.info("providerMeetings info ======>", providerMeetings);
  Object.keys(providerMeetings).forEach(email => {
    params.push({args: ['providers', email, 'current_sessions'], val: providerMeetings[email]});
  })
  
  const providerMessagesInfo = await getProvidersChatCount(startDateTimeSeconds, endDateTimeSeconds);
  functions.logger.info("messagesCount info ======>", providerMessagesInfo);
  providerMessagesInfo.forEach((providerInfo: ProviderMessagesInfo) => {
    params.push({args: ['providers', providerInfo.email, 'current_msgs'], val: providerInfo.chatCount});
  })
  
  await updateVals(params).then(r => {
    functions.logger.debug(r);
  })
})

export const getProviderTrackings = Endpoint<{startDate: string, endDate: string}, void>(async ({ startDate,  endDate, token}) => {
  let startDateTimeSeconds = moment.utc(startDate,"YYYY-MM-DD").valueOf()/1000;
  let endDateTimeSeconds = moment.utc(endDate,"YYYY-MM-DD").valueOf()/1000;

  let providerInfo:any = {};
  let providerMeetings = await getProviderSessionCount(startDateTimeSeconds, endDateTimeSeconds);
  Object.keys(providerMeetings).forEach(email => {
    providerInfo[email] = {};
    providerInfo[email]["SessionCount"] = providerMeetings[email] ?? 0;
  })
  
  const providerMessagesInfo = await getProvidersChatCount(startDateTimeSeconds, endDateTimeSeconds);
  
  providerMessagesInfo.forEach((provider: any) => {
    const email = decodeKey(provider.email || "");
    if(!providerInfo[email]){
      providerInfo[email] = {};
    }
    providerInfo[email]["ChatCount"] = provider.chatCount ?? 0;
  })

  let output: string = "Email, Chat, Sessions\n"
  Object.keys(providerInfo).forEach(email => {
    output += `${email}, ${providerInfo[email]["ChatCount"] ?? 0}, ${providerInfo[email]["SessionCount"] ?? 0}\n`;
  })

  return output;
})

async function getProvidersChatCount(startDateTimeSeconds: number, endDateTimeSeconds: number) {
  const snapshot = await getRef("providers").orderByChild("status").equalTo("active").once("value");
  
  let providersMessagesInfo: ProviderMessagesInfo[] = [];
  snapshot.forEach(childSnapshot => {
    let providerThreads = childSnapshot.child("threads").val();
    if(providerThreads){
      const threadIds = Object.keys(providerThreads || {}).map((key: any) => {
        //@ts-ignore
        return providerThreads[key].threadId.replace(/\./g, '{dot}');
      });
  
      providersMessagesInfo.push({email: childSnapshot.key, threadIds, chatCount: 0});
    }
  })  
  
  for(let providerMessageInfo of providersMessagesInfo) {
    for(let threadId of providerMessageInfo.threadIds) {
      const snapshot = await getRef("threads/"+threadId)
                .orderByChild("time_secs").startAt(startDateTimeSeconds).endAt(endDateTimeSeconds)
                .once("value");

      snapshot.forEach((childSnapshot) => {
        const chat = childSnapshot.val();
          if (chat.time_secs >= startDateTimeSeconds && chat.time_secs <= endDateTimeSeconds){
              providerMessageInfo.chatCount += chat.msg.length;
          }
          else{
            functions.logger.debug("----> not in range time_secs: ", chat.msg, chat.time_secs);
          }
      });
    }
  }

  return providersMessagesInfo;
}

async function getProviderSessionCount(startDateTimeSeconds: number, endDateTimeSeconds: number) {
  let snapshots = await getRef("bookings").once("value");

  let providerMeetings: {[email: string]: number} = {};

  snapshots.forEach((childSnapshot) => {
      let booking = childSnapshot.val();
      if(booking.meetings){
        let completed_meetings = 0
        Object.keys(booking.meetings || {}).forEach((key: any) => {
          if (booking.meetings[key].is_completed && booking.meetings[key].time_secs >= startDateTimeSeconds && booking.meetings[key].time_secs <= endDateTimeSeconds){
              completed_meetings++;
          }
        });

        providerMeetings[booking.provider_email] = (providerMeetings[booking.provider_email] ?? 0) + completed_meetings;
      }
    });
  
    return providerMeetings;
}