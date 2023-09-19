import React from "react";
import { Dimensions, Platform, SafeAreaView, View } from "react-native";



export default class SafeAreaInsets extends React.Component {

    static TOP =Platform.OS=='web' ? 0: -1;
    static BOTTOM =Platform.OS=='web' ? 0: -1;
    static onComplete: any = null;
    static IsCompleted = false;
    static init(): Promise<void> {
        return new Promise<void>(r => {

            if (this.IsCompleted){
                console.log("Already completed")
                r()
            }
            let timeoutCallback = setTimeout(() => {
               // console.log("Not found so clearing")
                r()
            }, 1000)

            this.onComplete = () => {
                clearTimeout(timeoutCallback)
                r()

            }


        })
    }
    renderCount = 0
    render(): React.ReactNode {
        return (<SafeAreaView
            style={{ zIndex: -1, position: "absolute", width: "100%", height: "100%" }}>
            <View onLayout={x => {
                if (SafeAreaInsets.IsCompleted)
                return;
                this.renderCount++
                //console.log(this.renderCount)
                SafeAreaInsets.TOP = x.nativeEvent.layout.y
                SafeAreaInsets.BOTTOM = Dimensions.get('window').height - x.nativeEvent.layout.height - x.nativeEvent.layout.y

                if (this.renderCount == 2) {
                    //console.log("Found!")
                    SafeAreaInsets.IsCompleted = true
                    if (SafeAreaInsets.onComplete) SafeAreaInsets.onComplete()
                }

            }} style={{ width: "100%", height: "100%" }} />
        </SafeAreaView>)
    }
}