'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from '@/redux/slices/userSlice';

// Component to load user on mount
function UserLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <UserLoader />
      {children}
    </Provider>
  );
}