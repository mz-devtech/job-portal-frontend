"use client";

import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import AppliedJobs from "@/components/dashboard/AppliedJobs";

export default function AppliedJobsPage() {
  return (
    <>
      {/* Fixed Navbars */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CandidateNavbar />
        <SecondNavbar />
      </div>

      {/* Dashboard */}
      <div className="flex pt-28">
        <CandidateSidebar />
        <AppliedJobs />
      </div>
    </>
  );
}
