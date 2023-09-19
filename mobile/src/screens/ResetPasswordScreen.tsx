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
import { makeDBPath, onUpdateOnce } from "src/commons";
import SafeAreaInsets from "src/components/SafeAreaInsets";

interface IResetPasswordScreenProps{
    email:string,
    componentId:string
    provider:boolean
}
export default function ResetPasswordScreen({ componentId ,...props}: IResetPasswordScreenProps) {

    
    const [email, setEmail] = useState<string>("")
    const [errors, setErrors] = useState<any>({})


    return (
        <SafeAreaView style={FULL_SCREEN}>

            <Header
                title="Forgot Password"
                leftButton={{
                    title: "Login",
                    onPress: () => navhelper.goBack()
                }}

            />


      
            <TextField label='Email address'
                value={email}
                placeholder="Email address"
                onChangeText={newEmail => setEmail(newEmail?.trim())}
                errorMsg={errors["email"]}
            />
            <View style={{paddingHorizontal:rw(16),marginTop:rh(16)}}>
            {/* <InfoBar data={
                {
                    text:"You can change your email before verification. Once verified you can not change it.",
                    textStyle:{ fontWeight:"400"}
                }
            }  /> */}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "flex-end" }}>
                <View style={Platform.OS=='android' ? { alignItems: 'center', paddingTop: rh(5), height: rh(108) + SafeAreaInsets.BOTTOM, bottom: -SafeAreaInsets.BOTTOM }:{}}>
                    <AppButton onPress={async () => {

                        await cloud.sendVerificationEmail({ email, type: "pwd", isProvider:props.provider })

                        Alert.alert("Success", "We have successfully sent the email. Please check the inbox. Make sure the mail is not in the junk box.")
                        navhelper.goBack()
                    }
                    }
                        title="Send Password Reset Mail"
                        enabled={!email ? false : undefined}

                    />
                </View>

                <View style={{ height: rh(20) }} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
coreOptions(ResetPasswordScreen,{
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

