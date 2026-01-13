// components/SocialButtons.jsx
import React from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

const SocialButtons = ({ type = 'signup' }) => {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaFacebook className="w-5 h-5 text-blue-600 mr-2" />
          {type === 'signup' ? 'Sign up' : 'Sign in'} with Facebook
        </button>
        <button
          type="button"
          className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaGoogle className="w-5 h-5 text-red-600 mr-2" />
          {type === 'signup' ? 'Sign up' : 'Sign in'} with Google
        </button>
      </div>
    </div>
  );
};

export default SocialButtons;