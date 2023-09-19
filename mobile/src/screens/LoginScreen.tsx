import clientStorage from "core/clientStorage";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import { IsValidEmail, IsValidPassword, validateAll } from "core/validators";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from "react-native";
import env from "res/env";


import { Login } from "src/commons";
import AppButton from "src/components/AppButton";
import Header from "src/components/Header";
import PasswordField from "src/components/PasswordField";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import TextField from "src/components/TextField";

export default function LoginScreen({ componentId }: any) {

  const [ email    ,  setEmail    ]=useState<string>(__DEV__ ? "dev0280@yopmail.com":clientStorage.getItem("lastSuccessEmail"))
  const [ password ,  setPassword ]=useState<string>(__DEV__ ? "Say7names":"")
  const [errors,setErrors]=useState<any>({})

  return (
    <SafeAreaView style={FULL_SCREEN}>
      <Header
          title="Login"
          leftButton={{
            title:"Sign Up",
            onPress:() => navhelper.push("SignupScreen")
          }}
       
        />
      
      

      <TextField  label="Email address" 
                  value={email}
                  placeholder="Email address"
                  onChangeText={newEmail=>setEmail(newEmail)  }
                  errorMsg={errors["email"]}
                  />

      <View style={{ height: rh(20) }} />

      <PasswordField label="Password" 
                     value={password}
                     placeholder="Password"
                     onChangeText={newPassword=>setPassword(newPassword)}
                     errorMsg={errors["password"]}
                     />
     
      <Text style={styles.forgotPwdTxt} onPress={()=>navhelper.push("ResetPasswordScreen")} >Forgot Password?</Text>
      <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "flex-end" }}>
      <View style={Platform.OS=='android' ? { alignItems: 'center', paddingTop: rh(5), height: rh(108) ,marginBottom:rh(20) }:{marginBottom:rh(10)}}>
      <AppButton onPress={async () => {
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
        await Login(email,password)
      }} 
        title="Login"
        enabled={(env.type=="mock") ||(!!email && !!password)}
        loaderDelayMillis={5000}
      />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheetRW.create(()=>({
  header: {
    width: "100%",
    height: rh(41),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rh(31)


  },
  inputBox: {
    width: rw(343),
    backgroundColor: rgba(0, 0, 0, 0.05),
    height: rh(60),
    borderRadius: 10,
    fontFamily: "Outfit", fontSize: fs(16),
    fontWeight: "400",
    color: "#333333",
    paddingHorizontal: rw(16)
  },

 
  forgotPwdTxt: { fontFamily: "Outfit", fontSize: fs(16), marginHorizontal: rw(16), width: rw(343), textAlign: "center", fontWeight: "500", color: rgba(3, 149, 144, 1), marginTop: rh(30) }
}))

