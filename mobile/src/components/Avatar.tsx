import { fs } from 'core/designHelpers'
import React from 'react'
import { View,Image, ImageProps ,Text} from 'react-native'
import colors from 'res/colors'


export default function Avatar(props:ImageProps & {name?:string}){
    let source=props.source as any
    const NO_IMAGE=!source || source.uri?.includes("null") || source.uri?.includes("undefined")
    return (<View >
        {NO_IMAGE && <View style={[props.style,{display:"flex",justifyContent:'center',alignItems:'center',backgroundColor:colors.darkGreen}]}>
                <Text style={{color:"white",fontSize:fs(24),marginBottom:4}}>{props.name?.charAt(0).toUpperCase()}</Text>
            </View>}
        {!NO_IMAGE && <Image
                  source={props.source }
                  style={props.style}
                />}
    </View>)
}