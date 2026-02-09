"use client";

import { useState } from "react";
import {
  FiMoreVertical,
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiEye,
  FiXCircle,
} from "react-icons/fi";

export default function EmployerMain() {
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
      <h2 className="text-xl font-semibold text-gray-900">
        Hello, Instagram
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Here is your daily activities and applications
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Open Jobs"
          value="589"
          icon={<FiBriefcase />}
          bg="bg-blue-50"
          iconBg="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Saved Candidates"
          value="2,517"
          icon={<FiUsers />}
          bg="bg-yellow-50"
          iconBg="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Table */}
      <div className="mt-8 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-gray-800">
            Recently Posted Jobs
          </h3>
          <button className="text-sm text-blue-600">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Jobs</th>
                <th>Status</th>
                <th>Applications</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              <JobRow
                title="UI/UX Designer"
                type="Full Time"
                days="27 days remaining"
                applications="798"
              />

              <JobRow
                title="Senior UX Designer"
                type="Internship"
                days="8 days remaining"
                applications="185"
              />

              <JobRow
                title="Technical Support Specialist"
                type="Part Time"
                days="4 days remaining"
                applications="556"
                active
              />

              <JobRow
                title="Junior Graphic Designer"
                type="Full Time"
                days="24 days remaining"
                applications="583"
              />

              <JobRow
                title="Front End Developer"
                type="Full Time"
                days="Dec 7, 2019"
                applications="740"
                expired
              />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, icon, bg, iconBg }) {
  return (
    <div className={`flex items-center justify-between rounded-lg p-5 ${bg}`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`rounded-md p-3 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

function JobRow({
  title,
  type,
  days,
  applications,
  active,
  expired,
}) {
  const [open, setOpen] = useState(false);

  return (
    <tr
      className={`border-t ${
        active ? "bg-blue-50/40" : ""
      }`}
    >
      {/* Job */}
      <td className="px-6 py-4">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="mt-1 text-xs text-gray-500">
          {type} • {days}
        </p>
      </td>

      {/* Status */}
      <td>
        {expired ? (
          <span className="flex items-center gap-1 text-red-500">
            ✕ Expire
          </span>
        ) : (
          <span className="flex items-center gap-1 text-green-600">
            ● Active
          </span>
        )}
      </td>

      {/* Applications */}
      <td className="text-gray-600">
        👥 {applications} Applications
      </td>

      {/* Actions */}
      <td className="relative pr-6 text-right">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <FiMoreVertical />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            onMouseLeave={() => setOpen(false)}
            className="
              absolute right-6 top-10 z-20
              w-44 rounded-md border bg-white shadow-lg
            "
          >
            <DropdownItem
              icon={<FiPlusCircle />}
              label="Promote Job"
              href="/promote-job"
              highlight
            />
            <DropdownItem
              icon={<FiEye />}
              label="View Detail"
              href="/job-detail"
            />
            <DropdownItem
              icon={<FiXCircle />}
              label="Mark as expired"
              href="/expire-job"
            />
            <DropdownItem
              label="View Applications"
              href="/applications"
              bold
            />
          </div>
        )}
      </td>
    </tr>
  );
}

function DropdownItem({
  icon,
  label,
  href,
  highlight,
  bold,
}) {
  return (
    <a
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm
        hover:bg-gray-50
        ${highlight ? "text-blue-600 bg-blue-50" : "text-gray-700"}
        ${bold ? "font-medium text-blue-600" : ""}
      `}
    >
      {icon}
      {label}
    </a>
  );
}
