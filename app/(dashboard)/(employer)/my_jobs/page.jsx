"use client";

import { useState, useEffect } from "react";
import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import MyJobsMain from "@/components/dashboard/employer/MyJobsMain";

export default function Page() {
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
        <MyJobsMain />
      </div>
    </>
  );
}