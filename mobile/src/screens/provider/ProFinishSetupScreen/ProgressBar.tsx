import { rgba, rh, rw } from "core/designHelpers"
import StyleSheetRW from "core/StyleSheetRW"
import React from "react"
import { StyleSheet, View } from "react-native"
export function ProgressBar ({total,completed}:any){

    let array=[...Array(total)].map((_,i)=>i)


    return (<View style={styles.body}>
        {array.map(i=>{
            return (<Bar completed={i<completed} total={total} key={i}/>)
        })}
        
    </View>


    )
}

function Bar({completed,total}:{completed:boolean,total:number}){
    let flex=1/total
    flex-=flex*0.1
    let backgroundColor="white"
    let opacity=0.5
    if (completed){
    backgroundColor=rgba(47, 72, 88, 1)
    opacity=1
    }
    return (<View style={[styles.bar,{flex,backgroundColor,opacity}]} ></View>)
}
const styles=StyleSheetRW.create(()=>({
    body:{
       
        flex:0,
        marginHorizontal:rw(16),
        height:rh(5),
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:rh(25)
    },
    bar:{
        borderRadius:10,
        height:rh(5)
        
    }
}))