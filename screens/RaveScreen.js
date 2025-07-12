import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setModels,
  setSelectedModel,
  setTransformedAudioUri,
} from "../store/audioSlice";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import AudioPlayer from "../components/AudioPlayer";
import Card from "../components/Card";
import CustomButton from "../components/CustomButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// IMPORT DEFAULT AUDIO SAMPLE
import sampleMp3 from "../assets/sample.mp3";

// DEFINE MODEL ICONS BASED ON MODEL NAME
function getModelIcon(model) {
  if (model.toLowerCase().includes("cat"))
    return <FontAwesome5 name="cat" size={24} color="#fff" />;
  if (model.toLowerCase().includes("dog"))
    return <FontAwesome6 name="dog" size={24} color="#fff" />;
  if (model.toLowerCase().includes("speech"))
    return <Ionicons name="chatbubbles" size={24} color="#fff" />;
  if (model.toLowerCase().includes("darbouka"))
    return <FontAwesome6 name="drum" size={24} color="#fff" />;
  if (model.toLowerCase().includes("jazz"))
    return <MaterialCommunityIcons name="saxophone" size={24} color="#fff" />;
  return <Ionicons name="musical-notes" size={24} color="#fff" />;
}

// RESOLVE URI FOR EXPO ASSET UPLOAD
async function getAudioFileUriForUpload(audio) {
  if (typeof audio.uri === "number") {
    const asset = Asset.fromModule(audio.uri);
    await asset.downloadAsync();
    const srcPath = asset.localUri || asset.uri;
    const destPath = FileSystem.cacheDirectory + "sample_upload.mp3";
    await FileSystem.copyAsync({ from: srcPath, to: destPath });
    return destPath;
  }
  return audio.uri;
}

// CHECK SERVER CONNECTIVITY
async function checkServerConnection(serverIP, serverPort) {
  try {
    const response = await fetch(`http://${serverIP}:${serverPort}/getmodels`, {
      method: "GET",
      timeout: 3000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export default function RaveScreen() {
  const serverIP = useSelector((state) => state.audio.serverIP);
  const serverPort = useSelector((state) => state.audio.serverPort);
  const models = useSelector((state) => state.audio.models);
  const selectedModel = useSelector((state) => state.audio.selectedModel);
  const recordings = useSelector((state) => state.audio.recordings);
  const transformedAudioUri = useSelector(
    (state) => state.audio.transformedAudioUri
  );

  const [audioSourceTab, setAudioSourceTab] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // DEFINE DEFAULT AUDIO LIST
  const defaultAudios = [
    { id: "default1", name: "Default Sample", uri: sampleMp3 },
  ];

  // FETCH AVAILABLE MODELS FROM SERVER
  useEffect(() => {
    if (serverIP && serverPort) {
      fetch(`http://${serverIP}:${serverPort}/getmodels`)
        .then((res) => res.json())
        .then((json) => dispatch(setModels(json.models || [])))
        .catch(() => {});
    }
  }, [serverIP, serverPort]);

  // SELECT RAVE MODEL
  const handleModelSelect = (model) => {
    fetch(`http://${serverIP}:${serverPort}/selectModel/${model}`).then(() =>
      dispatch(setSelectedModel(model))
    );
  };

  // UPLOAD AND TRANSFORM AUDIO
  const handleSend = async () => {
    if (!selectedAudio || !selectedModel) {
      Alert.alert("Error", "Select a model and an audio");
      return;
    }

    // CHECK SERVER CONNECTION BEFORE UPLOAD
    const isServerConnected = await checkServerConnection(serverIP, serverPort);
    if (!isServerConnected) {
      Alert.alert(
        "Error",
        "Server not connected. Please check the server IP and port."
      );
      return;
    }

    setLoading(true);

    let uriToSend;
    try {
      uriToSend = await getAudioFileUriForUpload(selectedAudio);
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", "Unable to prepare audio for upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: uriToSend,
      name: "audio.wav",
      type: "audio/wav",
    });

    try {
      await fetch(`http://${serverIP}:${serverPort}/upload`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const downloadUri = `${FileSystem.documentDirectory}transformed_audio.wav`;
      const downloadRes = await FileSystem.downloadAsync(
        `http://${serverIP}:${serverPort}/download`,
        downloadUri
      );
      dispatch(setTransformedAudioUri(downloadRes.uri));
      Alert.alert("Success", "Transfer completed!");
    } catch (err) {
      Alert.alert("Error", "Unable to transfer the file");
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD TRANSFORMED AUDIO
  const handleDownload = async () => {
    if (!transformedAudioUri) {
      Alert.alert("Error", "No transformed audio available to download");
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Downloading is not supported on this device");
        return;
      }

      await Sharing.shareAsync(transformedAudioUri, {
        mimeType: "audio/wav",
        dialogTitle: "Download Transformed Audio",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to download the audio");
      console.error("Download error:", error);
    }
  };

  // DETERMINE DISPLAYED AUDIO LIST BASED ON TAB
  const displayedList = audioSourceTab === 0 ? defaultAudios : recordings;

  // RENDER UI
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="magic-staff" size={36} color="#1976d2" />
        <Text style={styles.title}>RAVE: Timbre Transfer</Text>
      </View>
      <Card>
        {/* TABS FOR AUDIO SOURCE SELECTION */}
        <View style={styles.sectionTabs}>
          <TouchableOpacity
            style={[styles.tab, audioSourceTab === 0 && styles.tabActive]}
            onPress={() => {
              setAudioSourceTab(0);
              setSelectedAudio(null);
            }}
          >
            <Ionicons
              name="musical-notes"
              size={20}
              color={audioSourceTab === 0 ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.tabText,
                audioSourceTab === 0 && styles.tabTextActive,
              ]}
            >
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, audioSourceTab === 1 && styles.tabActive]}
            onPress={() => {
              setAudioSourceTab(1);
              setSelectedAudio(null);
            }}
          >
            <Ionicons
              name="mic"
              size={20}
              color={audioSourceTab === 1 ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.tabText,
                audioSourceTab === 1 && styles.tabTextActive,
              ]}
            >
              My Recordings
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>
          {audioSourceTab === 0
            ? "Choose a default sound:"
            : "Choose a recording:"}
        </Text>
        {/* DISPLAY AUDIO LIST */}
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.audioBtn,
                selectedAudio?.id === item.id && styles.audioBtnSelected,
              ]}
              onPress={() => setSelectedAudio(item)}
            >
              <Ionicons
                name={audioSourceTab === 0 ? "musical-notes" : "mic"}
                size={20}
                color={selectedAudio?.id === item.id ? "#fff" : "#fff"}
              />
              <Text
                style={[
                  styles.audioBtnText,
                  selectedAudio?.id === item.id && styles.audioBtnTextSelected,
                ]}
              >
                {item.name}
              </Text>
              <View style={{ marginLeft: 8 }}>
                <AudioPlayer uri={item.uri} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No audio available.</Text>
          }
          showsHorizontalScrollIndicator={false}
        />

        {/* DISPLAY MODEL LIST */}
        <Text style={styles.sectionTitle}>Choose a model:</Text>
        <FlatList
          data={models}
          keyExtractor={(item) => item}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.modelBtn,
                item === selectedModel && styles.modelBtnSelected,
              ]}
              onPress={() => handleModelSelect(item)}
            >
              {getModelIcon(item)}
              <Text
                style={[
                  styles.modelBtnText,
                  item === selectedModel && styles.modelBtnTextSelected,
                ]}
              >
                {item.replace(".onnx", "")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No models available.</Text>
          }
          showsHorizontalScrollIndicator={false}
        />

        {/* TRANSFER BUTTON */}
        <CustomButton
          title="Transfer and Transform"
          onPress={handleSend}
          color="#ff6d00"
          disabled={loading || !selectedAudio || !selectedModel}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color="#1976d2"
            style={{ marginVertical: 20 }}
          />
        )}
      </Card>

      {/* ORIGINAL AUDIO SECTION */}
      <Card>
        <Text style={styles.sectionTitle}>Original Audio:</Text>
        {selectedAudio ? (
          <AudioPlayer uri={selectedAudio.uri} />
        ) : (
          <Text style={styles.emptyText}>No audio selected.</Text>
        )}
      </Card>

      {/* TRANSFORMED AUDIO SECTION */}
      <Card>
        <Text style={styles.sectionTitle}>Transformed Audio:</Text>
        <View style={styles.transformedAudioContainer}>
          {transformedAudioUri ? (
            <>
              <AudioPlayer uri={transformedAudioUri} />
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={handleDownload}
              >
                <Ionicons name="download-outline" size={20} color="#fff" />
                <Text style={styles.downloadBtnText}>Download</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.emptyText}>Not yet transformed.</Text>
          )}
        </View>
      </Card>
    </SafeAreaView>
  );
}

// DEFINE STYLES
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#e8effd",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  title: {
    fontWeight: "700",
    fontSize: 28,
    color: "#1e40af",
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  sectionTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
    gap: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d1d5db",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabActive: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  tabText: {
    marginLeft: 8,
    color: "#1e40af",
    fontWeight: "600",
    fontSize: 16,
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#1e40af",
    marginVertical: 12,
    letterSpacing: 0.3,
  },
  audioBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1fd534ff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 6,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  audioBtnSelected: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  audioBtnText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#fff",
    fontSize: 16,
  },
  audioBtnTextSelected: {
    color: "#fff",
  },
  modelBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4b72e7ff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  modelBtnSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  modelBtnText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#fff",
    fontSize: 16,
  },
  modelBtnTextSelected: {
    color: "#fff",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 12,
  },
  transformedAudioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 100,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e40af",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
