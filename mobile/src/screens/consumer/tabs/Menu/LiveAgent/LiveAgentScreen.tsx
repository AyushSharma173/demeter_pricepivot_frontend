import { FULL_SCREEN, rh } from "core/designHelpers";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from "react-native";
import Header from "src/components/Header";
import { coreOptions } from "core/core";
import WebView from "react-native-webview";
import { useAppStore } from "src/models/ReduxStore";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import navhelper from "core/navhelper";

export default function LiveAgentScreen() {
    const email = useAppStore(s => s.user?.email) || ""
    const full_name = useAppStore(s => s.user?.full_name) || ""
    const [loading, setLoading] = useState(false)
    const [url, setURL] = useState<string | null>(null)
    useEffect(() => {
        setURL(`https://thegameonappcom.ladesk.com/scripts/inline_chat.php?cwid=trc2wbxc&email=${email}&firstName=${full_name}`);
    }, [])

    return (<View style={[FULL_SCREEN]}>
        <SafeAreaView style={{ ...FULL_SCREEN, flex: 1 }}>
            <Header headerStyle={Platform.OS=='ios' ? {marginBottom:-rh(25)}:undefined}  title="Live chat" onBackPress={() => { setURL(null); navhelper.goBack(); return true; }} />
 
            <KeyboardAvoidingView keyboardVerticalOffset={SafeAreaInsets.BOTTOM + (Platform.OS=='android'? 40:10)}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, marginTop: rh(-5), bottom: -SafeAreaInsets.BOTTOM }}>

                {!!url && (<WebView
                scrollEnabled={Platform.OS=='ios'? false:undefined}
                    useWebView2
                    enableApplePay={true}
                    useWebKit={true}
                    source={{ uri: url }}
                    onLoadStart={() => {
                        setLoading(true)
                    }}
                    onLoadEnd={() => {
                        setLoading(false)
                    }}
                    style={{ flex: 1, backgroundColor: "white" }}
                />)}
                {loading && <View pointerEvents="none" style={[FULL_SCREEN, { position: "absolute", justifyContent: "center", alignItems: "center" }]} >
                    <ActivityIndicator size={"large"} />
                </View>}

            </KeyboardAvoidingView>
            <View style={{ height: rh(Platform.OS=='ios' ?25:50) }} />
        </SafeAreaView>

    </View>)
}

coreOptions(LiveAgentScreen, {
    noBottomBar: true
})