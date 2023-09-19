import clientStorage from "core/clientStorage";
import { coreOptions } from "core/core";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import { IsValidEmail, IsValidPassword, validateAll } from "core/validators";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from "react-native";
import env from "res/env";
import database from "@react-native-firebase/database"


import cloud from "src/cloud";
import AppButton from "src/components/AppButton";
import Header from "src/components/Header";
import InfoBar from "src/components/InfoBar";
import TextField from "src/components/TextField";
import { getAppStore,updateStore, useAppStore } from "src/models/ReduxStore";
import { authorizeFirebase, makeDBPath, mock_api, mock_onUpdateOnce, onUpdateOnce } from "src/commons";

interface IProVerifyEmailScreenProps{
    email:string,
    componentId:string
}
var active=false
export default function ProVerifyEmailScreen({ componentId ,...props}: IProVerifyEmailScreenProps) {

    const provider=useAppStore(p=>p.provider)!
    const [email, setEmail] = useState<string>(provider?.email?.toLowerCase())
    const [password, setPassword] = useState<string>(__DEV__ ? "Say7names" : "")
    const [errors, setErrors] = useState<any>({})
    console.log("redux email",provider?.email)

    useEffect(()=>{
        active=true
        return ()=>{active=false}
    })
    return (
        <SafeAreaView style={FULL_SCREEN}>

            <Header
                title="Verify Email"
                // leftButton={{
                //     title: "Sign Up",
                //     onPress: () => navhelper.push("SignupScreen")
                // }}

            />


      
            <TextField label="Contact Email"
                value={email}
                placeholder="Enter your new email address"
                onChangeText={newEmail => setEmail(newEmail?.trim().toLowerCase())}
                errorMsg={errors["email"]}
         
            />
            <View style={{paddingHorizontal:rw(16),marginTop:rh(16)}}>
            <InfoBar data={
                {
                    text:"You can change your email before verification. Once verified you can not change it.",
                    textStyle:{ fontWeight:"400"}
                }
            }  />
            </View>

       <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1,justifyContent:"flex-end"}}>
            <AppButton onPress={async () => {
                if (email !=provider.email){
                    
                    //await cloud.provider.changeEmail({newEmail:email})
                    await cloud.providers.changeEmail({newEmail:email})

                    //let {token}=await cloud.login({email,password:clientStorage.getItem('lastPassword')})
                    let {token}=await cloud.providers.login ({email,password:clientStorage.getItem('lastPassword')})

                    updateStore({user:{token} as any, provider:{...provider,email}})  
                    authorizeFirebase(email)
                    clientStorage.saveItem("provider",{...provider,email,token})  
                
                }
                await cloud.sendVerificationEmail({email,isProvider:true})
               
                onUpdateOnce (makeDBPath("providers",email,"verified"),(v)=>{
                   let store_provider=getAppStore(p=>p.provider)!
                   if (v.val() )
                   {
                    console.log("Active",active)
                    !store_provider?.verified && updateStore({provider:{...store_provider,verified:true}})
                    Alert.alert("Verified","Thank you your email has been verified!")
                    navhelper.push("ProFinishSetupScreen")
                   }
                })
                Alert.alert("Success","We have successfully sent the email. Please check the inbox. Make sure the mail is not in the junk box.")
            }
        }
                title="Send Verification Mail"
                enabled={!email ? false:undefined}
                
            />
            <View style={{height:rh(20)}} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
coreOptions(ProVerifyEmailScreen,{
    noBottomBar:true
})

const styles = StyleSheetRW.create(() => ({
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

