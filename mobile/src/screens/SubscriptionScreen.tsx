import { GirdComponent, WinWidth } from "core/helpers";
import navhelper from "core/navhelper";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import back_arrow_png from "res/img/back_arrow.png"
import eye_png from "res/img/eye.png"
import plan_selected_png from "res/img/plan_selected.png"
import plan_unselected_png from "res/img/plan_unselected.png"
import Header from "src/components/Header";
import StyleSheetRW from "core/StyleSheetRW";
import ConsumerTabs from "./consumer/tabs/ConsumerTabs";
export default function SubscriptionScreen({ componentId }: any) {



    return (<View style={[FULL_SCREEN, { /*backgroundColor: 'rgb(192,216,200)'*/ }]}>
        <SafeAreaView style={FULL_SCREEN}>
            <Header 
            title="Subscription Plan"
            />
           

            <View style={{ width: rw(343), marginHorizontal: rw(16) ,flex:1}}>
                <Text style={{ fontFamily:"Outfit" , fontSize: fs(18), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>Get full access to features and benefits that Game On! has to Offer</Text>
                <Text style={{ fontFamily:"Outfit" , fontSize: fs(36), fontWeight: "600", color: rgba(3, 149, 144, 1), marginTop: rh(20), marginBottom: rh(20) }}>$4.99<Text style={{ fontFamily:"Outfit" , fontSize: fs(12), fontWeight: "400" }} >/month.</Text><Text style={{ fontFamily:"Outfit" , fontSize: fs(12), fontWeight: "400", marginLeft: rw(10), color: rgba(128, 128, 128, 1) }} >Billed annually</Text></Text>
                
                
                <View style={{flex:0,flexDirection:"row"}}>
                <View style={styles.planBox} ><Image source={plan_selected_png} style={{width:rw(24),height:rh(24)}} /><Text style={{color:"#333",fontFamily:"Outfit" , fontSize:fs(16),fontWeight:"400",marginLeft:rw(10)}}>7 Days Free Trial</Text></View>
                </View>

                <View style={{flex:0,flexDirection:"row"}}>
                <View style={styles.planBox2} ><Image source={plan_unselected_png} style={{width:rw(24),height:rh(24)}} /><Text style={{color:"#333",fontFamily:"Outfit" , fontSize:fs(16),fontWeight:"400",marginLeft:rw(10)}}>Tempor, nulla odio fermentum</Text></View>
                </View>

                <View style={{flex:0,flexDirection:"row"}}>
                <View style={styles.planBox2} ><Image source={plan_unselected_png} style={{width:rw(24),height:rh(24)}} /><Text style={{color:"#333",fontFamily:"Outfit" , fontSize:fs(16),fontWeight:"400",marginLeft:rw(10)}}>Sed dignissim aliquam auctor pretium</Text></View>
                </View>

                <View style={{flex:0,flexDirection:"row"}}>
                <View style={styles.planBox2} ><Image source={plan_unselected_png} style={{width:rw(24),height:rh(24)}} /><Text numberOfLines={10}  style={{maxWidth:rw(280), color:"#333",fontFamily:"Outfit" , fontSize:fs(16),fontWeight:"400",marginLeft:rw(10)}}>Integer mi aenean sed mauris mi porta pellentesque pharetra.</Text></View>
                </View>
            </View>



            <TouchableOpacity style={styles.button} onPress={()=>{ navhelper.setRoot(ConsumerTabs) }}>
                <Text style={{ fontFamily:"Outfit" , fontSize: fs(14), fontWeight: "600", color: 'white' }}>Begin Free Trial</Text>
            </TouchableOpacity>
            <View style={{height:rh(10)}}/>
        </SafeAreaView>

    </View>)
}

const styles = StyleSheetRW.create(()=>({
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
        fontFamily:"Outfit" , fontSize: fs(16),
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

    },
    planBox:{
        height:rh(54),
        paddingHorizontal:rw(15),
       paddingVertical:rh(15),
 backgroundColor:"rgba(255,255,255,0.5)",
flex:0,
        borderRadius:40,
       flexDirection:"row",
       alignItems:"center",
       marginBottom:rh(10)

        
       
    },
    planBox2:{
        //height:rh(54),
        paddingHorizontal:rw(15),
       paddingVertical:rh(15),
 backgroundColor:"rgba(255,255,255,0.1)",
flex:0,
        borderRadius:40,
       flexDirection:"row",
       alignItems:"center",
       marginBottom:rh(10)

        
       
    }
}))