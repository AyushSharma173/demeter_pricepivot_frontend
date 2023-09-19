import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import colors from "res/colors";
import types from "res/refGlobalTypes";
import Header from "src/components/Header";
import Pic from "core/Pic";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import AppButton from "src/components/AppButton";
import navhelper from "core/navhelper";
import cloud from "src/cloud";
import info_svg from 'res/svgs/info.svg'
import sessions_svg from 'res/svgs/sessions.svg'
import location_svg from 'res/svgs/location.svg'
import rating_svg from 'res/svgs/rating.svg'
import { BlurView } from "@react-native-community/blur";
interface ProfDetailsScreenprops {
    provider: types.IProvider,
    isActive?: boolean
    onTrial?:boolean
}

export default function ProfDetailsScreen(props: ProfDetailsScreenprops) {
    const { provider ,onTrial} = props
    const { img, name, title, rating,
        primarySpecialty, total_sessions, location,
        desc,
        otherSpecialties,
        feedbacks,
        
    } = provider || {}

    const cards: Array<[icon: any, label: any, value: any]> = [
        [info_svg, "Specialty", primarySpecialty],
        [sessions_svg, "Total Sessions", total_sessions],
        [location_svg, "Location", location]
    ]
    if (!provider)
        return null
    return (<>
        <Header title="Professional Details" noPadHorizontal />
        <ScrollView showsVerticalScrollIndicator={false} >
            <View>
            <Image style={styles.img} source={{ uri: img }} />
            {onTrial && <BlurView pointerEvents="none" style={{position:"absolute",borderRadius:15,alignItems:"center",justifyContent:"center", width:"100%",height:"100%",backgroundColor:'rgba(0,0,0,0.2)'}} 
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            />}
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.sub}>By {onTrial ? name.slice(0,1)+new Array(name.length - 1).join('*'): name}</Text>
            <View style={{ flexDirection: "row", marginBottom: rh(27) }} >
                {new Array(...new Array(rating)).map((_, i) => <Pic key={i} style={{ height: rh(17), width: rw(16), marginRight: rw(3) }} source={rating_svg} />)

                }
            </View>
            <View style={{ width: "100%", marginBottom: rh(25), flexDirection: "row", justifyContent: 'space-between' }} >
                {
                    cards.map(([icon, label, value]) => (<View key={label} style={{ width: rw(107), height: rh(99), borderRadius: 20, backgroundColor: '#cde5d6', alignItems: "center", justifyContent: "center" }}>
                        <Pic style={{ width: rw(24), height: rh(24), marginBottom: rh(10) }} source={icon} />
                        <Text style={{ fontFamily: "Outfit", fontWeight: "400", fontSize: fs(12), color: '#888', marginBottom: rh(5) }}>{label}</Text>
                        <Text style={{ fontFamily: "Outfit", fontWeight: "500", fontSize: fs(12), color: '#333' }}>{value}</Text>
                    </View>))
                }
            </View>
            <Text style={styles.subHeading}>About Service</Text>
            <Text style={styles.text}>{desc}</Text>
            <View style={{ marginTop: rh(25) }} />
            <Text style={styles.subHeading}>Other Specialties</Text>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }} >
                {otherSpecialties.map((x, i) => (<View key={x + i} style={{ width: rw(162), marginBottom: rh(10), height: rh(40), borderRadius: 5, backgroundColor: '#cde5d6', alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { marginBottom: 0 }]}>{x}</Text>
                </View>))

                }
            </View>
            <View style={{ marginTop: rh(25) }} />
            <Text style={styles.subHeading}>Feedbacks</Text>
            {!!feedbacks?.[0] && <View style={{ width: '100%', paddingHorizontal: rw(20), paddingVertical: rh(20), borderRadius: 5, backgroundColor: '#cde5d6' }}>
                <Text style={[styles.text, { marginBottom: rh(10) }]}>{feedbacks[0].text}</Text>
                <Text style={{ fontFamily: "Outfit", color: colors.lightGreen, fontSize: fs(16), fontWeight: '400' }}>{feedbacks[0].by}</Text>
            </View>}
            {!feedbacks?.length ?
                <Text style={[styles.sub,{textAlign:'center'}]}>No feedbacks</Text>
            :
            <TouchableOpacity onPress={() => navhelper.push("ProfFeedbacksScreen", { provider })}>
                <Text style={{ fontFamily: "Outfit", marginTop: rh(15), width: "100%", textAlign: "center", color: colors.lightGreen, fontSize: fs(16), fontWeight: '400' }}>View All {'>'}</Text>
            </TouchableOpacity>
            }

            <View style={{ height: rh(120) }} />
        </ScrollView>
        {!props.isActive && <View style={{ position: "absolute", width: rw(375), paddingTop: rh(10), height: rh(108) + SafeAreaInsets.BOTTOM, backgroundColor: '#bbd8c5', bottom: -SafeAreaInsets.BOTTOM }}>
            <AppButton title="Book Now"

                onPress={() => {
                    if (onTrial){
                        Alert.alert("Upgrade", "Please buy a subscription to book a professional.",[
{text:"Cancel"},
{
    text:"See Plans",
    onPress:()=>navhelper.push("ManageSubscriptionsScreen",{from:"ProfDetailsScreen"})
}
                        ])
                        return
                    }
                    return new Promise((r) => {

                        Alert.alert("Book " + provider.name, "Are you sure you want to proceed with " + provider.name, [
                            {
                                text: "No",
                                onPress:r
                            },
                            {
                                text: "Yes", onPress: () => {
                                    cloud.bookProvider({ provider_email: provider.email }).then(({ booked }) => {
                                        if (booked) {
                                            alert("You have been booked successfully")
                                            navhelper.goBack()
                                        }
                                    }).finally(r)
                                }
                            }
                        ])

                    })


                }}
            />
        </View>}
    </>
    )

}
coreOptions(ProfDetailsScreen, {
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ paddingHorizontal: rw(16) })
})
const styles = StyleSheetRW.create(() => ({
    img: {
        height: rh(343),
        width: rw(343),

        marginBottom: rh(20),
        borderRadius: 15,
    },
    title: {
        fontFamily: "Outfit",
        fontWeight: '600',
        fontSize: fs(18),
        color: colors.dark,
        marginBottom: rh(5),
    },
    sub: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(16),
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