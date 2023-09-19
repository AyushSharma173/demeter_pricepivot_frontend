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
import PasswordField from "src/components/PasswordField";
import TextField from "src/components/TextField";
import { getAppStore, ReduxUser, updateStore, useAppStore } from "src/models/ReduxStore";
import ConsumerTabs from "./consumer/tabs/ConsumerTabs";
import { translateQuestions } from "./FinishSetupScreen/questions";
import { makeDBPath, onUpdateOnce, registerPush } from "src/commons";

interface IVerifyEmailScreenProps{
    email:string,
    componentId:string
    from:string,
}
var active=false
export default function VerifyEmailScreen({ componentId ,...props}: IVerifyEmailScreenProps) {

    const user=useAppStore(p=>p.user)!
    const [email, setEmail] = useState<string>(user.email)
    const [password, setPassword] = useState<string>(__DEV__ ? "Say7names" : "")
    const [errors, setErrors] = useState<any>({})
    console.log("redux email",user.email)

    let Source= user?.source?.charAt(0).toUpperCase()! + user?.source?.slice(1);
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
                onChangeText={newEmail => setEmail(newEmail?.trim())}
                errorMsg={errors["email"]}
                editable={!user.source}
            />
            <View style={{paddingHorizontal:rw(16),marginTop:rh(16)}}>
            <InfoBar data={
                {
                    text:user.source ?"This account is created using third party identity provider "+Source+" and the email can not be changed":"You can change your email before verification. Once verified you can not change it.",
                    textStyle:{ fontWeight:"400"}
                }
            }  />
            </View>

       <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1,justifyContent:"flex-end"}}>
            <AppButton onPress={async () => {
                if (email?.toLowerCase() !=user.email?.toLowerCase()){
                    await cloud.user.changeEmail({newEmail:email?.toLowerCase()})
                    let {token}=await cloud.login({email:email?.toLowerCase(),password:clientStorage.getItem('lastPassword')})
                    updateStore({user:{...getAppStore(p=>p.user),email:email?.toLowerCase(),token}})  
                    clientStorage.saveItem("user",{...user,email:email?.toLowerCase(),token})  
                    try{
                        await registerPush()
                    }
                    catch(e){

                    }
                
                }
                await cloud.sendVerificationEmail({email:email?.toLowerCase()})
                onUpdateOnce (makeDBPath("users",email?.toLowerCase(),"verified"),(v)=>{
                   let store_user=getAppStore(p=>p.user)!
                   if (v.val() )
                   {
                    console.log("Active",active)
                    !store_user?.verified && updateStore({user:{...store_user,verified:true}})
                    Alert.alert("Verified","Thank you your email has been verified!")
                    active && ( props.from=="FinishSetupScreen" ? navhelper.setRoot(ConsumerTabs):  navhelper.goBack())
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
coreOptions(VerifyEmailScreen,{
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

