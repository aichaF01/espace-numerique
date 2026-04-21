import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'https://192.168.1.207',
  baseURL: 'http://localhost',
  headers : {
    'Content-Type' : 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;