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
  const inputsRef = useRef([]);

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
        code: verificationCode,  // Send as 'code' not 'token'
        email: email              // Send email explicitly
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Loading Verification
            </h2>
            
            <p className="text-gray-500 text-sm animate-pulse">
              Please wait while we load your verification session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200/50 animate-scaleIn">
          
          {/* Header */}
          <div className="text-center mb-8 animate-fadeInDown">
            <div className="relative inline-block">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mx-auto mb-4 group hover:scale-110 transition-transform duration-300">
                <Mail className="h-8 w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              {isVerified ? 'Email Verified!' : 'Verify Your Email'}
            </h2>
            
            {!isVerified && (
              <>
                <p className="text-sm text-gray-600 mb-1">
                  Enter the 6-digit verification code sent to
                </p>
                <p className="font-medium text-gray-900 break-words bg-blue-50 inline-block px-4 py-1.5 rounded-full text-sm">
                  {email}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>Code expires in 10 minutes</span>
                </div>
              </>
            )}
          </div>

          {/* Success State */}
          {isVerified ? (
            <div className="text-center animate-scaleIn">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mx-auto animate-bounceIn">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              
              <p className="text-gray-600 mb-4">
                Your email has been verified successfully!
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Redirecting to login</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 6-digit code input */}
              <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Verification Code
                </label>
                <div 
                  className="flex justify-center gap-2 sm:gap-3" 
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
                      className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 ${
                        digit ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ animationDelay: `${150 + index * 50}ms` }}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                  <Mail className="w-3 h-3 text-blue-500" />
                  Enter the 6-digit code from your email
                </p>
              </div>

              <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <button
                  type="submit"
                  disabled={isLoading || code.some(digit => digit === '')}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl overflow-hidden group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RotateCw className="animate-spin h-5 w-5 mr-2" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Verify Email
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </button>

                <div className="text-center space-y-4">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="group text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {countdown > 0 ? (
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 animate-pulse" />
                        Resend code in {countdown}s
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        Didn't receive a code? 
                        <span className="font-medium underline decoration-2 decoration-transparent hover:decoration-blue-600 transition-all duration-300">
                          Resend
                        </span>
                      </span>
                    )}
                  </button>
                  
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link 
                      href="/register" 
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                      onClick={() => {
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userRole');
                      }}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Wrong email? 
                        <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                          Register again
                        </span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                    
                    <Link 
                      href="/login" 
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                    >
                      <span className="flex items-center justify-center gap-1">
                        Already verified? 
                        <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                          Log in here
                        </span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3 text-blue-500" />
              Your verification code is encrypted and secure
              <Shield className="w-3 h-3 text-blue-500" />
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