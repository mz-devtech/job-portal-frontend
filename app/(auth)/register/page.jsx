'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import SocialButtons from '@/components/SocialButtons';
import { authService } from '@/services/authService';
import { UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  // Clear any existing auth data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all auth-related data to prevent auto-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      console.log('🧹 [RegisterPage] Cleared existing auth data');
    }
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError('');
    
    try {
      console.log('=== REGISTRATION START ===');
      
      // Double-check: clear any existing auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      
      const registrationData = {
        name: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        role: userType,
      };
      
      console.log('Registration data:', registrationData);
      
      // Call registration service
      const result = await authService.register(registrationData);
      
      console.log('Registration successful:', result);
      
      // Clear form
      reset();
      
      // IMPORTANT: Store ONLY email for verification, NO token
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', userType);
        // Ensure no token is stored
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('📧 [RegisterPage] Stored email for verification, no token stored');
      }
      
      // Redirect to verification page
      setTimeout(() => {
        router.push('/verify');
      }, 500);
      
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full no-scrollbar">
      {/* Heading */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create account.
        </h1>
        <p className="text-sm text-gray-600">
          Already have account?{' '}
          <Link href="/login" className="text-blue-600 font-medium underline">
            Log In
          </Link>
        </p>
      </div>

      {/* Server Error Display */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      {/* User Type Selection */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          I want to register as:
        </p>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setUserType('candidate')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md
              text-sm font-semibold transition-all duration-200
              ${
                userType === 'candidate'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <UserIcon className="w-4 h-4" />
            Candidate
          </button>

          <button
            type="button"
            onClick={() => setUserType('employer')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md
              text-sm font-semibold transition-all duration-200
              ${
                userType === 'employer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <BuildingOffice2Icon className="w-4 h-4" />
            Employer
          </button>
        </div>
        
        {/* Role indicator */}
        <div className="mt-3 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            userType === 'candidate' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            {userType === 'candidate' ? (
              <>
                <UserIcon className="w-3 h-3 mr-1" />
                Creating Job Seeker Account
              </>
            ) : (
              <>
                <BuildingOffice2Icon className="w-3 h-3 mr-1" />
                Creating Employer Account
              </>
            )}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name & Username */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              placeholder="John Doe"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                maxLength: {
                  value: 30,
                  message: 'Username cannot exceed 30 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Only letters, numbers, and underscores allowed'
                }
              })}
              placeholder="johndoe123"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address"
              }
            })}
            placeholder="john@example.com"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || "Passwords do not match",
              })}
              placeholder="••••••••"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="pt-2">
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input 
              type="checkbox" 
              {...register('agreeTerms', { required: 'You must agree to the terms' })} 
              className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 font-medium hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 font-medium hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500 mt-1">{errors.agreeTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${
            userType === 'employer' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating {userType === 'employer' ? 'Employer' : 'Candidate'} Account...
            </span>
          ) : (
            `Create ${userType === 'employer' ? 'Employer' : 'Candidate'} Account →`
          )}
        </button>
      </form>

      {/* Important Notice */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 text-center">
          After registration, you'll need to <strong>verify your email</strong> before logging in.
        </p>
      </div>

      {/* Divider */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        {/* Pass userType to SocialButtons */}
        <div className="mt-4">
          <SocialButtons type="signup" userType={userType} />
        </div>
      </div>
    </div>
  );
}