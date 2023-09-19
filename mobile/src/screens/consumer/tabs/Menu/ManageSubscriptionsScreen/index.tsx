import { GirdComponent, IScreenProps, WinWidth } from "core/helpers";
import navhelper from "core/navhelper";
import { fs, FULL_SCREEN, rgba, rh, rw } from "core/designHelpers";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import back_arrow_png from "res/img/back_arrow.png"
import eye_png from "res/img/eye.png"
import plan_selected_png from "res/img/plan_selected.png"
import plan_unselected_png from "res/img/plan_unselected.png"
import Header from "src/components/Header";
import StyleSheetRW from "core/StyleSheetRW";
import { coreOptions } from "core/core";
import env from "res/env";
import { ProductResponse } from "src/models/ServerInterfaces";
import { useAppStore } from "src/models/ReduxStore";
import moment from "moment";
import { Navigation } from "react-native-navigation";
import cloud from "src/cloud";
import { firstCap, Logout, Session } from "src/commons";
import ConsumerTabs from "../../ConsumerTabs";
import InfoBar from "src/components/InfoBar";
import { MSG } from "res/constants";
import TextField from "src/components/TextField";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import colors from "res/colors";
import AppButton from "src/components/AppButton";

interface IProps extends IScreenProps{
    from?:string
    
}
const FinishSetupScreen='FinishSetupScreen'
const TRIAL_STRING='Get a free consultation'
export default function ManageSubscriptionsScreen({ componentId,from }: IProps) {

    const [products, setProducts] = useState<ProductResponse>([])
    const [selected,setSelected]=useState(0)
    const [coupon, setCoupon]=useState("")
    const email = useAppStore(s=>s.user?.email) || ""
    const created_on=useAppStore(s=>s.user?.created_on)!
    const [active_subscription,setActiveSubscription]=useState<any>(undefined)
    const [ loading,setLoading]=useState(true)
     function onFocus(){
        setLoading(true)
        cloud.stripe.userSubscription({})
        .then((x)=>{
            console.log(x)
            if (!x.length)
            cloud.stripe.products().then((r) => {

                if (from==FinishSetupScreen || moment().diff( moment(created_on) ,"day")<=Session.configs.trial ){
                   // r.push({name:TRIAL_STRING,paymentLink:"" })
                    //setSelected(r.length-1)
                }
                setProducts(r)

            })
            .finally(()=>{
                setLoading(false)
            })
            else {
                setProducts([])
                setLoading(false)
            }
                setActiveSubscription(x.pop())
        
        })
        .catch(e=>{
            setLoading(false)
            alert("Something went wrong",e.toString())
            navhelper.goBack()
        })
        .finally(()=>{
            
        })
     }
    useEffect(() => {

        if (Platform.OS!='web')
   { let s= Navigation.events().registerComponentDidAppearListener(x=>{
        if (x.componentId==componentId){
            onFocus()
        }
     })

        return ()=>s.remove()}
        else onFocus()
    }, [])

    console.log(email)
    console.log("From>",from)
    if (loading)
    return (<View style={[FULL_SCREEN,{alignItems:"center",justifyContent:"center"}]}>
    <ActivityIndicator size={"large"} />
    </View>)
    else
    return (<View style={{flex:1}}>
        <SafeAreaView style={{flex:1}}>
        
            <Header
            onBackPress={()=>{
                    if (from=='ProfDetailsScreen')
                    {
                        navhelper.popToRoot()
                    }

                    return false
            }}
                noBack={from=="Home" && !active_subscription}
                title="Subscription Plan"
                leftButton={
                            from == "Home" && !active_subscription ? 
                                { title: "Log Out",
                                  onPress: Logout } 
                                : 
                                undefined
                           }
            />

        <KeyboardAvoidingView
        keyboardVerticalOffset={SafeAreaInsets.BOTTOM -230}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ width: rw(343), marginHorizontal: rw(16), flex: 1 }}>
         
             { active_subscription ? (<Text style={{ fontFamily: "Outfit", fontSize: fs(18), marginBottom: rh(32), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>
                    You are currently subscribed with following details.
                    {'\n\n'}
                    Start date{'\t\t'}: {moment(active_subscription.created*1000).format("YYYY-MM-DD")}
                    {'\n\n'}
                    Interval{'\t\t'}: {active_subscription.plan.interval?.toUpperCase()}
                    {'\n\n'}
                    Period Start{'\t'}: {moment(active_subscription.current_period_start*1000).format("YYYY-MM-DD")}
                    {'\n\n'}
                    Period End{Platform.OS=='web'? '\t\t':'\t'}: {moment(active_subscription.current_period_end*1000).format("YYYY-MM-DD")}
                    {'\n\n'}
                    Status{'\t\t\t'}: {firstCap( active_subscription.status)}
                    </Text>):
                (<Text style={{ fontFamily: "Outfit", fontSize: fs(18), marginBottom: rh(16), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>
                    
                    {/*Get full access to features and benefits that Game On! has to Offer.{'\n\n'}*/}
                    Choose a plan to get started:
                    </Text>)}


                <View style={{width:"100%",flex:0.6,flexDirection:"row",justifyContent:"space-between",flexWrap:"wrap"}} >
                {products.map((x,i) => {
                    let parts=x.name?.split(",")
                    parts=[...parts[0].split("/"),parts[1]]
                    return (<TouchableOpacity onPress={()=> setSelected(i) } key={x.name} style={{ flex:Platform.OS!="web" ? 0:undefined, flexDirection: "column",width:"49%" }}>

                        <View style={i!=selected ? styles.planBox2:styles.planBox} >
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                        {/* <Image resizeMode="contain" source={ i==selected ? plan_selected_png: plan_unselected_png} style={{ width: rw(14), height: rh(14) }} /> */}
                        <Text style={{ color:selected==i ? colors.lightGreen:colors.darkGreen, fontFamily: "Outfit", fontSize: fs(32), fontWeight: "400" }}>{parts[0]}<Text style={{fontSize:fs(16)}}>/{parts[1]}</Text></Text>
                        </View>
                        <Text style={{ color:selected==i ? colors.lightGreen:colors.darkGreen, fontFamily: "Outfit", fontSize: fs(16), fontWeight: "400",marginTop:rh(4) }}>{parts[2]}</Text>
                        </View>
                    </TouchableOpacity>)
                })}
                
                </View>
               
              { active_subscription && !active_subscription.isCanceled && active_subscription.status!='active' &&     <InfoBar data={{ textStyle:{fontWeight:"normal"},text:MSG.PAYMENT_DETAIL}}/>}

                {!active_subscription && (

                    <View style={{flex:1,paddingTop:rh(30)}}>
                        <View
                            style={{
                                //paddingHorizontal: rw(15),
                         //paddingTop:rh(10),
                                alignItems: "center",
                                marginBottom: rh(10),
                               
                            
                            }}>
                            <TextField
                                label="Promo Code (optional)"
                                value={coupon}
                                inputSyle ={{ backgroundColor:'rgb(191,218,202)'}}
                                placeholder="Enter promo code."
                                onChangeText={coupon => setCoupon(coupon)}
                            />
                            </View>
                            <ScrollView style={{width:"100%",paddingTop:rh(14),flex:1}}>
                            <Text style={{ fontFamily: "Outfit", fontSize: fs(16), marginBottom: rh(8), fontWeight: "600", color: rgba(47, 72, 88, 1) }}>
                    
                    Get full access to features and benefits that Game On! has to Offer:
                    
                    
                    </Text>
                            <View style={ styles.highlights} ><Image resizeMode="contain" source={ 1 ? plan_selected_png: plan_unselected_png} style={{ width: rw(20), height: rh(20) }} /><Text style={{ color: "#333", fontFamily: "Outfit", fontSize: fs(16), fontWeight: "400", marginLeft: rw(10) }}>Personalized and Secure Experience</Text></View>
                            <View style={ styles.highlights} ><Image resizeMode="contain" source={ 1 ? plan_selected_png: plan_unselected_png} style={{ width: rw(20), height: rh(20) }} /><Text style={{ color: "#333", fontFamily: "Outfit", fontSize: fs(16), fontWeight: "400", marginLeft: rw(10) }}>Unlimited Messaging</Text></View>
                            <View style={ styles.highlights} ><Image resizeMode="contain" source={ 1 ? plan_selected_png: plan_unselected_png} style={{ width: rw(20), height: rh(20) }} /><Text style={{ color: "#333", fontFamily: "Outfit", fontSize: fs(16), fontWeight: "400", marginLeft: rw(10) }}>24/7 Support</Text></View>
                            </ScrollView>
                        
                   
                    </View>
                )}
          
                
    
            </KeyboardAvoidingView>
   
            
            <AppButton enabled={active_subscription?.isCanceled ? false:undefined} 
            title={active_subscription ? "Cancel Subscription" :"Proceed to Checkout"}
            style={[styles.button,{opacity:active_subscription?.isCanceled ?0:1}]} onPress={async () => { 
                console.log("Coupon",coupon)
                    if (!active_subscription){
                        const handleProceed = () => {
                        products.length && 
                        products[selected].paymentLink && 
                        navhelper.push("StripeScreen", { product: products[selected], from, coupon });
                        if (!products[selected].paymentLink) {
                            if (from == FinishSetupScreen) navhelper.setRoot(ConsumerTabs);
                             else navhelper.goBack();
                        }
                    }
                      !coupon   && handleProceed()
                   coupon && await cloud.stripe.validateCoupon({coupon}).then((res) => {
                        if(res.valid){
                            handleProceed();
                        }else{
                            Alert.alert("Invalid Coupon", "Proceed without discount?",[
                                {text:"No", onPress: () => {}},
                                {
                                    text:"Yes",
                                    onPress:()=> handleProceed()
                                }
                            ])
                        }
                    });                        
                    }
                    else {
                        Alert.alert("Confirm","Are you sure you want to cancel subscription",[{text:"Yes",onPress:()=>{
                            cloud.stripe.cancelSubscription({subscription:active_subscription}).then(x=>{
                                    alert("Your subscription has been canceled")
                                    onFocus()
                                })

                        }},{text:"No",onPress:()=>{}}])
                    }

             }}/>

        
            <View style={{ height: rh(10) }} />
        </SafeAreaView>

    </View>)
}

coreOptions(ManageSubscriptionsScreen, {
    noBottomBar: true
})
const styles = StyleSheetRW.create(() => ({
    header: {
        width: "100%",
        height: rh(41),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: rh(31)


    },
    inputBox: {
        width: rw(343),
        backgroundColor: rgba(0, 0, 0, 0.05),
        height: rh(60),
        borderRadius: 10,
        fontFamily: "Outfit", fontSize: fs(16),
        fontWeight: "400",
        color: "#333333",
        paddingHorizontal: rw(16)
    },
    button: {
        width: rw(343),
        marginHorizontal: rw(16),
        backgroundColor: rgba(47, 72, 88, 1),
        height: rh(54),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'

    },
    planBox: {
        height: rh(100),
        paddingHorizontal: rw(15),
        paddingVertical: rh(15),
        backgroundColor: "rgba(255,255,255,0.5)",
        flex: Platform.OS=='web'? 1:0,
        borderRadius: 12,
        flexDirection: "column",
        alignItems: "center",
        justifyContent:'center',
        marginBottom: rh(10)



    },
    planBox2: {
        height:rh(100),
        paddingHorizontal: rw(15),
        paddingVertical: rh(15),
        backgroundColor: "rgba(255,255,255,0.1)",
        flex:Platform.OS=='web'? 1:0,
        borderRadius: 12,
        flexDirection: "column",
        alignItems: "center",
        justifyContent:"center",
        marginBottom: rh(10)



    },
    highlights: {
        //height:rh(54),
        paddingHorizontal: rw(15),
        paddingVertical: rh(15),
        backgroundColor: "rgba(255,255,255,0.1)",
        flex:Platform.OS=='web'? 1:0,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: rh(10)



    }
}))