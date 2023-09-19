import { rw, fs, rh, rgba } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useState } from "react";
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle, View, ViewStyle } from "react-native";
import colors from "res/colors";

var textInputProps:TextInputProps
export interface TextFieldProps extends TextInputProps{
    label:string,
    placeholder?:string,
    value?:string
    overlayElement?:JSX.Element,
    underlayElement?:JSX.Element,
    textColor?:any,
    onChangeText?:(text:string)=>any
    carretHidden?:boolean
    errorMsg?:string
    bodyStyle?:StyleProp<ViewStyle>
    labelStyle?:StyleProp<TextStyle>
    inputSyle?:StyleProp<TextStyle>
    multiline?:boolean
    keyboardType?: typeof textInputProps.keyboardType

}
/**  
*TextField Component with Label and Text
*Provider yes
*Consumer no
*/
export default function TextField({ 
                                    label,
                                    placeholder ,
                                    value,
                                    overlayElement,
                                    textColor,
                                    underlayElement,
                                     onChangeText,
                                     carretHidden,
                                     errorMsg,
                                     ...props

                                  }:TextFieldProps){

    const [focused, setFocused ]=useState(false)

    const TextInputStyle:Array<any>=[styles.inputBox]
    const LabelStyle:Array<any>=[styles.label]

    if (focused) {
        
        TextInputStyle.push({borderWidth:1,borderColor:colors.lightGreen,width:rw(342)})
        LabelStyle.push({color:colors.lightGreen})
    }
    if (textColor){
        TextInputStyle.push({color:textColor})
    }

    return(  <View style={{ width: rw(343), marginHorizontal: rw(16),...(props.bodyStyle as any) }}>
    <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={[LabelStyle,props.labelStyle]}>{label} </Text>
        
    </View>
    <View style={{ width: rw(343), justifyContent: "center" }}>
        {underlayElement}
        <TextInput value={value} 
                placeholder={placeholder} 
                placeholderTextColor="rgb(136,158,147)"
                style={[TextInputStyle,props.inputSyle]} 
                onFocus={()=>setFocused(true)}
                onBlur={()=>setFocused(false)}
                onChangeText={onChangeText}
                caretHidden={carretHidden}
                multiline={props.multiline}
                keyboardType={props.keyboardType}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                ></TextInput>
        {overlayElement}
    </View>
    {!!errorMsg && <Text style={{...styles.label,marginTop:rh(10),width:"100%",color:"red",fontWeight:"normal"}}>{errorMsg}</Text>}
  </View>)
}

const styles=StyleSheetRW.create(()=>({
    label:{ fontFamily: "Outfit", fontSize: fs(14), fontWeight: "600", color: "rgba(51, 51, 51, 1)", marginBottom: rh(5) },
    inputBox: {
        width: rw(343),
        backgroundColor: rgba(0, 0, 0, 0.05),
        height: rh(60),
        borderRadius: 10,
        fontFamily: "Outfit", 
        fontSize: fs(16),
        fontWeight: "400",
        color: "#333333",
        paddingHorizontal: rw(16),
        paddingVertical:0
      },
}))