import { store, updateReduxStore } from "core/singleFileReduxManager"
import { useSelector } from "react-redux"
import types from "res/refGlobalTypes"

export default class ReduxStore{

    // user variables
    user?:ReduxUser
    active_provider?:types.IProvider
    subscription_status?:types.SubscriptionEnum
    schedules?: types.IUserSchedule[]

    //provider variables
    provider?:ReduxProvider

}

export type  ReduxUser=types.IUser & {token?:string}
export type ReduxProvider=types.IProvider & {clients:Array<types.IClientUser & {unRead?:boolean}>}

export function updateStore (newValue:Partial<ReduxStore>){

    updateReduxStore(newValue)

}

export function useAppStore<T>(selector: (p:ReduxStore)=>T){
  return  useSelector(selector)
}
export function getAppStore<T>(selector: (p:ReduxStore)=>T){
    return selector(store.getState())
}