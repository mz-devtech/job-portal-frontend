// app/(auth)/layout.jsx
import React from 'react';
import AuthStats from '@/components/AuthStats';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Jobpilot</h1>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Stats & Background */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <AuthStats />
        </div>
      </div>
    </div>
  );
}