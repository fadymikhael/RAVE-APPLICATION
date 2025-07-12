import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AudioPlayer from "./AudioPlayer";
import { useDispatch } from "react-redux";
import { removeRecording } from "../store/audioSlice";
import CustomButton from "./CustomButton";

export default function RecordingItem({ recording }) {
  const dispatch = useDispatch();

  // RENDER RECORDING ITEM ROW WITH NAME, PLAYER, AND DELETE BUTTON
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{recording.name}</Text>
      </View>
      <AudioPlayer uri={recording.uri} />
      <CustomButton
        title="Delete"
        color="#ef4444"
        style={styles.btn}
        onPress={() => dispatch(removeRecording(recording.id))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  name: {
    fontWeight: "500",
    fontSize: 16,
    color: "#111",
    marginRight: 7,
    flex: 1,
  },
  btn: {
    minWidth: 85,
    paddingHorizontal: 12,
    marginLeft: 4,
  },
});
