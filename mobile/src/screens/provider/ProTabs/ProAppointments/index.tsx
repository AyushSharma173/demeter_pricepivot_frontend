import StyleSheetRW from "core/StyleSheetRW";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  Text,
  Image,
  View,
} from "react-native";
import { fs, rgba, rh, rw } from "core/designHelpers";
import navhelper from "core/navhelper";
import { TouchableOpacity } from "react-native";
import { coreOptions } from "core/core";
import ConHeader from "src/components/ConHeader";

import colors from "res/colors";

import { Navigation } from "react-native-navigation";

import { BlurView } from "@react-native-community/blur";

import gear_svg from "res/svgs/gear.svg";
import chat from "res/svgs/chat.svg";
import call from "res/svgs/call.svg";
import deleteIcon from "res/svgs/delete.svg";

import cloud from "src/cloud";
import moment from "moment";
import { Alert } from "react-native";
import { FlatList } from "react-native";
import Pic from "core/Pic";
import Avatar from "src/components/Avatar";
import { BetaOnly } from "src/commons";

interface ProAppointmentProps {
  componentId: any;
}

function BorderButton({ title, icon, style, iconStyle, onPress }: any) {
  const [loading,setLoading]=useState(false)
  return (
    <TouchableOpacity 
    onPress={async ()=>{ 
      setLoading(true);
    try {
      onPress && await onPress()
    }
    finally{
      setLoading(false)
    }
    }}
    
    disabled={loading} style={[style,{opacity:loading ? 0.5:1}]}>
      {icon && <Pic source={icon} style={iconStyle} />}

      {title && (
        <Text
          style={{
            fontFamily: "Outfit",
            fontWeight: "600",
            fontSize: fs(14),
            color: colors.darkGreen,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const AppointmentCard = ({ client, onMeetingCancel, setLoading }: any) => (
  <View
    key={client.email+client.dateTimeUTC}
    style={{
      width: "100%",
      height: rh(171),
      borderRadius: 20,
      borderColor: "#C5D3CE",
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: rgba(255, 255, 255, 0.5),
      marginTop: rh(10),
    }}
  >
    <Avatar
      source={
        client.img?.startsWith("http")
          ? { uri: client.img }
          : { uri: "data:image/png;base64," + client.img }
      }
      style={{
        width: rw(30),
        height: rh(30),
        borderRadius: rh(30),
        marginTop: rh(10),
        marginLeft: rw(10),
      }}
      name={client.full_name}
    />
    <Text
      key={"text_" + client.email}
      style={{
        width: "100%",
        height: rh(18),
        fontFamily: "Outfit",
        fontWeight: "600",
        fontSize: fs(14),
        color: rgba(51, 51, 51, 1),
        marginTop: rh(10),
        marginLeft: rw(10),
      }}
    >
      Call With {client.full_name}
    </Text>

    <Text
      style={{
        width: "100%",
        height: rh(18),
        fontFamily: "Outfit",
        fontWeight: "400",
        fontSize: fs(12),
        color: rgba(3, 149, 144, 1),
        marginTop: rh(10),
        marginLeft: rw(10),
      }}
    >
      {client.dateTimeLocal}
    </Text>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: rh(10),
        marginBottom: rh(10),
        marginLeft: rw(10),
        marginRight: rw(10),
        height: rh(48),
      }}
    >
      <BorderButton
        icon={deleteIcon}
        style={{
          borderWidth: 2,
          borderColor: "#2F4858",
          borderRadius: 20,
          width: rw(56),
          height: rh(48),
          alignItems: "center",
          justifyContent: "center",
        }}
        iconStyle={{ height: 16, width: 16 }}
        onPress={() => {
          Alert.alert("Cancel?", "Do you want to cancel this call?", [
            {
              text: "No",
            },
            {
              text: "Yes",
              onPress: () => {
                setLoading(true);
                cloud
                  .cancelMeeting({
                    bookingId: client?.bookingId!,
                    dateTimeUTC: client.dateTimeUTC,
                  })
                  .then(() => {
                    onMeetingCancel(client);
                  })
                  .finally(() => setLoading(false));
              },
            },
          ]);
        }}
      />

      <BorderButton
        icon={chat}
        style={{
          borderWidth: 2,
          borderColor: "#2F4858",
          borderRadius: 20,
          width: rw(56),
          height: rh(48),
          alignItems: "center",
          justifyContent: "center",
        }}
        iconStyle={{ height: 16, width: 16 }}
        onPress={() =>
          navhelper.push("ProClientInteraction", {
            to: {
              email: client.email,
              name: client.full_name,
              img: client.img,
            },
          })
        }
      />

      <BorderButton
        title="Join"
        icon={call}
        style={{
          width: rw(122),
          height: rh(48),
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 24,
          borderWidth: rh(2),
          borderColor: colors.darkGreen,
        }}
        iconStyle={{ height: rh(13.2), width: rw(13.2), marginRight: rw(10) }}
        onPress={async () => {
          await cloud.twilio.getToken({ to: client.email }).then((x) => {
            if (x.token) {
              if (Platform.OS != "web") {
                //activeCallToken=x.token
                //setJoined(true)
              } else {
                navhelper.push("TwilioVideoCall",{
                  token:x.token, 
                  is_provider: true,
                  to:client
                })
              }
            }
          });
        }}
      />
    </View>
  </View>
);

export default function ProAppointments(props: ProAppointmentProps) {
  const [loading, setLoading] = useState(true);
  const [clientMeetings, setClientMeetings] = useState([]);
  const onFocus = () => {
    let client_meetings: Array<any> = [];
    cloud.providers
      .getClients()
      .then((response: any) => {
        response.map((client: any) => {
          Object.keys(client.meetings || {}).map((key) => {
            let localTime = moment.utc(key).local();
            client_meetings.push({
              dateTimeUTC: key,
              dateTimeLocal:
                localTime.format("ddd D MMM, hh:mm a") +
                " - " +
                localTime.add(1, "hour").format("hh:mm a"),
              full_name: client.full_name,
              email: client.email,
              img: client.img,
              bookingId: client.meetings[key]?.bookingId,
              isTrialBooking: client.meetings[key]?.is_trial,
            });
          });
        });
        setClientMeetings(client_meetings.sort((z) => z.dateTimeUTC) as any);
      })
      .finally(() => setLoading(false));
  };

  const handleMeetingCancel = (client: any) => {
    clientMeetings.splice(clientMeetings.indexOf(client), 1);
    setClientMeetings([...clientMeetings]);
  };

  useEffect(() => {
    if (Platform.OS != "web") {
      let s = Navigation.events().registerComponentDidAppearListener((x) => {
        if (x.componentId == props.componentId) {
          onFocus();
        }
      });

      return () => s.remove();
    } else{ onFocus()};
  }, []);

  return (
    <>
      <ConHeader
        title="Appointments"
        rightComponent={() => (
          <Image
            style={{ height: rh(40), width: rh(40), borderRadius: 100 }}
            source={{ uri: gear_svg }}
          />
        )}
      />

      {loading && (
        <View
          style={{
            position: "absolute",
            marginLeft: -rw(16),
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

      {!clientMeetings.length && !loading && (
        <Text
          style={{
            marginTop: rh(15),
            textAlign: "center",
            fontWeight: "400",
            fontSize: fs(15),
            color: rgba(51, 51, 51, 1),
            fontFamily: "Outfit",
          }}
        >
          No appointments
        </Text>
      )}

      <FlatList
        data={clientMeetings}
        renderItem={({ item }) => (
          <AppointmentCard
            client={item}
            onMeetingCancel={handleMeetingCancel}
            setLoading={setLoading}
          />
        )}
        keyExtractor={(item: any) => item.dateTimeUTC}
      />
    </>
  );
}

function Card(item: any) {
  const onTrial = item.onTrial;
  const name = onTrial
    ? item.name.slice(0, 1) + new Array(item.name.length - 1).join("*")
    : item.name;
  const [loading, setLoading] = useState(true);
  return (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS == "web" && onTrial) {
          alert(
            "Please buy a subscription to get started. Goto Menu->Manage Subscription to select a subscription of your own choice"
          );
        } else
          navhelper.push("ProfDetailsScreen", {
            provider: item,
            onTrial,
          });
      }}
    >
      <ImageBackground
        source={{ uri: item.img }}
        style={{
          width: rw(343),
          height: rh(343),
          borderRadius: 15,
          marginBottom: rh(15),
          overflow: "hidden",
        }}
        // onLoadStart={()=>setLoading(true)}
        onLoad={() => setLoading(false)}
      >
        {onTrial && (
          <BlurView
            pointerEvents="none"
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
        )}
        <View
          style={{
            marginHorizontal: rw(20),
            marginVertical: rh(20),
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={styles.recomendedContainer}>
            <Text
              style={{
                flex: 0,
                //height:fs(16)*1.4,
                fontFamily: "Outfit",
                fontSize: fs(16),
                fontWeight: "400",
                color: colors.darkGreen,
              }}
            >
              Recommended
            </Text>
          </View>
          <View>
            <Text
              style={{
                flex: 0,
                fontFamily: "Outfit",
                fontSize: fs(18),
                fontWeight: "400",
                color: "white",
                marginBottom: rh(5),
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                flex: 0,
                fontFamily: "Outfit",
                fontSize: fs(16),
                fontWeight: "400",
                color: colors.lightGreen,
              }}
            >
              By {name}
            </Text>
          </View>
        </View>
        {loading && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <ActivityIndicator size={"large"} color="black" />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

coreOptions(ProAppointments, {
  useSafeAreaView: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});

const styles = StyleSheetRW.create(() => ({
  recomendedContainer: {
    borderRadius: 14,
    overflow: "hidden",
    flex: 0,
    backgroundColor: "white",
    paddingHorizontal: rw(10),
    paddingVertical: rh(5),
    flexDirection: "row",
    alignSelf: "flex-start",
    minHeight: fs(16) * (Platform.OS == "web" ? 1.5 : 1.4),
    alignItems: "flex-start",
  },
  subHeading: {
    fontFamily: "Outfit",
    fontWeight: "400",
    fontSize: fs(12),
    color: "#888",
    marginBottom: rh(5),
  },
}));
