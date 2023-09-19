import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from "res/colors";
import types from "res/refGlobalTypes";
import Header from "src/components/Header";
import Pic from "core/Pic";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import AppButton from "src/components/AppButton";

interface ProfFeedbacksScreenprops {
    provider: types.IProvider
}

export default function ProfFeedbacksScreen(props: ProfFeedbacksScreenprops) {
    const { provider } = props
    const { img, name, title, rating,
        primarySpecialty, total_sessions, location,
        desc,
        otherSpecialties,
        feedbacks
    } = provider

   
    return (<>
        <Header title="Feedbacks" noPadHorizontal />
        <ScrollView showsVerticalScrollIndicator={false} >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub}>By {name}</Text>
          
           
            
            {feedbacks.map((x, i) => (<View key={i} style={{ width: '100%', paddingHorizontal: rw(20), paddingVertical: rh(20), marginBottom: rh(5), borderRadius: 5, backgroundColor: '#cde5d6' }}>
                <Text style={[styles.text, { marginBottom: rh(10) }]}>{x.text}</Text>
                <Text style={{ fontFamily: "Outfit", color: colors.lightGreen, fontSize: fs(16), fontWeight: '400' }}>{x.by}</Text>
            </View>))

            }
          

                <View style={{height:rh(120)}} />
        </ScrollView>
      
    </>
    )

}
coreOptions(ProfFeedbacksScreen, {
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
        fontSize: fs(12),
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