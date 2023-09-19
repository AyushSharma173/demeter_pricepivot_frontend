import StyleSheetRW from "core/StyleSheetRW";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
import { fs, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import { TouchableOpacity } from "react-native";
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";

import colors from "res/colors";

import types from "res/refGlobalTypes";
import { Navigation } from "react-native-navigation";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";

import { BlurView } from "@react-native-community/blur";
import env from "res/env";
import ProActiveProvider from "./ProActiveProvider";
import ProClients from "./ProClients";
import InfoBar from "src/components/InfoBar";
import cloud from "src/cloud";
import  database  from "@react-native-firebase/database"
import gear_svg from "res/svgs/gear.svg"
import { BetaOnly, getThreadId, Session } from "src/commons";
import clientStorage from "core/clientStorage";
import BottomBar from "src/components/BottomBar";

interface ProHomeprops {
  componentId: any;
}
var ref:any=undefined
var listener:any=undefined
function onLogout(){
  ref?.off("value",listener)
  ref=undefined
  console.log("Realtime closed")

}

export default function ProHome(props: ProHomeprops) {
  const [loading, setLoading] = useState(true);
  const [activeProvider, setActiveProvider] = useState<types.IProvider>();
  const provider = useAppStore((s) => s.provider)!;
  const [providers, setProviders] = useState<Array<types.IProvider>>([]);

  const [schedules, setSchedules] = useState<Array<any>>([]);
  const [onTrial, setTrial] = useState(!env.NO_PAY);
  //console.log(">><<",user,provider)

  const onFocus = () => {
    
    
    cloud.providers
      .getProvider()
      .then((p: any) => {
        updateStore({ provider: { ...provider, ...p } });
      })
      .finally(() => setLoading(false));
  
     if(!ref){
      let path=`/${env.type.toUpperCase()}/providers/${provider?.email.replace(/\./g,'{dot}')}/threads`
      ref=database().ref(path)
      listener=ref.on("value",async (sp:any)=>{
        console.log(">>",Session.loadingClientsStatus)
        if (Session.loadingClientsStatus=='loading'  )
        {
          console.log("Already fetching data,so ignoring realtime")
          return ;
        }
        const myThreads:types.IMyThreads =sp.val()
        if (myThreads){
            const threads=Object.values(myThreads)
            const current_clients=getAppStore(r=>r?.provider?.clients)
            console.log(">>","c",current_clients,threads)
            const NEEDS_RELOAD=threads.find(x=>!current_clients?.find(y=>getThreadId( y.email,provider?.email)==x.threadId))
            if (NEEDS_RELOAD)
            { console.log("RELOADING")
            const clients:Array<types.IClientUser &{unRead?:boolean} > = (await cloud.providers.getClients())?.map(x=>{
              let last_read=clientStorage.getItem("lastRead"+x.threadId) || 0
              const unRead = last_read < x.updatedAt_secs && x.threadId !== Session.currentThread;
              if (unRead){
                BottomBar.setIndicator(2)
              }
              return {...x,unRead:unRead}
            });
              updateStore({ provider: { ...getAppStore(p=>p.provider)!, clients } });
            }
            else {
              console.log("MERGING")
              const clients=[...current_clients!].map(x=>({...x}))
              threads.forEach(x=>{
                let client=clients.find(y=>getThreadId( y.email,provider?.email)==x.threadId)!
                client.last_message=x.last_msg
                client.updatedAt_secs=x.updatedAt_secs
                client.unRead=(clientStorage.getItem("lastRead"+x.threadId)|| 0) < x.updatedAt_secs && x.threadId !== Session.currentThread;
                if (client.unRead){
                  BottomBar.setIndicator(2)
                }
              })
              updateStore({ provider: { ...getAppStore(p=>p.provider)!, clients } });

            }

        }

      })
      Session.onLogoutListeners.push(onLogout)
      console.log("Realtime Initiated") 
    }
     else {
      console.log("Realtime already established...")
     }

    
  };

  useEffect(() => {
    if (Platform.OS != "web") {
      let s = Navigation.events().registerComponentDidAppearListener((x) => {
        if (x.componentId == props.componentId) {
          onFocus();
        }
      });

      return () => s.remove();
    } else onFocus();
  }, []);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: rw(16) }}>
          <ConHeader title="Home" />
        </View>
        <View
          style={{
            backgroundColor: "#E9FAEF",
            paddingVertical: rh(10),
            borderRadius: 25,
            paddingHorizontal: rw(16),
          }}
        >
          {provider.status == "profile_completed" && !loading && (
            <InfoBar
              data={{
                textStyle: { fontWeight: "normal" },
                text: "Please add your availability so user can schedule appointments.",
              }}
            />
          )}

          <ProActiveProvider />
        </View>
        {/* {new Array(...Array(100)).map((_,i)=>{
        return (<Text key={i}>{i}</Text>)
      })

      } */}
        <ProClients IsParentShowingLoader={loading} />
      </ScrollView>
      {loading && (
        <View
          style={{
            position: "absolute",
            alignItems: "center",
            height: "100%",
            backgroundColor: "rgba(127,127,127,0.5)",
            width: rw(375),
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"large"} color="black" />
        </View>
      )}
    </>
  );
}

function Card(item: any) {
  const onTrial = item.onTrial;
  const name = onTrial
    ? item.name.slice(0, 1) + new Array(item.name.length - 1).join("*")
    : item.name;
  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS == "web" && onTrial) {
          alert(
            "Please buy a subscription to get started. Goto Menu->Manage Subscription to select a subscription of your own choice"
          );
        } else
          navhelper.push("ProfDetailsScreen", {
            provider: item,
            onTrial,
          });
      }}
    >
      <ImageBackground
        source={{ uri: item.img }}
        style={{
          width: rw(343),
          height: rh(343),
          borderRadius: 15,
          marginBottom: rh(15),
          overflow: "hidden",
        }}
        // onLoadStart={()=>setLoading(true)}
        onLoad={() => setLoading(false)}
      >
        {onTrial && (
          <BlurView
            pointerEvents="none"
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
        )}
        <View
          style={{
            marginHorizontal: rw(20),
            marginVertical: rh(20),
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={styles.recomendedContainer}>
            <Text
              style={{
                flex: 0,
                //height:fs(16)*1.4,
                fontFamily: "Outfit",
                fontSize: fs(16),
                fontWeight: "400",
                color: colors.darkGreen,
              }}
            >
              Recommended
            </Text>
          </View>
          <View>
            <Text
              style={{
                flex: 0,
                fontFamily: "Outfit",
                fontSize: fs(18),
                fontWeight: "400",
                color: "white",
                marginBottom: rh(5),
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                flex: 0,
                fontFamily: "Outfit",
                fontSize: fs(16),
                fontWeight: "400",
                color: colors.lightGreen,
              }}
            >
              By {name}
            </Text>
          </View>
        </View>
        {loading && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <ActivityIndicator size={"large"} color="black" />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

coreOptions(ProHome, {
  useSafeAreaView: true,
  getBodyStyle: () => ({}),
});

const styles = StyleSheetRW.create(() => ({
  recomendedContainer: {
    borderRadius: 14,
    overflow: "hidden",
    flex: 0,
    backgroundColor: "white",
    paddingHorizontal: rw(10),
    paddingVertical: rh(5),
    flexDirection: "row",
    alignSelf: "flex-start",
    minHeight: fs(16) * (Platform.OS == "web" ? 1.5 : 1.4),
    alignItems: "flex-start",
  },
}));
