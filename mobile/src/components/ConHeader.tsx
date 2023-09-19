/* ConHeader short for ConsumerHeader */

import { fs, rh, rw } from "core/designHelpers";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "res/colors";
import notification_svg from 'res/svgs/notification.svg'
import notification_unread_svg from 'res/svgs/notification_unread.svg'
interface ConHeaderprops{
title:string
hideNotification?:boolean,
rightComponent?:any
}
var listeners:Array<any>=[]
var _IsUnread=false;
function  _ConHeader ({title,hideNotification,rightComponent}:ConHeaderprops){
   
    let [IsUnread,setUnread]=useState (_IsUnread);
    
    let notification_icon=IsUnread ? notification_unread_svg :notification_svg
    let RightComponent=rightComponent

    useEffect(()=>{
        listeners.push(setUnread)
        return ()=>{
            listeners=listeners.filter(x=>x!=setUnread)
        }
    },[])

   return(<View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {!hideNotification && !rightComponent && <Pic source={notification_icon} style={styles.notification} />}
        {!!rightComponent && <RightComponent />}
        </View>)
    
}
const ConHeader: typeof _ConHeader & {setUnread:(value:boolean)=>void}=React.memo(_ConHeader,()=>true)
ConHeader.setUnread=(value:boolean)=>{
    listeners.forEach(l=>l(value))
}

const styles=StyleSheetRW.create(()=>({
    body:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:rh(10)
    }
    ,
    title:{
        fontFamily:'Outfit',
        fontWeight:"600",
        fontSize:fs(40),
        color:colors.darkGreen
    },
    notification:{
        height:rh(34),
        width:rw(34)
    }
}))

export default ConHeader