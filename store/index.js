import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './audioSlice';

const store = configureStore({
  reducer: {
    audio: audioReducer,
  },
});

export default store;
