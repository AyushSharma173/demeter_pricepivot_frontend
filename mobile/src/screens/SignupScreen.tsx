import clientStorage from "core/clientStorage";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import { IsValidEmail, IsValidPassword, validateAll } from "core/validators";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import env from "res/env";
import cloud from "src/cloud";
import { JumpToSignUp } from "src/commons";
import AppButton from "src/components/AppButton";
import Header from "src/components/Header";
import PasswordField from "src/components/PasswordField";
import TextField from "src/components/TextField";
import { ReduxUser, updateStore } from "src/models/ReduxStore";
import questions, { translateQuestions } from "./FinishSetupScreen/questions";
import SafeAreaInsets from "src/components/SafeAreaInsets";

export default function SignupScreen({ componentId }: any) {

    let id = 0;
    if (__DEV__) {
        id = Math.round((new Date().getTime() - new Date(2022, 10, 22).getTime()) / 1000).toString().slice(-4)
    }
    const [email, setEmail] = useState<string>(__DEV__ ? `dev${id}@yopmail.com` : "")
    const [password, setPassword] = useState<string>(__DEV__ ? "Say7names" : "")
    const [cnfrmPassword, setCnfrmPassword] = useState<string>(__DEV__ ? "Say7names" : "")
    const [errors, setErrors] = useState<any>({})
    const _scrollViewRef = useRef<ScrollView>();

    useEffect(() => {

        let sub = Keyboard.addListener("keyboardDidShow", () => {
            //setErrors({})
        })
        let sub2 = Keyboard.addListener("keyboardDidHide", () => {
            //_scrollViewRef?.current?.scrollToEnd();
        })

        return () => {
            sub.remove()
            sub2.remove()
        }
    }, [errors])

    return (<View style={[FULL_SCREEN,
        //{backgroundColor:'rgb(192,216,200)'}
    ]}>
        <SafeAreaView style={FULL_SCREEN}>

                <Header
                    title="Sign Up"
                    leftButton={{
                        title: "Login",
                        onPress: () => navhelper.goBack()
                    }}

                />
          
                    <TextField label="Email address"
                        value={email}
                        placeholder="Email address"
                        onChangeText={newEmail => setEmail(newEmail)}
                        errorMsg={errors["email"]}
                    />
                    <View style={{ height: rh(20) }} />
                    <PasswordField label="Password"
                        value={password}
                        placeholder="Password"
                        onChangeText={newPassword => setPassword(newPassword)}
                        errorMsg={errors["password"]}
                    />
                    <View style={{ height: rh(20) }} />
                    <PasswordField label="Re-enter Password"
                        placeholder="Re-enter Password"
                        value={cnfrmPassword}
                        onChangeText={newPassword => setCnfrmPassword(newPassword)}
                        errorMsg={errors["cnfrmPassword"]}
                    />
                   
                   <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "flex-end"}}>
                        <View style={Platform.OS=='android' ? { alignItems: 'center', paddingTop: rh(5), height: rh(108) ,marginBottom:rh(20)}:{marginBottom:rh(10)}}>
              
                        <AppButton onPress={() => {
                            if (env.type != "mock") {
                                let newErrors = validateAll([
                                    { email, rule: IsValidEmail },
                                    { password, rule: IsValidPassword },
                                    {
                                        cnfrmPassword, rule: v => v == password ? undefined : "Passwords must match."
                                    }
                                ])
                                setErrors(newErrors)
                                if (Object.keys(newErrors).length) {

                                    return;
                                }
                            }

                            return new Promise((r, rj) => {
                                cloud.signup({ email, password }).then(async ({ token, }) => {
                                    if (token) {
                                        try {
                                            clientStorage.saveItem("lastPassword", password)
                                            await JumpToSignUp(token, email).then(r).catch(rj)
                                            r(undefined)
                                        }
                                        catch (e) {
                                            rj(e)
                                        }

                                    }
                                })
                                    .catch(rj)




                            })

                        }}
                            title="Sign Up"
                            enabled={(!!email && !!password && !!cnfrmPassword) || env.type == "mock"}
                            loaderDelayMillis={5000}
                        />
                    </View>
                    </KeyboardAvoidingView>
              
        </SafeAreaView>
    </View>)
}

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
    button: {
        width: rw(343),
        marginHorizontal: rw(16),
        backgroundColor: rgba(47, 72, 88, 1),
        height: rh(54),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'

    }
}))