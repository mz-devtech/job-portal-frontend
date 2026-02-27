"use client";

import { useState, useEffect } from "react";
import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import ApplicationsMain from "@/components/dashboard/employer/ApplicationsMain";

export default function Page() {
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
        <EmployerNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard Body */}
      <div className={`flex ${screenSize === 'mobile' ? 'pt-24' : 'pt-28 md:pt-24'}`}>
        <EmployerSidebar />
        <ApplicationsMain />
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden"></div>
    </>
  );
}