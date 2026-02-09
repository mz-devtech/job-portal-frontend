"use client";

import { useState } from "react";
import { FiMoreVertical, FiDownload, FiPlus, FiX, FiMail } from "react-icons/fi";

export default function ApplicationsMain() {
  const [sortOpen, setSortOpen] = useState(false);
  const [openAddColumn, setOpenAddColumn] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  return (
    <main className="w-full min-h-screen bg-gray-50 px-6 py-6 md:ml-[260px] md:w-[calc(100%-260px)]">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-2">
        Home / Job / Senior UI/UX Designer /{" "}
        <span className="text-blue-600">Applications</span>
      </p>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Job Applications
        </h2>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setOpenAddColumn(true)}
            className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm"
          >
            <FiPlus /> Create
          </button>

          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="rounded-md border bg-white px-4 py-2 text-sm"
          >
            Sort
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-md border bg-white shadow-md z-20">
              <SortItem label="Newest" active />
              <SortItem label="Oldest" />
            </div>
          )}
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <ApplicationColumn
          title="All Application"
          count={213}
          applicants={ALL_APPS}
          onApplicantClick={(app) => setSelectedCandidate(app)}
        />

        <ApplicationColumn
          title="Shortlisted"
          count={2}
          applicants={SHORTLISTED}
          onApplicantClick={(app) => setSelectedCandidate(app)}
        />
      </div>

      {/* Add Column Modal */}
      {openAddColumn && (
        <AddColumnModal onClose={() => setOpenAddColumn(false)} />
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </main>
  );
}

/* ================= Column ================= */

function ApplicationColumn({ title, count, applicants, onApplicantClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-lg bg-white border shadow-sm flex flex-col h-[calc(100vh-180px)]">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-medium text-gray-900">
          {title} <span className="text-gray-400">({count})</span>
        </h3>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 w-40 rounded-md border bg-white shadow-md z-10">
              <MenuItem label="Edit Column" />
              <MenuItem label="Delete" danger />
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 space-y-4 overflow-y-auto">
        {applicants.map((app) => (
          <ApplicantCard
            key={app.name}
            {...app}
            onClick={() => onApplicantClick(app)}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= Applicant Card ================= */

function ApplicantCard({
  name,
  role,
  experience,
  education,
  applied,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 hover:shadow-md transition bg-white"
    >
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-xs text-gray-600">
        <li>• {experience} Years Experience</li>
        <li>• Education: {education}</li>
        <li>• Applied: {applied}</li>
      </ul>

      <button
        onClick={(e) => {
          e.stopPropagation();
          // Add your download CV logic here
          console.log(`Download CV for ${name}`);
        }}
        className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <FiDownload />
        Download CV
      </button>
    </div>
  );
}

/* ================= Candidate Detail Modal ================= */

function CandidateDetailModal({ candidate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div className="relative w-[1100px] max-w-[95%] h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100 z-10"
        >
          <FiX />
        </button>

        {/* LEFT */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-700">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {candidate.name}
              </h2>
              <p className="text-sm text-gray-500">
                {candidate.role}
              </p>
            </div>
          </div>

          {/* Biography */}
          <Section title="Biography">
            <p className="text-sm text-gray-600 leading-relaxed">
              Passionate UI/UX designer with experience in web and
              mobile applications. Focused on clean design systems,
              usability and user-centered solutions.
            </p>
          </Section>

          {/* Cover Letter */}
          <Section title="Cover Letter">
            <p className="text-sm text-gray-600 leading-relaxed">
              Dear Sir,<br /><br />
              I am writing to express my interest in the position.
              I believe my skills and experience align perfectly
              with your requirements.
              <br /><br />
              Sincerely,<br />
              {candidate.name}
            </p>
          </Section>
        </div>

        {/* RIGHT */}
        <div className="w-[360px] border-l bg-gray-50 p-6 overflow-y-auto">
          <div className="flex gap-2 mb-6">
            <button className="flex-1 rounded-md border bg-white px-3 py-2 text-sm flex items-center justify-center gap-2">
              <FiMail /> Send Mail
            </button>
            <button className="flex-1 rounded-md bg-blue-600 text-white px-3 py-2 text-sm">
              Hire Candidate
            </button>
          </div>

          <InfoItem label="Experience" value={`${candidate.experience} Years`} />
          <InfoItem label="Education" value={candidate.education} />
          <InfoItem label="Applied" value={candidate.applied} />
          <InfoItem label="Email" value="esther.howard@gmail.com" />
          <InfoItem label="Location" value="Beverly Hills, CA" />
        </div>
      </div>
    </div>
  );
}

/* ================= Add Column Modal ================= */

function AddColumnModal({ onClose }) {
  const [columnName, setColumnName] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Column
        </h3>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">
            Column Name
          </label>
          <input
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            type="text"
            placeholder="Enter column name"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */

function SortItem({ label, active }) {
  return (
    <button
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
        active ? "text-blue-600 font-medium" : "text-gray-700"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full border ${
          active ? "border-blue-600 bg-blue-600" : "border-gray-300"
        }`}
      />
      {label}
    </button>
  );
}

function MenuItem({ label, danger }) {
  return (
    <button
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
        danger ? "text-red-500" : "text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function Avatar({ name }) {
  return (
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
      {name.charAt(0)}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* ================= Dummy Data ================= */

const ALL_APPS = [
  {
    name: "Ronald Richards",
    role: "UI/UX Designer",
    experience: 7,
    education: "Master Degree",
    applied: "Jan 23, 2022",
  },
  {
    name: "Theresa Webb",
    role: "Product Designer",
    experience: 7,
    education: "High School Degree",
    applied: "Jan 23, 2022",
  },
  {
    name: "Devon Lane",
    role: "User Experience Designer",
    experience: 7,
    education: "Master Degree",
    applied: "Jan 23, 2022",
  },
];

const SHORTLISTED = [
  {
    name: "Darrell Steward",
    role: "UI/UX Designer",
    experience: 7,
    education: "Intermediate Degree",
    applied: "Jan 23, 2022",
  },
  {
    name: "Jenny Wilson",
    role: "UI Designer",
    experience: 7,
    education: "Bachelor Degree",
    applied: "Jan 23, 2022",
  },
];