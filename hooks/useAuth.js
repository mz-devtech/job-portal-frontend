'use client';

import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectToken,
  selectRole,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  loginUser,
  logoutUser,
  updateUserProfile,
  clearError,
  updateUserData,
} from '@/redux/slices/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const role = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());
  const updateProfile = (userId, data) => dispatch(updateUserProfile({ userId, data }));
  const clearAuthError = () => dispatch(clearError());
  const updateUser = (data) => dispatch(updateUserData(data));

  // Helper functions
  const isAdmin = () => role === 'admin';
  const isEmployer = () => role === 'employer';
  const isCandidate = () => role === 'candidate' || !role;
  
  const hasPermission = (requiredRole) => {
    if (!requiredRole) return true;
    return role === requiredRole;
  };

  const getUserId = () => user?.id || user?._id;
  const getUserEmail = () => user?.email;
  const getUserName = () => user?.name || user?.username;

  return {
    // State
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    error,
    
    // User info helpers
    userId: getUserId(),
    userEmail: getUserEmail(),
    userName: getUserName(),
    
    // Role helpers
    isAdmin: isAdmin(),
    isEmployer: isEmployer(),
    isCandidate: isCandidate(),
    
    // Actions
    login,
    logout,
    updateProfile,
    updateUser,
    clearError: clearAuthError,
    hasPermission,
  };
};