
import { fs, rgba, rh, rw } from "core/designHelpers"
import navhelper from "core/navhelper"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Image, Linking, Platform, Text, TouchableOpacity, View } from "react-native"

import { NavProps } from "core/interfaces"
import StyleSheetRW from "core/StyleSheetRW"
import AppleLogo_png from 'res/img/AppleLogo.png'
import EmailLogo_png from 'res/img/EmailLogo.png'
import FbLogo_png from 'res/img/FbLogo.png'
import Game_On_Logo_png from "res/img/Game_On_Logo.png"
import GoogleLogo_png from 'res/img/GoogleLogo.png'
import GO_ShadowX_png from "res/img/GO_ShadowX.png"

import { AppleLogin, FBLogin, GoogleLogin, ISocialLogin } from "core/SocialLogins"
import cloud from "src/cloud"
import {  Login } from "src/commons"
import FinishSetupScreen from "./FinishSetupScreen"
import Pic from "core/Pic"

const URLS = {
  PRIVACY: "https://web.thegameonapp.com/policy.pdf",
  TERMS: "https://web.thegameonapp.com/terms.pdf",
}

function SocialLogin(provider: ISocialLogin,[loading,setLoading]:[boolean,(_:boolean)=>any]) {

  if (loading)
    return;
  setLoading(true)

  provider().then(async x => {

    if (!x) {
      return;
    }
    FinishSetupScreen.hintName = x.fullName!
    try {
      await Login(x?.email!, x?.externalId!, true)
    }
    catch (e) {
      try {
        const { token } = await cloud.signup({
          email: x?.email!,
          password: x?.externalId!,
          source: x?.source
        })

        // if (token)
        //   await JumpToSignUp(token, x?.email)
      }
      catch (signupError) {

      }
    }

  })
    .catch(e => {
      Alert.alert("Something went wrong", typeof e == 'string' ? e : e.message)
    })
    .finally(() => {
      setLoading(false)
    })
}

export default function WelcomeScreen({ componentId }: NavProps) {
  const loader           = useState(false)
  const [index,setIndex] = useState(0)
  const [loading,setLoader]=loader
  let continueButtons:Array<[name:string,action:any,icon:any]>=[
   ["Google"  , () => SocialLogin(GoogleLogin,loader) ,GoogleLogo_png ],
   ["Apple"   , () => SocialLogin(AppleLogin,loader)  ,AppleLogo_png  ],
   ["Facebook", () => SocialLogin(FBLogin,loader)     ,FbLogo_png     ],
   ["Email"   , () => navhelper.push("LoginScreen")   ,EmailLogo_png  ],
  ]
  let buttons = continueButtons.map(x=>x[0])
  let actions = continueButtons.map(x=>x[1])
  let logos   = continueButtons.map(x=>x[2])

  return (
    <View style={styles.body}>
      <Image style={styles.logoShadow} resizeMode="contain" source={GO_ShadowX_png} />
      <View style={styles.content}>
        <Image style={styles.logo} resizeMode="contain" source={Game_On_Logo_png} />
        <Text style={styles.subtitle}>
          Connect With Verified Mental Health Professionals
        </Text>
        <View style={{ marginTop: rh(40) }}>

          {buttons.map((button, i) => {
            if (button!='Email')
            return null;
            let enabled =  !loading && !!actions[i]
            let action=()=>{
              setIndex(i)
              actions[i]()
            }
            return (<ContinueButton 
                      key={button} 
                      {...{ enabled, 
                            name: button, 
                            logo: logos[i],
                            loading:loading && i==index, 
                            action, i }} />)

          })}

        </View>
        <Text style={{
          marginTop: rh(80),
          textAlign: "center",
          fontWeight: "400",
          fontSize: fs(12),
          color: rgba(51, 51, 51, 1),
          fontFamily:"Outfit"
        }}>
          By tapping Continue, you agree to our{' '}
          <Text style={styles.hyperlink} onPress={() => Linking.openURL(URLS.TERMS)}>
            Terms of Use
          </Text> and our{' '}
          <Text style={styles.hyperlink} onPress={() => Linking.openURL(URLS.PRIVACY)} >
            Privacy Policy
          </Text>
        </Text>
        <Text style={{
          marginTop: rh(15),
          textAlign: "center",
          fontWeight: "400",
          fontSize: fs(12),
          color: rgba(51, 51, 51, 1),
          fontFamily:"Outfit"
        }}>
          This app is not for emergancy cases. For emergency cases{'\n'}
          please call{' '}
          <Text style={styles.hyperlink} onPress={() => Linking.openURL('tel:988')}>
            988
          </Text> 
        </Text>
        {/* Access for providers */}
        <Text style={{
          marginTop: rh(15),
          textAlign: "center",
          fontWeight: "400",
          fontSize: fs(12),
          color: rgba(51, 51, 51, 1),
          fontFamily:"Outfit"
        }}>
          
          <Text  style={[styles.hyperlink,{fontSize:fs(15),opacity:Platform.OS=='web' ? 1:0}]} onPress={() =>Platform.OS=='web'&& navhelper.setRoot("ProWelcomeScreen")}>
          {Platform.OS=='android'?'':'Continue as a Professional'}
          </Text> 
        </Text>
      </View>
    </View>
  )


}
interface ContinueButtonProps { enabled: boolean,loading?:boolean, name: string, logo: any, i: number, action?: any }

function ContinueButton({ enabled, name, i, logo, action,loading }: ContinueButtonProps) {

  return (<TouchableOpacity
    disabled={!enabled}

    style={{
      flexDirection: "row",
      borderRadius: 50,
      alignItems: "center",
      backgroundColor: enabled ? "white" : "rgba(255,255,255,0.5)",
      width: "100%",
      height: rh(54),
      marginTop: rh(i > 0 ? 15 : 0)
    }}
    onPress={action}
  >
    {loading ?
     <ActivityIndicator  style={{marginLeft: rw(15)}}/>
    :
     <Image style={{ height: rh(24), width: rw(24), marginLeft: rw(15) }} resizeMode="contain" source={logo} /> 
    }
    <Text style={{ marginLeft: rw(20), fontFamily: "Outfit" ,color:'rgba(51, 51, 51, 1)'}}>Continue with {name}</Text>
   
  </TouchableOpacity>)
}


const styles = StyleSheetRW.create(() => ({

  body: { width: "100%", height: "100%", alignItems: "center" },

  logoShadow: { alignSelf:"flex-end",width: rh(281)*1436/1072, height: rh(281), marginTop: rh(-13) },

  content: { width: rw(343), marginTop: rh(30) },

  logo: { width:rh(40)*668/117, height: rh(40), borderWidth: 0 },

  subtitle: { color: "#2F4858", marginTop: rh(20), fontFamily: "Outfit", fontSize: 16, fontWeight: "600" },

  hyperlink: { textDecorationLine: "underline", fontWeight: "bold", fontFamily: "Outfit" }
}))

