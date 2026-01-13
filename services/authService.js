// services/authService.js
import api from '@/utils/api';
import toast from 'react-hot-toast';

export const authService = {
  // Register user - Updated for 6-digit token
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Store email for verification
      if (typeof window !== 'undefined' && response.data.data?.email) {
        localStorage.setItem('userEmail', response.data.data.email);
      }
      
      toast.success('Registration successful! Check your email for the 6-digit verification code.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      
      // Special handling for email verification required
      if (error.response?.data?.requiresVerification) {
        // Store email for verification page
        if (typeof window !== 'undefined' && credentials.email) {
          localStorage.setItem('userEmail', credentials.email);
        }
        toast.error('Please verify your email first');
      } else {
        toast.error(message);
      }
      
      throw error;
    }
  },

  // Verify email with 6-digit token - MODIFIED: Don't store token
  async verifyEmail(verificationData) {
    try {
      const response = await api.post('/auth/verify-email', verificationData);
      
      // IMPORTANT: Don't store token and user automatically
      // User needs to login explicitly after verification
      
      toast.success('Email verified successfully! Please login with your credentials.');
      
      // Return data without storing token
      return {
        success: true,
        message: response.data.message,
        user: response.data.user // Return user data but don't store
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      throw error;
    }
  },

  // Resend verification code - UPDATED for 6-digit
  async resendVerification(emailData) {
    try {
      const response = await api.post('/auth/resend-verification', emailData);
      toast.success('New verification code sent to your email!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification code';
      toast.error(message);
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, passwords) {
    try {
      const response = await api.put(`/auth/reset-password/${token}`, passwords);
      toast.success('Password reset successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    }
  },

  // Get current user
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Silently handle auth errors for getMe
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  // Logout
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
    }
    toast.success('Logged out successfully!');
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Optional: Validate token expiry
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get stored email for verification
  getStoredEmail() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userEmail');
  },

  // Get stored token
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  // Update user profile
  async updateProfile(userId, data) {
    try {
      const response = await api.put(`/users/${userId}`, data);
      toast.success('Profile updated successfully!');
      
      // Update stored user data
      if (response.data.user && typeof window !== 'undefined') {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  },

  // Change password
  async changePassword(data) {
    try {
      const response = await api.put('/auth/change-password', data);
      toast.success('Password changed successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      throw error;
    }
  },

  // Check if email is verified (for protected routes)
  isEmailVerified() {
    const user = this.getCurrentUser();
    return user?.isEmailVerified || false;
  }
};