// utils/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-three-gamma.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;
    
    // Handle specific error statuses
    if (status === 401 && typeof window !== 'undefined') {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not on auth pages
      const currentPath = window.location.pathname;
      const authRoutes = ['/login', '/register', '/verify', '/forgot-password', '/reset-password'];
      
      if (!authRoutes.some(route => currentPath.includes(route))) {
        window.location.href = '/login?session_expired=true';
      }
    }

    // Return a consistent error structure
    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors,
      data: data?.data,
    });
  }
);

export default api;