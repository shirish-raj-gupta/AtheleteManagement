import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically Attach Token from Local Storage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

export default axiosInstance;
