import { fs, rh, rw } from "core/designHelpers";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import colors from "res/colors";
import types from "../../../../../../commons/globalTypes";
import navhelper from "core/navhelper";
import AppButton from "src/components/AppButton";
import cloud from "src/cloud";
import moment from "moment";
import { updateStore, useAppStore } from "src/models/ReduxStore";
import chat_svg from 'res/svgs/chat.svg'
import schedule_png from 'res/svgs/schedule.svg'
import info_svg from 'res/svgs/info.svg'
import sessions_svg from 'res/svgs/sessions.svg'
import location_svg from 'res/svgs/location.svg'
import { findActiveMeeting, Session, useAppMode } from "../../../../commons";
import { MSG } from "res/constants";
import prompt from 'react-native-prompt-android';

function BorderButton({icon,text,onPress,style}:any){
    const mode=useAppMode()
    const IsSubError=mode=='fault' || mode=='trial_completed'
    return (<TouchableOpacity disabled={IsSubError} onPress={onPress} style={{width:"100%",marginTop:rh(10),flexDirection:"row",height:rh(50),justifyContent:"center",alignItems:"center",borderRadius:24,borderWidth:rh(1),borderColor:colors.darkGreen,opacity:IsSubError ?0.5:1,...style}}>
        <Pic source={icon} style={{height:rh(16),width:rw(16),marginRight:rw(10)}} />
        <Text style={{fontFamily:"Outfit",fontWeight:"600",fontSize:fs(14),color:colors.darkGreen}} > {text}</Text>

    </TouchableOpacity>)
}
function ActiveProvider({provider,onFocus,schedules,setSchedules}:{provider:types.IProvider,onFocus:any,schedules:Array<{dateTimeUTC:string}>,setSchedules:any}){
    const mode=useAppMode()
    const IsSubError=mode=='fault' || mode=='trial_completed' || mode=='no_sub'
    const cards: Array<[icon: any, label: any, value: any]> = [
        [info_svg, "Specialty", provider.primarySpecialty],
        [sessions_svg, "Total Sessions", provider.total_sessions],
        [location_svg, "Location",provider.location]
    ]
    const user=useAppStore(c=>c.user)
    const activeMeeting = findActiveMeeting({ schedules });
    const USER_ON_TRIAL_WITH_MEETING=mode=='trial' && schedules && schedules.length  

    return (<>
    <View style={{width:"100%",flexDirection:"row",marginBottom:rh(20)}}>
        <Image style={{width:rw(162),height:rh(236),borderRadius:15,borderWidth:1,borderColor:colors.lightGreen}} source={{uri:provider.img}} />
        <View style={{marginLeft:rw(15),flex:1}} >
            <Text style={styles.subHeading} >You are in contact with:</Text>
            <Text style={styles.title}  numberOfLines={Platform.OS=='android' ? 2:undefined} >{provider.name?.replace(/ /g,'\n')}</Text>
            <BorderButton onPress={()=>{
                navhelper.selectTab(1)
        
        }} icon={chat_svg} text="Send Message" />
            <BorderButton style={ USER_ON_TRIAL_WITH_MEETING ? {opacity:0.5}:undefined} onPress={()=>{USER_ON_TRIAL_WITH_MEETING ? Alert.alert("Free Consultation",MSG.MORE_MEETING) :navhelper.push("ScheduleCallScreen",{provider})}} icon={schedule_png} text="Schedule Call" />
        </View>
    </View>
    <View style={{ width: "100%", marginBottom: rh(8), flexDirection: "row", justifyContent: 'space-between' }} >
    {
                    cards.map(([icon, label, value]) => (<View key={label} style={{ width: rw(107), height: rh(99), borderRadius: 20, backgroundColor: '#cde5d6', alignItems: "center", justifyContent: "center" }}>
                        <Pic style={{ width: rw(24), height: rh(24), marginBottom: rh(10) }} source={icon} />
                        <Text style={{ fontFamily: "Outfit", fontWeight: "400", fontSize: fs(12), color: '#888', marginBottom: rh(5) }}>{label}</Text>
                        <Text style={{ fontFamily: "Outfit", fontWeight: "500", fontSize: fs(12), color: '#333' }}>{value}</Text>
                    </View>))
                }
    </View>
    <Text onPress={()=>navhelper.push("ProfDetailsScreen",{provider,isActive:true})} style={{fontFamily:"Outfit",marginTop:rh(15),width:"100%",textAlign:"center",color:colors.lightGreen,fontSize:fs(16),fontWeight:'400'}}>View full profile {'>'}</Text>
    <Text style={[styles.subHeading,{marginBottom:rh(20)}]} >Upcoming Calls:</Text>
    <ScrollView>
    
    {!schedules && <Text style={styles.subHeading} >No Upcoming Calls</Text>}
    {schedules.map(x=>{
        return (<View key={x.dateTimeUTC} style={{backgroundColor:'#e9faef',marginBottom:rh(10),flexDirection:"row",justifyContent:'space-between',paddingHorizontal:rw(20),paddingVertical:rh(15),borderRadius:16}}>
            <Text style={[styles.subHeading,{fontSize:fs(14),color:'#333',marginBottom:0}]} >{moment.utc(x.dateTimeUTC).local().format("dddd, MMMM D, * hh:mm a").replace('*','by')}</Text>
            <Text onPress={()=>{
                Alert.alert("Cancel?","Do you want to cancel this call?",[
                    {
                        text:"No",

                    },
                    {
                        text:"Yes",
                        onPress:()=>{
                            cloud.cancelMeeting({bookingId:user?.bookingId!,dateTimeUTC:x.dateTimeUTC}).then(()=>{
                                schedules.splice(schedules.indexOf(x),1)
                                setSchedules([...schedules])
                            })
                        }
                    }
                ])
            }} style={[styles.subHeading,{fontSize:fs(14),color:'red',marginBottom:0}]}>X</Text>
        </View>)
    })

    }
    {!!schedules && !!schedules.length && <View  style={{height:rh(70)}}/>}
    </ScrollView>
    {
      activeMeeting ?
        <View style={{ 
           flexDirection: 'row', backgroundColor: '#E9FAEF', paddingLeft: rw(16), paddingTop: rh(10), paddingBottom: rh(20),
          marginLeft: rw(-16), marginRight: rw(-16)
          ,
          height:rh(64)
       
        }}>
          <View style={{flex:1}}>
            <Text style={{ color: '#039590', fontFamily: 'Outfit', fontWeight: '400' }}>
              Call Started
            </Text>
            <Text style={{ fontFamily: 'Outfit', fontWeight: '400', marginTop: rh(5) }}>
              { moment.utc(activeMeeting.dateTimeUTC).local().format("dddd, MMMM D") }  { moment.utc(activeMeeting.dateTimeUTC).local().format("hh:mm a") }
            </Text>            
            
          </View>      
          <AppButton title="Join" onPress={() => {
            Session.user_join_call= true
            navhelper.selectTab(1);
             
          }} style={{ width: rw(120), height: rh(50) }} />
        </View> :
    <AppButton enabled={IsSubError || (schedules?.length) ? false:undefined} style={{position:"absolute",bottom:0,marginHorizontal:0}} 
    onPress={()=>{
        return new Promise<void>(r=>{
            const cancelProvider = (reason) =>{
                if (!reason) {
                    alert("You must enter a reason")
                    r()
                    return;
                }
                cloud.cancelProvider({provider_email:provider.email,cancel_reason:reason})
                .then(res => {
                    updateStore({active_provider:undefined});
                    onFocus();
                })
                .finally(r)
            }
            if(Platform.OS != "android"){
                Alert.prompt("Request another professional?", "We are going to remove your current professional and give you list of 3 professionals to choose from.Please enter a reason for leaving the professional",[
                    {text:"No",onPress:r},
                    {text:"Yes",onPress:(reason)=>{ cancelProvider(reason) }}
                ])
            }else{
                try {
                    prompt("Request another professional?", "We are going to remove your current professional and give you list of 3 professionals to choose from.Please enter a reason for leaving the professional",[
                        {text:"No",onPress:r},
                        {text:"Yes",onPress:(reason)=>{ cancelProvider(reason) }}
                    ]);
                  } catch (error) {
                    console.log('Error occurred:', error);
                  }
            }
            
        })
    }}
    title="Change Professional" />
    }
    </>)
}
const styles = StyleSheetRW.create(() => ({
    subHeading: {
        fontFamily: "Outfit",
        fontWeight: '400',
        fontSize: fs(12),
        color: '#888',
        marginBottom: rh(5),
    },
    title: {
        fontFamily: "Outfit",
        fontWeight: '600',
        fontSize: fs(32),
        color: colors.dark,
        marginBottom: rh(5),
        height:rh(100)
    },
}))
export default ActiveProvider