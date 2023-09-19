
import React, { useEffect, useState } from "react"
import { Image, ImageBackground,Platform,View } from "react-native"
import { GirdComponent, WinWidth } from "core/helpers"
import launch_Background_jpg from "res/img/launch_Background.jpg"
import Game_On_Logo_png from "res/img/Game_On_Logo.png"
import GO_Shadow_png from "res/img/GO_Shadow.png"
import { AppWindow, rh, rw } from "core/designHelpers"
import navhelper from "core/navhelper"
import home_stub_png from "res/img/home_stub.png";
import ConsumerTabs from "./consumer/tabs/ConsumerTabs"
import SafeAreaInsets from "src/components/SafeAreaInsets"
import ReduxStore, { ReduxUser, updateStore, useAppStore } from "src/models/ReduxStore"
import clientStorage from "core/clientStorage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import loadDynamicEnv from "core/dynamicEnv"
import cloud, { initClient } from "src/cloud"
import { Logout, makeDBPath, Session } from "src/commons"
import { store } from "core/singleFileReduxManager"
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import BottomBar from "src/components/BottomBar"
import database from '@react-native-firebase/database'
import types from "res/refGlobalTypes"
import NewVersionScreen from "./NewVersionScreen";
import packageJson from "../../package.json";
import jwtDecode from "jwt-decode"
import ProviderTabs from "./provider/ProTabs/ProviderTabs"

export default function SplashScreen() {

  const [ shouldDisplayNewVersionScreen, setShouldDisplayNewVersionScreen ] = useState<boolean>(false);
  const [ isUpdateCompulsory, setIsUpdateCompulsory ] = useState<boolean>(false);

  const shouldUpdateVersion = () => {
    if(Platform.OS === 'web')
      return false;
    const configs = Session.configs || {latest_version:"1.0.0.0",force_update:false}
    
    const latestVersion = configs.latest_version;
    const forceUpdate = configs.force_update;

    const localAppVersion = packageJson.version;

    const isLatestVersionInstalled = Number( localAppVersion.replace(/\./g,"") ) >= Number(latestVersion.replace(/\./g,""))
    const isUpdateCompulsory = !isLatestVersionInstalled && forceUpdate;
    setIsUpdateCompulsory(isUpdateCompulsory);

    if(isUpdateCompulsory || !isLatestVersionInstalled) {
      setShouldDisplayNewVersionScreen(true);
      return true;
    }

    return false;
  }

  const updateMainScreen = () => {
    setShouldDisplayNewVersionScreen(false);
    let user:ReduxUser = clientStorage.getItem("user")
    let provider:types.IProvider = clientStorage.getItem("provider")
    // console.log("User>>",user)
    updateStore({ user, provider })
    let IsAdmin=user?.token ? (jwtDecode(user.token)  as types.ITokenConent).isAdmin:false
    const IS_AUTHORIZED =(!!user && !!user?.full_name) || (!!provider?.email && !!user?.token ) || IsAdmin
    const params: any = Platform.OS != "web" ? {} : new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    });

    if (params.dest) {
      navhelper.setRoot(params.dest)
    } else {
      if (!IS_AUTHORIZED) {
        navhelper.setRoot("WelcomeScreen")
      }
      else {
        if (IsAdmin){
          navhelper.setRoot("AdminHomeScreen")
        }
        else if (provider?.email){
          if (provider?.status=='profile_completed' || provider?.status=='active')
          navhelper.setRoot(ProviderTabs)
          else
          navhelper.setRoot("WelcomeScreen")
        }
        else{
          navhelper.setRoot(ConsumerTabs)
        }
      }
    }
  }

  useEffect(()=>{
    
    clientStorage.loadCache().then(() => 
    Promise.all([
    //   AsyncStorage.clear(),
        loadDynamicEnv(()=>initClient({
          logoutAction:Logout,
          getToken:()=>{
            return (store.getState() as ReduxStore).user?.token || ""
          }
        
        })).catch(e=>{
          throw e
        }),
      
        SafeAreaInsets.init(),
      
      ])
      .then(()=>{

        Session.configs=  clientStorage.getItem("serverConfigs")
        database().ref(makeDBPath("configs")).once('value').then(sp=>{
          Session.configs=sp.val()
          clientStorage.saveItem("serverConfigs",sp.val())
        })

        if(shouldUpdateVersion()) {
          return;
        }
          
        updateMainScreen();
      })
   )
  },[])
  
    return (
        <View  style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <SafeAreaInsets />
            <Image style={{width:rh(36)*668/117,marginLeft:rw(16), height: rh(36), marginTop: rh(390), }} resizeMode="contain"  source={Game_On_Logo_png} />
            <Image style={{position:"absolute", width:AppWindow.WIN_WIDTH*0.4,height:620/900*0.4*AppWindow.WIN_WIDTH,left:0,bottom:0}} resizeMode="contain" source={GO_Shadow_png} /> 
            <NewVersionScreen visible={shouldDisplayNewVersionScreen} isUpdateCompulsory={isUpdateCompulsory} closeModal={() => updateMainScreen()} />
        </View>
    )
}
const handler=(msg:FirebaseMessagingTypes.RemoteMessage,isBack?:boolean)=>{

  console.log(isBack)
  if (msg.data?.isMsg){
   !Session.isChatActive && BottomBar.setIndicator(1)
  }
}
messaging().onMessage(handler)
messaging().setBackgroundMessageHandler( async (e)=>handler(e,true))