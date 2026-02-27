'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { Loader2, CheckCircle, XCircle, Sparkles, Shield, ArrowRight, User } from 'lucide-react';

// Content component that uses useSearchParams
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        
        if (!token || !userId) {
          throw new Error('Missing authentication data');
        }

        setUserRole(role);

        // Simulate progress for better UX
        const interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        // Handle the Google callback
        await authService.handleGoogleCallback({ token, userId, email, name, role });
        
        clearInterval(interval);
        setProgress(100);
        
        // Redirect to dashboard or appropriate page based on role
        setTimeout(() => {
          if (role === 'employer') {
            router.push('/');
          } else {
            router.push('/');
          }
        }, 1000);
        
      } catch (error) {
        console.error('Google callback error:', error);
        setError(error.message || 'Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative background elements - hidden on mobile */}
        {screenSize !== 'mobile' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        )}

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-7 lg:p-8 border border-gray-200/50 animate-scaleIn">
          
          {/* Logo */}
          <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-2 sm:mb-3 md:mb-4 group hover:scale-110 transition-transform duration-300">
              <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {loading ? 'Authentication' : error ? 'Authentication Failed' : 'Success!'}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
              {loading ? 'Google Sign-In' : error ? 'Please try again' : 'Google Sign-In Successful'}
            </p>
          </div>

          {/* Progress Bar (only during loading) */}
          {loading && !error && (
            <div className="mb-4 sm:mb-5 md:mb-6 animate-fadeIn">
              <div className="flex justify-between text-[8px] sm:text-xs text-gray-500 mb-1">
                <span>Setting up your account</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="text-center animate-fadeInUp">
            {loading ? (
              <>
                <div className="relative mb-4 sm:mb-5 md:mb-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 lg:h-16 lg:w-16 animate-spin text-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-blue-100 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loading messages with animation */}
                  <div className="space-y-1 sm:space-y-2 mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">
                      {screenSize === 'mobile' ? 'Signing in...' : 'Completing Sign In...'}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 animate-pulse">
                      {progress < 30 ? 'Verifying credentials...' :
                       progress < 60 ? 'Setting up your profile...' :
                       progress < 90 ? 'Almost there...' :
                       'Redirecting...'}
                    </p>
                  </div>
                </div>

                {/* Role indicator */}
                {userRole && (
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 rounded-full border border-blue-100">
                    <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
                    <span className="text-[8px] sm:text-[10px] text-blue-600 font-medium capitalize">
                      {userRole} Account
                    </span>
                  </div>
                )}
              </>
            ) : error ? (
              <>
                <div className="relative mb-4 sm:mb-5 md:mb-6">
                  <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-30"></div>
                  <div className="relative flex items-center justify-center h-14 w-14 sm:h-15 sm:w-15 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 mx-auto animate-bounceIn">
                    <XCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-red-600" />
                  </div>
                </div>
                
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Authentication Failed
                </h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4">
                  <p className="text-[10px] sm:text-xs text-red-600">{error}</p>
                </div>
                
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] text-gray-600">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                  <span className="hidden sm:inline">Redirecting to login page...</span>
                  <span className="sm:hidden">Redirecting...</span>
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-4 sm:mb-5 md:mb-6">
                  <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                  <div className="relative flex items-center justify-center h-14 w-14 sm:h-15 sm:w-15 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mx-auto animate-bounceIn">
                    <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 text-green-600" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
                </div>
                
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  Successfully Signed In!
                </h2>
                
                <p className="text-[10px] sm:text-xs text-gray-600 mb-3 sm:mb-4">
                  Welcome back! We're setting up your dashboard.
                </p>
                
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] text-gray-500">
                  <span>Redirecting</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="capitalize">{userRole || 'user'}</span>
                </div>
              </>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
            <p className="text-[8px] sm:text-[10px] text-gray-500 flex items-center justify-center gap-1 sm:gap-2">
              <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
              <span className="hidden sm:inline">Secure authentication powered by Google</span>
              <span className="sm:hidden">Secure Google auth</span>
              <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  const [screenSize, setScreenSize] = useState('desktop');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements - hidden on mobile */}
        {screenSize !== 'mobile' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        )}

        {/* Card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-7 lg:p-8 text-center">
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 lg:h-16 lg:w-16 border-3 sm:border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-blue-100 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
            {screenSize === 'mobile' ? 'Loading...' : 'Loading Authentication'}
          </h2>
          
          <p className="text-[10px] sm:text-xs text-gray-500 animate-pulse">
            {screenSize === 'mobile' ? 'Please wait...' : 'Please wait while we prepare your secure login...'}
          </p>

          {/* Progress indicator */}
          <div className="mt-4 sm:mt-5 md:mt-6 flex justify-center gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}

// Main page component with Suspense
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  );
}