"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiMoreVertical,
  FiEye,
  FiPlusCircle,
  FiXCircle,
} from "react-icons/fi";

export default function MyJobsMain() {
  return (
    <main
      className="
        w-full min-h-screen bg-gray-50
        px-4 py-6 sm:px-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)]
        md:overflow-y-auto
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          My Jobs <span className="text-gray-400">(589)</span>
        </h2>

        <select className="rounded-md border px-3 py-2 text-sm">
          <option>All Jobs</option>
          <option>Active</option>
          <option>Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left">Jobs</th>
              <th>Status</th>
              <th>Applications</th>
              <th className="pr-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <JobRow
              jobId="1"
              title="UI/UX Designer"
              type="Full Time"
              days="27 days remaining"
              applications="798"
              status="active"
            />
            <JobRow
              jobId="2"
              title="Senior UX Designer"
              type="Internship"
              days="8 days remaining"
              applications="185"
              status="active"
            />
            <JobRow
              jobId="3"
              title="Junior Graphic Designer"
              type="Full Time"
              days="24 days remaining"
              applications="583"
              status="active"
            />
            <JobRow
              jobId="4"
              title="Front End Developer"
              type="Full Time"
              days="Dec 7, 2019"
              applications="740"
              status="expired"
            />
            <JobRow
              jobId="5"
              title="Technical Support Specialist"
              type="Part Time"
              days="4 days remaining"
              applications="556"
              status="active"
              highlight
            />
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------------- Job Row ---------------- */

function JobRow({
  jobId,
  title,
  type,
  days,
  applications,
  status,
  highlight,
}) {
  const [open, setOpen] = useState(false);

  return (
    <tr
      onMouseLeave={() => setOpen(false)}
      className={`
        border-t transition
        hover:bg-blue-50/40
        ${highlight ? "bg-blue-50/40" : ""}
      `}
    >
      {/* Job */}
      <td className="px-6 py-4">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-xs text-gray-500">
          {type} • {days}
        </p>
      </td>

      {/* Status */}
      <td>
        {status === "expired" ? (
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
          onMouseEnter={() => setOpen(true)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <FiMoreVertical />
        </button>

        {open && <ActionsDropdown jobId={jobId} />}
      </td>
    </tr>
  );
}

/* ---------------- Dropdown ---------------- */

function ActionsDropdown({ jobId }) {
  return (
    <div
      className="
        absolute right-6 top-10 z-20
        w-44 rounded-md border bg-white shadow-lg
      "
    >
      <DropdownItem icon={<FiPlusCircle />} label="Promote Job" />

      <DropdownItem icon={<FiEye />} label="View Detail" />

      {/* ✅ LINK TO APPLICATIONS PAGE */}
      <Link
        href={`/my_jobs/${jobId}/applications`}
        className="block"
      >
        <DropdownItem label="View Applications" bold />
      </Link>

      <DropdownItem icon={<FiXCircle />} label="Mark as expired" />
    </div>
  );
}

function DropdownItem({ icon, label, bold }) {
  return (
    <div
      className={`
        flex w-full cursor-pointer items-center gap-2
        px-4 py-2 text-left text-sm
        hover:bg-gray-50
        ${bold ? "font-medium text-blue-600" : "text-gray-700"}
      `}
    >
      {icon}
      {label}
    </div>
  );
}
