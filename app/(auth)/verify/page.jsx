'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, ArrowRight, RotateCw, Shield, Sparkles, Clock } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const inputsRef = useRef([]);

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
    // Get stored email on component mount
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      console.log('📧 [VerifyPage] Found stored email:', storedEmail);
      
      // Clear any existing token to prevent auto-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🧹 [VerifyPage] Cleared any existing auth data');
    } else {
      console.error('❌ [VerifyPage] No email found in localStorage');
      toast.error('No registration session found. Please register again.');
      setTimeout(() => router.push('/register'), 2000);
    }
    
    // Initialize refs for inputs
    inputsRef.current = inputsRef.current.slice(0, 6);
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value !== '' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    
    if (value !== '' && index === 5 && newCode.every(digit => digit !== '')) {
      handleSubmitAuto(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (code[index] !== '') {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      inputsRef.current[5]?.focus();
      setTimeout(() => handleSubmitAuto(pastedData), 100);
    } else {
      toast.error('Please paste a valid 6-digit code');
    }
  };

  const handleSubmitAuto = async (verificationCode) => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (isVerified) return;

    setIsLoading(true);

    try {
      console.log('🔄 [VerifyPage] Verifying email WITHOUT auto-login:', {
        code: verificationCode,
        email: email
      });

      // Verify email - send BOTH code and email
      const result = await authService.verifyEmail({
        code: verificationCode,
        email: email
      });

      console.log('✅ [VerifyPage] Verification successful:', result);

      setIsVerified(true);
      
      // CRITICAL: Only remove email, DO NOT set token
      localStorage.removeItem('userEmail');
      localStorage.removeItem('registerError');
      localStorage.removeItem('userRole');
      console.log('✅ [VerifyPage] Email verified, NO token stored');
      
      toast.success('Email verified successfully! Please login with your credentials.');
      
      // Redirect to login page after delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      
    } catch (error) {
      console.error('❌ [VerifyPage] Verification error:', error);
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
      toast.error(error.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    await handleSubmitAuto(verificationCode);
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    try {
      console.log('🔄 [VerifyPage] Resending code to:', email);
      await authService.resendVerification({ email });
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
      toast.success('New verification code sent to your email!');
    } catch (error) {
      console.error('❌ [VerifyPage] Resend error:', error);
      toast.error(error.message || 'Failed to resend verification code');
    }
  };

  // If no email found, show loading/redirect
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md">
          {screenSize !== 'mobile' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
          )}
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 border border-gray-200/50 text-center">
            <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 border-3 sm:border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
              Loading Verification
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-500 animate-pulse">
              Please wait while we load your verification session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
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
          
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6 md:mb-7 lg:mb-8 animate-fadeInDown">
            <div className="relative inline-block">
              <div className="flex items-center justify-center h-12 w-12 sm:h-13 sm:w-13 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mx-auto mb-3 sm:mb-4 group hover:scale-110 transition-transform duration-300">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
              {isVerified ? 'Email Verified!' : 'Verify Your Email'}
            </h2>
            
            {!isVerified && (
              <>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-1">
                  Enter the 6-digit verification code sent to
                </p>
                <p className="font-medium text-gray-900 break-words bg-blue-50 inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm">
                  {email}
                </p>
                <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs text-gray-500">
                  <Clock className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
                  <span>Code expires in 10 minutes</span>
                </div>
              </>
            )}
          </div>

          {/* Success State */}
          {isVerified ? (
            <div className="text-center animate-scaleIn">
              <div className="relative mb-4 sm:mb-5 md:mb-6">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                <div className="relative flex items-center justify-center h-16 w-16 sm:h-17 sm:w-17 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mx-auto animate-bounceIn">
                  <CheckCircle className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-green-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
              </div>
              
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4">
                Your email has been verified successfully!
              </p>
              
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs text-gray-500">
                <span>Redirecting to login</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              </div>
            </div>
          ) : (
            <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
              {/* 6-digit code input */}
              <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                  Verification Code
                </label>
                <div 
                  className="flex justify-center gap-1 sm:gap-2 md:gap-3" 
                  onPaste={handlePaste}
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => inputsRef.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading}
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 ${
                        digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ animationDelay: `${150 + index * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] md:text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                  <Mail className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <button
                  type="submit"
                  disabled={isLoading || code.some(digit => digit === '')}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl overflow-hidden group text-xs sm:text-sm"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RotateCw className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Verifying...</span>
                      <span className="sm:hidden">Verifying</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1 sm:gap-2">
                      <span className="hidden sm:inline">Verify Email</span>
                      <span className="sm:hidden">Verify</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </button>

                <div className="text-center space-y-3 sm:space-y-4">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="group text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {countdown > 0 ? (
                      <span className="flex items-center justify-center gap-1 sm:gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                        <span className="hidden sm:inline">Resend code in {countdown}s</span>
                        <span className="sm:hidden">{countdown}s</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-0.5 sm:gap-1">
                        <span className="hidden sm:inline">Didn't receive a code?</span>
                        <span className="sm:hidden">No code?</span>
                        <span className="font-medium underline decoration-2 decoration-transparent hover:decoration-blue-600 transition-all duration-300">
                          Resend
                        </span>
                      </span>
                    )}
                  </button>
                  
                  <div className="pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-3">
                    <Link 
                      href="/register" 
                      className="block text-[8px] sm:text-[10px] md:text-xs text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                      onClick={() => {
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userRole');
                      }}
                    >
                      <span className="flex items-center justify-center gap-0.5 sm:gap-1">
                        <span className="hidden sm:inline">Wrong email?</span>
                        <span className="sm:hidden">Wrong email?</span>
                        <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                          Register again
                        </span>
                        <ArrowRight className="w-2 h-2 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                    
                    <Link 
                      href="/login" 
                      className="block text-[8px] sm:text-[10px] md:text-xs text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                    >
                      <span className="flex items-center justify-center gap-0.5 sm:gap-1">
                        <span className="hidden sm:inline">Already verified?</span>
                        <span className="sm:hidden">Verified?</span>
                        <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                          Log in here
                        </span>
                        <ArrowRight className="w-2 h-2 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Security Note */}
          <div className="mt-5 sm:mt-6 md:mt-7 lg:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200">
            <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 flex items-center justify-center gap-1 sm:gap-2">
              <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
              <span className="hidden sm:inline">Your verification code is encrypted and secure</span>
              <span className="sm:hidden">Encrypted & secure</span>
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
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
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