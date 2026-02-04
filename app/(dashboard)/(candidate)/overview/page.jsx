"use client";

import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import CandidateMain from "@/components/dashboard/CandidateMain";

const Page = () => {
  return (
    <>
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CandidateNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard Body */}
      <div className="flex pt-28">
        <CandidateSidebar />
        <CandidateMain />
      </div>
    </>
  );
};

export default Page;
