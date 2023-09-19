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
import { authorizeFirebase, Logout, makeDBPath, mock_api, mock_onUpdateOnce, onUpdateOnce } from "src/commons";
import DoubleCheckSvg from "res/svgs/double_check.svg"
import DeclinedSvg from "res/svgs/declined.svg"
import Pic from "core/Pic";
import colors from "res/colors";
interface IAwaitingVerificationScreenProps{
    componentId:string,
    showDenied?:boolean
}

export default function AwaitingVerificationScreen({ componentId ,showDenied,...props}: IAwaitingVerificationScreenProps) {



    return (
        <SafeAreaView style={[FULL_SCREEN,{alignItems:"center"}]}>

            <Header
                title={ showDenied ? "Declined" : "Awaiting Verification"}
                onBackPress={()=>{
                    Logout()
                    return true                    
                }}
            

            />
<View pointerEvents="none" style={{width:"100%",position:"absolute",height:"100%",justifyContent:"center",alignItems:"center"}}>
<Pic 
source= { showDenied ? DeclinedSvg: DoubleCheckSvg}
style={{height:rh(161),width:rw(161)}}
/>

      
            
            <View style={{paddingHorizontal:rw(16),marginTop:rh(128)}}>
            {showDenied ? <Text style={{fontFamily:"Outfit",fontSize:fs(18),fontWeight:'600',color:colors.darkGreen,textAlign:"center"}}>
            We regret to inform you that your application was not approved.
            Thank you for your interest and understanding.
            </Text>
            :
                <Text style={{fontFamily:"Outfit",fontSize:fs(18),fontWeight:'600',color:colors.darkGreen,textAlign:"center"}}>Your details have been submitted, we will send you an update via email.</Text>
            }
         
            </View>

            </View>

  
        </SafeAreaView>
    )
}
coreOptions(AwaitingVerificationScreen,{
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

