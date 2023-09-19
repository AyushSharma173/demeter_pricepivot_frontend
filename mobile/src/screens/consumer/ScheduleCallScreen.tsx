import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import colors from "res/colors";
import Header from "src/components/Header";
import dropdown_svg from "res/svgs/dropdown.svg"
import momentTz from 'moment-timezone'
import AppButton from "src/components/AppButton";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import cloud from "src/cloud";
import { useAppStore } from "src/models/ReduxStore";
import navhelper from "core/navhelper";
import InfoBar from "src/components/InfoBar";
interface ScheduleCallScreenprops{
}
const ADD_FACTOR=3
export default function  ScheduleCallScreen (props:ScheduleCallScreenprops){

    const [selectedDate,setSelectedDate]=useState(moment().add(ADD_FACTOR,"day").format("YYYY-MM-DD"))
    const [selectedTime,setSelectedTime]=useState<string>(); 
    const user=useAppStore(s=>s.user)
    const active_provider=useAppStore(s=>s.active_provider)
    const [loading,setLoading]=useState(true)
    const [slots,setSlots]=useState<Array<string>>([])
    console.log(selectedDate,selectedTime)
    useEffect(()=>{
        setLoading(true)
        cloud.user.getSlots({date:selectedDate,timezone:momentTz.tz.guess(),provider:active_provider?.email!}).then(x=>{
            setSlots(x)
         
        }).catch(()=>{
            setSlots([])
        }).finally(()=>{
            setLoading(false)
            setSelectedTime(undefined)
        })

    },[selectedDate])
    return(<>
    <Header title="Schedule Call" noPadHorizontal />
    <View  style={{flex:1}}>
    <DatePicker value={selectedDate} onChange={setSelectedDate} />
   {loading && <View style={{marginTop:rh(10),marginBottom:rh(30),width:'100%',alignItems:'center',justifyContent:"center"}}  >
        <ActivityIndicator size="large" color={"black"}/>
    </View>}
    {(!loading && (!slots || !slots.length)) ? <InfoBar 
        data={{
            text:"We have found no slots found for the given day. Please choose another date or contact your professional for availability.",
            textStyle:{fontWeight:"normal"}
          
        }}
    /> : <Slots available={slots} loading={loading} value={selectedTime}  onChange={setSelectedTime}/>}
    <View style={{ height: rh(120) }} />
   
    </View>
    <View style={{ position: "absolute", width: rw(375), paddingTop: rh(10), height: rh(108) + SafeAreaInsets.BOTTOM, backgroundColor: '#bbd8c5', bottom: -SafeAreaInsets.BOTTOM }}>
            <AppButton title="Schedule"
                enabled={!selectedTime ? false: true}
                onPress={async () => {
                    await cloud.schedule({bookingId:user?.bookingId!,dateTimeUTC:moment(selectedDate+"T"+selectedTime).utc().format("YYYY-MM-DDTHH:mm")})
                    navhelper.goBack()

                }}/>
    </View>
    
    </>)
    
}
interface IDatePickerProps{
    value?:string // 'YYYY-MM-DD'
    onChange?:(value:string)=>void
}
function DatePicker({value,onChange}:IDatePickerProps){
   
    let dates:Array<[day:string,month:string,date:string,year:string]>=[]
    let dateIterator=moment().add(ADD_FACTOR,"day")
    for (let i=0;i<31;i++){
        dates.push(dateIterator.format("ddd,MMM,DD,YY").split(",") as any)
        dateIterator.add(1,"day")
    }
    const [selected,setSelected]=useState(value ? dates.find(x=>x.join()== moment(value).format("ddd,MMM,DD,YY") )!: dates[0])

    useEffect(()=>{
        setSelected(value ? dates.find(x=>x.join()== moment(value).format("ddd,MMM,DD,YY") )!: dates[0])
    },[value])

    return(<View  style={{width:"100%",height:rh(120)}}>
    <ScrollView horizontal  showsHorizontalScrollIndicator={false} >
        {dates.map((dateArr)=>{
            const [day,month,date,year]=dateArr
            const Is_Selected=day==selected[0] && month==selected[1] && date==selected[2] && year==selected[3]   
            return (
                <TouchableOpacity  key={day+month+date} style={{height:rh(83),marginRight:rw(10),width:rw(57),borderRadius:20,borderWidth:1,borderColor:'rgba(51,51,51,0.1)',justifyContent:"center",alignItems:"center",backgroundColor:Is_Selected ? colors.darkGreen:undefined}}
                onPress={()=>{
                    setSelected(dateArr)
                    onChange && onChange( moment(dateArr.join(),"ddd,MMM,DD,YY").format("YYYY-MM-DD"))
                }
                }
                >
                <Text style={{fontFamily:"Outfit",fontWeight:"600",fontSize:fs(14),marginBottom:rh(10),color:Is_Selected ? "white":colors.darkGreen}}>{day}</Text>
                <Text style={{fontFamily:"Outfit",fontWeight:"400",fontSize:fs(14),color:colors.lightGreen}}>{month}</Text>
                <Text style={{fontFamily:"Outfit",fontWeight:"400",fontSize:fs(16),color:Is_Selected ? "white":colors.darkGreen}}>{date}</Text>
        </TouchableOpacity>
        )}
        )

        }
   
    </ScrollView>
    </View>)
}
interface ISlotsProps{
    value?:string //HH:mm
    onChange?:(value:string)=> void
    available:Array<string>
    loading:boolean
}
function Slots({value,onChange,available,loading}:ISlotsProps){
    const slots:Array<string>=available
    const [selected,setSelected]=useState(value ? moment(value,"HH:mm").format("hh:mm a"):"")
    let start=moment({hour:0})
    // for (let i=0;i<24;i++){
    //     slots.push(start.format('hh:mm a'))
    //     start.add(1,"hour")
    // }
    useEffect(()=>{
        setSelected(value ? moment(value,"HH:mm").format("hh:mm a"):"")
    },[value])
    let groups=[
    [ "Night",slots.filter(s=>moment(s,"hh:mm a").isBefore(moment("08:00 am","hh:mm a"),"hour"))],
    ["Day",slots
                    .filter(s=>moment(s,"hh:mm a").isAfter(moment("07:00 am","hh:mm a"),"hour"))
                    .filter(s=>moment(s,"hh:mm a").isBefore(moment("04:00 pm","hh:mm a"),"hour"))

            ],
    ["Evening",slots.filter(s=>moment(s,"hh:mm a").isAfter(moment("03:00 pm","hh:mm a"),"hour"))]
  ]
  .filter(x=>x[1].length)

  useEffect(()=>{

    onChange && selected && onChange(moment(selected,"hh:mm a").format("HH:mm"))
  },[selected])
 

//console.log(moment("18:00","HH:mm").format("hh:mm a"))
    return (<ScrollView pointerEvents={loading ? "none":undefined }   style={{opacity:loading ? 0.5 :1,flex:1}} showsVerticalScrollIndicator={false}>
{  groups.map((group,i)=>(<Collapsable selected={selected} expanded={true } setSelected={setSelected} key={group[0]} name={group[0]} slots={group[1]} />))}
        {/* <View  style={{height:rh(220),width:100,backgroundColor:'red'}}/> */}
        </ScrollView>)
}
function Collapsable({expanded,...props}:{expanded?:boolean,slots:Array<string>,name:string,selected:string,setSelected:any}){ // 65 : 360
    const height=useRef(new Animated.Value(expanded ? rh(360):rh(65))).current
    const [open,setOpen]=useState(expanded)
    return (<Animated.View style={{height,borderWidth:1,width:"100%",paddingHorizontal:rw(20),marginBottom:rh(20),borderRadius:20,borderColor:'rgba(51,51,51,0.1)'}}>
             <TouchableOpacity style={{paddingVertical:rh(20),justifyContent:"space-between",alignItems:"center",flexDirection:"row",borderBottomWidth:open ? 1:0,borderColor:'rgba(51,51,51,0.1)'}} 
             onPress={()=>{
                let currentOpen=open
                if (currentOpen) setOpen(false)
                Animated.timing(height,{
                    toValue:rh( open ? 65:360),
                    duration:200,
                    useNativeDriver:false,
                }).start(()=>{
                    if (!currentOpen)
                    setOpen(true)
                })
         }}
             >
             <Text style={{fontFamily:"Outfit",fontWeight:"600",fontSize:fs(14),color:colors.darkGreen}}>{props.name} Slots</Text>
             <View >
             <Pic source={dropdown_svg} style={{height:rh(24),width:rw(24)}} />
             </View>
             </TouchableOpacity>
             
            {open &&<>
            <View  style={{borderWidth:0,marginTop:rh(6),width:"100%",flex:1, flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"}}>
                {props.slots.map(x=>(<TouchableOpacity onPress={()=>{
                    props.setSelected(x)
                }} key={x} style={{backgroundColor:props.selected==x ? colors.darkGreen:'rgba(0,0,0,0.05)',justifyContent:"center",alignItems:"center",borderRadius:10,width: rw(141),height:rh(50),marginBottom:rh(10)}}>
                <Text style={{fontFamily:"Outfit",fontWeight:"600",fontSize:fs(14),color:props.selected==x? "white":colors.darkGreen}}>{x}</Text>
                </TouchableOpacity>))}
             </View>
             <Text style={{fontFamily:"Outfit",fontWeight:"400",marginVertical:rh(20),width:"100%",textAlign:"center",fontSize:fs(14),color:colors.lightGreen}}>All times are in {momentTz.tz.guess()}</Text>
             </>}
    </Animated.View>)
}
coreOptions(ScheduleCallScreen,{
    useSafeAreaView: true,
    noBottomBar: true,
    getBodyStyle: () => ({ paddingHorizontal: rw(16) })
})
const styles=StyleSheetRW.create(()=>({
    
}))