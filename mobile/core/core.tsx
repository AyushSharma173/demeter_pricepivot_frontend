import React, { useEffect, useState } from "react"
import { IComponent, NavProps } from "./interfaces"
import navhelper from "./navhelper";
import launch_Background_jpg from "res/img/launch_Background.jpg"
import { AppState, Dimensions, ImageBackground, Platform,StatusBar,StyleProp,Text, View, ViewProps, ViewStyle } from "react-native";
import { AppWindow, FULL_SCREEN, useAppWindow } from "./designHelpers";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import EnvInfo from "../src/components/EnvInfo";
import { initalizeStore } from "./singleFileReduxManager";
import { Navigation } from "react-native-navigation";
import ErrorBoundary from "./ErrorBoundary";


export function connectCore(Component: IComponent) {


    const IS_IOS = Platform.OS == "ios"
    const noPhoneWindow=Component.connectConfig?.noPhoneWindow

    return (props: any) => {
        const BodyJsx = <CoreHOC {...props} Component={Component} />
        const { w, h } = useAppWindow();
        // const style:any={backgroundImage:" linear-gradient(10deg, #C6F4A9 0%, #93F9DA 100%)"}

        switch (Platform.OS) {

            case 'ios':
                return BodyJsx
            case 'android':
                return (<ImageBackground style={{width:'100%',height:Dimensions.get('screen').height,paddingTop:StatusBar.currentHeight}} source={launch_Background_jpg}>
                    <View  style={FULL_SCREEN}>
                    {BodyJsx}
                    </View>
                </ImageBackground>

                )
            default:
                return (<ImageBackground resizeMode="stretch" style={{ width: w, height: h, alignItems: "center", justifyContent: "center" }} >
                    <View style={noPhoneWindow ? { width: w, height: h}: { width: AppWindow.WIN_WIDTH, height: AppWindow.WIN_HEIGHT, overflow: "hidden" }} >

                        {BodyJsx}
                    </View>
                </ImageBackground>
                )

        }

    }

}
var Is_App_Initialized=false;
var configs: ICoreConfig = {initializerScreenName:'',defaultReduxValue:{}}
var overlayListeners:Array<any>=[]
export function CoreHOC({ Component, ...props }: { Component: IComponent } & NavProps) {
  

  

    useEffect(() => {
     
        if (Platform.OS=="web"){
            const componentId=navhelper.getWebComponentId()
            if (componentId==configs.initializerScreenName)
                Is_App_Initialized=true
            else if (!Is_App_Initialized) 
            {    console.log("App not initialized, so redirecting...")
                let dest=""
                if (configs.resumableScreens.includes( componentId)) 
                dest=`?dest=${componentId}`
                navhelper.setRoot(configs.initializerScreenName+dest)
            }
        }

        navhelper.setComponentId(props.componentId)

    }, []);

    const RENDERABLE= Platform.OS!="web" || (Is_App_Initialized || navhelper.getWebComponentId()==configs.initializerScreenName)
    if (!RENDERABLE)
    return null

    let BottomBar = configs.BottomBarComponent!
    
    let { useSafeAreaView ,getBodyStyle,noBottomBar,getBottomBarStyle}: ICoreOptions = (Component as any).options || { useSafeAreaView: false }
    let SHOW_BOTTOM_TAB = navhelper.MODE == 'tabs' && !!BottomBar && !noBottomBar
    let bodyStyle:StyleProp<ViewProps>={}
    
    if (getBodyStyle)
    bodyStyle=getBodyStyle()

    const ParentStyle:any= Component.connectConfig?.noPhoneWindow ? [{width:'100%',height:'100%'}]: [FULL_SCREEN,{borderWidth:0}]
    if ( useSafeAreaView) {
        ParentStyle.push({paddingTop:SafeAreaInsets.TOP,paddingBottom:SafeAreaInsets.BOTTOM})
    }

    return (<ErrorBoundary>
    <View style={ParentStyle} >
        <View style={[{ flex: 1 },bodyStyle]}>
            <Component {...{...props,...navhelper.getPassedProps()}} />
        </View>
        {SHOW_BOTTOM_TAB && <BottomBar style={getBottomBarStyle ? getBottomBarStyle():undefined} />}

        <EnvInfo />
        
    </View>
        <OverlayInternal componentId={props.componentId} />
 
    </ErrorBoundary>
    )
}
function OverlayInternal(p:{componentId:string}){

    const [overlayJSX,_setOverlay]=useState<any>(null)
    const [active,setActive]=useState(false)
     useEffect(()=>{
        overlayListeners.push(_setOverlay)
               let s=   Navigation.events().registerComponentDidAppearListener(x=>{
                    x.componentId==p.componentId && setActive(true)
                  })
               let s1=   Navigation.events().registerComponentDidDisappearListener (x=>{
                
                    x.componentId==p.componentId && AppState.currentState!='background' && setActive(false)
                  })

        return ()=>{
            overlayListeners=overlayListeners.filter(x=>x!=_setOverlay)
            s.remove()
            s1.remove()
        }
        },[])
    if (!active)
    return null
    return overlayJSX
}

export interface ICoreConfig {
    BottomBarComponent?: React.FC<{style:StyleProp<ViewStyle>}>
    initializerScreenName:string
    defaultReduxValue:any
    resumableScreens:Array<string>
}


export interface ICoreOptions {
    useSafeAreaView?: boolean
    getBodyStyle?:()=>StyleProp<ViewStyle>
    noBottomBar?:boolean
    getBottomBarStyle?:()=>StyleProp<ViewStyle>
}

export function configureCore(newConfigs: ICoreConfig) {
    configs = newConfigs
    initalizeStore({...newConfigs.defaultReduxValue})
}

export function coreOptions(component: any, options: ICoreOptions) {
    component.options = options
}
export function Overlay(props:{children:any}){

    useEffect(()=>{
    overlayListeners.forEach(x=>x(props.children))

    },[props.children])

    return null
}