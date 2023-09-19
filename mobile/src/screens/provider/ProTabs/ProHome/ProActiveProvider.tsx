import { fs, rgba, rh, rw } from "core/designHelpers";
import Pic from "core/Pic";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import sessions_svg from "res/svgs/sessions.svg";
import no_schedule_svg from "res/svgs/no_schedule.svg";
import check_vector_svg from "res/svgs/check_vector.svg";
import gear_svg from "res/svgs/gear.svg";
import momentTz from "moment-timezone";
import { useAppStore } from "src/models/ReduxStore";
import navhelper from "core/navhelper";

const DayView = ({item}) => (
  <View
    style={{
      width: rw(300),
      height: rh(38),
      paddingTop: rh(10),
      paddingBottom: rh(10),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: rh(16),
        alignItems: "center",
      }}
    >
      {item.shiftCount > 0 && (
        <Pic
          style={{ width: rw(16), height: rh(16) }}
          source={check_vector_svg}
        />
      )}

      {(item.shiftCount === undefined ||  item.shiftCount <= 0) && (
        <Pic
          style={{ width: rw(16), height: rh(16) }}
          source={no_schedule_svg}
        />
      )}

      <Text
        style={{
          marginLeft: rw(5),
          textAlign: "center",
          fontWeight: "600",
          fontSize: fs(14),
          color: rgba(51, 51, 51, 1),
          fontFamily: "Outfit",
          fontStyle: "normal",
        }}
      >
        {item.dayName}
      </Text>
    </View>

    <Text
      style={{
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "400",
        fontSize: fs(12),
        color: rgba(128, 128, 128, 1),
        fontFamily: "Outfit",
      }}
    >
      {item.shiftCount > 0 ? item.shiftCount : '-'}
    </Text>
  </View>
);

function ProActiveProvider() {
  const daysData = [
    {
      dayName: "Sun",
      shiftCount: 0,
    },
    {
      dayName: "Mon",
      shiftCount: 0,
    },
    {
      dayName: "Tue",
      shiftCount: 0,
    },
    {
      dayName: "Wed",
      shiftCount: 0,
    },
    {
      dayName: "Thu",
      shiftCount: 0,
    },
    {
      dayName: "Fri",
      shiftCount: 0,
    },
    {
      dayName: "Sat",
      shiftCount: 0,
    },
  ];

  const provider = useAppStore((s) => s.provider);

  if (provider?.availability) {
    daysData.forEach((d) => {
      d.shiftCount = provider?.availability[d.dayName.toLocaleLowerCase()]?.length;
    });
  }

  const cards: Array<
    [icon: any, label: any, backgroudColor: any, textColor: any, value: any]
  > = [
    [sessions_svg, "Total Sessions", "#039590", "#E9FAEF", provider?.current_sessions],
    [sessions_svg, "Total Characters", "#FFFFFF", "#039590", provider?.current_msgs],
  ];

  return (
    <>
      <View
        style={{
          width: "100%",
          marginBottom: rh(30),
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {cards.map(([icon, label, backgroudColor, textColor, value]) => (
          <View
            key={label}
            style={{
              width: rw(161),
              height: rh(88),
              borderRadius: 20,
              backgroundColor: backgroudColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Outfit",
                fontWeight: "400",
                fontSize: fs(12),
                color: textColor,
                marginBottom: rh(5),
              }}
            >
              {label}
            </Text>
            <Text
              style={{
                fontFamily: "Outfit",
                fontWeight: "600",
                fontSize: fs(18),
                color: textColor,
              }}
            >
              {value || '-'}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          width: "100%",
          paddingVertical: rh(15),
          paddingHorizontal: rw(15),
          borderRadius: 20,

          borderColor: "rgba(197, 211, 206, 1)",
          borderWidth: '1px',
          borderStyle: "solid",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: rw(300),
            height: rh(16),
            padding: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "400",
              fontSize: fs(12),
              color: rgba(128, 128, 128, 1),
              fontFamily: "Outfit",
            }}
          >
            Availability
          </Text>
          <TouchableOpacity onPress={()=>navhelper.push("AvailabilityScreen")}>
          <Pic
            style={{ width: rw(14.4), height: rh(16), top: 1 }}
            source={gear_svg}
          />
          </TouchableOpacity>
        </View>

        <FlatList
          data={daysData}
          renderItem={({ item }) => <DayView item={item} />}
          keyExtractor={(item) => item.dayName}
        />

        <Text
          style={{
            fontFamily: "Outfit",
            fontWeight: "400",
            marginVertical: rh(20),
            width: "100%",
            textAlign: "center",
            fontSize: fs(12),
            color: rgba(128, 128, 128, 1),
          }}
        >
          All times are in {momentTz.tz.guess()}
        </Text>
      </View>
    </>
  );
}

export default ProActiveProvider;
