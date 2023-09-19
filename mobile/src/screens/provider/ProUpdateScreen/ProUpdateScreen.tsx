import clientStorage from "core/clientStorage";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, useWindowDimensions, View } from "react-native";
import colors from "res/colors";
import env from "res/env";
import { Logout } from "src/commons";

import AppButton from "src/components/AppButton";
import DateField from "src/components/DateField";
import DropDownField, { DropDownOptionsStates } from "src/components/DropDownField";
import Header from "src/components/Header";
import QuestionCard, { Uploader } from "src/components/QuestionCard";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import TextField from "src/components/TextField";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";
import types from "res/refGlobalTypes"
import cloud from "../../../cloud"
//import ConsumerTabs from "../consumer/tabs/ConsumerTabs";
import { ProgressBar } from "./ProgressBar";
import InfoBar from "src/components/InfoBar";
import ProviderTabs from "../ProTabs/ProviderTabs";
import { configureCore, coreOptions } from "core/core";
//import { IQuestionWithIcon, loadQuestions } from "./questions";




interface IUpdateForm {
    title: string,
    img: string ,
    desc: string,

}

async function completeSignup(updateForm:IUpdateForm &{email:string},from:string){
    await cloud.providers.update(updateForm)
    clientStorage.saveItem("lastSuccessEmail", updateForm.email)
    let storeProvider=clientStorage.getItem("provider")
    clientStorage.saveItem("provider", {...storeProvider,...updateForm})
    clientStorage.saveItem("user",getAppStore(p=>p.user))
    let reduxProvider=getAppStore(p=>p.provider)
    updateStore({provider:{...reduxProvider,...updateForm}})
    if (from=="ProMenu")
    navhelper.goBack()
    else
    navhelper.setRoot(ProviderTabs)

}

//cache questions
var masterQuestions:Array<IQuestionWithIcon>=[]

export default function ProUpdateScreen(props:any) {
    const email = useAppStore(s=>s.provider?.email) || ""
    const [questions,setQuestions]=useState<Array<IQuestionWithIcon>>([])
    const [loading,setLoading]=useState(false)
    const LENGTH = 1 + questions.length
    const [step, setStep] = useState(0)
    const scrollViewRef = React.useRef<ScrollView>();
    const [answers,setAnswers]=useState<{[questionCode:string]:types.IAnswer}>({})
    const dim=useWindowDimensions()
    const provider=useAppStore(s=>s.provider)
    let defaultFirstForm={ 
         img:provider?.img || "",
         title:provider?.title || "",
         desc:provider?.desc || ""
        }

    

    
    const [firstForm, setFirstForm] = useState< IUpdateForm>(defaultFirstForm)

    const scrollToStep = React.useCallback((newStep: number) => {
        scrollViewRef.current?.scrollTo({ x: rw(343 * (newStep)) })
    }, [])


    useEffect(()=>{
        scrollToStep(step)
    },[dim])
    var Is_Enabled = step==0 ? 
                        !!firstForm.img && !!firstForm.title && !! firstForm.desc
                        :
                        (!!answers[questions[step-1].code]?.answer.length)
 

    useEffect(() => {
           //console.log("Val", JSON.stringify(values, null, 4))
         step>0 &&  console.log("answer",answers[questions[step-1].code].code,answers[questions[step-1].code].answer)
    }, [answers])
 
    

    useEffect(() => {
        // loadQuestions().then(qs=>{
        //     setQuestions(qs)
        //     masterQuestions=qs
        // })
        // .catch((e)=>{
        //     console.log(e)
        //     Alert.alert("Error","Failed to complete sign up. Please try again later")
        //     navhelper.goBack()
        // })
       
    }, [])

    useEffect(()=>{

    },[step])
    var errorMsg=""
    if (step>0 ){
       if (answers[questions[step-1].code]?.answer.length> questions[step-1].maxSelections!){
        errorMsg=`You cannot select more than ${questions[step-1].maxSelections} options`

       }
    }
    return (
        <View style={[FULL_SCREEN, {
            // backgroundColor:'rgb(192,216,200)',
            flex: 1, flexDirection: "column"
        }]}
        >
            <SafeAreaView style={FULL_SCREEN}>
                <Header
                    title="Update Profile"
                    // leftButton={(step > 0) ? {
                    //     title: "Skip",
                    //     onPress: async () => {
                    //         if (step + 1 < LENGTH) {
                    //             setStep(step + 1)
                    //             scrollToStep(step + 1)
                    //         }
                    //         else {
                    //             setLoading(true)
                    //             try {
                    //             await  completeSignup({ ...firstForm,email,details:answers})
                    //             }
                    //             catch{

                    //             }
                    //             finally{
                    //                 setLoading(false)
                    //             }
                    //         }
                    //     }
                    // } : undefined}
                    onBackPress={() => {
                        if (step == 0) {
                            props.from=="ProMenu"
                            ?
                            navhelper.goBack()
                            :
                            Alert.alert("Confirm", "Do you want to logout?", [
                                {
                                    text: "No"
                                },
                                {
                                    text: "Yes",
                                    onPress: ()=>{
                                        Logout()
                                    }
                                }
                            ])
                        }
                        else {
                            setStep(step - 1);
                            scrollToStep(step - 1);
                        }
                        return true;

                    }}
                />
                {false ? <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={'large'} color={colors.darkGreen} />
                </View>
                :
                <>
                {!errorMsg ?
                <View style={{marginHorizontal:rw(16)}}>
                <InfoBar data={{text:"This is the profile that will be shown to the users"
                        ,textStyle:{fontWeight:'normal',flex:0.8}
            }} />
            </View>
                :
                <Text style={{fontFamily:"Outfit",color:"white",backgroundColor:"rgba(255,87,87,1)",fontSize:fs(14),textAlign:"center",paddingVertical:rh(10)}}>{errorMsg}</Text>
                }<KeyboardAvoidingView
                    keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}>
                <View style={{ flex: 1, marginHorizontal: rw(16) }}>
                    <ScrollView 
                        // @ts-ignore
                        ref={scrollViewRef}
                      showsVerticalScrollIndicator={false}
              
                    >
                        <View style={{ maxWidth: rw(343), overflow: "hidden" }}>
                        <Uploader 
                                    option={{text:"Photo"} as any} 
                                    key={"PRO"}
                                    questionCode={"PRO"}
                                    onUpload={(_,img)=>{
                                        setFirstForm({...firstForm,img:img!})
                                    }}
                                    photoMode
                                    />
                                    <View style={{marginBottom:rh(20)}} />
                            <TextField
                                value={firstForm.title}
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20) }}
                                label="Title"
                                placeholder="Enter the title of your service..."
                                onChangeText={title => {
                                   setFirstForm({...firstForm,  title})
                                }}

                            />
                            <TextField
                                value={firstForm.desc} //todo
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20)}}
                                inputSyle={{ height: rh(150), paddingTop: rh(20) }}
                                label="Bio"
                                placeholder="Enter the description of the service you will be providing"
                                multiline
                                onChangeText={desc => {
                                    setFirstForm({...firstForm,desc})
                                 }}
                                />

                           
                        </View>
                        {questions.map(q => { 
                            let options = q.options
                            return (<QuestionCard key={q.code} maxSelections={q.maxSelections} 
                                question={( q.usePastFor && answers[q.usePastFor.code]?.answer?.some(l=>q.usePastFor!.answer.includes(l)) ) ?   q.pastText!:q.text} 
                                code={q.code}
                                options={options} 
                                onSelection={(selections) => {
                           
                                
                                    answers[q.code]={
                                        code:q.code,
                                        answer: selections
                                    }
                                setAnswers({...answers})
                            }}
                            
                            />)

                        
                        })
                        }
                    </ScrollView>

                </View>
                <AppButton
                    onPress={async () => {

                        await  completeSignup({...firstForm,email},props.from)
                        return ;
                        if (step + 1 < LENGTH) {

                            if (step==0){
                               
                            }
                           let fQuestions= masterQuestions.filter(x=>{
                                if (!x.skipFor)
                                return true;
                                return !x.skipFor.answer.some(l=> answers[x.skipFor!.code]?.answer?.includes(l))
                            })
                            setQuestions([...fQuestions])
                            setStep(step + 1)
                            scrollToStep(step + 1)
                        }
                        else {
                           
                              await  completeSignup({...firstForm,email,details:answers})
                            
                        }
                    }}
                    title="Proceed"
                    enabled={Is_Enabled || (env.type == "mock" && step + 1 != LENGTH)}
                />
                <View style={{ height: rh(10) }} />
              
                </KeyboardAvoidingView>
                {/* <GirdComponent/> */}
                </>
                }
            </SafeAreaView>
           {loading && <View style={{position:'absolute',height:'100%',width:"100%",backgroundColor:"rgba(0,0,0,0.1)",alignItems:'center',justifyContent:"center"}} >
                <ActivityIndicator  size={"large"} color="black"/>

            </View>}
        </View>)
}
coreOptions(ProUpdateScreen,{
noBottomBar:true
})
ProUpdateScreen.hintName=""

