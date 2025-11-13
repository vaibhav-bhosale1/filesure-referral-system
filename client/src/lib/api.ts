import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://filesure-referral-system-d0vy.onrender.com/api', // Our backend URL
  withCredentials: true, // Allows cookies to be sent
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem('auth-token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;