import { rw, fs, rh, rgba } from "core/designHelpers";
import Pic from "core/Pic";
import StyleSheetRW from "core/StyleSheetRW";
import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import rating_star_selected from "res/svgs/rating.svg";
import rating_star_not_selected from "res/svgs/rating_not_selected.svg";
import { Text, TextInputProps, View, Image } from "react-native";

export interface RatingFieldProps extends TextInputProps {
  questionCode: string;
  question: string;
  lowLabel: string;
  highLabel: string;
  onRatingChange: (question: string, value: any) => any;
}
/**
 *RatingField Component with Label and Starts to choose rating
 */
export default function RatingField({
  questionCode,
  question,
  lowLabel,
  highLabel,
  onRatingChange,
  ...props
}: RatingFieldProps) {
  const [rating, setRating] = useState(0);

  const handleRating = (value: any) => {
    console.log(value);
    setRating(value);
    onRatingChange(questionCode, value);
  };

  const renderStars = () => {
    const stars = [];
    let Comp = Platform.OS === 'web' ? Image : Pic;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRating(i)}>
          <Comp
            source={
              rating >= i ? rating_star_selected : rating_star_not_selected
            }
            style={styles.ratingstar}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.border, { height: rh(130), marginTop: rh(Platform.OS == "web" ? 20 : 30) }]}>
      <Text style={styles.text}>{question}</Text>
      <View
        style={{
          height: rh(90),
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <View style={styles.starframe}>{renderStars()}</View>
        <View style={styles.ratingTextFrame}>
          <Text
            style={{
              fontFamily: "Outfit",
              fontSize: fs(12),
              fontWeight: "400",
              color: "#808080",
            }}
          >
            {lowLabel}
          </Text>
          <Text
            style={{
              fontFamily: "Outfit",
              fontSize: fs(12),
              fontWeight: "400",
              color: "#808080",
            }}
          >
            {highLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheetRW.create(() => ({
  border: {
    borderBottomColor: rgba(51, 51, 51, 0.1),
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  ratingTextFrame: {
    height: rh(15),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingstar: {
    height: rh(40),
    width: rw(40),
    position: "relative",
  },
  starframe: {
    height: rh(40),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: rw(25),
  },
  text: {
    fontFamily: "Outfit",
    fontWeight: "600",
    fontSize: fs(14),
    color: "#333333",
    marginVertical: rh(10),
    textAlign: "left"
  }
}));
