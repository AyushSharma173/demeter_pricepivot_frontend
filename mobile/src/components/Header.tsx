import { fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import BackButton, { BackButtonProps } from "./BackButton";
interface HeaderProps extends BackButtonProps{
    leftButton?:{ title:string,onPress:()=>any }
    title:string
    noPadHorizontal?:boolean
    noBack?:boolean
    headerStyle?:StyleProp<ViewStyle>
    rightComponent?: any,
}
export default function Header(props:HeaderProps){
  const headerStyle:Array<any>=[styles.header]

    if (props.noPadHorizontal){
      headerStyle.push({paddingHorizontal:undefined})
    }
    if (props.headerStyle){
      headerStyle.push(props.headerStyle)
    }
    return (<View style={headerStyle}  >
       {props.noBack ? <View    style={{flex:1/2}}/> :<BackButton onBackPress={props.onBackPress} />}
         <Text style={styles.heading}>{props.title}</Text>
         {!props.rightComponent && <TouchableOpacity
           onPress={props.leftButton?.onPress}
           style={{flex:1/2}}
         >
           <Text style={styles.leftButtonText}>{props.leftButton?.title}</Text>
         </TouchableOpacity>}
         {props.rightComponent && <View style={{
            flex: 1/2,
            alignItems: 'flex-end'
          }}>
            {props.rightComponent}
         </View>}
       </View>)
}

const styles=StyleSheetRW.create(()=>({
    header: {
        width: "100%",
        height: rh(41),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: rh(31),
        paddingHorizontal:rw(16)
    
    
      },
      heading:{ fontFamily: "Outfit",textAlign:"center",flex:1, fontSize: fs(18), fontWeight: "600", color: "rgba(51, 51, 51, 1)",width:rw(120) },

      leftButtonText: { fontFamily: "Outfit",textAlign:"right", fontSize: fs(16), fontWeight: "500", color: "rgba(3, 149, 144, 1)" },

}))