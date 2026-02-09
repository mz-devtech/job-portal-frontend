"use client";

import SecondNavbar from "@/components/SecondNavbar";

import EmployerNavbar from "@/components/EmployerNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import EmployerMain from "@/components/dashboard/employer/EmployerMain";

const Page = () => {
  return (
    <>
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">

        <EmployerNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard Body */}
      <div className="flex pt-28">
        <EmployerSidebar />
        <EmployerMain />

      </div>
    </>
  );
};

export default Page;
