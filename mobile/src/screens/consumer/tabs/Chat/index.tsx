import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { fs, FULL_SCREEN, rh, rw } from "core/designHelpers"
import navhelper from "core/navhelper"
import { Alert, Image, Touchable, TouchableOpacity } from "react-native"
import home_stub_png from "res/img/home_stub.png"
import { coreOptions, Overlay } from "core/core";
import ConHeader from "src/components/ConHeader";
import colors from "res/colors";
import no_conversation_svg from 'res/svgs/no_conversation.svg'
import Pic from "core/Pic";
import TextField from "src/components/TextField";
import AppButton from "src/components/AppButton";
import cloud from "src/cloud";
import { useAppStore } from "src/models/ReduxStore";
import { Navigation } from "react-native-navigation";
import database from "@react-native-firebase/database";
import { makeDBPath, Session } from "src/commons";
import ChatScreen from "src/screens/ChatScreen";
interface Chatprops{
componentId:string
}
var    bottomBarStyle={backgroundColor:'#e9faef'}
export default function  Chat (props:Chatprops){
    const [threads,setThreads]=useState<Array<any>>([])
    const user=useAppStore(p=>p.user)
    const active_provider=useAppStore(p=>p.active_provider)
    const [user_join_call,set_user_join_call]=useState(Session.user_join_call)
    bottomBarStyle.backgroundColor='red'
    function onFocus(){
        Session.isChatActive=true
        if (Session.user_join_call){
            console.log("Chat joined")
            Session.user_join_call=false
            set_user_join_call(true)
            
        }
    }
    useEffect(() => {
// let ref=database().ref(makeDBPath("users",user?.email!,"threads"))
//        let  lstner=ref.on("child_added",sp=>{

//             threads.push(sp.val())
//            console.log( sp.key)
//             setThreads([...threads])
//         })
        if (Platform.OS!='web'){
            let s= Navigation.events().registerComponentDidAppearListener(x=>{
                if (x.componentId==props.componentId){
                    onFocus()
                }
            })
            let sl= Navigation.events().registerComponentDidDisappearListener(x=>{
                if (x.componentId==props.componentId){
                Session.isChatActive=false
                set_user_join_call(false)
                }
            })
        
                return ()=>{
                //  ref.off("child_added",lstner)
                    s.remove()
                    sl.remove()
                }
            }

            else {
                onFocus()
                return ()=>{
                    Session.isChatActive=false
                }
            }
        }, [])


       // console.log(threads)
    if (active_provider)
        return (<>
   
        <ChatScreen to={active_provider} user_join_call={user_join_call}/>
        </>
        )//todo
    return (<>
     
    <ConHeader title="Chat" hideNotification />
    <View style={{flex:1,justifyContent:"center",alignItems:'center'}} >
    
            <View style={{flexDirection:"column",alignItems:"center",flex:0}} >

                <Pic 
                  source={no_conversation_svg} 
                style={{height:rh(70),opacity:0.3,width:rw(70),marginBottom:rh(20)}}
                />
                <View style={{flexDirection:"row"}}>
                <Text  style={{opacity:0.2, flex:0,fontFamily:"Outfit",fontSize:fs(16),fontWeight:'500',color:colors.dark,marginBottom:rh(10)}} >No Conversations</Text>
                </View>
                <View style={{flexDirection:"row",marginBottom:rh(20)}}>
                <Text onPress={()=>navhelper.selectTab(0) } style={{flex:0, fontFamily:"Outfit",fontSize:fs(16),fontWeight:'500',color:colors.lightGreen}} >Pick a service provider</Text>
                </View>
               
            
            </View>
            
    </View>
    </>
   )
    
}
const UseAppStore=()=>useAppStore(p=>p.active_provider)
coreOptions(Chat,{ 
    useSafeAreaView:true,
    getBodyStyle:()=>({paddingHorizontal:rw(16)}),
    getBottomBarStyle:()=>{
        const active_provider=UseAppStore()
        if (active_provider)
        return {backgroundColor:'#e9faef'}
        else 
        return {}
    }

})

function TestVideo(){
    const [to,setTo]=useState("a@gmail.com")
    return (<>
    <TextField 
    label="Recipient address" 
    placeholder="email@domain.com"
    value={to}
    onChangeText={setTo}    
    />
                <View  style={{height:rh(10)}}/>
    <AppButton  
    title="Start Call"
    enabled={!!to}
    onPress={async ()=>{

       await cloud.twilio.getToken({to}).then(x=>{
            if(x.token){
                navhelper.push("TwilioVideoCall",{token:x.token})
            }
        })
    }}
    />
    </>)
}
const styles=StyleSheetRW.create(()=>({
    
}))