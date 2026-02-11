"use client";

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
      console.log('🔐 [USER SLICE] User attempting login');
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
      
      // Also keep in localStorage for backward compatibility
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      console.log('✅ [USER SLICE] Login successful, user data stored');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      console.error('❌ [USER SLICE] Login failed:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚪 [USER SLICE] User logging out');
      authService.logout();
      clearUserCookies();
      
      // Clear localStorage as well
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
      }
      
      console.log('✅ [USER SLICE] Logout successful');
      return null;
    } catch (error) {
      console.error('❌ [USER SLICE] Logout failed:', error);
      return rejectWithValue('Logout failed');
    }
  }
);

// Async thunk for loading user from storage
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 [USER SLICE] Loading user from storage');
      
      // Only run on client side
      if (typeof window === 'undefined') {
        console.log('🌐 [USER SLICE] Server-side, returning null');
        return null;
      }

      // Check cookies first
      const userFromCookies = getUserFromCookies();
      
      if (userFromCookies) {
        return {
          ...userFromCookies,
          isAuthenticated: true,
        };
      }
      
      // Fallback to localStorage (for backward compatibility)
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          const userData = {
            ...user,
            token,
            isAuthenticated: true,
            lastUpdated: new Date().toISOString(),
          };
          
          // Migrate to cookies
          setUserCookies(userData);
          console.log('✅ [USER SLICE] User loaded from localStorage and migrated to cookies');
          return userData;
        } catch (parseError) {
          console.error('❌ [USER SLICE] Error parsing user from localStorage:', parseError);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          clearUserCookies();
          return null;
        }
      }
      
      // No user found
      console.log('❌ [USER SLICE] No auth data found in storage');
      return null;
    } catch (error) {
      console.error('❌ [USER SLICE] General error loading user:', error);
      // Clear all auth data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      clearUserCookies();
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

// Async thunk for refreshing user data - FIXED
export const refreshUserData = createAsyncThunk(
  'user/refreshData',
  async (_, { rejectWithValue, getState }) => {
    try {
      console.log('🔄 [USER SLICE] Refreshing user data');
      
      // Get current state
      const state = getState();
      const currentUserId = state.user.user?.id;
      
      if (!currentUserId) {
        console.log('❌ [USER SLICE] No user ID found');
        return rejectWithValue('No user ID found');
      }
      
      try {
        // Fetch fresh user data from API - FIXED: Use authService.getMe()
        const response = await authService.getMe();
        
        console.log('📊 [USER SLICE] getMe response:', response);
        
        if (response?.data?.user) {
          const updatedUser = {
            ...response.data.user,
            token: state.user.token, // Keep existing token
            isAuthenticated: true,
            lastUpdated: new Date().toISOString(),
          };
          
          // Update cookies
          setUserCookies(updatedUser);
          
          console.log('✅ [USER SLICE] User data refreshed from API');
          return updatedUser;
        } else if (response?.user) {
          // Handle case where response is directly the user object
          const updatedUser = {
            ...response.user,
            token: state.user.token,
            isAuthenticated: true,
            lastUpdated: new Date().toISOString(),
          };
          
          // Update cookies
          setUserCookies(updatedUser);
          
          console.log('✅ [USER SLICE] User data refreshed from direct response');
          return updatedUser;
        } else {
          console.log('⚠️ [USER SLICE] No user data in response, falling back to storage');
          // If API returns no data, try to load from storage
          return await loadUserFromStorage()(rejectWithValue);
        }
      } catch (apiError) {
        console.error('❌ [USER SLICE] API error:', apiError);
        // If API fails, try to reload from storage
        const storageUser = await loadUserFromStorage()(rejectWithValue);
        if (storageUser) {
          return storageUser;
        }
        throw apiError;
      }
    } catch (error) {
      console.error('❌ [USER SLICE] Refresh error:', error);
      return rejectWithValue(error.message || 'Failed to refresh user data');
    }
  }
);

// Async thunk to mark profile as complete
export const markProfileAsComplete = createAsyncThunk(
  'user/markProfileComplete',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      console.log('✅ [USER SLICE] Marking profile as complete:', profileData);
      
      const state = getState();
      const currentUser = state.user.user;
      
      if (!currentUser) {
        return rejectWithValue('No user found');
      }
      
      const updatedUser = {
        ...currentUser,
        isProfileComplete: true,
        profile: profileData.profile,
        lastUpdated: new Date().toISOString(),
      };
      
      // Update cookies
      setUserCookies(updatedUser);
      
      // Also update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('profileComplete', 'true');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('❌ [USER SLICE] Mark profile complete error:', error);
      return rejectWithValue('Failed to mark profile as complete');
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
    // Update profile completion status immediately
    updateProfileCompletion: (state, action) => {
      if (state.user) {
        state.user.isProfileComplete = action.payload.isProfileComplete || true;
        state.user.profile = action.payload.profile || state.user.profile;
        state.lastUpdated = new Date().toISOString();
        
        console.log('✅ [USER SLICE] Profile completion updated in store:', {
          isProfileComplete: state.user.isProfileComplete,
          hasProfile: !!state.user.profile
        });
        
        // Update cookies
        if (typeof window !== 'undefined') {
          const updatedUserData = {
            user: state.user,
            token: state.token,
            role: state.role,
          };
          setUserCookies(updatedUserData);
          
          // Also update localStorage
          localStorage.setItem('user', JSON.stringify(state.user));
          localStorage.setItem('profileComplete', 'true');
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
        console.log('✅ [USER SLICE] Login state updated');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        console.log('❌ [USER SLICE] Login rejected:', action.payload);
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
        console.log('✅ [USER SLICE] Logout state updated');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('❌ [USER SLICE] Logout rejected:', action.payload);
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
          console.log('✅ [USER SLICE] User loaded from storage');
        } else {
          state.user = null;
          state.token = null;
          state.role = null;
          state.isAuthenticated = false;
          console.log('❌ [USER SLICE] No user found in storage');
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        console.log('❌ [USER SLICE] Load user rejected:', action.payload);
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
      })
      
      // Refresh user data cases - FIXED
      .addCase(refreshUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.token = action.payload.token || state.token;
          state.role = action.payload.role;
          state.isAuthenticated = true;
          state.lastUpdated = new Date().toISOString();
          console.log('✅ [USER SLICE] User data refreshed and updated in store');
        }
      })
      .addCase(refreshUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('❌ [USER SLICE] Refresh failed:', action.payload);
      })
      
      // Mark profile as complete cases
      .addCase(markProfileAsComplete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markProfileAsComplete.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.lastUpdated = new Date().toISOString();
          console.log('✅ [USER SLICE] Profile marked as complete in store');
        }
      })
      .addCase(markProfileAsComplete.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('❌ [USER SLICE] Mark profile complete failed:', action.payload);
      });
  },
});

// Export actions
export const { 
  setUser, 
  clearUser, 
  setError, 
  clearError, 
  updateUserData,
  updateProfileCompletion 
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