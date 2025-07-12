import React from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import AudioRecorder from "../components/AudioRecorder";
import RecordingItem from "../components/RecordingItem";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";

// RECORD SCREEN FOR AUDIO RECORDINGS
export default function RecordScreen() {
  const recordings = useSelector((state) => state.audio.recordings);

  // RENDER MAIN UI
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Ionicons name="mic" size={32} color="#1976d2" />
        <Text style={styles.title}>Audio Recording</Text>
      </View>
      <Card>
        <AudioRecorder />
      </Card>
      <Text style={styles.subtitle}>My Recordings:</Text>
      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.cardList}>
            <RecordingItem recording={item} />
          </Card>
        )}
        ListEmptyComponent={
          <Card>
            <Text style={{ textAlign: "center", color: "#888" }}>
              No recordings.
            </Text>
          </Card>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f1f5fc",
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  header: {
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    marginTop: 5,
    color: "#1976d2",
  },
  subtitle: {
    fontWeight: "600",
    fontSize: 18,
    marginVertical: 16,
    marginLeft: 8,
    color: "#4f5e76",
  },
  cardList: {
    marginVertical: 4,
    marginHorizontal: 0,
  },
});
