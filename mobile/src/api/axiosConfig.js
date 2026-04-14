import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 routes to the host machine's localhost on Android Emulator.
// iOS Simulator can usually just use 'http://localhost:5000/api'.
// Physical device requires your actual Wi-Fi IP (e.g. 192.168.1.X:5000).
import { Platform } from 'react-native';

const getBaseUrl = () => {
  // Pointing to Production Render URL
  return 'https://bug-tracker-8rzb.onrender.com/api'; 
};

const api = axios.create({
  baseURL: getBaseUrl(), 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
