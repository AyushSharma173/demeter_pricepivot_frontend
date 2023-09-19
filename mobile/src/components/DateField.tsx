import { rw, fs, rh, rgba } from "core/designHelpers";
import React, { useEffect, useState } from "react";
import { Image, Keyboard, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TextField, { TextFieldProps } from "./TextField";
import DateTimePicker from '@react-native-community/datetimepicker';
import schedule_png from 'res/svgs/schedule.svg'
import StyleSheetRW from "core/StyleSheetRW";
import Pic from "core/Pic";
import moment from "moment";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
export interface DateFieldProps extends TextFieldProps {


}


export default function DateField({ label,value,onChangeText,...otherprops}:TextFieldProps){

   const [visible,setVisible]=useState(false)
   const [date,setDate]=useState("")

   const handlePicker = () => {
    if(Platform.OS == 'android'){
        DateTimePickerAndroid.open(
            {
                value: date ? new Date(date) : new Date(),
                onChange: (event: any, selectedDate?: any) => {setDate(selectedDate!);onChangeText!(moment(selectedDate!).format("YYYY-MM-DD")) },
                mode: 'date',
                display: "spinner"
            })
    }else{
        setVisible(true)
    }
   }

    return (    <View style={{ width: '100%'}}>
                {Platform.OS!='web' &&<TextField {...otherprops} {...{label,}}

                    value={date ? moment(date,"YYYY-MM-DD").format("MM-DD-YYYY"):undefined}
                    editable={false}
                    overlayElement={( 
                        <TouchableOpacity  style={{position:"absolute",justifyContent:"center",width:"100%",height:"100%"}}
                        onPress={()=>handlePicker()}
                        >
                        <View
                            style={styles.eyeIcon}
                 
                            >
                            <Pic source={schedule_png} style={{width:"100%",height:"100%"}}  />
                        </View>
                        </TouchableOpacity >
                        )}
                    onChangeText={newText=>{
                          
                    }
                    }
                />}
                {Platform.OS=='web' && <>
                <Text style={styles.label}>{label}</Text>
                <input  type={"date"}
                value={date}
                style={styles.inputBox}
                onChange={e=>{
                    setDate(e.target.value)
                    onChangeText!(e.target.value)

                }}
                />
                </>

                }
                
                {Platform.OS==='ios' &&<DatePickerModal visible={visible} onClose={(newDate?:string)=>
                    {
                     
                        if (newDate){
                            console.log("NEw")
                            setDate(newDate)
                            onChangeText!(newDate)
                        }
                        setVisible(false)
                    
                }} />}
     
    </View>)
  
}

function DatePickerModal(props:{visible:boolean,onClose:(date?:string)=>void}){

    const [visible,setVisible]=useState(props.visible)
    const [date,setDate]=useState(new Date())
    useEffect(()=>{
        setVisible(props.visible)
    },[props.visible])

    useEffect(()=>{
        if (visible) Keyboard.dismiss()
    },[visible])
    return (<Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
         
          setVisible(!visible)
        }}
        
      >
        <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"}}>
        <View  style={{backgroundColor:"white",width:rw(343),borderRadius:25}}>
        <DateTimePicker
                //   testID="dateTimePicker"
                //   timeZoneOffsetInMinutes={tzOffsetInMinutes}
                //   minuteInterval={interval}
                //   maximumDate={maximumDate}
                //   minimumDate={minimumDate}
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(_,newDate)=>{
                    setDate(newDate!)
                  }}
              
                  textColor="black"
                //   is24Hour
                //   display={display}
                //   onChange={onChange}
                //   textColor={textColor || undefined}
                //   accentColor={accentColor || undefined}
                //   neutralButton={{label: neutralButtonLabel}}
                //   negativeButton={{label: 'Cancel', textColor: 'red'}}
                //   disabled={disabled}
                />
       
        <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>

        <Text onPress={()=>props.onClose()} style={{fontFamily:"Outfit",fontSize:fs(18),flex:1,textAlign:"center",backgroundColor:'#rgba(0,0,0,0.05)',paddingVertical:rh(20)}} >Cancel</Text>
        <Text onPress={()=>props.onClose(moment(date).format("YYYY-MM-DD") )} style={{fontFamily:"Outfit",fontSize:fs(18),flex:1,textAlign:"center",paddingVertical:rh(20)}} >Done</Text>
        </View>
        </View>
        </View>
      </Modal>)


}

const styles=StyleSheetRW.create(()=>({
    eyeIcon:{ position: "absolute", height: rh(24), width: rw(24), right: rw(20) },
    label:{ fontFamily: "Outfit", fontSize: fs(14), fontWeight: "600", color: "rgba(51, 51, 51, 1)", marginBottom: rh(5) },
    inputBox: {
        //width: rw(343),
        backgroundColor: rgba(0, 0, 0, 0.05),
        height: rh(60),
        borderRadius: 10,
        fontFamily: "Outfit", 
        fontSize: fs(16),
        fontWeight: "400",
        color: "#333333",
        paddingLeft: rw(16),
        paddingRight: rw(16),
        paddingTop:0,
        paddingBottom:0,
        borderWidth:0,
        marginBottom:rh(20),
      },
      
}))