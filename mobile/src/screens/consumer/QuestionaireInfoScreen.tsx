import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "src/components/Header";
import AppButton from "src/components/AppButton";
import finishsetup_png from "res/img/finishsetup.png";
import navhelper from "core/navhelper";


interface QuestionaireInfoScreenprops {

}

export default function QuestionaireInfoScreen(props: QuestionaireInfoScreenprops) {
    return (<SafeAreaView>
        <Header title="Finish Setup" noPadHorizontal  noBack={true}/>
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{ height: rh(150)}}>
                    <Image source={finishsetup_png} style={styles.elipse} /> 
            </View>
            <View style={{ height: rh(160) }}>
                <Text style={styles.title}>Matching Questions</Text>
                <Text style={styles.text}>We will collect your name, D.O.B., and state information. To match you with the most qualified professional, we would like to ask a few questions. </Text>
            </View>
            <View style={{ height: rh(300) }} />
            <AppButton style={{ marginHorizontal: 0, backgroundColor: '#2F4858' }} title="Continue"
                onPress={async () => {
                    navhelper.push("FinishSetupScreen")
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
            <View style={{ height: rh(100), top: 30 }}>
   
            </View>



        </ScrollView>

    </SafeAreaView>
    )

}
coreOptions(QuestionaireInfoScreen, {
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
        //lineHeight:'1.5'
    },
    homeindicator: {

        width: rw(134),
        height: rh(5),
        bottom: 5,
        backgroundColor: '#000000',
        borderRadius: 100, alignSelf: 'center',
    },
}))