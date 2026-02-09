"use client";

import { useState } from "react";
import {
  FiMoreVertical,
  FiBookmark,
  FiMail,
  FiDownload,
} from "react-icons/fi";

const candidates = [
  {
    id: 1,
    name: "Guy Hawkins",
    role: "Technical Support Specialist",
    avatar: "/avatars/1.png",
  },
  {
    id: 2,
    name: "Jacob Jones",
    role: "Product Designer",
    avatar: "/avatars/2.png",
  },
  {
    id: 3,
    name: "Cameron Williamson",
    role: "Marketing Officer",
    avatar: "/avatars/3.png",
    active: true,
  },
  {
    id: 4,
    name: "Robert Fox",
    role: "Marketing Manager",
    avatar: "/avatars/4.png",
  },
  {
    id: 5,
    name: "Kathryn Murphy",
    role: "Junior Graphic Designer",
    avatar: "/avatars/5.png",
  },
];

export default function SavedCandidateMain() {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Saved Candidates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            All of the candidates are visible until 24 March, 2021
          </p>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 rounded-lg bg-white shadow-sm divide-y">
        {candidates.map((candidate) => (
          <CandidateRow
            key={candidate.id}
            candidate={candidate}
          />
        ))}
      </div>
    </main>
  );
}

/* ---------------- Candidate Row ---------------- */

function CandidateRow({ candidate }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        flex items-center justify-between px-6 py-4
        hover:bg-gray-50
        ${candidate.active ? "ring-1 ring-blue-200 rounded-lg" : ""}
      `}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <p className="font-medium text-gray-800">
            {candidate.name}
          </p>
          <p className="text-sm text-gray-500">
            {candidate.role}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        {/* Bookmark */}
        <button className="rounded-md p-2 text-blue-600 hover:bg-blue-50">
          <FiBookmark />
        </button>

        {/* View Profile */}
        <button className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          View Profile →
        </button>

        {/* More */}
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
              absolute right-0 top-10 z-20
              w-44 rounded-md border bg-white shadow-lg
            "
          >
            <DropdownItem
              icon={<FiMail />}
              label="Send Email"
            />
            <DropdownItem
              icon={<FiDownload />}
              label="Download CV"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Dropdown Item ---------------- */

function DropdownItem({ icon, label }) {
  return (
    <button
      className="
        flex w-full items-center gap-2
        px-4 py-2 text-sm text-gray-700
        hover:bg-gray-50
      "
    >
      {icon}
      {label}
    </button>
  );
}
