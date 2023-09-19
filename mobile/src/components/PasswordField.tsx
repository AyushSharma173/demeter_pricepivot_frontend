import { rw, fs, rh, rgba } from "core/designHelpers";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import TextField, { TextFieldProps } from "./TextField";
import eye_png from "res/img/eye.png"
import eye_cross_png from "res/img/eye_cross.png"
import StyleSheetRW from "core/StyleSheetRW";
export interface PasswordFieldProps extends TextFieldProps {
    label:string,
    placeholder:string,
    value?:string
    onChangeText?:(newText:string)=>any

}

const DOT_CHAR='●'
const DOT_SIZE=24
export default function PasswordField({ label,placeholder ,value,onChangeText,...otherprops}:TextFieldProps){

    const [secured, setSecured ]=useState(true)
    const [privateValue,setValue]=useState(value)
    
    useEffect(()=>{
        setValue(value)
    },[value])
    
    var dottedText=privateValue
    if (secured && privateValue && privateValue.length)
    {
        dottedText=DOT_CHAR.repeat(privateValue.length)
    }    

    return (    <View style={{ width: '100%'}}>
                <TextField {...otherprops} {...{label,placeholder,value:privateValue}}
                    textColor={secured ? rgba(0,0,0,0):undefined}

                    underlayElement={
                        (!!secured ? <View style={styles.dotTextView}>
                        <Text style={styles.dotText} >{dottedText}</Text>
                        </View>
                        :
                        undefined
                        )
                    }
                    inputSyle={(secured && !!dottedText) ? {fontFamily:'PTMono-Regular',fontSize:fs(DOT_SIZE)}:undefined}
                    overlayElement={( 
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={()=>setSecured(!secured)}
                            >
                            <Image source={secured ?eye_png:eye_cross_png} style={{width:"100%",height:"100%"}}  />
                        </TouchableOpacity>
                        )}
                    onChangeText={newText=>{
                            setValue(newText)
                            if(onChangeText)
                                onChangeText(newText)
                    }
                    }
                />
     
    </View>)
  
}

const styles=StyleSheetRW.create(()=>({
    eyeIcon:{ position: "absolute", height: rh(24), width: rw(24), right: rw(20) },
    dotTextView: {
        position:"absolute",
        top:0,
        left:0,
        width: rw(343),

        height: rh(60),
  
     
        paddingHorizontal: rw(16),
        justifyContent:"center",  
        zIndex:-1
      },
      dotText:{
        fontFamily:"PTMono-Regular",
        fontSize: fs(DOT_SIZE),
        fontWeight: "400",
        color: "#333333",
      }
      
}))