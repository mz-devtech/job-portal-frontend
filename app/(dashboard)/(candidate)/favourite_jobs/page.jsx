"use client";

import CandidateNavbar from "@/components/CandidateNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";
import FavouriteJobs from "@/components/dashboard/FavouriteJobs";

const FavouriteJobsPage = () => {
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

        {/* Main Content */}
        <main
          className="
            w-full
            min-h-screen
            bg-gray-50
            px-4 py-4
            sm:px-6 sm:py-6
            md:ml-[260px]
            md:w-[calc(100%-260px)]
            md:h-[calc(100vh-7rem)]
            md:overflow-y-auto
          "
        >
          <FavouriteJobs />
        </main>
      </div>
    </>
  );
};

export default FavouriteJobsPage;
