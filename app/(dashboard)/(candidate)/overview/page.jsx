"use client";

import { useState, useEffect } from "react";
import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import CandidateMain from "@/components/dashboard/CandidateMain";

export default function CandidateDashboardPage() {
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <CandidateNavbar />
        <SecondNavbar />
      </div>
      <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
        <CandidateSidebar />
        <CandidateMain />
      </div>
      <div className="h-16 md:hidden"></div>
    </>
  );
}