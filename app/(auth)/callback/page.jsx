'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

// Content component that uses useSearchParams
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        // Handle the Google callback
        await authService.handleGoogleCallback({ token, userId, email, name, role });
        
        // Redirect to dashboard or appropriate page based on role
        setTimeout(() => {
          if (role === 'employer') {
            router.push('/employer/dashboard');
          } else {
            router.push('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {loading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account
            </p>
          </>
        ) : error ? (
          <>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">
              Redirecting to login page...
            </p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Successfully Signed In!
            </h2>
            <p className="text-gray-600">
              Redirecting to your dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading authentication...</p>
      </div>
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