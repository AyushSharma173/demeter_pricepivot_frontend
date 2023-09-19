import { Platform } from "react-native"
import env from "res/env"



const log = (...args: any) => console.log("<i>", "dynamicEnv.ts", ...args)

export default function loadDynamicEnv(postLoadTask?:()=>Promise<any>) {

    return new Promise<void>( (r,rj) => {

        async  function waitAndComplete(){
            if (postLoadTask)
            await postLoadTask()
            //console.log("POST LOAD")
            r()
        }
        var IS_DEV=false
        if (Platform.OS=="web"){
            IS_DEV=!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        }
        else{
            IS_DEV=__DEV__
        }
        if ( IS_DEV && env.serverURL.includes("{x}")) {
            console.log("Finding DEV server for "+env.serverURL.slice(0,30))
        
            let start = new Date().getTime()
            let SERVER_FOUND=0
            for (let i=100;i<140;i++){
                
                let controller=new AbortController();
                    setTimeout(()=>controller.abort(),5000)
                let url=env.serverURL.replace('{x}',i.toString())
               // console.log(url)
          
                fetch(url+'ping',{
                  signal:controller.signal
                }).then(async x => {
                    SERVER_FOUND=1
                    log("Found ",url," in ",new Date().getTime() - start)
                    env.serverURL=url
                    waitAndComplete()
                })
                .catch(e=>{
                
                })

            }
            setTimeout(()=>{
                if (!SERVER_FOUND){
                    //rj("Failed to find server!")
                    //throw "Failed to find server!"
                    console.warn("Failed to find server")
                    waitAndComplete()
                }

            },5000)
  
        }
        else {
        waitAndComplete()
        }

    })

}

