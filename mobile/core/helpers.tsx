import { Dimensions, Platform, View } from "react-native"
import React from "react";
const { width, height } = Dimensions.get('window')


export function GirdComponent() {

  const N = 10;
  const PERCENT = 100 / N;
  const COLOR = 'rgba(0,0,0,0.25)'
  let arr = [...Array(N)].map((_, i) => i)

  return (<View style={{ width: "100%", height: "100%", position: "absolute", }} >

    {arr.map(x => {

      return (<View key={x} style={{ width: "100%", position: "absolute", height: 1, backgroundColor: COLOR, top: `${x * PERCENT}%` }} />)
    }
    )}

    {arr.map(x => {

      return (<View key={x} style={{ width: 1, position: "absolute", height: "100%", backgroundColor: COLOR, left: `${x * PERCENT}%` }} />)
    }
    )}

  </View>)
}


export const WinWidth = width;
export const WinHeight = height;

export function IsNullOrWhitespace(str:string){

  return !str  || str.trim() === ''
    //...
  
}

const _persist:any={

}
export const persist:{set:(o:{[key:string]:any})=>void , [key:string ]:any}={
  set(o) {
    let key=   Object.keys(o).pop() ||""
      if (Platform.OS=='web'){
      
        let value=JSON.parse( localStorage.getItem(key)! || "null" )
        _persist[key]=value || o[key]
        if (!value)
        localStorage.setItem(key, JSON.stringify( _persist[key]!))
        Object.defineProperty(persist,key,{
          get:()=>{
            return _persist[key]
          }
          ,
          set:newValue=>{
            _persist[key]=newValue
          localStorage.setItem(key,JSON.stringify( newValue))
          }
        })


      }
      else{
      
        persist[key]=o[key]
     
      }
    

  }
}
export interface IScreenProps{
  componentId:string
}