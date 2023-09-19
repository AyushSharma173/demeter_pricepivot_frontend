import { fs, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import back_arrow_png from "res/img/back_arrow.png"
export interface BackButtonProps{

  onBackPress?:()=>boolean // if the function handles back button, it should return true
}
export default function BackButton(props:BackButtonProps){
    return( <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" ,flex:1/2}}
    onPress={()=>{ 
      if (props.onBackPress &&props.onBackPress())
        return;
      navhelper.goBack()
    }}
    >
    <Image style={styles.backIcon} resizeMode="contain" source={back_arrow_png} />
    <Text style={styles.backText} >Back</Text>
  </TouchableOpacity>)
}

const styles=StyleSheetRW.create(()=>({
    backIcon:{ width: rw(12), height: rh(21), marginRight: rw(5) },
    backText: { fontFamily: "Outfit", fontSize: fs(16), fontWeight: "500", color: "rgba(51, 51, 51, 1)" },
}))