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
import QuestionCard from "src/components/QuestionCard";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import TextField from "src/components/TextField";
import { getAppStore, updateStore, useAppStore } from "src/models/ReduxStore";
import types from "res/refGlobalTypes"
import cloud from "../../../cloud"
//import ConsumerTabs from "../consumer/tabs/ConsumerTabs";
import { ProgressBar } from "./ProgressBar";
import { IQuestionWithIcon, loadQuestions } from "./questions";
import InfoBar from "src/components/InfoBar";
import { coreOptions } from "core/core";




interface IFirstForm {
    first_name: string,
    last_name: string ,
    state: string,

}

async function completeSignup(provider:Partial<types.IProvider> & IFirstForm,bamboo:any, from:string){
    provider.name = provider.first_name+" "+provider.last_name;
    await cloud.providers.update({
                state:provider.state,
                email:provider.email,
                details:provider.details,
                first_name:provider.first_name,
                last_name:provider.last_name,
                name:provider.name
            })
    clientStorage.saveItem("lastSuccessEmail", provider.email)
    let storeProvider=clientStorage.getItem("provider")
    let updatedProvider = {...storeProvider,...provider};
    clientStorage.saveItem("provider", updatedProvider)
    from==='ProMenu' && updateStore({provider: {...getAppStore(p=>p.provider) , ...provider } as any });
    if (bamboo?.status==='approved' && from === 'ProMenu')
        navhelper.goBack();
    else if (bamboo?.status==='approved')
        navhelper.setRoot("ProUpdateScreen")
    else 
        navhelper.setRoot("AwaitingVerificationScreen")
    //
   // navhelper.push("SubscriptionScreen")
}

//cache questions
var masterQuestions:Array<IQuestionWithIcon>=[]

export default function ProFinishSetupScreen({from}: {from?: string}) {
    const email = useAppStore(s=>s.provider?.email) || ""
    const provider = useAppStore(s=>s.provider) || null
    const [questions,setQuestions]=useState<Array<IQuestionWithIcon>>([])
    const [loading,setLoading]=useState(false)
    const LENGTH = 1 + questions.length
    const [step, setStep] = useState(0)
    const scrollViewRef = React.useRef<ScrollView>();
    const [answers,setAnswers]=useState<{[questionCode:string]:types.IAnswer}>({})
    const [bamboo,setBamboo]=useState<any>(undefined)
    const dim=useWindowDimensions()
    let defaultFirstForm={ 
            first_name: provider?.first_name || ProFinishSetupScreen.hintName || "",
            last_name: provider?.last_name || "" ,
            state: provider?.state || ""
        }

    if (__DEV__)
    {
        defaultFirstForm={ 
            first_name: provider?.first_name || 'Shahid',
            last_name:  provider?.last_name || 'Sheharyar',
            state:provider?.state || "California"
        }
    }
    
    const [firstName, setFirstName] = useState<string>(provider?.first_name || "");
    const [lastName, setLastName] = useState<string>(provider?.last_name || "");
    const [state, setState] = useState<string>(provider?.state || "");
    const [firstForm, setFirstForm] = useState< IFirstForm>(defaultFirstForm)

    const scrollToStep = React.useCallback((newStep: number) => {
        scrollViewRef.current?.scrollTo({ x: rw(343 * (newStep)) })
    }, [])

    
    useEffect(()=>{
        if(from === "ProMenu")
        {
            let modifiedAnswers: {[questionCode:string]:types.IAnswer} = answers;
            Object.keys(provider?.details || {}).forEach(key => {
                //@ts-ignore
                modifiedAnswers[key] = {code: provider.details[key]?.code, answer: provider.details[key].answer};
            })
            setAnswers(modifiedAnswers);
        }
    },[])

    useEffect(()=>{
        scrollToStep(step)
    },[dim])
    var Is_Enabled = step==0 ? 
                        !!firstForm.first_name && !!firstForm.last_name && !! firstForm.state
                        :
                        (!!answers[questions[step-1].code]?.answer.length)
 

    useEffect(() => {
           //console.log("Val", JSON.stringify(values, null, 4))
         step>0 &&  console.log("answer",answers[questions[step-1].code].code,answers[questions[step-1].code].answer)
    }, [answers])
 
    

    useEffect(() => {
        Promise.all([
            loadQuestions(),
            cloud.providers.getBamboo()
        ])
        .then(([qs,bambooN])=>{
            
            if (bambooN){
                setBamboo(bambooN)
                if(!!bambooN.name)
                    setFirstForm({first_name:bambooN.name.split(' ')[0],last_name:bambooN.name.split(' ')[1],state:bambooN.state})
               
            }
            if (env.DO_NOT_REQUIRE_DOCS || bambooN) {
                qs=qs.filter(x=>!["UPCV","CERT","UPCR","MAST","UPMA","LCLI","LADC","UPAC"].includes(x.code))
            }
            setQuestions(qs)
            masterQuestions=qs
        })
        .catch((e)=>{
            console.log(e)
            Alert.alert("Error","Failed to complete sign up. Please try again later")
            navhelper.goBack()
        })
       
    }, [])

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
            //paddingLeft:rw(0)
        }]}
        >
            <SafeAreaView style={FULL_SCREEN}>
                <Header 
                    title={from === "ProMenu" ? "Update Profile" : "Finish Setup"}
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
                        if (step === 0) {
                            if(from === "ProMenu"){
                                navhelper.goBack();
                            }else{
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
                        }
                        else {
                            setStep(step - 1);
                            scrollToStep(step - 1);
                        }
                        return true;

                    }}
                />
                {!questions.length ? <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={'large'} color={colors.darkGreen} />
                </View>
                :
                <>
                {!errorMsg ?
                <ProgressBar total={LENGTH} completed={step + 1} />
                :
                <Text style={{fontFamily:"Outfit",color:"white",backgroundColor:"rgba(255,87,87,1)",fontSize:fs(14),textAlign:"center",paddingVertical:rh(10)}}>{errorMsg}</Text>
                }<KeyboardAvoidingView
                keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                 <View style={{ flex: 1,marginHorizontal: rw(16),paddingLeft:rw(0)}}>
                    <ScrollView horizontal 
                        // @ts-ignore  marginHorizontal: rw(16) ,
                        ref={scrollViewRef}
                        pointerEvents="box-none"
                        // 
                        scrollEnabled={Platform.OS!="web" ? false:undefined}
                        
                    >
                         <View style={{ maxWidth: rw(343), overflow: "hidden" }}>
                            <TextField
                                value={firstName}
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20) }}
                                label="First Name"
                                placeholder="First Name"
                                onChangeText={first_name => {
                                   setFirstForm({...firstForm, first_name})
                                   setFirstName(first_name);
                                }}

                            />
                            <TextField
                                value={lastName} //todo
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20) }}
                                label="Last Name"
                                placeholder="Last Name"
                            
                                onChangeText={last_name => {
                                    setFirstForm({...firstForm,last_name})
                                    setLastName(last_name);
                                 }}
                                />
                            <DropDownField 
                                value={state}
                                label="Your location"
                                placeholder="Please Select"
                                bodyStyle={{ marginHorizontal: 0 }}
                                options={DropDownOptionsStates}
                                onChangeText={state => {
                                    setFirstForm({...firstForm,state})
                                    setState(state);
                                 }}
                            />
                        </View>
                        {questions.map(q => { 
                            let options = q.options
                            return (<QuestionCard key={q.code} maxSelections={q.maxSelections} 
                                question={( q.usePastFor && answers[q.usePastFor.code]?.answer?.some(l=>q.usePastFor!.answer.includes(l)) ) ?   q.pastText!:q.text} 
                                code={q.code}
                                answers={answers[q.code] ? answers[q.code].answer || [] : []}
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
                           
                              await  completeSignup({...firstForm,email,details:answers},bamboo, from)
                            
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

ProFinishSetupScreen.hintName=""

coreOptions(ProFinishSetupScreen,{ 
    useSafeAreaView:true,
    getBodyStyle:()=>({paddingHorizontal:rw(16)}),
    noBottomBar: true
})

