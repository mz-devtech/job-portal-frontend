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
    <div className="w-full animate-fadeIn">
      {/* OR Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative bg-white px-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            OR
          </span>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Facebook Button */}
        <button
          type="button"
          onClick={handleFacebookAuth}
          className="group relative flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:border-blue-300 overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <FaFacebookF className="text-blue-600 text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
            {isSignup ? 'Sign up with Facebook' : 'Sign in with Facebook'}
          </span>
        </button>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="group relative flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:border-red-300 overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <FaGoogle className="text-red-500 text-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-red-500 transition-colors duration-300">
            {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </button>
      </div>
      
      {/* Terms and Privacy */}
      <p className="mt-4 text-center text-xs text-gray-400">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600">
          Privacy Policy
        </Link>
      </p>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Add Link import
import Link from 'next/link';

export default SocialButtons;