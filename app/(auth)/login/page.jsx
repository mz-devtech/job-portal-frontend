'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, LogIn, Sparkles, ArrowRight, Mail, Lock, CheckCircle } from 'lucide-react';
import SocialButtons from '@/components/SocialButtons';
import { loginUser, selectIsLoading, selectError, clearError } from '@/redux/slices/userSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState('');
  const [screenSize, setScreenSize] = useState('desktop');

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width >= 640 && width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange'
  });

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    
    if (typeof window !== 'undefined') {
      const hasVerificationEmail = localStorage.getItem('userEmail');
      if (hasVerificationEmail) {
        console.log('ℹ️ User needs to verify email before logging in');
      }
      
      // Check if user just verified email
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('verified') === 'true') {
        console.log('✅ User just verified email, can now login');
        setVerifiedMessage('Email verified successfully! You can now login.');
        
        // Remove the query parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      console.log('🔐 [LoginPage] User attempting login');
      setLoginSuccess(true);
      
      const result = await dispatch(loginUser(data)).unwrap();
      
      // Check if login was successful
      if (result?.isAuthenticated) {
        console.log('✅ [LoginPage] Login successful');
        
        // Clear verification email if it exists
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userEmail');
        }
        
        // Redirect based on user role
        const userRole = result.role || result.user?.role;
        console.log(`📍 [LoginPage] Redirecting ${userRole} user`);
        
        // Add a small delay to show success message
        setTimeout(() => {
          if (userRole === 'admin') {
            router.push('/');
          } else if (userRole === 'employer') {
            router.push('/');
          } else {
            router.push('/'); // Default for candidates
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ [LoginPage] Login error:', error);
      setLoginSuccess(false);
      // Error is already handled in the slice
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-3 sm:px-4 md:px-0">
      {/* Header with animation */}
      <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8 text-center animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-2 sm:mb-3 md:mb-4 group hover:scale-110 transition-transform duration-300">
          <LogIn className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
          Welcome Back
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
        </h1>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
          {screenSize === 'mobile' ? "New here?" : "Don't have an account?"}{' '}
          <Link 
            href="/register" 
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600 inline-flex items-center gap-1 group"
          >
            <span className="hidden sm:inline">Create Account</span>
            <span className="sm:hidden">Sign up</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </p>
      </div>

      {/* Verified Message */}
      {verifiedMessage && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl animate-slideDown">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 animate-bounceIn" />
              <div className="absolute -inset-1 bg-green-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <p className="text-[10px] sm:text-xs text-green-700">{verifiedMessage}</p>
          </div>
        </div>
      )}

      {/* Display Redux error */}
      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-shake">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-600 rounded-full animate-pulse"></div>
            <p className="text-[10px] sm:text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        {/* Email Field */}
        <div className="group">
          <label htmlFor="email" className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            {screenSize === 'mobile' ? 'Email' : 'Email address'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 ${
                errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
              placeholder={screenSize === 'mobile' ? "Email" : "john@example.com"}
            />
            {!errors.email && isDirty && (
              <CheckCircle className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-scaleIn" />
            )}
          </div>
          {errors.email && (
            <p className="mt-1 text-[8px] sm:text-[10px] text-red-600 flex items-center gap-1 animate-shake">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="group">
          <label htmlFor="password" className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 pr-8 sm:pr-10 ${
                errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              {showPassword ? <EyeOff size={screenSize === 'mobile' ? 16 : 18} /> : <Eye size={screenSize === 'mobile' ? 16 : 18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[8px] sm:text-[10px] text-red-600 flex items-center gap-1 animate-shake">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 sm:gap-2 cursor-pointer group">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-[10px] sm:text-xs text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              Remember me
            </span>
          </label>

          <Link 
            href="/forgot-password" 
            className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600"
          >
            {screenSize === 'mobile' ? 'Forgot?' : 'Forgot password?'}
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl overflow-hidden group mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="hidden sm:inline">Signing in...</span>
              <span className="sm:hidden">Signing in</span>
            </span>
          ) : loginSuccess ? (
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 animate-bounceIn" />
              <span className="hidden sm:inline">Login Successful!</span>
              <span className="sm:hidden">Success!</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Sign in</span>
              <span className="sm:hidden">Login</span>
              <LogIn className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          )}
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-[8px] sm:text-[10px] md:text-xs">
            <span className="px-2 sm:px-4 bg-white text-gray-500 flex items-center gap-1 sm:gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              {screenSize === 'mobile' ? 'Or continue with' : 'Or continue with'}
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            </span>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 transform transition-all duration-500 hover:scale-105">
          <SocialButtons type="signin" />
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-4 sm:mt-5 md:mt-6 text-center">
        <p className="text-[8px] sm:text-[10px] text-gray-500 flex items-center justify-center gap-1 sm:gap-2">
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
          <span className="hidden sm:inline">Protected by industry-leading security</span>
          <span className="sm:hidden">Secure login</span>
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Shield component for security note
function Shield(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}