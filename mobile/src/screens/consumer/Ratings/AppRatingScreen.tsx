import { coreOptions } from "core/core";
import { FULL_SCREEN, fs, rh, rw } from "core/designHelpers";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import types from "res/refGlobalTypes";
import DropDownField from "src/components/DropDownField";
import RatingField from "src/components/RatingField";
import { ProgressBar } from "./ProgressBar";
import AppButton from "src/components/AppButton";
import navhelper from "core/navhelper";
import { useAppStore } from "src/models/ReduxStore";
import cloud from "src/cloud/cloud";
import { Session } from "src/commons";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import cross_svg from "res/svgs/cross.svg";
import Pic from "core/Pic";
import ConHeader from "src/components/ConHeader";
import TextField from "src/components/TextField";
import { SafeAreaView } from "react-native";

let appRatingQuestions = [
  {
    question: "How would you rate your experience with Game On!?",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "appExperience",
  },
  {
    question:
      "How likely are you to recommend Game On! To friends and colleagues?",
    lowLabel: "Not at all",
    highLabel: "Highly Recommend",
    code: "chanceToRecommend",
  },
];

let providerRatingQuestions = [
  {
    question: "Communication variety",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "communication",
  },
  {
    question: "Timely responses",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "responseTime",
  },
  {
    question: "Respect and support",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "respectAndSupport",
  },
  {
    question: "Understanding of concerns",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "understanding",
  },
  {
    question: "Confidence in expertise",
    lowLabel: "Poor",
    highLabel: "Excellent",
    code: "ConfidenceInExpertise",
  },
];

export default function AppRatingScreen({
  provider,
}: {
  provider: types.IProvider;
}) {
  const [step, setStep] = useState(0);
  const [isRatingValid, setIsRatingValid] = useState(false);
  const user = useAppStore((s) => s.user);
  const [userFeedback, setUserFeedback] = useState({
    appFeedback: {
      by: user?.full_name,
      email: user?.email,
    },
    providerFeedback: {
      by: user?.full_name,
      email: user?.email,
    },
  });
  const _scrollViewRef=useRef<ScrollView>();
  const handleRatingChange = (questionCode: string, rating: any) => {
    //@ts-ignore
    userFeedback[step === 0 ? "appFeedback" : "providerFeedback"][
      questionCode
    ] = rating;
    setUserFeedback(userFeedback);

    setIsRatingValid(
      step === 0
        ? !appRatingQuestions.some(
          //@ts-ignore
          (x) => userFeedback.appFeedback[x.code] == null
        )
        : !providerRatingQuestions.some(
          //@ts-ignore
          (x) => userFeedback.providerFeedback[x.code] == null
        )
    );
  };

  const handlesourceOfInformationChange = (source: string) => {
    //@ts-ignore
    userFeedback.appFeedback.sourceOfInformation = source;
    setUserFeedback(userFeedback);
  };

  const handleadditionalCommentsChange = (comments: string) => {
    userFeedback[
      step === 0 ? "appFeedback" : "providerFeedback"
      //@ts-ignore
    ].additionalComments = comments;
    setUserFeedback(userFeedback);
  };

  const options = ["Facebook", "Instagram", "TV"];
  const renderAppFeedback = () => {
    return (
      <View style={{ flex: 1 }}>
        <DropDownField
          label="How did you hear about Game On!"
          placeholder="Chose one"
          bodyStyle={{ marginHorizontal: 0 }}
          options={options}
          onChangeText={handlesourceOfInformationChange}
        />

        {appRatingQuestions.map((q) => (
          <RatingField
            key={q.code}
            questionCode={q.code}
            question={q.question}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
            onRatingChange={handleRatingChange}
          />
        ))}

        <TextField
          bodyStyle={{ marginHorizontal: 0, marginTop: rh(30), marginBottom: rh(5) }}
          inputSyle={{ height: rh(150), paddingTop: rh(20) }}
          label="Any additional comments, feedback, suggestions of ways Game On! can improve?"
          placeholder="Additional comments"
          multiline
          onChangeText={handleadditionalCommentsChange}
        />
      </View>
    );
  };

  const renderProviderFeedback = () => {
    return (
      <View>
        <Text style={styles.text}>
          How would you rate your experience with {provider?.name}?
        </Text>
        {providerRatingQuestions.map((q) => (
          <RatingField
            key={q.code}
            questionCode={q.code}
            question={q.question}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
            onRatingChange={handleRatingChange}
          />
        ))}

        <TextField
          bodyStyle={{ marginHorizontal: 0, marginTop: rh(30), marginBottom: rh(5) }}
          inputSyle={{ marginHorizontal: 0, height: rh(150), paddingTop: rh(20) }}
          label={"Any additional comments or feedback for " + provider?.name + "?"}
          placeholder="Additional comments"
          multiline
          onChangeText={handleadditionalCommentsChange}
        />

        
        <Text style={{
          fontFamily: "Outfit", fontWeight: "400",
          fontSize: fs(12),
          color: "#808080",
          marginBottom: rh(5),
          textAlign: "left"
        }}>
          Your feedback is anonymous.
        </Text>
      </View>
    );
  };
  useEffect(()=>{

   let sub= Keyboard.addListener("keyboardWillShow",()=>{
      _scrollViewRef?.current?.scrollToEnd();
    })
    
   let sub2= Keyboard.addListener("keyboardDidHide",()=>{
    _scrollViewRef?.current?.scrollTo({x:0,y:0})
  })
  
    return ()=>{
      sub.remove()
      sub2.remove()
    }
  },[])
  return (
    <View style={[FULL_SCREEN, {
      flex: 1, flexDirection: "column"
    }]}
    >
      <SafeAreaView style={FULL_SCREEN}>
        <KeyboardAvoidingView keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, maxWidth: rw(343), overflow: "hidden" }}>

            <ConHeader
              title="Feedback"
              rightComponent={() => (<TouchableOpacity onPress={() => { Session.feedbackSkipped = true; navhelper.goBack() }}>
                <Pic style={{ height: rh(24), width: rh(24) }} source={cross_svg} />
              </TouchableOpacity>)}
            />
            <ScrollView
              // @ts-ignore
              ref={_scrollViewRef}
              showsVerticalScrollIndicator={false}>
              <ProgressBar total={2} completed={step + 1} />
              {step === 0 && <View>{renderAppFeedback()}</View>}

              {step === 1 && <View>{renderProviderFeedback()}</View>}


            </ScrollView>
          </View>
          <View style={{ height: rh(15) }}></View>
          <View style={{ alignItems: 'center', maxWidth: rw(343), paddingTop: rh(5), height: rh(108) + SafeAreaInsets.BOTTOM, bottom: -SafeAreaInsets.BOTTOM }}>
            <AppButton
              onPress={async () => {
                if (step === 0) {
                  setIsRatingValid(false);
                  setStep(1);
                } else {
                  //@ts-ignore
                  cloud
                    .rateAppAndProvider({
                      provider_email: provider.email,
                      //@ts-ignore
                      bookingId: user.bookingId,
                      feedback: userFeedback,
                    })
                    .then((x) => {
                      if (x.done)
                        navhelper.goBack();
                    });
                }
              }}
              title={step === 0 ? "Proceed" : "Submit Feedback"}
              enabled={isRatingValid}
              loaderDelayMillis={step === 0 ? 0 : 5000}
            />
          </View>

          <View style={{ height: rh(10) }} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>);
}

coreOptions(AppRatingScreen, {
  useSafeAreaView: true,
  noBottomBar: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});

const styles = StyleSheetRW.create(() => ({
  text: {
    fontFamily: "Outfit",
    fontWeight: "600",
    fontSize: fs(14),
    color: "#333333",
    marginBottom: rh(5),
    textAlign: "left"
  }
}));
