'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [screenSize, setScreenSize] = useState('desktop');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'onChange'
  });

  const password = watch('password');

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

  // Calculate password strength
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 6) strength += 25;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(Math.min(strength, 100));
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // Clear any existing auth data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
      
      console.log('=== FRONTEND REGISTRATION DATA ===');
      console.log('User Type Selected:', userType);
      
      const registrationData = {
        name: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
        role: userType,
      };
      
      console.log('Data being sent to backend:', registrationData);
      
      const result = await authService.register(registrationData);
      
      console.log('Registration successful:', result);
      
      reset();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', userType);
        if (!result.token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        console.log('📧 [RegisterPage] Stored email for verification');
      }
      
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

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="w-full no-scrollbar px-2 sm:px-3 md:px-4">
      {/* Heading with animation */}
      <div className="mb-3 sm:mb-4 animate-fadeInDown">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create account
          </h1>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
          Already have account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600">
            Log In
          </Link>
        </p>
      </div>

      {/* Server Error Display with animation */}
      {serverError && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
          <p className="text-[10px] sm:text-xs text-red-600 flex items-center gap-1 sm:gap-2">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-600 rounded-full animate-pulse"></span>
            {serverError}
          </p>
        </div>
      )}

      {/* User Type Selection */}
      <div className="mb-4 sm:mb-5 md:mb-6 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        <p className="text-[8px] sm:text-[10px] md:text-xs font-semibold text-gray-600 mb-1 sm:mb-2 uppercase tracking-wide flex items-center gap-1 sm:gap-2">
          <span className="w-1 h-3 sm:h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
          {screenSize === 'mobile' ? 'Register as:' : 'I want to register as:'}
        </p>

        <div className="flex bg-gray-100/80 p-1 rounded-lg sm:rounded-xl backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setUserType('candidate')}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 md:py-3 rounded-lg
              text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105
              ${
                userType === 'candidate'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
          >
            <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Candidate</span>
            <span className="xs:hidden">Job</span>
            {userType === 'candidate' && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 animate-bounceIn" />}
          </button>

          <button
            type="button"
            onClick={() => setUserType('employer')}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 md:py-3 rounded-lg
              text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105
              ${
                userType === 'employer'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
          >
            <BuildingOffice2Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Employer</span>
            <span className="xs:hidden">Emp</span>
            {userType === 'employer' && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 animate-bounceIn" />}
          </button>
        </div>
        
        {/* Role indicator */}
        <div className="mt-2 sm:mt-3 text-center animate-scaleIn">
          <span className={`inline-flex items-center px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium transition-all duration-300 ${
            userType === 'candidate' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
          }`}>
            {userType === 'candidate' ? (
              <>
                <UserIcon className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 animate-pulse" />
                {screenSize === 'mobile' ? 'Job Seeker' : 'Creating Job Seeker Account'}
              </>
            ) : (
              <>
                <BuildingOffice2Icon className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 animate-pulse" />
                {screenSize === 'mobile' ? 'Employer' : 'Creating Employer Account'}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
        {/* Full Name & Username */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <label className="block text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              placeholder={screenSize === 'mobile' ? "Full name" : "John Doe"}
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.fullName.message}</p>
            )}
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '250ms' }}>
            <label className="block text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              Username <span className="text-red-500">*</span>
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
              placeholder={screenSize === 'mobile' ? "Username" : "johndoe123"}
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.username.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <label className="block text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            Email Address <span className="text-red-500">*</span>
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
            placeholder={screenSize === 'mobile' ? "Email" : "john@example.com"}
            className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="animate-fadeInUp" style={{ animationDelay: '350ms' }}>
          <label className="block text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            Password <span className="text-red-500">*</span>
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
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 sm:pr-10 transition-all duration-300 hover:border-blue-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={screenSize === 'mobile' ? 14 : 16} /> : <Eye size={screenSize === 'mobile' ? 14 : 16} />}
            </button>
          </div>
          
          {/* Password strength meter */}
          {password && (
            <div className="mt-1 sm:mt-2 animate-slideDown">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex-1 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-500`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <span className={`text-[8px] sm:text-[10px] font-medium ${
                  passwordStrength < 40 ? 'text-red-500' : 
                  passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {getStrengthText()}
                </span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <label className="block text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || "Passwords do not match",
              })}
              placeholder="••••••••"
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 sm:pr-10 transition-all duration-300 hover:border-blue-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={screenSize === 'mobile' ? 14 : 16} /> : <Eye size={screenSize === 'mobile' ? 14 : 16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Hidden role field */}
        <input type="hidden" {...register('role')} value={userType} />

        {/* Terms */}
        <div className="pt-1 sm:pt-2 animate-fadeInUp" style={{ animationDelay: '450ms' }}>
          <label className="flex items-start gap-1 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs text-gray-700 cursor-pointer group">
            <input 
              type="checkbox" 
              {...register('agreeTerms', { required: 'You must agree to the terms' })} 
              className="mt-0.5 w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer transition-transform duration-300 group-hover:scale-110"
              disabled={isLoading}
            />
            <span className="group-hover:text-gray-900 transition-colors duration-300">
              {screenSize === 'mobile' ? (
                <>I agree to the <Link href="/terms" className="text-blue-600 font-medium">Terms</Link></>
              ) : (
                <>I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600">
                    Privacy Policy
                  </Link>
                </>
              )}
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[8px] sm:text-[10px] text-red-500 mt-1 animate-shake">{errors.agreeTerms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`relative w-full py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-5 md:mt-6 overflow-hidden group animate-fadeInUp ${
            userType === 'employer' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
          } text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
          style={{ animationDelay: '500ms' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="hidden sm:inline">Creating {userType === 'employer' ? 'Employer' : 'Candidate'} Account...</span>
              <span className="sm:hidden">Creating...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Create {userType === 'employer' ? 'Employer' : 'Candidate'} Account</span>
              <span className="sm:hidden">Create</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          )}
        </button>
      </form>

      {/* Important Notice */}
      <div className="mt-4 sm:mt-5 md:mt-6 p-2 sm:p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 animate-fadeInUp" style={{ animationDelay: '550ms' }}>
        <p className="text-[8px] sm:text-[10px] md:text-xs text-blue-700 text-center flex items-center justify-center gap-1 sm:gap-2">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 animate-pulse" />
          {screenSize === 'mobile' ? (
            <>Verify email after registration</>
          ) : (
            <>After registration, you'll need to <strong>verify your email</strong> before logging in.</>
          )}
        </p>
      </div>

      {/* Divider */}
      <div className="mt-4 sm:mt-5 md:mt-6 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
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
        
        {/* SocialButtons with animation */}
        <div className="mt-3 sm:mt-4 animate-fadeInUp" style={{ animationDelay: '650ms' }}>
          <SocialButtons type="signup" userType={userType} />
        </div>
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}