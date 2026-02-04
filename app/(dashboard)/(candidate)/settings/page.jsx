"use client";

import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import CandidateSettingsMain from "@/components/dashboard/CandidateSettingsMain";

const SettingsPage = () => {
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
        <CandidateSettingsMain />
      </div>
    </>
  );
};

export default SettingsPage;
