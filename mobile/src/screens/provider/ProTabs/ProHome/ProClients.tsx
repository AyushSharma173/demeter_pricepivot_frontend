import { useEffect, useState } from 'react';
import { Image, Text, View, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fs, rh, rw } from "core/designHelpers";

import chat from 'res/svgs/chat.svg';
import schedule_png from 'res/svgs/schedule.svg'
import Pic from 'core/Pic';
import navhelper from "core/navhelper";
import cloud from "src/cloud";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";
import { BetaOnly, Session } from 'src/commons';
import clientStorage from 'core/clientStorage';
import types from 'res/refGlobalTypes';
import BottomBar from 'src/components/BottomBar';
import Avatar from 'src/components/Avatar';

interface ProClientsProps {
  IsParentShowingLoader:boolean
}

export default function ProClients(props: ProClientsProps) {
  const [loading, setLoading] = useState(true);
  const provider = useAppStore((s) => s.provider);

	/*
  // for testing  
  const [clients, setClients] = useState([{
		full_name: 'abc',
		email: 'dede2',
		lastMessage: 'ddd'},{
			
				full_name: 'abc',
				email: 'dede2',
				lastMessage: 'xyz'},{
					full_name: 'abc',
					email: 'dede2',
					lastMessage: 'ddd'}
	]); */

  const onFocus = async () => {
    try {
      if (Session.loadingClientsStatus=='loaded')
      { console.log("Already loaded")
        return;
      }
      Session.loadingClientsStatus='loading'
      const clients:Array<types.IClientUser &{unRead?:boolean} > = (await cloud.providers.getClients())?.map(x=>{
        let last_read=clientStorage.getItem("lastRead"+x.threadId) || 0
        const unRead = last_read < x.updatedAt_secs && x.threadId !== Session.currentThread;
        if (unRead){
          BottomBar.setIndicator(2)
        }
        return {...x,unRead:unRead}
      });
    
      updateStore({ provider: { ...getAppStore(p=>p.provider)!, clients } });
      console.log(">>",getAppStore(r=>r?.provider?.clients))
      Session.loadingClientsStatus='loaded'
    } catch(err) {
      Session.loadingClientsStatus='failed'
    } 
    finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    onFocus()    
  }, []);
  
  return (
    <>
      <View
        style={{
          marginTop: 25,
          paddingLeft:rw(16),paddingRight:rw(16)
        }}>
        <Text style={{
					color:'#808080',
					fontFamily: 'Outfit'
				}}>Clients</Text>
        {!!provider?.clients?.length && provider.clients.map((c) => {
          return (
            <View  key={c.email} >
              <View
               
                style={{
                  marginTop: 15,
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Avatar
                  name={c.full_name}
                  source={c.img?.startsWith("http") ? {uri:c.img}: { uri:'data:image/png;base64,'+c.img} }
                  style={{
                    width: rw(50),
                    height: rh(50),
                    borderRadius: rh(25),
                  
                  }}
                />

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    alignSelf: 'center'
                  }}>
                  <Text
                    style={{
            					fontFamily: 'Outfit',
                      fontWeight: '600'
                    }}>
                    {c.full_name}
                  </Text>
                  {/* <Text
                    style={{
                      color: rgba(128, 128, 128, 1),
                      marginTop: 3,
                    }}>
                    {c.lastMessage}
                  </Text> */}
                </View>
                <TouchableOpacity onPress={() =>
                  navhelper.push("ProScheduleCallScreen", {client_email: c.email})}>
                  <View
                    style={{
                      borderWidth: 3,
                      borderColor: '#2F4858',
                      borderRadius: 50,
                      width: rw(90),
                      height: rh(45),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Pic source={schedule_png} style={{ height: 20, width: 20 }} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>
                  navhelper.push("ProClientInteraction", {
                    to: {
                      email: c.email,
                      name: c.full_name,
                      img: c.img
                    }
                  })}>
                  <View
                    style={{
                      borderWidth: 3,
                      borderColor: '#2F4858',
                      borderRadius: 50,
                      width: rw(90),
                      height: rh(45),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: rw(10)
                    }}>
                    <Pic source={chat} style={{ height: 20, width: 20 }} />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  width: '100%',
                  opacity: 0.15,
                }}
              />
            </View>
          );
        })}
        {
          !loading && !provider?.clients?.length  && 
          <Text style={{
            paddingTop: '30',
            alignSelf: 'center',
            color:'#333333',
            opacity: 0.2,
            fontWeight: '500'
          }}> No clients </Text>
        }
        {(loading && !props.IsParentShowingLoader &&
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              width: '75%',
              height: rh(100),
              margin: 10,
              //backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <ActivityIndicator size={"large"} color="black" />
          </View>
        )}
      </View>
    </>
  );
}
