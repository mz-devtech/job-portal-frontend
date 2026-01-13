// app/(auth)/verify/page.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    console.log('Verification code:', verificationCode);
    // Add verification logic here
    // After verification, redirect to dashboard or login
    router.push('/dashboard');
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Email Verification
        </h1>
        <p className="text-gray-600">
          We've sent a verification code to{' '}
          <span className="font-semibold">emailadmbs@gmail.com</span>{' '}
          to verify your email address and activate your account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all mb-4"
        >
          Verify My Account
        </button>

        <div className="text-center text-sm text-gray-500">
          <p>(3601 seconds left to verify your account)</p>
          <p className="mt-2">
            Didn't receive code?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Resend Code
            </button>
          </p>
          <p className="mt-2">
            Wrong email?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Go back
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}