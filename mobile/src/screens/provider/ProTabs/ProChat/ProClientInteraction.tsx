import { coreOptions } from "core/core";
import { fs, rgba, rh, rw } from "core/designHelpers";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import SafeAreaInsets from "src/components/SafeAreaInsets";
import Header from "src/components/Header";
import Avatar from "src/components/Avatar";
import ProIndividualChat from "./ProIndividualChat";
import StyleSheetRW from "core/StyleSheetRW";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import ProNotes from "./ProNotes";

interface ProClientInteractionProps {
  to: { email: string; name: string; img: any };
}

export default function ProClientInteraction(props: ProClientInteractionProps) {
  const { to } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [conversation_mode, setConversationMode] = useState(true);
  
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={SafeAreaInsets.BOTTOM + 10}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Header
        title={to.name}
        rightComponent={
          <Avatar
            name={to.name}
            style={{
              height: rh(40),
              width: rh(40),
              borderRadius: 100,
              alignItems: "flex-start",
            }}
            source={
              to.img?.startsWith("http")
                ? { uri: to.img }
                : { uri: "data:image/png;base64," + to.img }
            }
          />
        }
      />

      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, selectedIndex === 0 && styles.selectedButton]}
          onPress={() => {setConversationMode(true); setSelectedIndex(0);}}
        >
          <Text style={styles.buttonText}>Conversation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedIndex === 1 && styles.selectedButton]}
          onPress={() => {setConversationMode(false); setSelectedIndex(1);}}
        >
          <Text style={styles.buttonText}>Notes</Text>
        </TouchableOpacity>
      </View>

      
      <View style={{ marginTop: rh(10), height: rh(700) }}>
        {conversation_mode && <ProIndividualChat to={to} is_main_view={false} />}
          {!conversation_mode && <ProNotes to={to}/>}
      </View>

    </KeyboardAvoidingView>
  );
}

coreOptions(ProClientInteraction, {
  useSafeAreaView: true,
  noBottomBar: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});

const styles = StyleSheetRW.create(() => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: rh(5),
  },
  button: {
    flex: 1,
    height: rh(32),
    backgroundColor: rgba(118, 118, 128, 0.12),
    borderWidth: 0.5,
    borderColor: rgba(0, 0, 0, 0.04),
    borderRadius: 8,
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: rgba(233, 250, 239, 1),
    borderColor: rgba(0, 0, 0, 0.04),
  },
  buttonText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "400",
    fontSize: fs(12),
  },
}));
