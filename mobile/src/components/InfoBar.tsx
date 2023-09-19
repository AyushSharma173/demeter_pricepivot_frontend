
import { fs, rh, rw } from "core/designHelpers";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import React from "react";
import { Platform, StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import colors from "res/colors";
import info_white_svg from "res/svgs/info_white.svg"

interface InfoBarprops{
data:{
    text:string,
    textStyle?:StyleProp<TextStyle>
    isError?:boolean
    button?:{
        text:string,
        onPress:()=>void
    }
    
}

}

export default function  InfoBar (props:InfoBarprops){
    const {data:{text,textStyle,button,isError}}=props
    return(<View style={{
                    width:"100%",
                    minHeight:rh(50),
                    backgroundColor:isError ? "#c86a52" :"#2f4858",
                    borderRadius:10,
                    marginBottom:rh(20),
                    flexDirection:"row",
                    alignItems:"center",
                    paddingHorizontal:rw(15),
                    paddingVertical:rh(15),
                    justifyContent:"space-between"
                    }}>
                    <View style={{flexDirection:"row",alignItems:'center'}}>
                        <Pic source={info_white_svg} style={{height:rh(20),width:rw(20),marginRight:rw(10)}}/>
                        <Text  style={[{fontFamily:"Outfit",fontSize:fs(14),color:'white',fontWeight:'normal',flex:button?undefined:(Platform.OS=="web" ?0.6:1),textAlignVertical:'center'},textStyle]}>
                            {text}
                        </Text>
                    </View>
                   {button ?  
                    <Text onPress={button.onPress} style={{fontFamily:"Outfit",fontSize:fs(14),color:isError? colors.darkGreen :colors.lightGreen,fontWeight:'normal',textDecorationLine:"underline"}}>
                        {button.text}
                    </Text>
                    :<View/>    
                }
        </View>)
    
}

const styles=StyleSheetRW.create(()=>({
    
}))