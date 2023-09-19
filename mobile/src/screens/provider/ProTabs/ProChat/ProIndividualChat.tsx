import { coreOptions } from 'core/core';
import { fs, rh, rw } from 'core/designHelpers';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Keyboard,
} from 'react-native';
import colors from 'res/colors';
import cloud from 'src/cloud';
import AppButton from 'src/components/AppButton';
import SafeAreaInsets from 'src/components/SafeAreaInsets';
import { useAppStore } from 'src/models/ReduxStore';
import database from '@react-native-firebase/database';
import env from 'res/env';
import Header from 'src/components/Header';
import Avatar from 'src/components/Avatar';
import { BetaOnly, Session, detectURLs, makeid } from 'src/commons';
import clientStorage from 'core/clientStorage';
import navhelper from 'core/navhelper';
import { Linking } from 'react-native';
import WebDocumentPicker from 'core/WebDocumentPicker';
import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
// import TwilioVideoCall from "./consumer/tabs/Chat/TwilioVideoCall";

interface ProIndividualChatProps {
  to: { email: string; name: string; img: any };
  is_main_view: boolean
}
var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

export default function ProChat(props: ProIndividualChatProps) {
  const { to, is_main_view = true } = props;
  const [msgs, setMsgs] = useState<Array<any>>([]);
  const [txt, setTxt] = useState<string>('');

  const email = useAppStore((s) => s.provider?.email) || '';
  const name = useAppStore((s) => s.provider?.name) || '';

  const threadId = [to.email, email].sort().join();
  // const [joined,setJoined]=useState(false)

  const _scrollViewRef = useRef<ScrollView>();
  const _webDocumentPickerRef=useRef<WebDocumentPicker>();
  const JOIN_CALL = true;

  useEffect(() => {
    let path = `/${env.type.toUpperCase()}/threads/${threadId.replace(/\./g, '{dot}')}`;
    console.log(path);
    let ref = database().ref(path);
    let r = ref.on('child_added', (sp) => {
      msgs.push(sp.val());
      setMsgs([...msgs]);
      clientStorage.saveItem("lastRead"+threadId, moment().utc().valueOf()/1000);
    });
    Session.currentThread=threadId
    console.log(">> current thread set",Session.currentThread)
    return () => {
      ref.off('child_added', r);
      Session.currentThread=""
      console.log("<< current thread unset",Session.currentThread)
    };
  }, []);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      {
        is_main_view &&
        <Header
          title={to.name}
          rightComponent={
            <Avatar
              name={to.name}
              style={{ height: rh(40), width: rh(40), borderRadius: 100, alignItems: 'flex-start' }}
              source={
                to.img?.startsWith('http')
                  ? { uri: to.img }
                  : { uri: 'data:image/png;base64,' + to.img }
              }
            />
          }
        />
      }
      <ScrollView
        ref={_scrollViewRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => _scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {(!msgs || !msgs.length) && (
          <Text
            style={{ fontFamily: 'Outfit', fontSize: fs(12), width: '100%', textAlign: 'center' }}>
            This is the beginning of this thread.
          </Text>
        )}
        {msgs.map(({ msg, from, time_secs, to }, i) => {
          const ME = from === email;
          let dateTime = moment(time_secs * 1000);
          let time = dateTime.format('hh:mm a');
          let date = moment().isSame(dateTime, 'date') ? '' : dateTime.format('D MMM');
          let r= detectURLs(msg)
          return (
            <View
              key={i}
              style={{
                width: '100%',
                justifyContent: ME ? 'flex-end' : 'flex-start',
                flexDirection: 'row',
                marginBottom: rh(10),
              }}>
              <View style={{ alignItems: ME ? 'flex-end' : 'flex-start' }}>
                <View
                  style={[
                    { backgroundColor: ME ? '#e9faef' : '#2f4858', borderRadius: 20 },
                    ME ? { borderBottomRightRadius: 0 } : { borderBottomLeftRadius: 0 },
                  ]}>
                  <Text
                    style={{
                      flex:1,
                      flexWrap:'wrap',
                      maxWidth:rw(200),
                      fontFamily: 'Outfit',
                      fontWeight: '400',
                      fontSize: fs(16),
                      color:(r?.length && ME )? "blue": (ME ?"black":"white"),
                      marginVertical: rh(15),
                      marginHorizontal: rw(20),
                      textDecorationLine : r?.length ? "underline":"none"
                    }}
                    onPress={()=>{
                      !!r?.length && Linking.openURL(r[0])
                    }}
                    >
                    {msg.replace(htmlRegexG,"")}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Outfit',
                    fontSize: fs(12),
                    color: '#333',
                    marginTop: rh(5),
                  }}>
                  {time} {date}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          marginLeft: -rw(16),
          width:is_main_view ? rw(375) : '110%',
          backgroundColor: '#e9faef',
          height: rh(JOIN_CALL ? 105 + 74 : 105),
        }}>
           {false &&<AppButton title="Join"  onPress={async ()=>{
                        await cloud.twilio.getToken({to:to.email}).then(x=>{
                            
                            if(x.token){
                               if (Platform.OS!="web"){
                                //activeCallToken=x.token
                                //setJoined(true)
                               }
                               else{
                                    navhelper.push("TwilioVideoCall",{
                                      token:x.token, 
                                      is_provider: true,
                                      to
                                    })
                               }
                               
                            }
                        })
                }}  style={{width:rw(160), marginTop:25}} />}
    
        <TextInput
          placeholder='Type a message'
          placeholderTextColor='#BAC8BF'
          value={txt}
          onChangeText={(t) => setTxt(t?.trimStart())}
          style={{
            width: '100%',
            flex: 1,
            fontFamily: 'Outfit',
            fontSize: fs(16),
            color: 'black',
            paddingHorizontal: rw(16),
          }}></TextInput>
          <WebDocumentPicker ref={_webDocumentPickerRef as any}/>
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View />
          <View style={{flexDirection:'row',display:"flex"}}>
          <AppButton
                    title="Send file"
                    style={{ width: rw(71), height: rh(30),marginTop:5, backgroundColor: 'rgba(0,0,0,0,0)', borderWidth: 1, borderColor:colors.lightGreen, color:colors.lightGreen}}
                    onPress={async ()=>{
                    
                  
                        const pickerResult =   await _webDocumentPickerRef.current?.pickFile()
                        
                          if (pickerResult?.size!>Session.configs.file_size_limit_in_bytes)
                          {
                                  alert (`Your file size is ${Math.round(pickerResult?.size!/Math.pow(1024,2))} MB, which is greater than the limit ${Session.configs.file_size_limit_in_bytes/Math.pow(1024,2)} MB.`)
                                  throw 'File too big error'
                          }
                          await new Promise((r,rj)=>{

                            Alert.alert("Confirm","Do you want to send "+pickerResult?.name,[{text:"No",onPress:r},{text:"Yes",onPress:async()=>{
                                const ref=storage().ref(`chats/${makeid(5)+"_"+pickerResult?.name}`)
                                try {
                                        await ref.putFile(pickerResult?.uri)
                                      let downloadURL=await ref.getDownloadURL()
                                      await cloud.send({to:to.email,name,time_secs:Math.round(moment().utc().valueOf()/1000),isUser:true,msg:`<a href=${downloadURL} >${pickerResult?.name} </a>`,threadId})
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
          <AppButton
            onPress={async () => {
              try {
                await cloud.send({
                  to: to.email,
                  name: name,
                  time_secs: Math.round(moment().utc().valueOf() / 1000),
                  isUser: false,
                  msg: txt!,
                  threadId,
                });
                setTxt('');
              } finally {
                Keyboard.dismiss();
              }
            }}
            enabled={!txt ? false : undefined}
            title='Send'
            style={{
              marginTop: 5,
              width: rw(71),
              height: rh(30),
              borderWidth: 1,
              borderColor: txt ? colors.lightGreen : '#aaa',
              color: txt ? colors.lightGreen : '#aaa',
              backgroundColor:'#rgba'
            }}
          />
          </View>
        </View>
      </View>
      {/* <Overlay></Overlay> */}
    </KeyboardAvoidingView>
  );
}

coreOptions(ProChat, {
  useSafeAreaView: true,
  noBottomBar: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});
