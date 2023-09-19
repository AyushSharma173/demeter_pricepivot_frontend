
import { fs, rgba, rh, rw } from "core/designHelpers"
import navhelper from "core/navhelper"
import React, { useState } from "react"
import { ActivityIndicator, Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native"

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
import { JumpToSignUp, Login, ProLogin } from "src/commons"
import Pic from "core/Pic"
import colors from "res/colors"
import TextField from "src/components/TextField"
import clientStorage from "core/clientStorage"
import PasswordField from "src/components/PasswordField"
import AppButton from "src/components/AppButton"
import { IsValidEmail, validateAll } from "core/validators"
import env from "res/env"

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

        if (token)
          await JumpToSignUp(token, x?.email)
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

export default function ProWelcomeScreen({ componentId }: NavProps) {
  const loader           = useState(false)
  const [index,setIndex] = useState(0)
  const [loading,setLoader]=loader
  const [ email    ,  setEmail    ]=useState<string>(__DEV__ ? "dev_shahid@mailinator.com":clientStorage.getItem("lastSuccessEmail"))
  const [ password ,  setPassword ]=useState<string>(__DEV__ ? "123456":"")
  const [errors,setErrors]=useState<any>({})
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
        <Text style={[styles.subtitle,{marginTop:rh(5),fontSize:fs(18),color:colors.lightGreen}]}>
          Professionals
        </Text>
        <Text style={[styles.subtitle,{fontSize:fs(16)}]}>
          Help People Heal And Grow.
        </Text>
        <View style={{ marginTop: rh(40) }}>
        <TextField  label="Email address" 
                bodyStyle={{marginHorizontal:0}}
                  value={email}
                  placeholder="Enter your new email address..."
                  onChangeText={newEmail=>setEmail(newEmail)  }
                  errorMsg={errors["email"]}
                  />

      <View style={{ height: rh(20) }} />

      <PasswordField label="Password" 
                     value={password}
                     bodyStyle={{marginHorizontal:0}}
                     placeholder="Enter your new password..."
                     onChangeText={newPassword=>setPassword(newPassword)}
                     errorMsg={errors["password"]}
                     />
     
      <Text style={styles.forgotPwdTxt} onPress={()=>navhelper.push("ResetPasswordScreen",{provider:true})}  >Forgot Password?</Text>
      <View style={{ height: rh(24) }} />
      <AppButton 
      style={{marginHorizontal:0}}
      onPress={async () => {
        let rules = [
          { email, rule: IsValidEmail },
          //{ password, rule: IsValidPassword }
        ]

        if (env.type == "mock")
          rules.pop()

        let newErrors = validateAll(rules)
        if (Object.keys(newErrors).length) {
          setErrors(newErrors)
          return;
        }
        await ProLogin(email,password)
      }} 
        title="Login"
        //enabled={(env.type=="mock") ||(!!email && !!password)}
        
        loaderDelayMillis={5000}
      />
        

        </View>
        <Text style={{
          marginTop: rh(24),
          textAlign: "center",
          fontWeight: "400",
          fontSize: fs(16),
          color: rgba(51, 51, 51, 1),
          fontFamily:"Outfit"
        }}>
          If you do not have an account{' '}
          <Text style={styles.hyperlink} onPress={() =>navhelper.push("ProSignupScreen")}>
            Sign Up
          </Text> 
        </Text>
        <Text style={{
          marginTop: rh(24),
          textAlign: "center",
          fontWeight: "400",
          fontSize: fs(12),
          color: rgba(51, 51, 51, 1),
          fontFamily:"Outfit"
        }}>
          By continuing, you agree to our{' '}
          <Text style={styles.hyperlink} onPress={() => Linking.openURL(URLS.TERMS)}>
            Terms of Use
          </Text> and our{' '}
          <Text style={styles.hyperlink} onPress={() => Linking.openURL(URLS.PRIVACY)} >
            Privacy Policy
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
    <Text style={{ marginLeft: rw(20), fontFamily: "Outfit" }}>Continue with {name}</Text>
   
  </TouchableOpacity>)
}


const styles = StyleSheetRW.create(() => ({

  body: { width: "100%", height: "100%", alignItems: "center" },

  logoShadow: { alignSelf:"flex-end",width: rh(199)*1436/1072, height: rh(199), marginTop: rh(-13) },

  content: { width: rw(343), marginTop: rh(0) },

  logo: { width:rh(40)*668/117, height: rh(40), borderWidth: 0 },

  subtitle: { color: "#2F4858", marginTop: rh(20), fontFamily: "Outfit", fontSize: fs(16), fontWeight: "600" },

  hyperlink: { textDecorationLine: "underline", fontWeight: "bold", fontFamily: "Outfit" },

  forgotPwdTxt: { fontFamily: "Outfit", fontSize: fs(16), width: rw(343), textAlign: "center", fontWeight: "500", color: rgba(3, 149, 144, 1), marginTop: rh(30) }
}))

