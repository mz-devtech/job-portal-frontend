"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import OverviewAdminMain from "@/components/dashboard/admin/OverviewAdminMain";

const OverviewAdminPage = () => {
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
        <AdminNavbar />
      </div>

      <div className={`flex ${screenSize === 'mobile' ? 'pt-14' : 'pt-16'}`}>
        <AdminSidebar />

        <main className="w-full min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 mt-0 md:ml-[220px] md:w-[calc(100%-220px)] lg:ml-[250px] lg:w-[calc(100%-250px)] xl:ml-[280px] xl:w-[calc(100%-280px)] md:overflow-y-auto pb-20 md:pb-6">
          <OverviewAdminMain />
        </main>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default OverviewAdminPage;