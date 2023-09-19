import { coreOptions } from "core/core";
import { fs, rh, rw } from "core/designHelpers";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Keyboard,
} from "react-native";
import colors from "res/colors";
import cloud from "src/cloud";
import AppButton from "src/components/AppButton";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import { useAppStore } from "src/models/ReduxStore";
import database from "@react-native-firebase/database";
import env from "res/env";
import Header from "src/components/Header";
import Avatar from "src/components/Avatar";
import { BetaOnly, Session, detectURLs, makeid } from "src/commons";
import clientStorage from "core/clientStorage";
import navhelper from "core/navhelper";
import { Linking } from "react-native";
import WebDocumentPicker from "core/WebDocumentPicker";
import { Alert } from "react-native";
import storage from "@react-native-firebase/storage";
import { ActivityIndicator } from "react-native";
import types from "../../../../../../commons/globalTypes";
// import TwilioVideoCall from "./consumer/tabs/Chat/TwilioVideoCall";

interface ProNotesProps {
  to: { email: string; name: string; img: any };
}

export default function ProNotes(props: ProNotesProps) {
  const { to } = props;
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Array<any>>([]);
  const [txt, setTxt] = useState<string>("");
  const _scrollViewRef = useRef<ScrollView>();
  const _webDocumentPickerRef = useRef<WebDocumentPicker>();
  var htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

  useEffect(() => {
    let notes: Array<any> = [];

    cloud
      .getNotes({ user_email: to.email })
      .then((response: any) => {
        Object.keys(response ?? {}).map((note: any) => {
          notes.push({
            time_secs: response[note].time_secs,
            msg: response[note].msg,
          });
        });
        setNotes(notes.sort((z) => z.time_secs) as any);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveNote = async (note: any) => {
    try {
      await cloud.addNote(note);
      setNotes([...notes, note]);
      setTxt("");
    } finally {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        ref={_scrollViewRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          _scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {loading && (
          <View
            style={{
              position: "absolute",
              marginLeft: -rw(16),
              marginTop: rh(250),
              alignItems: "center",
              height: "100%",
              backgroundColor: "rgba(127,127,127,0.5)",
              width: rw(375),
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size={"large"} color="black" />
          </View>
        )}

        {!loading && (!notes || !notes.length) && (
          <Text
            style={{
              fontFamily: "Outfit",
              fontSize: fs(12),
              width: "100%",
              textAlign: "center",
            }}
          >
            No notes taken yet.
          </Text>
        )}
        {!loading &&
          notes.map(({ msg, time_secs }, i) => {
            let dateTime = moment(time_secs * 1000);
            let time = dateTime.format("hh:mm a");
            let date = moment().isSame(dateTime, "date")
              ? ""
              : dateTime.format("D MMM");

            let urlRegex = detectURLs(msg)
            return (
              <View
                key={i}
                style={{
                  width: "100%",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  marginBottom: rh(10),
                }}
              >
                <View style={{ alignItems: "flex-start" }}>
                  <View
                    style={[
                      {
                        backgroundColor: "#e9faef",
                        borderRadius: 5,
                        width: rw(340),
                      },
                    ]}
                  >
                    <Text
                      style={{
                        flex: 1,
                        flexWrap: "wrap",
                        fontFamily: "Outfit",
                        fontWeight: "400",
                        fontSize: fs(16),
                        color: urlRegex?.length ? "blue": "black",
                        marginVertical: rh(10),
                        marginHorizontal: rw(10),
                        textDecorationLine: urlRegex?.length ? "underline":"none",
                      }}
                      onPress={()=>{
                        !!urlRegex?.length && Linking.openURL(urlRegex[0])
                      }}
                    >
                      {msg.replace(htmlRegexG,"")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Outfit",
                      fontSize: fs(12),
                      color: "#333",
                      marginTop: rh(5),
                    }}
                  >
                    {time} {date}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
      <View
        style={{
          marginLeft: -rw(16),
          width: rw(375),
          backgroundColor: "#e9faef",
          height: rh(105),
        }}
      >
        <TextInput
          placeholder="Take a note"
          placeholderTextColor="#BAC8BF"
          value={txt}
          onChangeText={(t) => setTxt(t?.trimStart())}
          style={{
            width: "100%",
            flex: 1,
            fontFamily: "Outfit",
            fontSize: fs(16),
            color: "black",
            paddingHorizontal: rw(16),
          }}
        ></TextInput>
        <WebDocumentPicker ref={_webDocumentPickerRef as any} />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View />
          <View style={{ flexDirection: "row", display: "flex" }}>
            <AppButton
              title="Add file"
              style={{
                width: rw(71),
                height: rh(30),
                marginTop: 5,
                backgroundColor: "rgba(0,0,0,0,0)",
                borderWidth: 1,
                borderColor: colors.lightGreen,
                color: colors.lightGreen,
              }}
              onPress={async () => {
                const pickerResult =
                  await _webDocumentPickerRef.current?.pickFile();

                if (
                  pickerResult?.size! > Session.configs.file_size_limit_in_bytes
                ) {
                  alert(
                    `Your file size is ${Math.round(
                      pickerResult?.size! / Math.pow(1024, 2)
                    )} MB, which is greater than the limit ${
                      Session.configs.file_size_limit_in_bytes /
                      Math.pow(1024, 2)
                    } MB.`
                  );
                  throw "File too big error";
                }
                await new Promise((r, rj) => {
                  Alert.alert(
                    "Confirm",
                    "Do you want to send " + pickerResult?.name,
                    [
                      { text: "No", onPress: r },
                      {
                        text: "Yes",
                        onPress: async () => {
                          const ref = storage().ref(
                            `chats/${makeid(5) + "_" + pickerResult?.name}`
                          );
                          try {
                            await ref.putFile(pickerResult?.uri);
                            let downloadURL = await ref.getDownloadURL();
                            const note = {
                              user_email: to.email,
                              time_secs: Math.round(
                                moment().utc().valueOf() / 1000
                              ),
                              msg: `<a href=${downloadURL} >${pickerResult?.name} </a>`,
                            };

                            await saveNote(note);
                            r();
                          } catch (e) {
                            rj(e);
                          }
                        },
                      },
                    ]
                  );
                });

                console.log(pickerResult);
              }}
            />
            <AppButton
              onPress={async () => {
                const note = {
                  user_email: to.email,
                  time_secs: Math.round(moment().utc().valueOf() / 1000),
                  msg: txt!,
                };

                saveNote(note);
              }}
              enabled={!txt ? false : undefined}
              title="Save"
              style={{
                marginTop: 5,
                width: rw(71),
                height: rh(30),
                borderWidth: 1,
                borderColor: txt ? colors.lightGreen : "#aaa",
                color: txt ? colors.lightGreen : "#aaa",
                backgroundColor: "#rgba",
              }}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

coreOptions(ProNotes, {
  useSafeAreaView: true,
  noBottomBar: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});
