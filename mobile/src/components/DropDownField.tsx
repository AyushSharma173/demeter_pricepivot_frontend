import { rw, fs, rh, rgba } from "core/designHelpers";
import React, { useEffect, useState } from "react";
import { Image, Keyboard, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TextField, { TextFieldProps } from "./TextField";
import DateTimePicker from '@react-native-community/datetimepicker';
import dropdown_svg from 'res/svgs/dropdown.svg'
import StyleSheetRW from "core/StyleSheetRW";
import Pic from "core/Pic";
import moment from "moment";
export interface DropDownFieldProps extends TextFieldProps {

    options:Array<string>

}


export default function DropDownField({ label,onChangeText,...props}:DropDownFieldProps){

   const [visible,setVisible]=useState(false)
   const [value,setValue]=useState(props.value)

    return (    <View style={{ width: '100%'}}>
                <TextField {...props} {...{label,}}

                    value={value}
                    editable={false}
                    overlayElement={( 
                        <TouchableOpacity  style={{position:"absolute",justifyContent:"center",width:"100%",height:"100%"}}
                        onPress={()=>setVisible(true)}
                        disabled={props.editable==false ? true:false}
                        >
                        <View
                            style={styles.eyeIcon}
                 
                            >
                            <Pic source={dropdown_svg} style={{width:"100%",height:"100%"}}  />
                        </View>
                        </TouchableOpacity >
                        )}
                    onChangeText={newText=>{
                          
                    }
                    }
                />
                
                <PickerModal 
                options={props.options}
                visible={visible} onClose={(newText?:string)=>
                    {
                     
                        if (newText){
                           setValue(newText)
                           onChangeText!(newText)
                        }
                        setVisible(false)
                    
                }} />
     
    </View>)
  
}

function PickerModal(props:{visible:boolean,onClose:(text?:string)=>void,options:Array<string>}){

    const [visible,setVisible]=useState(props.visible)
    const [value,setValue]=useState("")
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
        <View  style={{backgroundColor:"white",width:rw(343),height:'60%',borderRadius:25}}>
        <ScrollView >
            {props.options.map(o=>{
                return (<Text onPress={()=>setValue(o)} key={o} style={{fontFamily:"Outfit",fontSize:fs(18),flex:1,paddingLeft:rw(20),backgroundColor:o!=value ? undefined:'#rgba(0,0,0,0.1)',paddingVertical:rh(20),color:'black'}} >{o}</Text>)
            })}
        </ScrollView>
       
        <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>

        <Text onPress={()=>props.onClose()} style={{fontFamily:"Outfit",fontSize:fs(18),flex:1,textAlign:"center",backgroundColor:'#rgba(0,0,0,0.05)',paddingVertical:rh(20)}} >Cancel</Text>
        <Text onPress={()=>props.onClose(value )} style={{fontFamily:"Outfit",fontSize:fs(18),flex:1,textAlign:"center",paddingVertical:rh(20)}} >Done</Text>
        </View>
        </View>
        </View >
      </Modal>)


}

const styles=StyleSheetRW.create(()=>({
    eyeIcon:{ position: "absolute", height: rh(24), width: rw(24), right: rw(20) },
      
}))

export  const DropDownOptionsStates=
["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
.sort();