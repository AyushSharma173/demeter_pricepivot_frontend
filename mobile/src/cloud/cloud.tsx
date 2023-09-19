import axios, { Axios, AxiosError } from "axios"
import clientStorage from "core/clientStorage"
import { Alert } from "react-native"
import env from "res/env"
import types from "../../../commons/globalTypes"
import type_cloud from "../../../server/functions/cloud"

const cloud:typeof type_cloud={} as any


interface ICloudConfigs{
    logoutAction:()=>any
    getToken:()=>string
}

var LOG_OUT_IN_PROGRESS=false

export function noAlert<T>(endpoint:T):T
{
 return ((...args:any)=>(endpoint as any)(...args,noAlert,true) )as T
}
export async function initClient(configs:ICloudConfigs){

    function implementFunctions (node:types.ICloud){

        Object.keys(node).forEach(k=>{

            let child=node[k]
            if (child.__isEndpoint){
                let remoteChild:types.IEndPoint<any,any>=child as any
             let newendpoint:any=(params :any,noAlert?:boolean)=>{
                return new Promise ((reslove,reject)=>{

                    let headers:any={}
                    if (remoteChild.__isAuthorized){
                        headers["authorization"]="Bearer "+configs.getToken()
                    }
                    axios
                    .post(env.serverURL+remoteChild.__path,params,{
                        headers
                    })
                    .then (r=>{

                        reslove(r.data)
                    })
                    .catch((e )=>{
                        let axiosError:AxiosError | undefined=e
                        function handleError(customError?:any)
                        { 
                            let reportError=customError|| e
                            !noAlert &&( reportError.message ? Alert.alert("Error",reportError.message) :Alert.alert("Error",typeof e=='string' ?e:e.toString()))
                            console.log(customError)
                            reject(customError) 
                        }
                        if (!axiosError?.isAxiosError)
                        axiosError=undefined

                        if (axiosError)
                        {
                            if (axiosError.response){
                                let httpCode=axiosError.response.status
                                let serverError:types.IError=axiosError.response.data as any
                                console.log(serverError)
                                if (httpCode==403){
                                    let TokenMissing:types.IErr_Code.TOKEN_MISSING=2
                                    if (serverError.err_code==TokenMissing){
                                        if (!LOG_OUT_IN_PROGRESS){
                                            LOG_OUT_IN_PROGRESS=true
                                           Alert.alert("Login Required","You need to login again to continue.",[{"text":"Ok",onPress:()=>{
                                            LOG_OUT_IN_PROGRESS=false
                                            configs.logoutAction()
                                           }}])
                                        }

                                    } 
                                    handleError(serverError)
                                }
                                else handleError(serverError)
                            }
                            else handleError()
                        }
                        else handleError()
                       

                    })

                })


             }
             let endpoint:types.IEndPoint<any,any>=newendpoint
             endpoint.__isAuthorized=remoteChild.__isAuthorized
             endpoint.__path=remoteChild.__path
             endpoint.__isEndpoint=remoteChild.__isEndpoint
             node[k]=endpoint
               

            }
            else implementFunctions(child as types.ICloud)

        })


    }
    try {
        try {
        let x=await  axios.get(env.serverURL+"getCloud",{timeout:__DEV__ ? 2*1000: 10*1000})
        let remoteCloud:types.ICloud= x.data
        clientStorage.saveItem("remoteCloud",remoteCloud)
        implementFunctions(remoteCloud)
        Object.assign(cloud,remoteCloud)
        console.log("CLIENT UPDATE COMPLETE")
        }
        catch{
          let remoteCloud=  clientStorage.getItem("remoteCloud")
          implementFunctions(remoteCloud)
          Object.assign(cloud,remoteCloud)
          console.log("CLIENT RESTORED")
        }
    
        
    
    }
    catch(e){
        console.log(e)
    }



}

export default cloud