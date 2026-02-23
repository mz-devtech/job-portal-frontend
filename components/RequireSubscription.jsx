"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoading } from "@/redux/slices/userSlice";
import { subscriptionService } from "@/services/subscriptionService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Clock, 
  Shield, 
  Sparkles,
  ArrowRight,
  X,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function RequireSubscription({ children }) {
  const router = useRouter();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  
  const [checking, setChecking] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (only on client)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check subscription status - only once on client
  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;
    let checkTimeout;

    const checkSubscription = async () => {
      try {
        // If user is not logged in, redirect to login
        if (!user && !isLoading) {
          console.log("🔐 No user found, redirecting to login");
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        // Check subscription status from API (with caching)
        const response = await subscriptionService.checkStatus();
        
        if (isMounted) {
          setHasActiveSubscription(response.hasActiveSubscription);
          setSubscription(response.subscription);

          // If no active subscription and on create page, show modal
          if (!response.hasActiveSubscription && window.location.pathname === "/post_job/create") {
            setShowExpiredModal(true);
            toast.error("You need an active subscription to post jobs", {
              duration: 5000,
            });
          }
        }

      } catch (error) {
        console.error("❌ Subscription check error:", error);
        if (isMounted) {
          setHasActiveSubscription(false);
          
          // In development, you might want to bypass
          if (process.env.NODE_ENV === 'development') {
            console.log("⚠️ Using development mode - bypassing subscription check");
            setHasActiveSubscription(true);
          }
        }
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    // Add a small delay to prevent multiple rapid checks
    checkTimeout = setTimeout(() => {
      checkSubscription();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(checkTimeout);
    };
  }, [user, isLoading, router, isClient]);

  // Handle redirect to plans page
  const handleRedirectToPlans = () => {
    router.push("/post_job");
  };

  // Show loading state - with fixed content to prevent hydration mismatch
  if (!isClient || checking) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-sm text-gray-600">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show nothing (redirect will happen)
  if (!user) {
    return null;
  }

  // If has active subscription, render children (job creation form)
  if (hasActiveSubscription) {
    return children;
  }

  // If no active subscription and we're not on the create page, just render children
  if (typeof window !== 'undefined' && window.location.pathname !== "/post_job/create") {
    return children;
  }

  // No active subscription and trying to access create page - show modal overlay
  return (
    <>
      {/* Show the job creation form in the background but with overlay */}
      <div className="relative">
        {/* Blurred background content */}
        <div className="filter blur-sm pointer-events-none opacity-30">
          {children}
        </div>

        {/* Subscription Required Modal */}
        <SubscriptionRequiredModal 
          isOpen={showExpiredModal}
          onClose={() => setShowExpiredModal(false)}
          subscription={subscription}
          onRedirect={handleRedirectToPlans}
        />
      </div>
    </>
  );
}

// Subscription Required Modal Component
function SubscriptionRequiredModal({ isOpen, onClose, subscription, onRedirect }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                    <CreditCard className="w-10 h-10" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                Active Subscription Required
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-600 text-center mb-6">
                You need an active subscription to post jobs. 
                {subscription?.status === 'expired' || subscription?.status === 'cancelled' 
                  ? ' Your previous subscription has expired.'
                  : ' Please choose a plan to continue.'}
              </p>

              {/* Expiration info if exists */}
              {subscription && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Previous Subscription:</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {subscription.planName} Plan
                    </span>
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expired
                    </span>
                  </div>
                  {subscription.endDate && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Expired on: {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Features reminder */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  With a subscription you can:
                </p>
                <ul className="space-y-1.5">
                  <li className="text-xs text-gray-500 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Post and manage job listings
                  </li>
                  <li className="text-xs text-gray-500 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Receive and review applications
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Link href="/post_job" onClick={onClose}>
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    View Subscription Plans
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              {/* Security notice */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-[9px] text-gray-400">Secure payments powered by Stripe</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}