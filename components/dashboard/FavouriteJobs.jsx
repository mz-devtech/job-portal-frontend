"use client";

import {
  FiBookmark,
  FiMapPin,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";

const jobs = [
  {
    id: 1,
    company: "Google",
    title: "Technical Support Specialist",
    location: "Idaho, USA",
    salary: "$15K-$20K",
    type: "Full Time",
    status: "expired",
  },
  {
    id: 2,
    company: "YouTube",
    title: "UI/UX Designer",
    location: "Minnesota, USA",
    salary: "$35K-$60K",
    type: "Full Time",
    status: "active",
  },
  {
    id: 3,
    company: "Dribbble",
    title: "Senior UX Designer",
    location: "United Kingdom",
    salary: "$30K-$35K",
    type: "Full Time",
    status: "active",
    activeRow: true,
  },
  {
    id: 4,
    company: "Facebook",
    title: "Junior Graphic Designer",
    location: "Bangladesh",
    salary: "$40K-$50K",
    type: "Full Time",
    status: "active",
  },
];

const FavouriteJobs = () => {
  return (
    <div>
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        Favorite Jobs <span className="text-gray-400">(17)</span>
      </h2>

      {/* Job List */}
      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <PageBtn active>01</PageBtn>
        <PageBtn>02</PageBtn>
        <PageBtn>03</PageBtn>
        <PageBtn>04</PageBtn>
        <PageBtn icon />
      </div>
    </div>
  );
};

export default FavouriteJobs;

/* ---------------- Job Card ---------------- */

function JobCard({ job }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border bg-white p-4 transition
        ${job.activeRow ? "border-blue-500 shadow-sm" : "border-gray-200"}
      `}
    >
      {/* Left */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-600">
          {job.company[0]}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {job.title}
            </h3>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              {job.type}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiMapPin size={14} /> {job.location}
            </span>
            <span>{job.salary}</span>
            <span className="flex items-center gap-1">
              <FiClock size={14} /> 4 Days Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-blue-600">
          <FiBookmark size={18} />
        </button>

        {job.status === "expired" ? (
          <span className="rounded bg-gray-100 px-4 py-2 text-sm text-gray-400">
            Deadline Expired
          </span>
        ) : (
          <button className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Apply Now <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Pagination ---------------- */

function PageBtn({ children, active, icon }) {
  return (
    <button
      className={`h-9 w-9 rounded-full border text-sm
        ${active ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-100"}
      `}
    >
      {icon ? <FiChevronRight /> : children}
    </button>
  );
}
