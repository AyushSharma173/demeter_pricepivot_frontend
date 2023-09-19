import StyleSheetRW from "core/StyleSheetRW";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View, Image } from "react-native";
import { fs, rh, rw, rgba } from "core/designHelpers";
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";
import colors from "res/colors";
import no_conversation_svg from "res/svgs/no_conversation.svg";
import Pic from "core/Pic";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";
import { Navigation } from "react-native-navigation";
import { BetaOnly, getDateTime, Session } from "src/commons";
import AppButton from "src/components/AppButton";
import cloud from "src/cloud";
import navhelper from "core/navhelper";
import clientStorage from "core/clientStorage";
import BottomBar from "src/components/BottomBar";
import moment from "moment";
import Avatar from "src/components/Avatar";

interface ProChatProps {
  componentId: string;
}

export default function ProChat(props: ProChatProps) {
  const provider = useAppStore((s) => s.provider);

  /*
  // For testing
  const [clientsList, setClienList] = useState([{
    name: 'lady diana',
    description: 'female 20, relationship',
    unread_count: 3,
    last_msg: 'Now'
  },{
    name: 'man 12',
    description: 'male 20, relationship',
    unread_count: 12,
    last_msg: 'a min ago'
  },{
    name: 'lady 2',
    description: 'female 20, relationship',
    unread_count: 0,
    last_msg: '2 min'
  },{
    name: 'lady 3',
    description: 'female 30, relationship',
    unread_count: 76,
    last_msg: '2:20 pm'
  },{
    name: 'lady 4',
    description: 'female 25, relationship',
    unread_count: 0,
    last_msg: 'Yesterday'
  },{
    name: 'lady 5',
    description: 'female 40, relationship',
    unread_count: 542,
    last_msg: '5/6/2022'
  },{
    name: 'child 4',
    description: 'child 10, relationship',
    unread_count: 0,
    last_msg: '7/8/2023'
  }]);*/

  function onFocus() {
    Session.isChatActive = true;
  }

  useEffect(() => {
    if (Platform.OS != "web") {
      let s = Navigation.events().registerComponentDidAppearListener((x) => {
        if (x.componentId == props.componentId) {
          onFocus();
        }
      });
      let sl = Navigation.events().registerComponentDidDisappearListener(
        (x) => {
          if (x.componentId == props.componentId) {
            Session.isChatActive = false;
          }
        }
      );

      return () => {
        //  ref.off("child_added",lstner)
        s.remove();
        sl.remove();
      };
    } else {
       onFocus()
      return () => {
        Session.isChatActive = false;
      };
    }
  }, []);
    
  return (
    <>
      <ConHeader title='Clients' />

      <View
        style={{
          marginTop: 0,
        }}>
        {provider && provider.clients && provider.clients.map((c) => {
          console.log("Unread",c.unRead)
          return (
            <TouchableOpacity onPress={()=>{ 
              clientStorage.saveItem("lastRead"+c.threadId,moment().utc().valueOf()/1000);
              const clients=provider.clients.map(x=>{
                let unRead=x.unRead
                if (x==c)
                {
                  unRead=false
                }
                return {...x,unRead}
              })
              updateStore({ provider: { ...getAppStore(p=>p.provider)!, clients } });
              if (clients.find(x=>x.unRead)){

              }
              else {
                BottomBar.setIndicator(-1)
              }
              navhelper.push('ProClientInteraction', {
                to: {
                  email: c.email,
                  name: c.full_name,
                  img: c.img,
                },
              });
            }} key={c.email}>
              <View
                style={{
                  marginTop: 20,
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Avatar
                  source={
                    c.img?.startsWith('http')
                      ? { uri: c.img }
                      : { uri: 'data:image/png;base64,' + c.img }
                  }
                  style={{
                    width: rw(45),
                    height: rh(45),
                    borderRadius: rw(22),
                  }}
                  name={c.full_name}

                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    marginTop: 4,
                  }}
                >
                  <View>
                    <Text
                   
                      style={{
                        fontWeight: 'bold',
                      }}>
                      {c.full_name}
                    </Text>
                    <Text
                      style={{
                        color: c.unRead  ? '#039590' : rgba(128, 128, 128, 1),
                        fontWeight: c.unRead ? 'bold' : 'normal',
                        marginTop: 8,
                        fontFamily: 'Outfit',
                        fontSize:fs(c.unRead ?18:16)
                      }}>
                      {c.last_message}
                    </Text>
                  </View>
                </View>

                <View style={{}}>
                  <Text
                    style={{
                      fontFamily: 'Outfit',
                      paddingTop: 3,
                      
                      
                    color: c.unRead  ? '#039590' :rgba(128, 128, 128, 1),
                    fontWeight: c.unRead  ? 'bold' : 'normal'
                    }}>
                    {getDateTime(c.updatedAt_secs)}
                  </Text>
                  {/* {c.unread_count > 0 && <View style={{
                    width: 24 + (c.unread_count.toString().length > 1 ? ((c.unread_count.toString().length - 1) * 8) : 0),
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#039590',
                    backgroundColor: '#039590',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    marginTop: 5,
                  }}>
                    <Text style={{
                      color: '#fff',
                      fontWeight: 'bold'
                    }}>
                      {c.unread_count}
                    </Text>
                  </View>} */}
                </View>
              </View>
              <View
                style={{
                  marginTop: 15,
                  marginLeft: 60,
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  width: '85%',
                  opacity: 0.15,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {provider && !provider.clients?.length  && <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ flexDirection: "column", alignItems: "center",justifyContent:"center", flex: 1 }}
        >
          <Pic
            source={no_conversation_svg}
            style={{
              height: rh(70),
              opacity: 0.3,
              width: rw(70),
              marginBottom: rh(20),
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                opacity: 0.2,
                fontFamily: "Outfit",
                fontSize: fs(16),
                fontWeight: "500",
                color: colors.dark,
                marginBottom: rh(10),
              }}
            >
              No Conversations
            </Text>
          </View>
        
        </View>
      </View>}
      {false &&<AppButton title="Join"  onPress={async ()=>{
                        await cloud.twilio.getToken({to:__DEV__ ?'dev0280@yopmail.com':"demo1@yopmail.com"}).then(x=>{
                            
                            if(x.token){
                               if (Platform.OS!="web"){
                                //activeCallToken=x.token
                                //setJoined(true)
                               }
                               else{
                                    navhelper.push("TwilioVideoCall",{
                                      token:x.token, 
                                      is_provider: true
                                    })
                               }
                               
                            }
                        })
                }}  style={{width:rw(160), marginTop:25}} />}
    </>
  );
}

const UseAppStore = () => useAppStore((p) => p.active_provider);

coreOptions(ProChat, {
  useSafeAreaView: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
  getBottomBarStyle: () => {
    const active_provider = UseAppStore();
    if (active_provider) return { backgroundColor: "#e9faef" };
    else return {};
  },
});

const styles = StyleSheetRW.create(() => ({}));