import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // backend URL
});

// Add token to headers if exists
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
