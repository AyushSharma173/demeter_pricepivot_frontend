import { coreOptions, Overlay } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, Keyboard, Modal, TouchableOpacity, Alert, Linking, Vibration, PermissionsAndroid } from "react-native";
import colors from "res/colors";
import cloud from "src/cloud";
import AppButton from "src/components/AppButton";
import ConHeader from "src/components/ConHeader";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import { updateStore, useAppStore } from "src/models/ReduxStore";
import database from "@react-native-firebase/database";
import env from "res/env";
import Header from "src/components/Header";
import TwilioVideoCall from "./consumer/tabs/Chat/TwilioVideoCall";
import navhelper from "core/navhelper";
import { findActiveMeeting, makeid, Session, useAppMode } from "../commons";
import DocumentPicker from 'react-native-document-picker'
import storage from '@react-native-firebase/storage';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFetchBlob from "rn-fetch-blob";
interface ChatScreenprops {
    is_main_view: boolean
    to: { email: string, name: string, img: any }
    user_join_call?: boolean
}
var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
function detectURLs(message:string) {
  var urlRegex = /(((https?:\/\/)|(https?:\/\/)|(www\.))[^\s]+)/g;
  return message.match(urlRegex)
}
var activeCallToken=""

const EMULATE_CALL=false
export default function ChatScreen(props: ChatScreenprops) {
    const mode=useAppMode()
    const IsSubError=mode=='fault' 
    const { to, user_join_call,is_main_view = true } = props
    const [msgs, setMsgs] = useState<Array<any>>([]);
    const [txt,setTxt]=useState<string>();

    const email=useAppStore(s=>s.user?.email) || ""
    const name=useAppStore(s=>s.user?.full_name) || ""
    const schedules = useAppStore(s => s.schedules);
    const threadId=[email,to.email].sort().join()
    const [joined,setJoined]=useState(user_join_call || false)
    
    const _scrollViewRef=useRef<ScrollView>();

    const JOIN_CALL = findActiveMeeting({ schedules }) || EMULATE_CALL;
    const DISABLE_SEND=(!txt || IsSubError )
    const [loading,setLoading]=useState(false)
    const inputRef=useRef<TextInput>()
    useEffect(()=>{
        let path=`/${env.type.toUpperCase()}/threads/${threadId.replace(/\./g,'{dot}')}`
        console.log(path)
        let ref=database().ref(path)
        // ref.once("value",p=>{
        //  setMsgs(   Object.values<any>(  p.val() || {})?.sort((a,b)=>a.time_secs-b.time_secs)) 
        // })
       let r= ref.on("child_added",sp=>{
        
            msgs.push(sp.val())
           setMsgs([...msgs])
        })

       return ()=>{
            ref.off("child_added",r)
       }
    },[])

    const joinCall = async () => {
        await cloud.twilio.getToken({to:to.email}).then(async x => {
            if(x.token) {
                if (Platform.OS!="web") {
                    activeCallToken=x.token

                    if (Platform.OS=='android'){
                      
                      let granted=await requestPermissionCamera()
                      if (granted!='granted') return;
                      
                      granted=await requestPermissionMic()
                      if (granted!='granted') return;
                   }
                    setJoined(true)
                }
                else {
                    navhelper.push("TwilioVideoCall",{ token:x.token })
                }
            }
        })
    }

    useEffect(()=>{
        
        (async () => {
        if(user_join_call) {
            try {
                setLoading(true)
          await  joinCall();
            }
            finally{
                setLoading(undefined as any)
            }
           
            
            
        }    
    })()
    
    },[user_join_call])

    useEffect(()=>{
        Session.call_in_progress=joined
    },[joined])
   // console.log(msgs)
   let inputHeight=txt?.includes("\n") ? 135:105
    return (<KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS=='android'? rh(50):SafeAreaInsets.BOTTOM + 10}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        
        {is_main_view && <ConHeader title="Chat" rightComponent={() => (<Image style={{ height: rh(40), width: rh(40), borderRadius: 100 }} source={{ uri: to.img }} />)} />}
        {/* <Header title={to.name} noPadHorizontal/> */}
        <ScrollView 
        ref={_scrollViewRef}
        showsVerticalScrollIndicator={false}
         onContentSizeChange={() => _scrollViewRef.current?.scrollToEnd({animated: true})}>
        
            {(!msgs || !msgs.length) && <Text style={{ fontFamily: 'Outfit', fontSize: fs(12), width: '100%', textAlign: "center" }}>This is the begining of this thread.</Text>}
            {msgs.map(({msg,from,time_secs},i)=>{

                const ME= from==email
                let dateTime=moment(time_secs*1000)
                let time=dateTime.format("hh:mm a")
                let date=moment().isSame(dateTime,'date')?"": dateTime.format('D MMM')
                let r= detectURLs(msg)
                return (<View  key={i} style={{width:"100%",justifyContent:ME ? "flex-end":"flex-start",flexDirection:"row",marginBottom:rh(10)}}>
                   <View style={{alignItems:ME ? "flex-end":"flex-start"}}>
                   <View style={[{backgroundColor : ME ? "#e9faef":"#2f4858",borderRadius:20},ME ? {borderBottomRightRadius:0}:{borderBottomLeftRadius:0}]}>
                    <Text onLongPress={()=>{ 
                        Clipboard.setString(msg)
                        Alert.alert("Copied!","Message copied to clipboard.")
                       }} 
                      onPress={()=>{ 
                      
                            !!r?.length && Linking.openURL(r[0])
                      }} 
                      style={{ fontFamily:"Outfit",fontWeight:"400",fontSize:fs(16),color:(r?.length && ME )? "blue": (ME ?"black":"white"),marginVertical:rh(15),marginHorizontal:rw(20), textDecorationLine : r?.length ? "underline":"none"}}  >{msg.replace(htmlRegexG,"")}</Text>

                 
                    </View>
                    <Text style={{fontFamily:"Outfit",fontSize:fs(12),color:'#333',marginTop:rh(5)}} >{time} {date}</Text>
                    </View>
                </View>)
            })

            } 
        </ScrollView>
        <View style={{ marginLeft: -rw(16), width: rw(375), backgroundColor: '#e9faef', height: rh(JOIN_CALL ? inputHeight+74:inputHeight)  }} >
       { is_main_view && JOIN_CALL &&    <View testID="Call Join" style={{width:"100%",backgroundColor:'#e9faef',height:rh(74),borderBottomWidth:1,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}} >
            <View>
                <Text style={{fontFamily:"Outfit",fontSize:fs(16),paddingLeft:rw(16),color:colors.lightGreen}} >Call in progress</Text>
                </View>
                {!joined && <AppButton title="Join" loading={loading}  onPress={async()=>{ await joinCall()
                }}  style={{width:rw(160)}} />}

            
            </View>}
            <TextInput ref={inputRef} placeholder="Type your message here" value={txt} onChangeText={t=>setTxt(t?.trimStart())} style={[{ width: "100%", flex: 1, fontFamily: 'Outfit', fontSize: fs(16), color: 'black', paddingHorizontal: rw(16),paddingTop:rh(15),paddingBottom:rh(15) }]}
             multiline
            >




            </TextInput>
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: "row" }} >
                <View />
                <View style={{flexDirection:'row',display:"flex"}}>
                <AppButton
                    title="Send file"
                    style={{ width: rw(71), height: rh(30), backgroundColor: undefined, borderWidth: 1, borderColor:!IsSubError ?colors.lightGreen:'#aaa', color:!IsSubError ?colors.lightGreen:'#aaa'}}
                    enabled={IsSubError ? false:undefined}
                    onPress={async ()=>{

                        //permission android
                        if (Platform.OS=='android'){
                           let granted=await requestPermission()
                           if (granted!='granted') return;
                        }
                        const pickerResult = await DocumentPicker.pickSingle({
                            presentationStyle: 'fullScreen',
                            copyTo: 'cachesDirectory',
                          })
                        
                          if (pickerResult?.size!>Session.configs.file_size_limit_in_bytes)
                          {
                                  alert (`Your file size is ${Math.round(pickerResult?.size!/Math.pow(1024,2))} MB, which is greater than the limit ${Session.configs.file_size_limit_in_bytes/Math.pow(1024,2)} MB.`)
                                  throw 'File too big error'
                          }
                          await new Promise((r,rj)=>{

                            Alert.alert("Confirm","Do you want to send "+pickerResult?.name,[{text:"No",onPress:r},{text:"Yes",onPress:async()=>{
                                const ref=storage().ref(`chats/${makeid(5)+"_"+pickerResult?.name}`)
                                try {
                                        await ref.putFile( await getPathForFirebaseStorage( pickerResult?.uri))
                                      let downloadURL=await ref.getDownloadURL()
                                      await cloud.send({to:to.email,name,time_secs:Math.round(moment().utc().valueOf()/1000),isUser:true,msg:`<a href=${downloadURL} >${pickerResult.name} </a>`,threadId})
                                        r()
                                    }
                                catch(e){
                                    rj(e)
                                }
                            }}])

                          })

                        console.log(pickerResult)
                    }}
               />
                <AppButton onPress={async ()=>{
                    try{
                    await cloud.send({to:to.email,name,time_secs:Math.round(moment().utc().valueOf()/1000),isUser:true,msg:txt!,threadId})
                    setTxt("")
                    inputRef.current?.clear()
                    }
                    finally{
                        Keyboard.dismiss()
                        setTimeout(()=>{
                            inputRef.current?.clear()
                        },1000)
                    }

                }} enabled={DISABLE_SEND? false:undefined} title="Send" style={{ width: rw(71), height: rh(30), backgroundColor: undefined, borderWidth: 1, borderColor:!DISABLE_SEND ?colors.lightGreen:'#aaa', color:!DISABLE_SEND?colors.lightGreen:'#aaa'}} />
                </View>
            </View>
          {Platform.OS !== 'web' && <Text style={{color:colors.lightGreen,fontSize:fs(10),paddingHorizontal:rw(16)}}>You can long press to copy message.</Text>} 
        </View>
        <Overlay >
     { joined &&  <TwilioVideoCall onEnd={()=>setJoined(false)} token={activeCallToken} />}
     </Overlay>
    </KeyboardAvoidingView>)

}

coreOptions(ChatScreen, {
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ paddingHorizontal: rw(16) }),

})
const styles = StyleSheetRW.create(() => ({

}))

const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Files Permission",
          message:
            "App needs access to your files " +
            "so you can send files",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("We can now read files");
      } else {
        console.log("File read permission denied");
      }
      return granted
    } catch (err) {
      console.warn(err);
    }
  };
  const requestPermissionCamera = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message:
            "App needs access to your Camera " +
            "so you can join calls",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("We can now use camera");
      } else {
        console.log("camera denied");
      }
      return granted
    } catch (err) {
      console.warn(err);
    }
  };
  const requestPermissionMic = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Mic Permission",
          message:
            "App needs access to your Microphone " +
            "so you can join calls",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("We can now use camera");
      } else {
        console.log("camera denied");
      }
      return granted
    } catch (err) {
      console.warn(err);
    }
  };
  async function getPathForFirebaseStorage (uri:string) {
    if (Platform.OS!='android') return uri
    const stat = await RNFetchBlob.fs.stat(uri)
    return stat.path
  }