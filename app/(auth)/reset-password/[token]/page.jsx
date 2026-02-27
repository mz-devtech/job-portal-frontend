'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, Sparkles, RotateCw } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;
  const [screenSize, setScreenSize] = useState('desktop');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Calculate password strength
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update password strength when new password changes
    if (field === 'newPassword') {
      setPasswordStrength(calculateStrength(value));
    }

    // Clear errors when user types
    if (field === 'newPassword' || field === 'confirmPassword') {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setPasswordErrors({
      newPassword: '',
      confirmPassword: '',
    });

    // Validate passwords
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: newPasswordError,
      }));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords don't match",
      }));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: formData.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error('Reset failed:', data);
        setErrorMessage(data.message || `Error ${res.status}: Password reset failed`);
        setShowErrorModal(true);
        return;
      }

      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/login');
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
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
    <div className="w-full max-w-md mx-auto px-3 sm:px-4 md:px-0">
      {/* Header */}
      <div className="mb-5 sm:mb-6 md:mb-7 lg:mb-8 animate-fadeInDown">
        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
          <Link 
            href="/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 group text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="hidden sm:inline">Back to Sign In</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-2 sm:mb-3 md:mb-4 group hover:scale-110 transition-transform duration-300">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
            Reset Password
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" />
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 max-w-sm mx-auto">
            Enter a new password for your account.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
        {/* New Password */}
        <div>
          <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 pr-8 sm:pr-10 ${
                passwordErrors.newPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              placeholder={screenSize === 'mobile' ? "Enter new password" : "Enter new password (min. 6 characters)"}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              {showNewPassword ? <EyeOff size={screenSize === 'mobile' ? 16 : 18} /> : <Eye size={screenSize === 'mobile' ? 16 : 18} />}
            </button>
          </div>

          {/* Password strength meter */}
          {formData.newPassword && !passwordErrors.newPassword && (
            <div className="mt-1 sm:mt-2 animate-slideDown">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex-1 h-1 sm:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-500`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <span className={`text-[8px] sm:text-[10px] md:text-xs font-medium ${
                  passwordStrength < 40 ? 'text-red-500' : 
                  passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {getStrengthText()}
                </span>
              </div>
            </div>
          )}

          {passwordErrors.newPassword && (
            <p className="mt-1 text-[8px] sm:text-[10px] md:text-xs text-red-600 flex items-center gap-1 animate-shake">
              <XCircle className="w-2 h-2 sm:w-3 sm:h-3" />
              {passwordErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 pr-8 sm:pr-10 ${
                passwordErrors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
              }`}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              {showConfirmPassword ? <EyeOff size={screenSize === 'mobile' ? 16 : 18} /> : <Eye size={screenSize === 'mobile' ? 16 : 18} />}
            </button>
          </div>

          {/* Password match indicator */}
          {formData.confirmPassword && formData.newPassword && (
            <div className="mt-1 sm:mt-2 animate-slideDown">
              {formData.newPassword === formData.confirmPassword ? (
                <p className="text-[8px] sm:text-[10px] md:text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                  Passwords match
                </p>
              ) : (
                <p className="text-[8px] sm:text-[10px] md:text-xs text-yellow-600 flex items-center gap-1">
                  <XCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                  Passwords don't match
                </p>
              )}
            </div>
          )}

          {passwordErrors.confirmPassword && (
            <p className="mt-1 text-[8px] sm:text-[10px] md:text-xs text-red-600 flex items-center gap-1 animate-shake">
              <XCircle className="w-2 h-2 sm:w-3 sm:h-3" />
              {passwordErrors.confirmPassword}
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
              <RotateCw className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Resetting Password...</span>
              <span className="sm:hidden">Resetting...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Reset Password</span>
              <span className="sm:hidden">Reset</span>
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className="mt-4 sm:mt-5 md:mt-6 text-center animate-fadeIn animation-delay-200">
        <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 flex items-center justify-center gap-1 sm:gap-2">
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
          <span className="hidden sm:inline">Your password is encrypted and secure</span>
          <span className="sm:hidden">Encrypted & secure</span>
          <Shield className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
        </p>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 md:p-6 transform animate-scaleIn">
            <div className="text-center">
              {/* Success Animation */}
              <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                <div className="relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mx-auto animate-bounceIn">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-600" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
              </div>

              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6">
                Your password has been reset successfully. You can now login with your new password.
              </p>

              <button
                onClick={handleCloseSuccessModal}
                className="group relative w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 rounded-lg sm:rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden text-xs sm:text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">Go to Login</span>
                  <span className="sm:hidden">Login</span>
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 md:p-6 transform animate-scaleIn">
            <div className="text-center">
              {/* Error Animation */}
              <div className="relative mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-30"></div>
                <div className="relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-full bg-gradient-to-br from-red-100 to-orange-100 mx-auto animate-bounceIn">
                  <XCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-red-600" />
                </div>
              </div>

              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                Password Reset Failed
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6">
                {errorMessage}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCloseErrorModal}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 sm:py-2.5 md:py-3 px-4 rounded-lg sm:rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-[1.02] text-xs sm:text-sm"
                >
                  Try Again
                </button>
                <Link
                  href="/login"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-center group text-xs sm:text-sm"
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="hidden sm:inline">Back to Login</span>
                    <span className="sm:hidden">Login</span>
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
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
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}