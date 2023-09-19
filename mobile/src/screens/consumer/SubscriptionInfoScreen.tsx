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
import frame_png from "res/img/frame.png";
import navhelper from "core/navhelper";



interface SubscriptionInfoScreenprops {
from:string
}

export default function SubscriptionInfoScreen(props: SubscriptionInfoScreenprops) {


    const user = useAppStore(p => p.user)

    const fields = ["full_name", "dob", "state", "email"]
    const labels = ["Name", "D.O.B", "State", "Email"]
    return (<SafeAreaView>
        <Header title="Welcome"  noPadHorizontal  noBack={true}/>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{ height: rh(150)}}>
                     <Image source={frame_png} style={styles.elipse} />        
            </View>
            <View style={{ height: rh(200) }}>
                <Text style={styles.text}>Congratulations, your profile has been created & completed.</Text>
                <Text style={styles.text}>To access all that Game On! has to offer. You need to choose a
                    subscription plan, but Game On! is free for your first consultation and we wouldn't bill you
                    untill after your first call.
                    {'\n\n'}
                    Please note: For subscription or free consultation, we will first verify your email.
                     </Text>
            </View>
            <View style={{ height: rh(120) }} />
            <AppButton style={{ marginHorizontal: 0, backgroundColor: '#2F4858' }} title="Buy a Subscription"
                onPress={async () => {
                    navhelper.push("ManageSubscriptionsScreen",{from :props.from})
                //     return new Promise(r => {
                //         Alert.alert("Delete Profile", "Do you want to delete your profile? This can not be undone!", [
                //             {
                //                 text: "No",
                //                 onPress: r
                //             },
                //             {
                //                 text: "Yes",
                //                 onPress: () => {
                //                     cloud.updateUser({ deleted: true, email: user?.email! })
                //                         .then(() => { Logout() })
                //                         .finally(r)


                //                 }
                //             }
                //         ])
                //     })
                }}

            /> 
            <Text style={[styles.text,{marginTop:rh(14),marginBottom:rh(14)}]}>or </Text>
            <AppButton style={{ marginHorizontal: 0, backgroundColor: '#2F4858' }} title="Continue to a free consultation"
                onPress={async () => {
                    navhelper.push("VerifyEmailScreen",{from :props.from})
                //     return new Promise(r => {
                //         Alert.alert("Delete Profile", "Do you want to delete your profile? This can not be undone!", [
                //             {
                //                 text: "No",
                //                 onPress: r
                //             },
                //             {
                //                 text: "Yes",
                //                 onPress: () => {
                //                     cloud.updateUser({ deleted: true, email: user?.email! })
                //                         .then(() => { Logout() })
                //                         .finally(r)


                //                 }
                //             }
                //         ])
                //     })
                }}

            />
            <View style={{ height: rh(200), top: 30 }}>
                    
            </View>



        </ScrollView>

    </SafeAreaView>
    )

}
coreOptions(SubscriptionInfoScreen, {
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ paddingHorizontal: rw(16) })
})
const styles = StyleSheetRW.create(() => ({
    elipse: {
        backgroundColor: '#E9FAEF',
        borderRadius: 100,
        height: rh(150),
        width: rw(150),
        marginLeft: rw(95),
        position: 'absolute',
    },
    title: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(20),
        color: '#333333',
        marginBottom: rh(5),
        marginTop: rh(30),
        textAlign: 'center'
    },
    text: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(18),
        color: '#2F4858',
        marginBottom: rh(5),
        marginTop: rh(30),
        textAlign: 'center',
  
    },
    homeindicator: {

        width: rw(134),
        height: rh(5),
        bottom: 5,
        backgroundColor: '#000000',
        borderRadius: 100, alignSelf: 'center',
    },
}))