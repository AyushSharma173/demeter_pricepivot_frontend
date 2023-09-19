import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import React from "react";
import { Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from "src/components/Header";
import navhelper from "core/navhelper";
import AppButton from "src/components/AppButton";
import StyleSheetRW from "core/StyleSheetRW";



export default function EmergencyScreen({ componentId }: any) {



    return (<View style={[FULL_SCREEN, { /*backgroundColor: 'rgb(192,216,200)'*/ }]}>
        <SafeAreaView style={FULL_SCREEN}>
            <Header 
            title="Call 988"
            leftButton={{
            title:"I am fine",
            onPress:()=>navhelper.push("SubscriptionScreen")
            
            }}
            />
           

            <View style={{ width: rw(343), marginHorizontal: rw(16) ,flex:0}}>
            <Text style={{ fontFamily:"Outfit" ,width:"100%",textAlign:"center", fontSize: fs(180), fontWeight: "600", color: rgba(3, 149, 144, 1), marginTop: rh(20), marginBottom: rh(20) }}>988
            </Text>
                
                <Text style={{ fontFamily:"Outfit" , fontSize: fs(18), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>
                While Game On! give you access to qualified and trained mental health professionsals, it is important to call 988 for more servere or emergancy cases.</Text>
               
                
              
            </View>

              <View style={{height:rh(30)}} />
              <AppButton title="Call 988" onPress={()=>Linking.openURL('tel:911') }/>
              <View style={{height:rh(15)}} />
              
              <AppButton title="I am fine"     onPress={()=>navhelper.push("SubscriptionScreen")} />
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