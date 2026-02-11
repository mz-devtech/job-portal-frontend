'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/authService';

export const useRequireProfile = () => {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          return;
        }

        // Get user role
        const user = authService.getCurrentUser();
        if (!user || user.role === 'admin') {
          return; // Admins don't need profile
        }

        // Check if already on setup page
        const currentPath = window.location.pathname;
        if (currentPath.includes('/account_setup') || 
            currentPath.includes('/login') || 
            currentPath.includes('/register')) {
          return;
        }

        // Check profile completion
        const result = await profileService.shouldCompleteProfile();
        
        if (result.needsCompletion) {
          // Store current path to redirect back after setup
          localStorage.setItem('returnUrl', currentPath);
          
          // Redirect to setup page
          router.push('/account-setup');
        }
      } catch (error) {
        console.error('Profile check error:', error);
      }
    };

    checkProfile();
  }, [router]);
};

// Higher Order Component for pages
export const withProfileRequired = (Component) => {
  const WrappedComponent = (props) => {
    useRequireProfile();
    return <Component {...props} />;
  };

  // Copy display name for debugging
  WrappedComponent.displayName = `withProfileRequired(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

// Component wrapper for specific sections
export const ProfileRequired = ({ children }) => {
  useRequireProfile();
  return children;
};