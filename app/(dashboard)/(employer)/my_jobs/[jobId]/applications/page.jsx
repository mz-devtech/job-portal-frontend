"use client";

import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import ApplicationsMain from "@/components/dashboard/employer/ApplicationsMain";

export default function Page() {
  return (
    <>
      {/* Fixed Nav */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <EmployerNavbar />
        <SecondNavbar />
      </div>

      {/* Body */}
      <div className="flex pt-28">
        <EmployerSidebar />
        <ApplicationsMain />
      </div>
    </>
  );
}
