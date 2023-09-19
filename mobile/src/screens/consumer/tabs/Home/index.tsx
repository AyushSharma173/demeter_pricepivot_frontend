import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { fs, FULL_SCREEN, rh, rw } from "core/designHelpers"
import navhelper from "core/navhelper"
import { Alert, Image, Touchable, TouchableOpacity } from "react-native"
import home_stub_png from "res/img/home_stub.png"
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";

import colors from "res/colors";

import cloud from "src/cloud";
import types from "res/refGlobalTypes";
import moment from "moment"
import { Navigation } from "react-native-navigation";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";
import ActiveProvider from "./ActiveProvider";
import InfoBar from "src/components/InfoBar";
import BottomBar from "src/components/BottomBar";
import { BlurView } from "@react-native-community/blur";
import env from "res/env";
import { Session, useAppMode } from "src/commons";



interface Homeprops{
componentId:any
from?: string
}

export default function  Home (props:Homeprops){
   const [loading,setLoading]=useState(false) 
   const [activeProvider,setActiveProvider]=useState<types.IProvider>()
    const user=useAppStore(s=>s.user) 
    const [providers,setProviders]=useState<Array<types.IProvider>>([])
   
    const [schedules,setSchedules]=useState<Array<any>> ([])
    const mode=  useAppMode()
    console.log("Mode",mode)
    let mode_based_txt=''
    let mode_based_btn_txt='See Plans'
    switch(mode){
        case 'fault':
            mode_based_txt='There is an issue with your payment.'
            mode_based_btn_txt='View Details'
            break;
        case 'no_sub':
            mode_based_txt='Please buy a subscription to continue\nusing application.'
            break;
        case 'trial':
            mode_based_txt="You're using free version."
            break;
        case 'trial_completed':
            mode_based_txt='Your trial is complete. Please buy\na subscription to continue using\nthis application.'
            break;
        
    }
    // console.log(moment({month:11}).toDate().getTimezoneOffset() )
   //console.log(moment({month:6}).toDate().getTimezoneOffset())

   //console.log(moment({month:11}).format('YYYY-MM-DDTHH:mm'),moment({month:11}).utc().format('YYYY-MM-DDTHH:mm'),moment.utc("2022-12-01T08:00").local().format("YYYY-MM-DDTHH:mm") )
   // console.log(moment({month:6}).format('YYYY-MM-DDTHH:mm'),moment({month:6}).utc().format('YYYY-MM-DDTHH:mm'),moment.utc("2022-07-01T07:00").local().format("YYYY-MM-DDTHH:mm") )
   // console.log(moment(moment().utc().format("YYYY-MM-DDTHH:mm")))
   const onFocus=()=>{
        setLoading(true)

        
        cloud.getUser({version:'1.0.0'}).then(x=>{
            
            updateStore({
                user:{...getAppStore(p=>p.user),...x,verified:!!x?.verified}
            
            })
            if (!x.bookingId){
                setActiveProvider(null as any)
                cloud.getRecommendations().then(x=>{
                    setProviders(x)
                })
                .finally(()=>{
                    setLoading(false)
                })
            }
            else {
                setProviders([])
                Promise.all([
                cloud.getProviderForBooking({bookingId:x.bookingId}).then(x=>{
                    __DEV__ && console.log("provider",x.email)
                    updateStore({active_provider:x})
                    if(x.feedbackPending && !Session.feedbackSkipped){
                        navhelper.push("AppRatingScreen", {provider: x});
                    }else{
                        Session.feedbackSkipped = false;
                        setActiveProvider(x)
                    }
                }),
                cloud.getSchedules({bookingId:x.bookingId}).then(x=>{
                    updateStore({ schedules: x });
                    
                    setSchedules(x)
                })])
                
                .finally(()=>setLoading(false))
              
            }
        })
       
    }
    useEffect(() => {
        if (Platform.OS!='web'){
        let s= Navigation.events().registerComponentDidAppearListener(x=>{
            if (x.componentId==props.componentId){
                onFocus()
            }
         })
    
            return ()=>s.remove()
        }
        else onFocus()
        }, [])
  
    return (<>
    <ConHeader title="Home" />
    {!loading && !mode_based_txt && !user?.verified && <InfoBar 
        data={{
            text:"Verify Your Email Address",
            button:{
                text:"Verify",
                onPress:()=> {
                    navhelper.push("VerifyEmailScreen",{email:user?.email})
                }
            }
        }}
    />}
    
    {!loading && mode_based_txt && <InfoBar 
        data={{
            //isError:true,
            
            text:mode_based_txt,
            button:{
                text:mode_based_btn_txt,
                onPress:()=> {
                    navhelper.push("ManageSubscriptionsScreen",{email:user?.email})
                }
            }
        }}
    />}
    
   <View style={{flex:1}}>
   
        {!activeProvider && <ScrollView showsVerticalScrollIndicator={false} >
             {providers.map((x,i)=>{

            return (<Card onTrial={false} key={i} {...x} />)
        })}
            </ScrollView>
        }
        

    
    {!!activeProvider && <View style={{flex:1}}>
     <ActiveProvider schedules={[...schedules]} onFocus={onFocus} setSchedules={setSchedules} provider={activeProvider}/>
    

    </View>}

    {loading && 
    
    <View  style={{position:'absolute',marginLeft:-rw(16),alignItems:'center',height:'100%',backgroundColor:'rgba(127,127,127,0.5)',width:rw(375),justifyContent:'center'}}>
    <ActivityIndicator size={"large"} color="black" />
    </View>
    }
    </View>
    </>)
    
}
function Card(item: any) {
    const onTrial=item.onTrial
    const name=onTrial ? item.name.slice(0,1)+new Array(item.name.length - 1).join('*'): item.name
    const [loading,setLoading]=useState(true)
    return (<TouchableOpacity onPress={() => 
    {
    if (Platform.OS=='web' && onTrial){
        alert("Please buy a subscription to get started. Goto Menu->Manage Subscription to select a subscription of your own choice")
    }   
    else 
    navhelper.push("ProfDetailsScreen", {
        provider: item,
        onTrial
    })
}
    }>
        <ImageBackground 
            source={{ uri: item.img }} 
            style={{ width: rw(343), height: rh(343), borderRadius: 15, marginBottom: rh(15), overflow: "hidden" }}
           // onLoadStart={()=>setLoading(true)}
            onLoad={()=>setLoading(false)}
            >
               {onTrial && <BlurView pointerEvents="none" style={{position:"absolute",alignItems:"center",justifyContent:"center", width:"100%",height:"100%",backgroundColor:'rgba(0,0,0,0.2)'}} 
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            />}
            <View style={{ marginHorizontal: rw(20), marginVertical: rh(20), flex: 1, justifyContent: "space-between" }}>

                <View style={styles.recomendedContainer} >
                    <Text style={{
                        flex: 0,
                        //height:fs(16)*1.4,
                        fontFamily: "Outfit", fontSize: fs(16), fontWeight: '400', color: colors.darkGreen
                    }} >Recommended</Text>
                </View>
                <View >
                    <Text style={{ flex: 0, fontFamily: "Outfit", fontSize: fs(18), fontWeight: '400', color: 'white', marginBottom: rh(5) }} >{item.title}</Text>
                    <Text style={{ flex: 0, fontFamily: "Outfit", fontSize: fs(16), fontWeight: '400', color: colors.lightGreen }} >By {name}</Text>
                </View>
            </View>
           {loading && <View pointerEvents="none" style={{position:"absolute",alignItems:"center",justifyContent:"center", width:"100%",height:"100%",backgroundColor:'rgba(0,0,0,0.2)'}} >
                <ActivityIndicator size={"large"} color="black" />
            </View>}
            
        </ImageBackground>
    </TouchableOpacity>)
}
coreOptions(Home,{ 
    useSafeAreaView:true,
    getBodyStyle:()=>({paddingHorizontal:rw(16)})

})

const styles=StyleSheetRW.create(()=>({
    recomendedContainer:{
        borderRadius:14,
        overflow:"hidden",
        flex:0,
        backgroundColor:"white", 
        paddingHorizontal:rw(10),
        paddingVertical:rh(5),
        flexDirection:"row",
        alignSelf:'flex-start',
        minHeight:fs(16)*(Platform.OS=='web'? 1.5:1.4),
        alignItems:'flex-start'
    }
}))

