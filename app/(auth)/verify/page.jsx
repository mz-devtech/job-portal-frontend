<<<<<<< HEAD
=======
// app/(auth)/verify/page.jsx
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
<<<<<<< HEAD
      
      // Clear any existing token to prevent auto-login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🧹 [VerifyPage] Cleared any existing auth data');
=======
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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
<<<<<<< HEAD
      console.log('🔄 [VerifyPage] Verifying email WITHOUT auto-login:', {
=======
      console.log('🔄 [VerifyPage] Verifying with:', {
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        code: verificationCode,
        email: email
      });

<<<<<<< HEAD
      // Verify email
      const result = await authService.verifyEmail({
        code: verificationCode,
        email: email
=======
      // FIXED: Send BOTH code and email
      const result = await authService.verifyEmail({
        code: verificationCode,  // Send as 'code' not 'token'
        email: email              // Send email explicitly
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      });

      console.log('✅ [VerifyPage] Verification successful:', result);

      setIsVerified(true);
      
<<<<<<< HEAD
      // CRITICAL: Only remove email, DO NOT set token
      localStorage.removeItem('userEmail');
      localStorage.removeItem('registerError');
      localStorage.removeItem('userRole');
      console.log('✅ [VerifyPage] Email verified, NO token stored');
      
      toast.success('Email verified successfully! Please login with your credentials.');
      
      // Redirect to login page after delay
=======
      // Clear stored email
      localStorage.removeItem('userEmail');
      localStorage.removeItem('registerError');
      
      // toast.success('Email verified successfully! Please login with your credentials.');
      
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit verification code sent to
          </p>
          <p className="font-medium text-gray-900 break-words">{email}</p>
          <p className="mt-1 text-xs text-gray-500">
<<<<<<< HEAD
            After verification, you'll need to login with your credentials
=======
            Check your inbox and spam folder
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* 6-digit code input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Verification Code
            </label>
            <div className="flex justify-between space-x-3" onPaste={handlePaste}>
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
                  disabled={isLoading || isVerified}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || isVerified || code.some(digit => digit === '')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : isVerified ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
<<<<<<< HEAD
                  Verified! Redirecting to login...
=======
                  Verified! Redirecting...
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
                </span>
              ) : (
                'Verify Email'
              )}
            </button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || isLoading || isVerified}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive a code? Resend"}
              </button>
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-sm text-gray-600">
                  Wrong email?{' '}
                  <Link 
                    href="/register" 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    onClick={() => {
                      localStorage.removeItem('userEmail');
                      localStorage.removeItem('userRole');
                    }}
                  >
                    Register again
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Already verified?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}