"use client";

import { useState } from "react";
import { FiUpload, FiMoreVertical, FiTrash2, FiEdit2, FiX } from "react-icons/fi";



import AddResumeModal from "@/components/dashboard/AddResumeModal";

export default function CandidateSettingsMain() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <main
      className="
        mt-28 w-full min-h-screen bg-gray-50
        px-4 py-4 sm:px-6 sm:py-6
        md:ml-[260px] md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)] md:overflow-y-auto
      "
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Settings
      </h2>

      {/* Tabs */}
      <div className="mt-6 border-b flex gap-6 text-sm font-medium">
        <Tab label="Personal" active={activeTab === "personal"} onClick={() => setActiveTab("personal")} />
        <Tab label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
        <Tab label="Social Links" active={activeTab === "social"} onClick={() => setActiveTab("social")} />
        <Tab label="Account Setting" active={activeTab === "account"} onClick={() => setActiveTab("account")} />
      </div>

      {/* Content */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        {activeTab === "personal" && <PersonalTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "social" && <SocialLinksTab />}
        {activeTab === "account" && <AccountSettingsTab />}
      </div>
    </main>
  );
}

/* ---------------- Tabs ---------------- */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 ${
        active
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function PersonalTab() {
  const [resumes, setResumes] = useState([
    { title: "Professional Resume", size: "3.5 MB" },
    { title: "Product Designer", size: "4.7 MB" },
    { title: "Visual Designer", size: "1.3 MB" },
  ]);

  const [openModal, setOpenModal] = useState(false);

  const handleAddResume = (resume) => {
    setResumes((prev) => [...prev, resume]);
  };

  return (
    <>
      {/* ================= BASIC INFO (UNCHANGED) ================= */}
      <h3 className="text-base font-semibold text-gray-800">
        Basic Information
      </h3>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Picture */}
        <div className="lg:col-span-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </p>

          <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-center">
            <FiUpload className="text-gray-400 mb-2" size={22} />
            <p className="text-sm text-gray-600">
              Browse photo or drop here
            </p>
            <p className="mt-1 text-xs text-gray-400">
              A photo larger than 400px work best. Max photo size 5MB.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full name" placeholder="Esther Howard" />
            <Input label="Title/headline" placeholder="UI/UX Designer" />
            <Select label="Experience" />
            <Select label="Educations" />
            <Input
              label="Personal Website"
              placeholder="https://yourwebsite.com"
              full
            />
          </div>

          <button className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= RESUME SECTION ================= */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-gray-800">
          Your CV/Resume
        </h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resumes.map((resume, index) => (
            <ResumeCard
              key={index}
              title={resume.title}
              size={resume.size}
            />
          ))}

          {/* ADD RESUME */}
          <div
            onClick={() => setOpenModal(true)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-6 text-center hover:border-blue-500"
          >
            <FiUpload className="text-gray-400 mb-2" size={20} />
            <p className="text-sm text-gray-600">Add CV/Resume</p>
            <p className="text-xs text-gray-400 mt-1">Only PDF</p>
          </div>
        </div>
      </div>

      {/* ================= ADD RESUME MODAL ================= */}
      <AddResumeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddResume}
      />
    </>
  );
}



/* ================= PROFILE ================= */

function ProfileTab() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Nationality" />
        <Input label="Date of Birth" placeholder="dd/mm/yyyy" />
        <Select label="Gender" />
        <Select label="Marital Status" />
        <Select label="Education" />
        <Select label="Experience" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biography
        </label>
        <textarea
          rows={5}
          placeholder="Write down your biography here..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <button className="mt-6 rounded-md bg-blue-600 px-6 py-2.5 text-sm text-white">
        Save Changes
      </button>
    </>
  );
}

/* ================= SOCIAL LINKS ================= */

function SocialLinksTab() {
  return (
    <>
      {["Facebook", "Twitter", "Instagram", "Youtube"].map((p) => (
        <div key={p} className="mb-3 grid grid-cols-12 gap-3 items-center">
          <select className="col-span-3 rounded-md border px-3 py-2 text-sm">
            <option>{p}</option>
          </select>
          <input
            placeholder="Profile link/url..."
            className="col-span-8 rounded-md border px-3 py-2 text-sm"
          />
          <button className="col-span-1 text-gray-400 hover:text-red-500">
            <FiX />
          </button>
        </div>
      ))}

      <button className="text-sm text-gray-600 mt-2">
        + Add New Social Link
      </button>

      <button className="mt-6 block rounded-md bg-blue-600 px-6 py-2.5 text-sm text-white">
        Save Changes
      </button>
    </>
  );
}

/* ================= ACCOUNT SETTINGS ================= */

function AccountSettingsTab() {
  const [profilePublic, setProfilePublic] = useState(true);
  const [resumePublic, setResumePublic] = useState(false);

  return (
    <div className="space-y-8">
      {/* ================= CONTACT INFO ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Contact Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Map Location" placeholder="City, state, country name" />
          <Input label="Phone" placeholder="+880 1234 56789" />
          <Input label="Email" placeholder="email@example.com" />
        </div>

        <button className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm text-white">
          Save Changes
        </button>
      </section>

      {/* ================= NOTIFICATIONS ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Notification
        </h3>

        <div className="space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Notify me when employers shortlisted me
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Notify me when my applied jobs are expired
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Notify me when I have up to 5 new jobs
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            Notify me when employers saved my profile
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Notify me when employers rejected me
          </label>
        </div>
      </section>

      {/* ================= JOB ALERTS ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Job Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Role" placeholder="Your job roles" />
          <Input label="Location" placeholder="City, state, country name" />
        </div>

        <button className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm text-white">
          Save Changes
        </button>
      </section>

      {/* ================= PRIVACY ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Profile Privacy
          </h4>
          <Toggle
            enabled={profilePublic}
            onToggle={() => setProfilePublic(!profilePublic)}
            label={profilePublic ? "Your profile is public now" : "Your profile is private now"}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Resume Privacy
          </h4>
          <Toggle
            enabled={resumePublic}
            onToggle={() => setResumePublic(!resumePublic)}
            label={resumePublic ? "Your resume is public now" : "Your resume is private now"}
          />
        </div>
      </section>

      {/* ================= CHANGE PASSWORD ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Change Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Current Password" placeholder="Password" />
          <Input label="New Password" placeholder="Password" />
          <Input label="Confirm Password" placeholder="Password" />
        </div>

        <button className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-sm text-white">
          Save Changes
        </button>
      </section>

      {/* ================= DELETE ACCOUNT ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Delete Your Account
        </h3>
        <p className="text-xs text-gray-500 max-w-xl mb-3">
          If you delete your account, you will no longer be able to get job
          information or receive notifications from the Jobpilot platform.
        </p>

        <button className="flex items-center gap-2 text-sm text-red-600">
          <FiTrash2 size={14} />
          Close Account
        </button>
      </section>
    </div>
  );
}


/* ---------------- Reusable ---------------- */

function Input({ label, placeholder, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
    </div>
  );
}

function Select({ label }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select className="w-full rounded-md border px-3 py-2 text-sm text-gray-500">
        <option>Select...</option>
      </select>
    </div>
  );
}

function ResumeCard({ title, size }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-400">{size}</p>
        </div>
        <FiMoreVertical />
      </div>

      <div className="mt-3 flex gap-3 text-sm">
        <button className="flex items-center gap-1 text-blue-600">
          <FiEdit2 size={14} /> Edit
        </button>
        <button className="flex items-center gap-1 text-red-500">
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}


function Toggle({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={`w-10 h-5 rounded-full relative transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
