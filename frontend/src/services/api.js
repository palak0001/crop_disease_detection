import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Ensure Authorization header is preserved even for multipart/form-data
    if (config.headers['Content-Type'] !== 'multipart/form-data') {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, username, password) =>
    api.post('/register', { email, username, password }),
  
  login: (email, password) =>
    api.post('/login', { email, password }),
};

export const predictionAPI = {
  predict: (formData) =>
    api.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getPredictions: () =>
    api.get('/predictions'),
  
  getUserStats: () =>
    api.get('/user-stats'),
};

export const reportAPI = {
  generateReport: (predictionId) =>
    api.post(`/generate-report/${predictionId}`),
  
  getReports: () =>
    api.get('/reports'),
  
  downloadReport: (reportId) =>
    api.get(`/download-report/${reportId}`, { responseType: 'blob' }),
};

export default api;
