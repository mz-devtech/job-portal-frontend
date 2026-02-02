'use client';

import React from 'react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { authService } from '@/services/authService';

const SocialButtons = ({ type = 'signup', userType = 'candidate' }) => {
  const isSignup = type === 'signup';

  const handleGoogleAuth = () => {
    if (isSignup) {
      authService.googleSignup(userType);
    } else {
      authService.googleAuth(userType);
    }
  };

  const handleFacebookAuth = () => {
    if (isSignup) {
      authService.facebookSignup(userType);
    } else {
      authService.facebookAuth(userType);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-gray-200">
      {/* OR */}
      <div className="flex items-center justify-center mb-4">
        <span className="text-xs text-gray-500 font-medium uppercase">
          OR
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Facebook */}
        <button
          type="button"
          onClick={handleFacebookAuth}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors hover:border-blue-500"
        >
          <FaFacebookF className="text-blue-600 text-lg" />
          <span>
            {isSignup ? 'Sign up with Facebook' : 'Sign in with Facebook'}
          </span>
        </button>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors hover:border-red-500"
        >
          <FaGoogle className="text-red-500 text-lg" />
          <span>
            {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </button>
      </div>
      
      <p className="mt-3 text-center text-xs text-gray-500">
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </div>
  );
};

export default SocialButtons;