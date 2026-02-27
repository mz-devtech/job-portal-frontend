"use client";

import { useState, useEffect } from "react";
import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import FavouriteJobs from "@/components/dashboard/FavouriteJobs";

const FavouriteJobsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    setMounted(true);
    
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-14 sm:h-16 bg-white/95 border-b border-indigo-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CandidateNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard Body */}
      <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
        <CandidateSidebar />
        
        {/* Main Content */}
        <main
          className="
            w-full min-h-screen
            bg-gray-50
            px-3 sm:px-4 md:px-6 py-4 sm:py-6
            md:ml-[260px]
            md:w-[calc(100%-260px)]
            md:h-[calc(100vh-7rem)]
            md:overflow-y-auto
            pb-20 md:pb-6
          "
        >
          <FavouriteJobs />
        </main>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default FavouriteJobsPage;