import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setServerIP, setServerPort } from '../store/audioSlice';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';

// INITIALIZE COMPONENT STATE AND REDUX
export default function HomeScreen() {
  const dispatch = useDispatch();
  const serverIP = useSelector(state => state.audio.serverIP);
  const serverPort = useSelector(state => state.audio.serverPort);

  const [ip, setIp] = useState(serverIP || '');
  const [port, setPort] = useState(serverPort || '');
  const [isConnected, setIsConnected] = useState(false);

  // TEST SERVER CONNECTION
  const handleTestConnection = async () => {
    Keyboard.dismiss();
    try {
      const res = await fetch(`http://${ip}:${port}/`, { timeout: 3000 });
      const text = await res.text();
      if (text.toLowerCase().includes('success')) {
        setIsConnected(true);
        dispatch(setServerIP(ip));
        dispatch(setServerPort(port));
        Alert.alert('Success', 'Connected to server: ' + text);
      } else {
        setIsConnected(false);
        Alert.alert('Error', 'Server responded: ' + text);
      }
    } catch (err) {
      setIsConnected(false);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  // DISCONNECT FROM SERVER
  const handleDisconnect = () => {
    setIp('');
    setPort('');
    setIsConnected(false);
    dispatch(setServerIP(''));
    dispatch(setServerPort(''));
  };

  const connectionStatus = !!(isConnected && ip && port);

  // RENDER UI
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Card>
          <Text style={styles.title}>Connect to RAVE Server</Text>
          {/* SERVER IP INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Server IP Address (e.g., 192.168.1.38)"
            placeholderTextColor="#6b7280"
            value={ip}
            onChangeText={setIp}
            keyboardType="numbers-and-punctuation"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            editable={!connectionStatus}
          />
          {/* SERVER PORT INPUT */}
          <TextInput
            style={styles.input}
            placeholder="Server Port (e.g., 8000)"
            placeholderTextColor="#6b7280"
            value={port}
            onChangeText={setPort}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            editable={!connectionStatus}
          />
          {/* CONNECTION BUTTONS */}
          <View style={styles.buttonRow}>
            <CustomButton
              title="Test Connection"
              onPress={handleTestConnection}
              disabled={connectionStatus}
              color="#1e40af"
              style={styles.btnSmall}
            />
            {connectionStatus && (
              <CustomButton
                title="Disconnect"
                onPress={handleDisconnect}
                color="#dc2626"
                style={styles.btnSmall}
              />
            )}
          </View>
          {/* CONNECTION STATUS */}
          <View style={styles.statusRow}>
            <Text style={[styles.status, connectionStatus ? styles.connected : styles.disconnected]}>
              {connectionStatus ? 'Connected' : 'Not Connected'}
            </Text>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// DEFINE STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8effd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: '700',
    fontSize: 24,
    color: '#1e40af',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginVertical: 10,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  btnSmall: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  status: {
    fontWeight: '600',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    textAlign: 'center',
    minWidth: 140,
  },
  connected: {
    backgroundColor: '#d1fae5',
    color: '#16a34a',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  disconnected: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
});