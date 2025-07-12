import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import { addRecording } from "../store/audioSlice";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";

export default function AudioRecorder() {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.audio.recordings);
  const [recording, setRecording] = useState(null);

  // AUTO-INCREMENTED DEFAULT NAME
  const defaultName = `Recording ${recordings.length + 1}`;
  const [fileName, setFileName] = useState(defaultName);

  // UPDATE DEFAULT NAME WHEN RECORDINGS COUNT CHANGES AND NOT EDITING
  React.useEffect(() => {
    if (!recording) setFileName(`Recording ${recordings.length + 1}`);
  }, [recordings.length, recording]);

  // START AUDIO RECORDING
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      Alert.alert("Error", "Unable to start recording");
    }
  };

  // STOP AUDIO RECORDING AND SAVE FILE
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      const finalName =
        fileName && fileName.trim() !== "" ? fileName : defaultName;
      const dest = `${FileSystem.documentDirectory}${finalName.replace(
        /\s/g,
        "_"
      )}_${Date.now()}.wav`;
      await FileSystem.moveAsync({ from: uri, to: dest });
      dispatch(
        addRecording({ id: Date.now().toString(), name: finalName, uri: dest })
      );
      setFileName(`Recording ${recordings.length + 2}`);
    } catch (err) {
      Alert.alert("Error", "Problem while stopping recording");
    }
  };

  // RENDER INPUT AND BUTTON
  return (
    <View>
      <CustomInput
        placeholder="File name"
        value={fileName}
        onChangeText={setFileName}
      />
      <CustomButton
        title={recording ? "Stop" : "Record"}
        color={recording ? "#ef4444" : "#1976d2"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
}
