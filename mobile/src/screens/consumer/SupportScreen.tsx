import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Alert, Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "res/colors";
import types from "res/refGlobalTypes";
import Header from "src/components/Header";
import Pic from "core/Pic";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import AppButton from "src/components/AppButton";
import { useAppStore } from "src/models/ReduxStore";
import cloud from "src/cloud";
import { Logout } from "src/commons";

interface SupportScreenprops {

}

export default function SupportScreen(props: SupportScreenprops) {
   
  
   
    return (<>
        <Header title="Support" noPadHorizontal />
        <ScrollView showsVerticalScrollIndicator={false} >
            <Text style={styles.title}>You can write to us at</Text>
            <View style={{height:rh(20)}} />
       
                   <View   style={{flexDirection:"row"}}><Text style={[styles.title,{width:"30%"}]} >Email</Text><Text style={[styles.title]}>: info@thegameonapp.com</Text></View>
        
              <View style={{height:rh(60)}} />
            <AppButton  style={{marginHorizontal:0}} title="Send Email" 
                onPress={async ()=>{
                   Linking.openURL("mailto:info@thegameonapp.com")
                    
                }}  
            
            />
          
           
            
    
        </ScrollView>
      
    </>
    )

}
coreOptions(SupportScreen, {
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ paddingHorizontal: rw(16) })
})
const styles = StyleSheetRW.create(() => ({
    img: {
        height: rh(343),
        width: rw(343),

        marginBottom: rh(20),
    },
    title: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(18),
        color: colors.dark,
        marginBottom: rh(5),
    },
    sub: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(12),
        color: colors.lightGreen,
        marginBottom: rh(5),
    },
    subHeading: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(12),
        color: '#888',
        marginBottom: rh(5),
    },
    text: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(16),
        color: '#333',
        marginBottom: rh(5),
    }
}))