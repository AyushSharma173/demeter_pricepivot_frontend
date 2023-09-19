import { fs, rgba, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";


interface AppButtonProps{
    onPress?: ()=>any 
    title?:string
    enabled?:boolean
    style?:StyleProp<TextStyle>
    loaderDelayMillis?:number
    loading?:boolean
}

export default function AppButton (props:AppButtonProps){

    const enabled=!(props.enabled==false )
    const buttonStyle:Array<any>=[styles.button]
    const [loading,setloading]=useState(props.loading || false)

    const textStyle:Array<any>=[styles.buttonText]

    if (props.style?.color){
        textStyle.push({color:props.style?.color})
    }

    if (!enabled)
        buttonStyle.push({ backgroundColor: rgba(128, 128, 128, 1)})

        async function onPress(){
            let x=props.onPress && props.onPress()
            if (x)
            {
                setloading(true)
                try {
                await x;
                }
                finally{
                setTimeout(()=> setloading(false),props.loaderDelayMillis || 0)
                }
            }
        }

    useEffect(()=>{
            setloading(props.loading || false)
    },[props.loading])
    return (<TouchableOpacity disabled={!enabled} 
                              onPress={onPress} 
                              style={[buttonStyle,props.style]}>
                                {loading ? 
                                <ActivityIndicator color={props.style?.color || "white"} />:
                                <Text style={textStyle}>{props.title}</Text>}
            </TouchableOpacity>)

}

const styles=StyleSheetRW.create(()=>({
    buttonText: { 
        fontFamily: "Outfit", 
        fontSize: fs(14), 
        fontWeight: "600", 
        color: 'white' 
    },

    button: {
        width: rw(343),
        marginHorizontal: rw(16),
        backgroundColor: rgba(47, 72, 88, 1),
        height: rh(54),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    
      },
}))