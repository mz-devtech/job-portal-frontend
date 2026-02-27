'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Mail, Send, CheckCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import SocialButtons from '@/components/SocialButtons';
import { authService } from '@/services/authService';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    },
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto px-3 sm:px-4 md:px-0">
        {/* Success State */}
        <div className="animate-scaleIn">
          <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8">
            <Link 
              href="/login" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 group mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Back to Sign In</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>

          <div className="text-center">
            {/* Success Animation */}
            <div className="relative mx-auto w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-4 sm:mb-5 md:mb-6">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
              <div className="relative flex items-center justify-center h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mx-auto animate-bounceIn">
                <CheckCircle className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 text-green-600" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
            </div>

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2">
              {screenSize === 'mobile' ? 'Check Email' : 'Check Your Email'}
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
            </h2>

            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6 max-w-sm mx-auto">
              We've sent password reset instructions to your email address.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6 animate-slideDown">
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 flex items-center justify-center gap-1 sm:gap-2">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                {screenSize === 'mobile' ? 'Check spam folder' : "Didn't receive the email? Check your spam folder"}
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              </p>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="group inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-[10px] sm:text-xs md:text-sm"
            >
              Try again
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 animate-fadeIn animation-delay-300">
          <SocialButtons type="signin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-3 sm:px-4 md:px-0">
      {/* Header */}
      <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
          <Link 
            href="/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 group text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="hidden sm:inline">Back to Sign In</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <p className="text-[10px] sm:text-xs text-gray-600">
            {screenSize === 'mobile' ? "New?" : "New user?"}{' '}
            <Link 
              href="/register" 
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-300 underline decoration-2 decoration-transparent hover:decoration-blue-600"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-center animate-fadeInDown">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-2 sm:mb-3 md:mb-4 group hover:scale-110 transition-transform duration-300">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
            {screenSize === 'mobile' ? 'Reset Password' : 'Forgot Password'}
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 max-w-sm mx-auto">
            {screenSize === 'mobile' 
              ? 'Enter your email to reset' 
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
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
              <span className="hidden sm:inline">Sending...</span>
              <span className="sm:hidden">Sending</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Reset Password</span>
              <span className="sm:hidden">Reset</span>
              <Send className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </span>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className="mt-4 sm:mt-5 md:mt-6 text-center animate-fadeIn animation-delay-200">
        <p className="text-[8px] sm:text-[10px] text-gray-500 flex items-center justify-center gap-1 sm:gap-2">
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
          <span className="hidden sm:inline">We'll never share your email with anyone</span>
          <span className="sm:hidden">Your email is safe with us</span>
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
        </p>
      </div>

      {/* Social Login */}
      <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 animate-fadeIn animation-delay-300">
        <SocialButtons type="signin" />
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
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}