import clientStorage from "core/clientStorage";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import StyleSheetRW from "core/StyleSheetRW";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
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
import { useAppStore } from "src/models/ReduxStore";
import types from "../../../../commons/globalTypes";
import cloud from "../../cloud"
import ConsumerTabs from "../consumer/tabs/ConsumerTabs";
import { ProgressBar } from "./ProgressBar";
import { IQuestionWithIcon, loadQuestions } from "./questions";




interface IFirstForm {
    full_name: string,
    dob: string ,// YYYY-MM-DD
    state: string,

}

async function completeSignup(user:Partial<types.IUser>){
    await cloud.updateUser(user as types.IUser)
    clientStorage.saveItem("lastSuccessEmail", user.email)
    let storeUser=clientStorage.getItem("user")
    clientStorage.saveItem("user", {...storeUser,...user})
    
    if (env.NO_PAY)
    navhelper.setRoot(ConsumerTabs)
    else
    navhelper.push("SubscriptionInfoScreen",{from :"FinishSetupScreen"})
    //
   // navhelper.push("SubscriptionScreen")
}

//cache questions
var masterQuestions:Array<IQuestionWithIcon>=[]

export default function FinishSetupScreen() {
    const email = useAppStore(s=>s.user?.email) || ""
    const [questions,setQuestions]=useState<Array<IQuestionWithIcon>>([])
    const [loading,setLoading]=useState(false)
    const LENGTH = 1 + questions.length
    const [step, setStep] = useState(0)
    const scrollViewRef = React.useRef<ScrollView>();
    const [answers,setAnswers]=useState<{[questionCode:string]:types.IAnswer}>({})
    const [firstForm, setFirstForm] = useState< IFirstForm>({ full_name:FinishSetupScreen.hintName || "",dob:"" ,state:""})

    const scrollToStep = React.useCallback((newStep: number) => {
        scrollViewRef.current?.scrollTo({ x: rw(343 * (newStep)) })
    }, [])


    var Is_Enabled = step==0 ? 
                        !!firstForm.full_name && !!firstForm.dob && !! firstForm.state
                        :
                        (!!answers[questions[step-1].code]?.answer.length)
 

    useEffect(() => {
           //console.log("Val", JSON.stringify(values, null, 4))
         step>0 &&  console.log("answer",answers[questions[step-1].code].code,answers[questions[step-1].code].answer)
    }, [answers])
 
    

    useEffect(() => {
        loadQuestions().then(qs=>{
            setQuestions(qs)
            masterQuestions=qs
        })
        .catch(()=>{
            Alert.alert("Error","Failed to complete sign up. Please try again later")
            navhelper.goBack()
        })
       
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
                    title="Finish Setup"
                    leftButton={(step > 0) ? {
                        title: "Skip",
                        onPress: async () => {
                            if (step + 1 < LENGTH) {
                                setStep(step + 1)
                                scrollToStep(step + 1)
                            }
                            else {
                                setLoading(true)
                                try {
                                await  completeSignup({ ...firstForm,email,details:answers})
                                }
                                catch{

                                }
                                finally{
                                    setLoading(false)
                                }
                            }
                        }
                    } : undefined}
                    onBackPress={() => {
                        if (step == 0) {
                            if (Platform.OS=="web")
                            {
                                navhelper.goBack()
                                return true;
                            }
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
                    keyboardVerticalOffset={Platform.OS=='ios'?0:SafeAreaInsets.BOTTOM + 10}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}>
                <View style={{ flex: 1, marginHorizontal: rw(16) }}>
                    <ScrollView horizontal scrollEnabled={false}
                        // @ts-ignore
                        ref={scrollViewRef}

                    >
                        <View style={{ maxWidth: rw(343), overflow: "hidden" }}>
                            <TextField
                                value={firstForm.full_name}
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20) }}
                                label="Full Name"
                                placeholder="Full Name"
                                onChangeText={full_name => {
                                   setFirstForm({...firstForm,full_name})
                                }}

                            />
                            <DateField
                                value={undefined} //todo
                                label="Date of Birth"
                                placeholder="MM-DD-YYYY"
                                bodyStyle={{ marginHorizontal: 0,marginBottom:rh(20) }}
                                onChangeText={dob => {
                                    setFirstForm({...firstForm,dob})
                                 }}
                                />
                            <DropDownField 
                                label="Your location"
                                placeholder="Please Select"
                                bodyStyle={{ marginHorizontal: 0 }}
                                options={DropDownOptionsStates}
                                onChangeText={state => {
                                    setFirstForm({...firstForm,state})
                                 }}
                            />
                        </View>
                        {questions.map(q => { 
                            let options = q.options
                            return (<QuestionCard key={q.code} code={q.code} answers={[]} maxSelections={q.maxSelections} 
                                question={( q.usePastFor && answers[q.usePastFor.code]?.answer?.some(l=>q.usePastFor!.answer.includes(l)) ) ?   q.pastText!:q.text} options={options} 
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
                <View style={Platform.OS=='android' ?  { alignItems: 'center', paddingTop: rh(15), height: rh(108) + SafeAreaInsets.BOTTOM, bottom: -SafeAreaInsets.BOTTOM } : {} }>
                    <AppButton
                        onPress={async () => {
                            if (step + 1 < LENGTH) {

                                if (step==0){
                                    if ( moment().diff(moment(firstForm.dob),"year")<18)
                                    {
                                        alert("This app is only for above 18")
                                        return;
                                    }
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
                        enabled={(Is_Enabled 
                            && (step === 0 || questions[step-1].maxSelections === undefined || answers[questions[step-1].code]?.answer.length <= questions[step-1].maxSelections!))
                            || (env.type == "mock" && step + 1 != LENGTH)}
                    />
                </View>
                
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

FinishSetupScreen.hintName=""

