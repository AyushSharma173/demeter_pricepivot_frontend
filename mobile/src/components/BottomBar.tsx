import { fs, rh, rw } from "core/designHelpers";
import navhelper, { useOnTabChange } from "core/navhelper";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import colors from "res/colors";
import { Session } from "src/commons";
import SafeAreaInsets from "./SafeAreaInsets";

interface IBottomBarProps{
    style?:StyleProp<ViewStyle>
}
var listeners:Array<any>=[]
var _indicatorIndex=-1;
export default function BottomBar ({style}:IBottomBarProps){

    let {tabs}=navhelper.getTabSpecs()
    const selectedIndex=useOnTabChange();
    const [indicatorIndex,setIndicator]=useState(_indicatorIndex)

    useEffect(()=>{
        listeners.push(setIndicator)
        return ()=>{
            listeners=listeners.filter(l=>l!=setIndicator)
        }
    },[])
   
    return(
    <View style={[styles.body,{       height:rh(64)+SafeAreaInsets.BOTTOM,        marginBottom:-SafeAreaInsets.BOTTOM},style]} >
{
    tabs.map((x,i)=>{
        let IsSelected=selectedIndex==i
        let icon= IsSelected ? x.selected :x.unselected
        return(<TouchableOpacity onPress={()=>{ 
            if (Session.call_in_progress){

                alert("We can not switch tabs during the call.")
                return;
            }
            if ( indicatorIndex==i)
            BottomBar.setIndicator(-1)
            navhelper.selectTab(i)
            } } key={x.name} style={{alignItems:"center"}} >
            <View style={{height:rh(24),width:rw(24)}}>
            <Pic  source={icon} style={{ height:rh(24),width:rw(24),marginBottom:rh(5)}} fill={ IsSelected ? colors.lightGreen: '#808080'} />
           {indicatorIndex==i && <View style={{position:"absolute",backgroundColor:colors.lightGreen,height:rh(15),width:rh(15),borderRadius:100,right:-rw(2),top:-rh(5)}} />}
            </View>
            <Text style={{fontFamily:"Outfit",fontWeight:"400",fontSize:fs(12),color:IsSelected ? colors.lightGreen: '#808080'}}>{x.name}</Text>
        </TouchableOpacity>)
    })
}

    </View>)
}

BottomBar.setIndicator=(index:number)=>{
listeners.forEach(x=>x(index))
_indicatorIndex=index
}
const styles=StyleSheetRW.create(()=>({
    body:{
    
 
        paddingTop:rh(15),
        width:"100%",
  
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:rw(38),

    }
}))