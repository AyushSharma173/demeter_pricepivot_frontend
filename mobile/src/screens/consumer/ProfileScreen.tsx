import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "res/colors";
import types from "res/refGlobalTypes";
import Header from "src/components/Header";
import Pic from "core/Pic";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import AppButton from "src/components/AppButton";
import { useAppStore } from "src/models/ReduxStore";
import cloud from "src/cloud";
import { Logout } from "src/commons";

interface ProfileScreenprops {

}

export default function ProfileScreen(props: ProfileScreenprops) {
   
  
    const user=useAppStore(p=>p.user)
    
    const fields=["full_name","dob","state","email"]
    const labels=["Name","D.O.B","State","Email"]
    return (<>
        <Header title="Your Profile" noPadHorizontal />
        <ScrollView showsVerticalScrollIndicator={false} >
            <Text style={styles.title}>Your profile details are as follows</Text>
            <View style={{height:rh(20)}} />
            {!!user && fields.map((x,i)=>{
                return    <View key={x}  style={{flexDirection:"row"}}><Text style={[styles.title,{width:"30%"}]} >{labels[i]}</Text><Text style={[styles.title]}>: {user[x]}</Text></View>
            })

            }
              <View style={{height:rh(60)}} />
            <AppButton  style={{marginHorizontal:0,backgroundColor:'rgba(175,0,0,1)'}} title="Delete Profile" 
                onPress={async ()=>{
                   
                    return new Promise(r=>{
                        Alert.alert("Delete Profile","Do you want to delete your profile? This can not be undone!",[
                            {
                               text:"No",
                               onPress:r 
                            },
                            {
                                text:"Yes",
                                onPress:()=>{
                                    cloud.updateUser({deleted:true,email:user?.email!})
                                    .then(()=>{Logout()})
                                    .finally(r)


                                }
                            }
                        ])
                    })
                }}  
            
            />
          
           
            
    
        </ScrollView>
      
    </>
    )

}
coreOptions(ProfileScreen, {
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