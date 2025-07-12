import { createSlice } from '@reduxjs/toolkit';

const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    serverIP: '',
    serverPort: '',
    recordings: [],
    selectedModel: '',
    models: [],
    transformedAudioUri: '',
  },
  reducers: {
    setServerIP: (state, action) => {
      state.serverIP = action.payload;
    },
    setServerPort: (state, action) => {
      state.serverPort = action.payload;
    },
    addRecording: (state, action) => {
      state.recordings.push(action.payload);
    },
    removeRecording: (state, action) => {
      state.recordings = state.recordings.filter(r => r.id !== action.payload);
    },
    setModels: (state, action) => {
      state.models = action.payload;
    },
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    setTransformedAudioUri: (state, action) => {
      state.transformedAudioUri = action.payload;
    },
  },
});

export const { setServerIP, setServerPort, addRecording, removeRecording, setModels, setSelectedModel, setTransformedAudioUri } = audioSlice.actions;
export default audioSlice.reducer;
