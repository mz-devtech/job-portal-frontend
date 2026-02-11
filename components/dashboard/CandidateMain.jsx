"use client";

import { FiBookmark, FiBell } from "react-icons/fi";
import ProfileAlert from "../../components/dashboard/ProfileAlert";
import { useSelector } from "react-redux";
import { selectUser, selectRole, selectIsAuthenticated } from "../../redux/slices/userSlice";

export default function CandidateMain() {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Handle edit profile click
  const handleEditProfile = () => {
    window.location.href = "/candidate/settings";
  };

  return (
    <main
      className="
        mt-28
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
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Hello, {user?.name || user?.username || "Esther Howard"}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Here is your daily activities and job alerts
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Applied Jobs" value="589" bg="bg-blue-50" />
        <StatCard title="Favorite Jobs" value="238" bg="bg-yellow-50" />
        <StatCard title="Job Alerts" value="574" bg="bg-green-50" />
      </div>

      {/* Profile Alert - Shows only when profile is incomplete */}
      {isAuthenticated && userRole === "candidate" && (
        <ProfileAlert 
          onClick={handleEditProfile}
          title="Complete Your Profile to Stand Out!"
          description="Finish setting up your profile to increase your chances of getting hired. Add your skills, experience, and portfolio."
        />
      )}

      {/* Table */}
      <div className="mt-8 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
          <h3 className="font-semibold text-gray-800">
            Recently Applied
          </h3>
          <button className="text-sm text-blue-600">
            View all →
          </button>
        </div>

        {/* ✅ Table scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Job</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <JobRow title="Networking Engineer" tag="Remote" />
              <JobRow title="Product Designer" tag="Full Time" />
              <JobRow title="Junior Graphic Designer" tag="Temporary" />
              <JobRow title="Visual Designer" tag="Contract Base" active />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small Components ---------- */

function StatCard({ title, value, bg }) {
  return (
    <div className={`rounded-lg p-5 ${bg}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function JobRow({ title, tag, active }) {
  return (
    <tr className={`border-t ${active ? "bg-blue-50/40" : ""}`}>
      <td className="px-6 py-4">
        <p className="font-medium text-gray-800">{title}</p>
        <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
          {tag}
        </span>
      </td>
      <td>Feb 2, 2019</td>
      <td className="font-medium text-green-600">Active</td>
      <td className="pr-6">
        <button className="rounded border px-4 py-1 text-blue-600 hover:bg-blue-50">
          View Details
        </button>
      </td>
    </tr>
  );
}