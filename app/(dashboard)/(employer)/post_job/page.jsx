"use client";

import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import PostJobMain from "@/components/dashboard/employer/PostJobMain";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slices/userSlice";
import { subscriptionService } from "@/services/subscriptionService";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [checking, setChecking] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    setIsClient(true);
    
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
    if (!isClient) return;

    let isMounted = true;

    const checkSubscription = async () => {
      try {
        const response = await subscriptionService.checkStatus();
        if (isMounted) {
          setHasActiveSubscription(response.hasActiveSubscription);
        }
      } catch (error) {
        console.error("Subscription check error:", error);
      } finally {
        if (isMounted) {
          setChecking(false);
        }
      }
    };

    checkSubscription();

    return () => {
      isMounted = false;
    };
  }, [isClient]);

  // Show loading state
  if (!isClient || checking) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50">
          <EmployerNavbar />
          <SecondNavbar />
        </div>
        <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
          <EmployerSidebar />
          <div className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-3 sm:border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <div className="h-16 md:hidden"></div>
      </>
    );
  }

  // If user already has active subscription, show message and link to create
  if (hasActiveSubscription) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50">
          <EmployerNavbar />
          <SecondNavbar />
        </div>
        <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
          <EmployerSidebar />
          <div className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)]">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-green-200 p-4 sm:p-6 md:p-8 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  You Have an Active Subscription!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  You can start posting jobs right away.
                </p>
                <Link
                  href="/post_job/create"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Create a New Job
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="h-16 md:hidden"></div>
      </>
    );
  }

  // No active subscription - show plans
  return (
    <>
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <EmployerNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard Body */}
      <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
        <EmployerSidebar />
        <PostJobMain />
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default Page;