import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  : '/api'; // This relies on the proxy in package.json

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Habits API
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  complete: (id, date) => api.post(`/habits/${id}/complete`, { date }),
  delete: (id) => api.delete(`/habits/${id}`)
};

// Time tracking API
export const timeAPI = {
  startSession: (data) => api.post('/time/start', data),
  endSession: (id) => api.put(`/time/${id}/end`),
  getSessions: (params) => api.get('/time/sessions', { params }),
  getActiveSession: () => api.get('/time/active'),
  getStats: (params) => api.get('/time/stats', { params })
};

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

export default api;
