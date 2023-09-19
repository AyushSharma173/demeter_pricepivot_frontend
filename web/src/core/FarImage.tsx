import React, { useState } from 'react'

import { ActivityIndicator, Image, ImageProps,View } from 'react-native'

export default function FarImage(props:ImageProps){

    const [loading,setLoading]=useState(true)
    return (<View>
    <Image {...props}
    //onLoadStart={()=>setLoading(true)}
    onLoad={()=>setLoading(false)}
    />
        {!!loading &&<View style={[{position:"absolute",alignItems:"center",justifyContent:'center',width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)"},props.style]}>
            <ActivityIndicator color="white" />
        </View>}
    </View>)
}