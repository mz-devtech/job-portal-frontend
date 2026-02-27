"use client";

import { useState, useEffect } from "react";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerNavbar from "@/components/EmployerNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import EmployerMain from "@/components/dashboard/employer/EmployerMain";

const Page = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-white/95 border-b border-indigo-100 animate-pulse"></div>
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
      <div className="flex pt-28 md:pt-24">
        <EmployerSidebar />
        <EmployerMain />
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:h-0 lg:hidden"></div>
    </>
  );
};

export default Page;