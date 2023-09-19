import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { fs, FULL_SCREEN, rh, rw } from "core/designHelpers"
import navhelper, { APP_SCREEN_NAME } from "core/navhelper"
import { Alert, Image, Touchable, TouchableOpacity } from "react-native"
import home_stub_png from "res/img/home_stub.png"
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";
import GO_ShadowX_png from "res/img/GO_ShadowX.png"
import colors from "res/colors";
import menu_profile_svg from 'res/svgs/menu_profile.svg'
import menu_settings_svg from 'res/svgs/menu_settings.svg'
import menu_support_svg from 'res/svgs/menu_support.svg'
import menu_subscription_svg from 'res/svgs/menu_subscription.svg'
import menu_signout_svg from 'res/svgs/menu_signout.svg'
import mock_profile_png from 'res/img/mock_profile.png'
import Pic from "core/Pic";
import { updateStore, useAppStore } from "src/models/ReduxStore";
import clientStorage from "core/clientStorage";
import { Logout } from "src/commons";
import AppButton from "src/components/AppButton";
import {launchImageLibrary} from "react-native-image-picker"
import cloud from "src/cloud";
import FarImage from "core/FarImage";
import defaultProfile_png from "res/img/defaultProfile.png"
import env from "res/env";
interface Menuprops{

}
const LOGO_SCALE=1.16
const OPTIONS=['Your Profile', 'Update Details', 'App Settings','Support','Sign out']
const ICONS=[menu_profile_svg,menu_settings_svg,menu_settings_svg,menu_support_svg,menu_signout_svg]
export default function  ProMenu (props:Menuprops){
  const provider = useAppStore(s=>s.provider!) || {}

    const {email,img,name:full_name}=provider
    const onPresses=[()=>navhelper.push("ProUpdateScreen",{from:"ProMenu"}),() => navhelper.push("ProFinishSetupScreen",{from:"ProMenu"}),,()=>navhelper.push("SupportScreen"),()=>Alert.alert("Sign Out?","You would me signed out of your Game On! account",[{text:"No"},{text:"Yes",onPress:Logout}])]
    console.log(img?.slice(0,12))
    let max=0;
    let names=full_name?.split(' ').slice(0,2)!
    if (names?.length<2){
        names.push('')
    }
    return (<>
    <ConHeader title="Pro Menu" />
    <View style={{height:rh(203),paddingVertical:rh(10),paddingHorizontal:rw(10),flexDirection:"row",borderRadius:24,backgroundColor:"rgba(255,255,255,0.3)",overflow:'hidden'}}>
        <Image source={GO_ShadowX_png}   resizeMode="contain" style={{height:rh(99)*LOGO_SCALE,width:rw(133)*LOGO_SCALE,position:"absolute",right:0}}/>
        <FarImage 
        source={img ? {uri:img}: defaultProfile_png}
        resizeMode={img ? "cover":"contain"}
        style={{borderRadius:30,height:'100%',width:rw(152)}}
        />
        <View style={{flex:1,paddingLeft:rw(15),justifyContent:"flex-end"}}>
                <View style={{flexDirection:"column"}}>
                    {names?.map((x,i)=>(<View key={i}>
                     <Text numberOfLines={1} key={i} adjustsFontSizeToFit   style={{flex:Platform.OS=='web' ? 1:0,height:Platform.OS=='web' ? 200:undefined,fontFamily:"Outfit",fontSize:fs(30),fontWeight:'600',color:colors.darkGreen,marginBottom:rh(5)}} >{(x.charAt(0).toUpperCase() + x.slice(1))}</Text>
                    </View>
                    ))

                    }
           
                </View>
                <View style={{flexDirection:"row",marginBottom:rh(10)}}>
                <Text numberOfLines={1} style={{flex:0, fontFamily:"Outfit",fontSize:fs(16),fontWeight:'400',color:colors.dark}} >{email}</Text>
                </View>
               
        </View>
    </View>
    <View  style={{backgroundColor:'black',opacity:0.2,height:1,width:rw(70),alignSelf:'center',marginTop:rh(20),marginBottom:rh(35)}}/>
{   OPTIONS.map((x,i)=>{
    if (x=='App Settings' || (x=="Manage Subscription" && env.NO_PAY)){
        return null
    }
    const onPress=onPresses[i]
    const icon=ICONS[i]
    return(<TouchableOpacity onPress={onPress} style={{flexDirection:"row",height:rh(54),paddingLeft:rw(16),marginBottom:rh(18),alignItems:'center'}} key={x}>
        <View style={{height:rh(24),width:rw(24),marginRight:rw(16),alignItems:"center",justifyContent:"center"}}>
<Pic source={icon} style={{height:'100%',width:"100%"}} />
</View>

    <Text style={{color:colors.dark,fontWeight:"600",fontFamily:"Outfit",fontSize:fs(16)}} >{x}</Text>
    </TouchableOpacity>)
})

}
    </>)
    
}
coreOptions(ProMenu,{ 
    useSafeAreaView:true,
    getBodyStyle:()=>({paddingHorizontal:rw(16)})
})
const styles=StyleSheetRW.create(()=>({
    
}))