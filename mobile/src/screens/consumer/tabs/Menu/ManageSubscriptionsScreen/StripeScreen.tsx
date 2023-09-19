import { GirdComponent, WinWidth } from "core/helpers";
import navhelper from "core/navhelper";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import back_arrow_png from "res/img/back_arrow.png"
import eye_png from "res/img/eye.png"
import plan_selected_png from "res/img/plan_selected.png"
import plan_unselected_png from "res/img/plan_unselected.png"
import Header from "src/components/Header";
import StyleSheetRW from "core/StyleSheetRW";
import { coreOptions } from "core/core";
import env from "res/env";
import { Product, ProductResponse } from "src/models/ServerInterfaces";
import WebView from "react-native-webview";
import { useAppStore } from "src/models/ReduxStore";
import ConsumerTabs from "../../ConsumerTabs";
import AppButton from "src/components/AppButton";

var once_alerted_after_mount=false
const FinishSetupScreen='FinishSetupScreen'
export default function StripeScreen({product ,from, coupon}:{product:Product,from?:string, coupon: string} ) {

    const [products, setProducts] = useState<ProductResponse>([])
    const [selected,setSelected]=useState(0)
    const [loading,setLoading]=useState(false)
    const email = useAppStore(s=>s.user?.email) || ""
    const verified = useAppStore(s=>s.user?.verified) || ""
    const url=env.serverURL+"stripe-buy?"+new URLSearchParams({ link:product.paymentLink ,email, coupon})
    useEffect(() => {
        once_alerted_after_mount=false
      
    }, [])

    console.log(products)

    return (<View style={[FULL_SCREEN]}>
        <SafeAreaView style={{...FULL_SCREEN,flex:1}}>
            <Header
                title="Checkout"
            />

{!verified  && <>
    <View style={{paddingHorizontal:rw(16)}}>
    <Text style={{ fontFamily: "Outfit", fontSize: fs(18), marginBottom: rh(32), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>
    Please verify your email first before continuing.
        
    </Text>
    
    </View>
    <AppButton onPress={()=>navhelper.push("VerifyEmailScreen")}  title="Verify Email"></AppButton>
    </>
    }

{verified && <WebView 
    useWebView2
    enableApplePay={true}
    useWebKit={true}
  source={{uri:url/*, coupon: coupon*/}} 
  style={{flex:1,marginHorizontal:rw(16),backgroundColor:"white"}}
  onNavigationStateChange={(s)=>{
    if (s.url.includes("/ping") && !once_alerted_after_mount){
        once_alerted_after_mount=true
        if (Platform.OS!='web')
        Alert.alert("Thank you!","Your payment has been received",[{text:"Ok",onPress:from==FinishSetupScreen ? ()=>navhelper.setRoot(ConsumerTabs) :navhelper.goBack}])
        else
        from==FinishSetupScreen ? navhelper.setRoot(ConsumerTabs) :navhelper.goBack()
    }
  }}
  onLoadStart={()=>{
    setLoading(true)
  }}
  onLoadEnd={()=>{
    setLoading(false)
  }}
   />}
        { loading && <View pointerEvents="none" style={[FULL_SCREEN,{position:"absolute",justifyContent:"center",alignItems:"center"}]} > 
            <ActivityIndicator size={"large"} />
         </View>}
        </SafeAreaView>

    </View>)
}

coreOptions(StripeScreen, {
    noBottomBar: true
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
    button: {
        width: rw(343),
        marginHorizontal: rw(16),
        backgroundColor: rgba(47, 72, 88, 1),
        height: rh(54),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'

    },
    planBox: {
        height: rh(54),
        paddingHorizontal: rw(15),
        paddingVertical: rh(15),
        backgroundColor: "rgba(255,255,255,0.5)",
        flex: 0,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: rh(10)



    },
    planBox2: {
        //height:rh(54),
        paddingHorizontal: rw(15),
        paddingVertical: rh(15),
        backgroundColor: "rgba(255,255,255,0.1)",
        flex: 0,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: rh(10)



    }
}))