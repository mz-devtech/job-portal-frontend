'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';

// Helper function to set cookies
const setUserCookies = (userData) => {
  if (typeof window === 'undefined') return;

  // Set user data in cookies (expires in 7 days)
  Cookies.set('user', JSON.stringify(userData), { 
    expires: 7, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  });
  
  // Set individual cookies for easy access
  if (userData.token) {
    Cookies.set('token', userData.token, { 
      expires: 7, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' 
    });
  }
  if (userData.role) {
    Cookies.set('userRole', userData.role, { 
      expires: 7, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' 
    });
  }
  if (userData.id) {
    Cookies.set('userId', userData.id, { 
      expires: 7, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' 
    });
  }
};

// Helper function to clear cookies
const clearUserCookies = () => {
  Cookies.remove('user');
  Cookies.remove('token');
  Cookies.remove('userRole');
  Cookies.remove('userId');
};

// Helper function to get user from cookies
const getUserFromCookies = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      return JSON.parse(userCookie);
    }
  } catch (error) {
    console.error('Error parsing user cookie:', error);
  }
  return null;
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      console.log('🔐 [USER SLICE] User attempting login');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      const response = await authService.login(credentials);
      const { token, user } = response.data || response;
      
      // Prepare user data for storage
      const userData = {
        ...user,
        token,
        isAuthenticated: true,
        lastUpdated: new Date().toISOString(),
      };
      
      // Store in cookies
      setUserCookies(userData);
      
<<<<<<< HEAD
      console.log('✅ [USER SLICE] Login successful, user data stored');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      console.error('❌ [USER SLICE] Login failed:', errorMessage);
=======
      // Also keep in localStorage for backward compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      console.log('🚪 [USER SLICE] User logging out');
      authService.logout(true);
      clearUserCookies();
      
      console.log('✅ [USER SLICE] Logout successful');
      return null;
    } catch (error) {
      console.error('❌ [USER SLICE] Logout failed:', error);
=======
      authService.logout();
      clearUserCookies();
      
      // Clear localStorage as well
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
      }
      
      return null;
    } catch (error) {
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      return rejectWithValue('Logout failed');
    }
  }
);

<<<<<<< HEAD
// Async thunk for loading user from storage - FIXED: Strict validation
=======
// Async thunk for loading user from storage
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
<<<<<<< HEAD
      console.log('🔍 [USER SLICE] Loading user from storage');
      
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('🌐 [USER SLICE] Server-side, returning null');
        return null;
      }

      // Check localStorage first
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      console.log('📊 [USER SLICE] Storage check:', {
        hasToken: !!token,
        hasUserStr: !!userStr
      });

      // If no token OR no user data, user is not authenticated
      if (!token || !userStr) {
        console.log('❌ [USER SLICE] No auth data found in localStorage');
        // Clear any partial data
        clearUserCookies();
        return null;
      }

      // Parse user data
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (parseError) {
        console.error('❌ [USER SLICE] Error parsing user:', parseError);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearUserCookies();
        return null;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          console.log('❌ [USER SLICE] Token expired');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          clearUserCookies();
          return null;
        }
      } catch (tokenError) {
        console.error('❌ [USER SLICE] Token validation error:', tokenError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearUserCookies();
        return null;
      }

      // Valid user found
      const userData = {
        ...user,
        token,
        isAuthenticated: true,
        lastUpdated: new Date().toISOString(),
      };

      // Set cookies for consistency
      setUserCookies(userData);
      
      console.log('✅ [USER SLICE] User loaded successfully from storage');
      return userData;
      
    } catch (error) {
      console.error('❌ [USER SLICE] General error loading user:', error);
      // Clear all auth data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      clearUserCookies();
=======
      // First try to get from cookies
      const userFromCookies = getUserFromCookies();
      
      if (userFromCookies) {
        return {
          ...userFromCookies,
          isAuthenticated: true,
        };
      }
      
      // Fallback to localStorage (for backward compatibility)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          const userData = {
            ...user,
            token,
            isAuthenticated: true,
          };
          
          // Migrate to cookies
          setUserCookies(userData);
          return userData;
        }
      }
      
      // No user found
      return null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      return rejectWithValue('Failed to load user data');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(userId, data);
      const updatedUser = {
        ...response.data.user,
        token: response.data.token || undefined,
        isAuthenticated: true,
        lastUpdated: new Date().toISOString(),
      };
      
      // Update cookies
      setUserCookies(updatedUser);
      
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.lastUpdated = new Date().toISOString();
      
      // Also update cookies
      if (typeof window !== 'undefined') {
        setUserCookies(action.payload);
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastUpdated = null;
      
      // Clear cookies
      clearUserCookies();
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.lastUpdated = new Date().toISOString();
        
        // Update cookies with new data
        if (typeof window !== 'undefined') {
          const updatedUserData = {
            user: state.user,
            token: state.token,
            role: state.role,
          };
          setUserCookies(updatedUserData);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.lastUpdated = new Date().toISOString();
<<<<<<< HEAD
        console.log('✅ [USER SLICE] Login state updated');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
<<<<<<< HEAD
        console.log('❌ [USER SLICE] Login rejected:', action.payload);
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.lastUpdated = null;
<<<<<<< HEAD
        console.log('✅ [USER SLICE] Logout state updated');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
<<<<<<< HEAD
        console.log('❌ [USER SLICE] Logout rejected:', action.payload);
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      })
      
      // Load user from storage cases
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.token = action.payload.token;
          state.role = action.payload.role;
          state.isAuthenticated = true;
          state.lastUpdated = new Date().toISOString();
<<<<<<< HEAD
          console.log('✅ [USER SLICE] User loaded from storage');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        } else {
          state.user = null;
          state.token = null;
          state.role = null;
          state.isAuthenticated = false;
<<<<<<< HEAD
          console.log('❌ [USER SLICE] No user found in storage');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
<<<<<<< HEAD
        console.log('❌ [USER SLICE] Load user rejected:', action.payload);
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      })
      
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token || state.token;
        state.role = action.payload.role;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { 
  setUser, 
  clearUser, 
  setError, 
  clearError, 
  updateUserData 
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectRole = (state) => state.user.role;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;
export const selectLastUpdated = (state) => state.user.lastUpdated;

export default userSlice.reducer;