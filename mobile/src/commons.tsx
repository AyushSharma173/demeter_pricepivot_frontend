import clientStorage from "core/clientStorage";
import navhelper, { APP_SCREEN_NAME } from "core/navhelper";
import env from "res/env";
import cloud, { noAlert } from "./cloud";
import ReduxStore, { getAppStore, ReduxUser, updateStore, useAppStore } from "./models/ReduxStore";
import ConsumerTabs from "./screens/consumer/tabs/ConsumerTabs";
import { translateQuestions } from "./screens/FinishSetupScreen/questions";
import  database, { FirebaseDatabaseTypes }  from "@react-native-firebase/database"
import messaging, { firebase } from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth';
import { Platform } from "react-native";
import moment from "moment";
import jwtDecode from "jwt-decode";
import types from "res/refGlobalTypes"
import ProviderTabs from "./screens/provider/ProTabs/ProviderTabs";

function onLogout(){
    Session.isChatActive=false
    Session.loadingClientsStatus='loading'
}
export class Session {   
    static onLogoutListeners: Array<() => void> = [onLogout]
    static isChatActive:boolean=false
    static loadingClientsStatus:'loading' | 'loaded' | 'failed'='loading'
    static currentThread:string=""
    
    static configs:{ trial:number, file_size_limit_in_bytes:number,file_types:string, force_update:boolean, latest_version:string }
    
    static user_join_call:boolean=false

    static call_in_progress=false
    static feedbackSkipped: boolean = false;
}

export function makeDBPath(...args: Array<string>) {
    let path = "/" + env.type.toUpperCase() + "/" + args.map(x => x.replace(/\./g, "{dot}")).join("/")
    //console.log(path)
    return path
}


export function decodeKey(key: string) {
    return key.replace(/\{dot}/g, ".")
}

export async function Logout() {
    let IsProvider= !! getAppStore(p=>p.provider?.email)
    let token=!! getAppStore(p=>p.user?.token) 
    let IsAdmin=token ? ( jwtDecode(token) as types.ITokenConent ).isAdmin :false
    
    if (!IsProvider && token && Platform.OS!='web'){
     let push_token= await messaging().getToken()
        await cloud.unRegisterToken({push_token})
    }
    Session.onLogoutListeners.forEach(x => x())
    Session.onLogoutListeners = [onLogout]
    updateStore({ user: undefined ,provider:undefined,schedules:undefined});
    
    Promise.all([
        clientStorage.saveItem("user", null),
        clientStorage.saveItem("provider",null)
    ]
    )
    .then(x =>IsAdmin ? navhelper.setRoot("portal?dest=AdminWelcomeScreen") : navhelper.setRoot(APP_SCREEN_NAME))
}

export async function JumpToSignUp(token: string, email: string) {
     let user: ReduxUser = { token, email }
     updateStore({ user })
     clientStorage.saveItem("user",user)
     navhelper.push("QuestionaireInfoScreen")
     await registerPush()
}

export async function Login(email: string, password: string,noAlertPopup?:boolean) {
    let res = await ((noAlertPopup  ? noAlert(cloud.login) :cloud.login)({ email, password }))
    let user: ReduxUser = { token: res.token, ...res.user }
    updateStore({ user })
    clientStorage.saveItem("lastPassword",password)
    if (res.user.full_name) {
        await registerPush()
        clientStorage.saveItem("lastSuccessEmail", email)
        clientStorage.saveItem("user", user)
        navhelper.setRoot(ConsumerTabs)
    }
    else await JumpToSignUp(user.token!,email)
}

export async function ProLogin(email: string, password: string,noAlertPopup?:boolean) {
    let res = await ((noAlertPopup  ? noAlert(cloud.providers.login) :cloud.providers.login)({ email, password }))
    let user: ReduxUser = { token: res.token }
    let provider=res?.provider
    let status=provider?.status
    updateStore({ user,provider:res.provider })
    clientStorage.saveItem("lastPassword",password)
    await authorizeFirebase(res.provider.email)
    if (!res?.provider.status){
        clientStorage.saveItem("lastSuccessEmail",res.provider.email)
        let storeProvider=clientStorage.getItem("provider")
        clientStorage.saveItem("provider", {...storeProvider,...res.provider})
        if (!res?.provider.name)
        navhelper.setRoot("ProFinishSetupScreen")
        else
        navhelper.setRoot("AwaitingVerificationScreen")
    }
    else if (status=='approved'){
        navhelper.setRoot("ProUpdateScreen")
    }
    else if (status === 'profile_completed' || status == 'active'){
        clientStorage.saveItem("user",user)
        clientStorage.saveItem("provider",provider)
        navhelper.setRoot(ProviderTabs)
    }
    else if (status=='inactive'){
        navhelper.push("AwaitingVerificationScreen",{showDenied:true})
    }
    else if (status=='forwarded')
    {
        navhelper.setRoot("AwaitingVerificationScreen")
    }
}

export function updateUser (newData:Partial<ReduxUser>){
 let existing=   getAppStore(p=>p.user)!
 updateStore({user:{...existing,...newData}})

}
export function onUpdateOnce(path:string,listener:(value:FirebaseDatabaseTypes.DataSnapshot)=>void){
    const ref=database().ref(path)
    var firstInvoked=false
    function updateOnceListener(v:any){

        if (!firstInvoked){
            firstInvoked=true
            return
        }
        else {
            listener(v)
            ref.off("value",updateOnceListener)
        }

    }

    return ref.on("value",updateOnceListener)

}

export async function registerPush(){
    if (Platform.OS!='web'){
   var  authStatus = await firebase.messaging().hasPermission();
    if (authStatus != firebase.messaging.AuthorizationStatus.AUTHORIZED) {
    authStatus=  await firebase.messaging().requestPermission()
    if (authStatus != firebase.messaging.AuthorizationStatus.AUTHORIZED){
        return;
    }
    }
   let token= await messaging().getToken()
   if (token ){
        await cloud.registerToken({push_token:token})
   }
    }
 
}
export async function unRegisterPush(){
   
    let token= await messaging().getToken()
    if (token ){
         await cloud.unRegisterToken({push_token:token})
    }
 }

export function mock_api(..._: any) {
    return new Promise<any>((r) => {
        setTimeout(() => r({}), 1000);
    })
}
export function mock_onUpdateOnce(path: string, listener: (value: FirebaseDatabaseTypes.DataSnapshot) => void) {
    mock_api(path).then(() => {
        listener({ val: () => true } as any)
    })

}

export async function authorizeFirebase(email:string){
    let {password}=await cloud.getFirebasePass()
    auth().signInWithEmailAndPassword(email,password)
    console.log("User Authorized!")
    

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

export function formatFileName(name:string=""){
    return name.length<30 ? name: name.slice(0,10)+"..."+name.slice(-20) 
}

export function getThreadId(email1:string,email2:string){
    return [email1,email2].sort().join()
}

export const getDateTime = (time_secs: number) => {
    let dateTime=moment(time_secs*1000);
    let time=dateTime.format("hh:mm a");
    let date=moment().isSame(dateTime,'date')?"": dateTime.format('D MMM');
    return `${time} ${date}`;
}

export function BetaOnly(email?:string){

    if (!email)
    email=getAppStore(p=>p.provider?.email) || ""

    if (__DEV__  || email=="devshahid@yopmail.com" || email?.includes(".beta@"))   
        return true;
}

export function detectURLs(message:string) {
    var urlRegex = /(((https?:\/\/)|(https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex)
}

export function firstCap(s:string){
    return s.charAt(0).toUpperCase()+s.slice(1)
}

export function isActiveMeeting({ meeting_time }: { meeting_time: any }) {
    const currentTime = moment();
    const meetingTime = moment.utc(meeting_time);
    // const meetingTime = moment.utc('2023-03-23 11:55');
  
    const diffInMins = meetingTime.diff(currentTime, 'minutes');
    // console.log('diff in mins ', diffInMins);
    const isMeetingGoingOn = diffInMins <= 0 && diffInMins >= -60;
    const isFiveMinsLeft = diffInMins > 0 && diffInMins <= 10;
  
    if(isFiveMinsLeft || isMeetingGoingOn) {
      return true;
    }
  
    return false;
}

export function findActiveMeeting({ schedules }: { schedules: any }) {
    if (!schedules)
        return undefined
    const activeMeeting = schedules.find((s: any) => {
        if(isActiveMeeting({ meeting_time: s.dateTimeUTC })) {
            return s;
        }
    });

    return activeMeeting;
}

export function useAppMode():types.IAppMode{
  const sub_status=  useAppStore(p=>p?.user?.sub_status)
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