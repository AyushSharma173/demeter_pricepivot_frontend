import StyleSheetRW from "core/StyleSheetRW";
import React, { useState } from "react";
import { StyleSheet, View ,Text, Touchable, TouchableOpacity, Alert} from "react-native";
import env from "res/env";


interface EnvInfoprops{

}
var _visible=true;
export default function  EnvInfo (props:EnvInfoprops){

    const [visible,setVisible]=useState(_visible)
    if (!visible || env.type!='mock' )
        return null
    else {
        function onPress(){
            Alert.alert("Mock Mode", "The application is in MOCK mode. You can navigate through the app without filling all the data.",[
                {
                    text:"Hide",
                    onPress:()=>{
                        _visible=false;
                        setVisible(false)
                    }
                }
                ,
                {
                    text:"Ok"
                }
            ])
        }

        return (<TouchableOpacity onPress={onPress} style={styles.body} >
        <Text style={styles.text} >M</Text>
        </TouchableOpacity>)
    }
}

const styles=StyleSheetRW.create(()=>({
    body:{
        width:44,
        height:44,
        backgroundColor:"white",
        position:"absolute",
        bottom:"14%",
        right:"5%",
        borderRadius:100,
        borderWidth:1,
        borderColor:"rgba(0,0,0,0.2)",
        alignItems:"center",
        justifyContent:"center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    text:{
        color:"black",
        fontSize:23,
        fontFamily:"Outfit"
    }
}))