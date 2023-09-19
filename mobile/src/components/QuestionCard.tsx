import { fs, rgba, rh, rw } from "core/designHelpers";
import { IsNullOrWhitespace } from "core/helpers";
import Pic from "core/Pic";
import selectAndUploadFile from "core/selectAndUploadFile";
import StyleSheetRW from "core/StyleSheetRW";
import React, { Fragment, useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleProp, Text, TextInputProps, TouchableOpacity, View, ViewStyle ,Image} from "react-native";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { SvgProps } from "react-native-svg";
import colors from "res/colors";
import types from "res/refGlobalTypes";
import { formatFileName, makeDBPath, makeid } from "src/commons";
import { useAppStore } from "src/models/ReduxStore";
import AppButton from "./AppButton";
import TextField from "./TextField";
import auth from "@react-native-firebase/auth"
var textInputProps:TextInputProps
interface QuestionCardprops {
    code:string
    question: string
    answers: Array<string>
    options: Array<types.IOptions>
    multiselectmode?: boolean
    onSelection?: (options:Array<string> ) => any
    onCustomText?:(customText:string)=>void
    maxSelections?:number
}

export type  ISelectionMap={
    [key: string]:ISelection
}

interface ISelection{
    text?:string
    subOptions?:ISelectionMap
    checked?:boolean
}

export interface IOptionWithIcon extends types.IOptions {

    icon?: React.FC<SvgProps> | string,
    selectedIcon?: React.FC<SvgProps> | string,
    code:string,

    /**
     * When `otherButton` is specified true,
     * <br/>
     *  it means selecting it will open more options. 
     */
    otherButton?: boolean  
    /**
     * When `partOfOtherOption` is specified true,
     * <br/>
     * this option will only display when the option
     * <br/>
     * with `otherButton` specified is selected. 
     */
    partOfOtherOption?: boolean,
    /**
     * Setting it true, indicates that is 
     * <br/>
     * a option that requires text input 
     * <br/> 
     * from the user.
     */
    IsOpenEndedQuestion?: boolean
    /**
     * Only valid when `IsOpenEndedQuestion` is set true.
     */
    placeholderText?: string
     /**
     * Only valid when `IsOpenEndedQuestion` is set true.
     */
    multiline?: boolean

    /**
     * Only valid when `IsOpenEndedQuestion` is set true.
     */
    keybordType?: typeof textInputProps.keyboardType
    /**
     * When the option is a question with its sub options, 
     * <br/>
     * `question` field can be set with question text in field `text` and 
     * <br/>
     * sub-options can be provided in `options`
     */
    question?: QuestionCardprops

    otherText:string
}

export type IOption = IOptionWithIcon



export default function QuestionCard(props: QuestionCardprops) {
    const { question, options, answers } = props

    const [answer, setAnswer] = useState<Array<string>>(answers)
    const [otherSelected,setOtherSelected]=useState(false)
    const customText=answer.filter(x=>!options.map(y=>y.code).includes(x)).pop()

    
    const scrollViewRef = React.useRef<ScrollView>();

    

   
                    // Show only options that are not part of other options when otherButton is unselected
                    //.filter(x => IsOtherSelected || !(x as IOptionWithIcon).partOfOtherOption)
    
                    useEffect(()=>{
                        props.onSelection!(answer)
                    },[answer])
    return (
    <View key={question} style={{ width: rw(343) }} >
        <View style={{flexDirection:'column'}}>
        <Text style={styles.questionText}>{question} </Text>
        {!!props.maxSelections && <Text style={[styles.questionText,{ fontWeight:"normal",width:'100%',marginTop:rh(-5)}]}>You can pick upto {props.maxSelections} options</Text>}
        </View>        
        <ScrollView showsVerticalScrollIndicator={false} 
            //@ts-ignore
            ref={scrollViewRef}
             >
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                {options.map((rawoption, i) => {
                    const option = (rawoption as IOptionWithIcon)
                    let optionCode = option.code
                    if (optionCode=='UPLD'){
                        return <Uploader 
                                    option={option} 
                                    key={optionCode}
                                    questionCode={props.code}
                                    onUpload={(path)=>{
                                        setAnswer([path!])
                                    }}
                                    />
                    }
                    if (option.type=="text" ){
                        if (!answer?.includes("TRUE"))
                        {
                            return null
                        }
                        return (
                        <TextField key={option.code}
                            bodyStyle={{marginHorizontal:0,marginBottom:rh(10)}}
                            label={option.text}
                            onChangeText={(ans)=>{
                                let nans=answer.filter(x=>!x.startsWith(option.code))
                                nans.push(`${optionCode}:${ans}`)
                                setAnswer([...nans])
                            }}
                        
                        />)
                    }
                    const ChipStyle: Array<any> = [styles.ChipStyle]
                    const ChipTextStyle: Array<any> = [styles.ChipText]
                    const chipSelected = option.otherText ? (!!customText || otherSelected) : answer.includes(optionCode)
                    const { icon: Icon } = ((chipSelected && option.selectedIcon) ? {icon:option.selectedIcon}: option)
                    const KEY=optionCode+(!!option.icon).toString()

                    if (chipSelected) {
                        ChipStyle.push(Platform.OS === "android" ? { borderColor:rgba(47, 72, 88, 1), borderWidth: 2 } : { backgroundColor: rgba(47, 72, 88, 1) })
                        if(Platform.OS !== "android"){
                            ChipTextStyle.push({ color: "white" })
                        }
                    }

                   
                    if (Icon)
                        ChipStyle.push({ height: rh(94) })

                    const Show_Divider = i > 0 && !!(options[i - 1] as any)?.icon && !(option as any).icon
            
    
                        return (
                            <Fragment key={KEY}>
                                {Show_Divider && <Divider key={"Dividers"} />}
                               
                                    <TouchableOpacity
                                        key={KEY}
                                        style={ChipStyle}
                                        onPress={() => {
                                        
                                            // if (optionWithIcon?.otherButton)
                                            //     otherKey.current = optionWithIcon.text

                                            let newSelections =props.maxSelections ? [...answer] : []
                                            if (!option.otherText){
                                                if (newSelections.includes(optionCode)){
                                                    newSelections.splice(newSelections.indexOf(optionCode),1)
                                                }
                                                else {
                                                    newSelections.push(optionCode)
                                                }
                                                setAnswer([...newSelections])
                                            }
                                            else {
                                                
                                                if (customText)
                                                setAnswer([...answer.filter(x=>x!=customText)])
                                                setOtherSelected(!otherSelected)
                                            }

                                            // // persist other button when other options are selected
                                            // if (optionWithIcon.partOfOtherOption)
                                            //     newSelections[otherKey.current!] = {}

                                         
                                            
                                            
                                            // set or unset other button
                                            // if (otherKey.current) {
                                            //     setOtherSelected(!!newSelections[otherKey.current])
                                            // }
                                         

                                        }}
                                    >
                                         {!!Icon   && 
                                         
                                         (Platform.OS!="web" ?
                                         <Icon fill={colors[chipSelected ? "lightGreen" : "darkGreen"]} style={{ width: rw(22.35), height: rh(22.35), marginBottom: rh(10.8) }} />
                                            
                                         
                                         :
                                         <Pic source={Icon} fill={option.selectedIcon ? undefined: colors[chipSelected ? "lightGreen" : "darkGreen"]} style={{ width: rw(22.35), height: rh(22.35), marginBottom: rh(10.8) }} />
                                         )
                                         }
                                        <Text style={ChipTextStyle} >{option.text}</Text>
                                    </TouchableOpacity>
                                    {!!option.otherText && otherSelected && (
                                        <>
                                        <Divider key={"Dividers"} />
                                        <View key={KEY+"_quest"} style={{ width: "100%" }}
                                        onLayout={()=>{
                                            scrollViewRef.current?.scrollToEnd();
                                        }}
                                        >
                                            <TextField
                                                bodyStyle={{ marginHorizontal: 0, marginBottom:rh(236)}}
                                                //inputSyle={optionWithIcon.multiline ? { height: rh(150), paddingTop: rh(20) } : {}}
                                                inputSyle={{ height: rh(150), paddingTop: rh(20) }}
                                                value={customText}
                                                label={option.otherText}
                                                placeholder= 'type your answer here..'//{optionWithIcon.placeholderText}
                                                //multiline={optionWithIcon.multiline}
                                                multiline
                                               // keyboardType={optionWithIcon.keybordType}
                                                // labelStyle={{fontWeight:"normal"}}
                                                onChangeText={text => {
                                                   // const oldselections = selections
                                                   if (text){
                                                    let newAnswers=props.maxSelections ? [...answer.filter(x=>options.map(y=>y.code).includes(x)),text]:[text]
                                                    setAnswer(newAnswers)
                                                   } 
                                                    // const newSelections = { ...selections, [optionCode]: { text }, [otherKey.current!]: {} }
                                                    // if (IsNullOrWhitespace(text))
                                                    // delete newSelections[optionCode]
                                                    // setSelections(newSelections)
                                                    // props.onSelection && props.onSelection(newSelections)
                                                }}
                                            />
                                        </View>
                                        </>


                                    )
                                }
                            </Fragment>)
                }
                )}
            </View>
        </ScrollView>
    </View>)

}
function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
    return (<View key="divider" style={[styles.divider, style]} />)
}
export function Uploader({ option,questionCode,onUpload ,photoMode}: { option: IOptionWithIcon ,photoMode?:boolean,questionCode:string,onUpload?:(path?:string,url?:string)=>void}) {

    const email=useAppStore(p=>(p.user?.email || p.provider?.email )) || ""
    const current_img=useAppStore(p=>(p.provider?.img )) || ""
    const [fileInfo,setFileInfo]=useState<Asset>(undefined as any)
    let path=makeDBPath("all",email!,questionCode,useState( makeid(10))[0])
    useEffect(()=>{
        if (fileInfo!)
        onUpload && onUpload(path,fileInfo?.url)
    },[fileInfo])
    const webR:any=[]
    function pickWeb(){
        document.getElementById(path)?.click()
        return new Promise<File>((r,rj)=>{
            webR.push([r,rj])
        })
    }
    function onChange(event:any){
       let file= event.target.files[0]
            webR.pop()?.[0](file)
    }
    return (<View style={{ width: '100%' }}>
        {Platform.OS=='web' && <input type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={onChange} id={path} style={{display:"none"}} />}
        {!photoMode && <TextField
            label={option.text!}
            labelStyle={{ color: "gray", fontWeight: "400", fontSize: fs(12) }}
            bodyStyle={{ marginHorizontal: 0,marginBottom:rh(10) }}
            editable={false}
            value={formatFileName( fileInfo?.fileName)}
        
        />}
        {photoMode &&  <Image 
           source={fileInfo?.url ? fileInfo?.url: (current_img || require("res/img/account.png"))} 
            style={{ width: rw(343),backgroundColor:'#E9FAEF', height: rh(343),  borderRadius: 15, marginBottom: rh(15), overflow: "hidden" }}
           // onLoadStart={()=>setLoading(true)}
            //onLoad={()=>setLoading(false)}
            resizeMode={!(fileInfo?.url || current_img)?"center" :undefined}
            />

        }
        <AppButton
        style={{
            marginHorizontal:0,
            backgroundColor:'rgba(0,0,0,0)',
            color:colors.darkGreen,
            borderWidth:2,
            borderColor:colors.darkGreen
        }}
        onPress={async ()=>{
          
        
                try {
                await selectAndUploadFile(path,(file)=>{
                    setFileInfo(file)
                },Platform.OS=='web' ? await pickWeb():undefined
                ,photoMode)
                }
                catch(e){
                    webR.pop()?.[1]()
                    Alert.alert("Upload Error",e?.toString())
                }
            
        }}
        title="Select File" />

    </View>)
}

const styles = StyleSheetRW.create(()=>({
    ChipStyle: {
        width: rw(161),
        height: rh(60),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: rh(20),
        backgroundColor: rgba(0, 0, 0, 0.05)
    },
    ChipText: { 
        fontFamily: "Outfit",
        fontSize: fs(16), 
        color: "#333", 
        fontWeight: "400" 
    },
    divider:{ 
        width: "100%", 
        marginTop: -rh(5), 
        marginBottom: rh(15), 
        height: rh(1), 
        backgroundColor: "rgba(157, 178, 164, 1)" 
    },
    questionText:{ 
        fontFamily: "Outfit",
        fontSize: fs(14),
        fontWeight: "600",
        color: rgba(51,51,51,1),
        marginTop: rh(20),
        marginBottom: rh(10),
        width:"100%",
        
     }

}))
// function resolveAssetUri(source): ?string {
//   let uri = null;
//   if (typeof source === 'number') {
//     // get the URI from the packager
//     const asset = getAssetByID(source);
//     if (asset == null) {
//       throw new Error(
//         `Image: asset with ID "${source}" could not be found. Please check the image source or packager.`
//       );
//     }
//     let scale = asset.scales[0];
//     if (asset.scales.length > 1) {
//       const preferredScale = PixelRatio.get();
//       // Get the scale which is closest to the preferred scale
//       scale = asset.scales.reduce((prev, curr) =>
//         Math.abs(curr - preferredScale) < Math.abs(prev - preferredScale)
//           ? curr
//           : prev
//       );
//     }
//     const scaleSuffix = scale !== 1 ? `@${scale}x` : '';
//     uri = asset
//       ? `${asset.httpServerLocation}/${asset.name}${scaleSuffix}.${asset.type}`
//       : '';
//   } else if (typeof source === 'string') {
//     uri = source;
//   } else if (source && typeof source.uri === 'string') {
//     uri = source.uri;
//   }

//   if (uri) {
//     const match = uri.match(svgDataUriPattern);
//     // inline SVG markup may contain characters (e.g., #, ") that need to be escaped
//     if (match) {
//       const [, prefix, svg] = match;
//       const encodedSvg = encodeURIComponent(svg);
//       return `${prefix}${encodedSvg}`;
//     }
//   }

//   return uri;
// }
