import React, { useRef, useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";

export default function AudioPlayer({ uri }) {
  const sound = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [resolvedUri, setResolvedUri] = useState(null);

  // RESOLVE URI FOR EXPO ASSETS AND STANDARD URIS
  useEffect(() => {
    const resolveUri = async () => {
      let finalUri = uri;
      if (
        typeof uri === "number" ||
        (uri && uri.uri && typeof uri.uri === "number")
      ) {
        // HANDLE EXPO ASSET (E.G. SAMPLE MP3)
        const asset = Asset.fromModule(uri.uri || uri);
        await asset.downloadAsync();
        finalUri = asset.localUri || asset.uri;
      } else if (uri && typeof uri === "object" && uri.uri) {
        // HANDLE OBJECT WITH URI FIELD
        finalUri = uri.uri;
      } else if (typeof uri === "string") {
        // HANDLE DIRECT URI (E.G. FILE:// OR HTTP://)
        finalUri = uri;
      }
      setResolvedUri(finalUri);
    };

    resolveUri().catch((error) => {
      console.error("Error resolving URI:", error);
      setResolvedUri(null);
    });

    // CLEANUP SOUND ON UNMOUNT
    return () => {
      if (sound.current) {
        sound.current.unloadAsync().catch((error) => {
          console.error("Error unloading sound:", error);
        });
        sound.current = null;
      }
    };
  }, [uri]);

  // PLAY AUDIO FROM RESOLVED URI
  const playSound = async () => {
    if (!resolvedUri) {
      console.warn("No valid URI to play audio");
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (sound.current) {
        await sound.current.unloadAsync();
        sound.current = null;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: resolvedUri,
      });
      sound.current = newSound;
      setPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying && status.didJustFinish) {
          setPlaying(false);
        }
      });
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
      setPlaying(false);
    }
  };

  // STOP AUDIO AND RESET POSITION
  const stopSound = async () => {
    if (sound.current) {
      try {
        await sound.current.stopAsync();
        await sound.current.setPositionAsync(0); 
        setPlaying(false);
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
    }
  };

  // RENDER PLAY/STOP BUTTON
  return (
    <View style={styles.container}>
      <Button
        title={playing ? "Stop" : "Play"}
        onPress={playing ? stopSound : playSound}
        disabled={!resolvedUri}
        color="#1976d2"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 8, 
  },
});
