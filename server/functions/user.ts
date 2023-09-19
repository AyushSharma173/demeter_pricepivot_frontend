import moment = require('moment-timezone');
import env from "./env";
import {  Endpoint, getBookings, getVal, IHttpError, returnError, setVal, TestEmails, throwError } from "./src/commons";
import types from "./src/commons/refGlobalTypes"
import * as functions from "firebase-functions"
import { sendMail } from "./src/commons/mailer";
import { _userSubscription } from './src/stripe';

export const changeEmail=Endpoint<{newEmail:string},{done:true}>(async(p)=>{

    let {newEmail}=p
    newEmail=newEmail.toLowerCase()
    let email=p.token?.email?.toLowerCase()
    let currentUser:types.IUser=await getVal("users",email)

    !newEmail && throwError({message:"New email can not be empty",status_code:500})
    !currentUser && throwError({message:"User not found",status_code:500})

    let existingWithNewEmail:types.IUser=await getVal("users",newEmail)
    !!existingWithNewEmail && !existingWithNewEmail.deleted && throwError({message:"User with email "+newEmail+" already exists. Please use different email.",status_code:500})

    currentUser.verified && throwError({message:"Can not change email of verified user",status_code:500})

    currentUser.email=newEmail
    await setVal({args:["users",newEmail],val:currentUser})
    await setVal({args:["users",email],val:null})
    
    let oldAudit: types.IUserAudit = await getVal("user_audit", email)
    await setVal({args:["user_audit",newEmail],val:oldAudit})
    await setVal({args:["user_audit",email],val:null})

    return {done:true}
})

export const getSlots=Endpoint<{date:string,timezone:string,provider:string},Array<string>>(async(p)=>{

    const {date,timezone}=p
    const iterator= moment.tz(date, timezone)
    const slots=[]
    const provider:types.IProvider=await getVal("providers",p.provider)
    const bookings=await getBookings(p.provider)
    let scheduledUTCS:Array<string>=[]
    bookings.forEach(booking=>{
   scheduledUTCS=   scheduledUTCS.concat(Object.keys(  booking.meetings || {}))
    })
  
    for (let i=0;i<24;i++){
        let utc=iterator.clone().utc().format('YYYY-MM-DDTHH:mm')
        let pTime=moment.utc(utc).tz(provider.timezone!)
        let day=pTime.format('ddd').toLowerCase()
        let time=pTime.format("hh:mm a")
    
        if (provider.availability![day]?.includes(time) && !scheduledUTCS.includes(utc))
            slots.push(iterator.format("hh:mm a"))
        iterator.add(1,'hour')
    }
    
    setVal({ args:["users",p.token?.email!,"timezone"],val:timezone })
    return slots

})

export const getSlotsForProvider=Endpoint<{date:string,timezone:string},Array<string>>(async(p)=>{
    const {date,timezone}=p
    const iterator= moment.tz(date, timezone)
    const providerCurrentTime = moment.tz(moment.now(), timezone)
    const slots=[]
    const bookings=await getBookings(p.token?.email || "")
    let scheduledUTCS:Array<string>=[]
    bookings.forEach(booking=>{
        scheduledUTCS=   scheduledUTCS.concat(Object.keys(  booking.meetings || {}))
    })
  
    for (let i=0;i<24;i++){
        let utc=iterator.clone().utc().format('YYYY-MM-DDTHH:mm')    
        if (iterator > providerCurrentTime && !scheduledUTCS.includes(utc))
            slots.push(iterator.format("hh:mm a"))
        
        iterator.add(1,'hour')
    }
    
    return slots;
})

export const isActive=Endpoint<void,{active:boolean,onTrial?:boolean,subscription_status?:types.SubscriptionEnum }>(async({token})=>{

    let {email}=token!
    email=email?.toLowerCase()
    // if (TestEmails.USERS.includes(email)){
    //     return { active:true,subscription_status:'active'};
    // }

    let active_subs:Array<any>=await _userSubscription({token})
    if (active_subs.length && active_subs[0].status=='active'){
        return {active:true,subscription_status:active_subs[0].status}
    }
    else {
        let created_date=await getVal("users",email,'created_on')
        if (!created_date)
        return {active:false}
        let trial:number=await getVal('configs','trial')
        let onTrial=moment().utc().diff(moment(created_date),"day") <trial
        return{ active: onTrial,onTrial}


    }


})