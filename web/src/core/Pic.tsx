import React, { useEffect, useState } from 'react'
import { Image, ImageStyle, Platform, StyleProp, Text } from 'react-native'
import colors from 'res/colors'

interface PicProps{
    source:any
    style?:StyleProp<ImageStyle>
    fill?:any

}

export default function Pic ( props:PicProps){

    let {source,style,fill}=props
    const Isource=Platform.OS + typeof source
    const flatStyle=style?.valueOf() as any
    switch(Isource)
    {
        case 'webstring':
            return <RSvg style={style as any} fill={fill} source={source} />
        case 'androidfunction':
            case 'iosfunction':
                let Svg=source
                return <Svg fillRule="evenodd" {...{style,fill}} width={flatStyle?.width} height={flatStyle?.height}/>
        default:
            return (<Image {...{style}} source={source}/>)
    }


    
}
const cache:{[path:string]:string}={}
function RSvg(props:any){
    const [source,setSource]=useState(cache[props.source] || "")
    
    useEffect(()=>{
    !source &&    fetch(props.source).then(x=>x.text()).then(x=>{

            cache[props.source]=x
            setSource(x)
        })
    }
    ,[])

    let out:any=source
    if (props.fill)
    out=out.replace(/path /g,`path fill='${props.fill}' `)
     out='data:image/svg+xml;base64, '+btoa(out)

     if (!source)
        return (<div {...props} style={{...props.style,...{border:'1px solid '+colors.lightGreen}}} />)
    return(<img {...props} src={out} />)

}