import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/loadUserFromStorage'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['user.lastUpdated'],
      },
    }),
});

export default store;