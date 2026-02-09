"use client";

import EmployerNavbar from "@/components/EmployerNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import PostJobForm from "@/components/dashboard/employer/PostJobForm";

export default function Page() {
  return (
    <>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <EmployerNavbar />
        <SecondNavbar />
      </div>

      {/* Body */}
      <div className="flex pt-28">
        <EmployerSidebar />
        <PostJobForm />
      </div>
    </>
  );
}
