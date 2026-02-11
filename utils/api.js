import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://job-portal-backend-three-gamma.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // Add this for cookies
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
    
    // For multipart/form-data requests, don't set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [API] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

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
        // Store current URL for redirect back after login
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login?session_expired=true';
      }
    }

    // Handle 403 Forbidden (profile incomplete, etc.)
    if (status === 403) {
      // Check if it's a profile completion error
      if (data?.message?.toLowerCase().includes('profile')) {
        // Store current path and redirect to setup
        localStorage.setItem('returnUrl', window.location.pathname);
        window.location.href = '/account_setup';
      }
    }

    // Return a consistent error structure
    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors,
      data: data?.data,
      success: false
    });
  }
);

// Helper functions for common requests
export const apiHelpers = {
  // GET request with error handling
  async get(endpoint, config = {}) {
    try {
      const response = await api.get(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request with error handling
  async post(endpoint, data, config = {}) {
    try {
      const response = await api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request with error handling
  async put(endpoint, data, config = {}) {
    try {
      const response = await api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request with error handling
  async patch(endpoint, data, config = {}) {
    try {
      const response = await api.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request with error handling
  async delete(endpoint, config = {}) {
    try {
      const response = await api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload files with FormData
  async upload(endpoint, formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress
      };
      
      const response = await api.post(endpoint, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;