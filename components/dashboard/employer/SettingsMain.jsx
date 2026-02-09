"use client";

import { useState } from "react";
import { 
  FiUpload, 
  FiChevronDown, 
  FiCalendar, 
  FiLink,
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube, 
  FiX, 
  FiPlus,
  FiEye 
} from "react-icons/fi";

const SOCIAL_OPTIONS = [
  { label: "Facebook", icon: <FiFacebook />, value: "facebook" },
  { label: "Twitter", icon: <FiTwitter />, value: "twitter" },
  { label: "Instagram", icon: <FiInstagram />, value: "instagram" },
  { label: "Youtube", icon: <FiYoutube />, value: "youtube" },
];

export default function SettingsMain() {
  const [activeTab, setActiveTab] = useState("company");

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
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        Settings
      </h2>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b text-sm">
        <Tab 
          label="Company Info" 
          active={activeTab === "company"} 
          onClick={() => setActiveTab("company")}
        />
        <Tab 
          label="Founding Info" 
          active={activeTab === "founding"} 
          onClick={() => setActiveTab("founding")}
        />
        <Tab 
          label="Social Media Profile" 
          active={activeTab === "social"} 
          onClick={() => setActiveTab("social")}
        />
        <Tab 
          label="Account Setting" 
          active={activeTab === "account"} 
          onClick={() => setActiveTab("account")}
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === "company" && <CompanyInfoTab />}
      {activeTab === "founding" && <FoundingInfoTab />}
      {activeTab === "social" && <SocialMediaTab />}
      {activeTab === "account" && <AccountSettingsTab />}
    </main>
  );
}

/* ================= TABS CONTENT ================= */

function CompanyInfoTab() {
  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800">
        Logo & Banner Image
      </h3>

      {/* Upload Section (30% / 70%) */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Logo – 30% */}
        <div className="col-span-12 md:col-span-4">
          <UploadBox title="Upload Logo" />
        </div>

        {/* Banner – 70% */}
        <div className="col-span-12 md:col-span-8">
          <UploadBox title="Banner Image" large />
        </div>
      </div>

      {/* Company Name */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Company name
        </label>
        <input
          type="text"
          placeholder="Enter company name"
          className="
            mt-2 w-full rounded-md border
            px-4 py-2 text-sm
            focus:border-blue-500 focus:outline-none
          "
        />
      </div>

      {/* About */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          About us
        </label>
        <textarea
          rows={5}
          placeholder="Write down about your company here. Let the candidate know who we are..."
          className="
            mt-2 w-full rounded-md border
            px-4 py-3 text-sm
            focus:border-blue-500 focus:outline-none
          "
        />
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          className="
            rounded-md bg-blue-600
            px-6 py-2 text-sm font-medium
            text-white hover:bg-blue-700
          "
        >
          Save Change
        </button>
      </div>
    </div>
  );
}

function FoundingInfoTab() {
  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Select label="Organization Type" />
        <Select label="Industry Types" />
        <Select label="Team Size" />
      </div>

      {/* Row 2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <DateInput label="Year of Establishment" />
        <TextInput
          label="Company Website"
          placeholder="Website url..."
          icon={<FiLink />}
        />
      </div>

      {/* Company Vision */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Company Vision
        </label>

        <textarea
          rows={5}
          placeholder="Tell us what Vision of your company..."
          className="
            mt-2 w-full rounded-md border
            px-4 py-3 text-sm
            focus:border-blue-500 focus:outline-none
          "
        />

        {/* Editor Toolbar (visual only) */}
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
          <span>B</span>
          <span>I</span>
          <span>U</span>
          <span>•</span>
          <span>🔗</span>
          <span>≡</span>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          className="
            rounded-md bg-blue-600
            px-6 py-2 text-sm font-medium
            text-white hover:bg-blue-700
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SocialMediaTab() {
  const [links, setLinks] = useState([
    { platform: "facebook", url: "" },
    { platform: "twitter", url: "" },
    { platform: "instagram", url: "" },
    { platform: "youtube", url: "" },
  ]);

  const updateLink = (index, key, value) => {
    const updated = [...links];
    updated[index][key] = value;
    setLinks(updated);
  };

  const removeLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const addLink = () => {
    setLinks([...links, { platform: "facebook", url: "" }]);
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">
        Social Media Profile
      </h3>

      <div className="space-y-4">
        {links.map((item, index) => (
          <SocialRow
            key={index}
            item={item}
            onChange={(key, value) => updateLink(index, key, value)}
            onRemove={() => removeLink(index)}
          />
        ))}
      </div>

      {/* Add new */}
      <button
        onClick={addLink}
        className="
          mt-4 flex items-center gap-2 rounded-md
          bg-gray-100 px-4 py-2 text-sm text-gray-700
          hover:bg-gray-200
        "
      >
        <FiPlus />
        Add New Social Link
      </button>

      {/* Save */}
      <div className="mt-6">
        <button
          className="
            rounded-md bg-blue-600 px-6 py-2
            text-sm font-medium text-white
            hover:bg-blue-700
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AccountSettingsTab() {
  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm space-y-8">
      {/* ---------------- Contact Information ---------------- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Contact Information
        </h3>

        <div className="space-y-4">
          {/* Map Location */}
          <div>
            <label className="text-sm text-gray-600">Map Location</label>
            <input
              type="text"
              placeholder=""
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <div className="mt-1 flex">
              <select
                className="rounded-l-md border border-r-0 px-3 py-2 text-sm focus:outline-none"
              >
                <option>🇧🇩 +880</option>
                <option>🇺🇸 +1</option>
                <option>🇮🇳 +91</option>
              </select>
              <input
                type="text"
                placeholder="Phone number.."
                className="w-full rounded-r-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="relative mt-1">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-md border px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ✉
              </span>
            </div>
          </div>

          <button
            className="
              mt-2 rounded-md bg-blue-600 px-6 py-2
              text-sm font-medium text-white hover:bg-blue-700
            "
          >
            Save Changes
          </button>
        </div>
      </section>

      <hr />

      {/* ---------------- Change Password ---------------- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Change Password
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <PasswordInput label="Current Password" />
          <PasswordInput label="New Password" />
          <PasswordInput label="Confirm Password" />
        </div>

        <button
          className="
            mt-4 rounded-md bg-blue-600 px-6 py-2
            text-sm font-medium text-white hover:bg-blue-700
          "
        >
          Change Password
        </button>
      </section>

      <hr />

      {/* ---------------- Delete Company ---------------- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Delete Your Company
        </h3>

        <p className="text-sm text-gray-500 max-w-2xl">
          If you delete your Jobpilot account, you will no longer be able
          to get information about the matched jobs, following employers,
          and job alert, shortlisted jobs and more. You will be abandoned
          from all the services of Jobpilot.com.
        </p>

        <button
          className="
            mt-4 flex items-center gap-2 text-sm
            text-red-500 hover:underline
          "
        >
          ⛔ Close Account
        </button>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 transition ${
        active
          ? "border-b-2 border-blue-600 font-medium text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function UploadBox({ title, large }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">
        {title}
      </p>

      <div
        className={`
          mt-2 flex cursor-pointer items-center
          justify-center rounded-md border border-dashed
          bg-gray-50 hover:bg-gray-100
          ${large ? "h-48" : "h-32"}
        `}
      >
        <div className="text-center text-gray-500">
          <FiUpload className="mx-auto text-xl" />
          <p className="mt-2 text-sm">Click to upload</p>
          <p className="text-xs text-gray-400">
            PNG, JPG up to 5MB
          </p>
        </div>
      </div>

      <div className="mt-2 flex gap-4 text-xs text-blue-600">
        <button>Remove</button>
        <button>Replace</button>
      </div>
    </div>
  );
}

function Select({ label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-2">
        <select
          className="
            w-full appearance-none rounded-md border
            px-4 py-2 text-sm text-gray-500
            focus:border-blue-500 focus:outline-none
          "
        >
          <option>Select...</option>
        </select>

        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function DateInput({ label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          type="date"
          className="
            w-full rounded-md border
            px-4 py-2 text-sm
            focus:border-blue-500 focus:outline-none
          "
        />
        <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function TextInput({ label, placeholder, icon }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          type="text"
          placeholder={placeholder}
          className="
            w-full rounded-md border
            px-4 py-2 pl-10 text-sm
            focus:border-blue-500 focus:outline-none
          "
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

function SocialRow({ item, onChange, onRemove }) {
  const selected = SOCIAL_OPTIONS.find(
    (s) => s.value === item.platform
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Select */}
      <div className="relative w-full sm:w-48">
        <select
          value={item.platform}
          onChange={(e) =>
            onChange("platform", e.target.value)
          }
          className="
            w-full appearance-none rounded-md border
            px-3 py-2 pr-8 text-sm
            focus:border-blue-500 focus:outline-none
          "
        >
          {SOCIAL_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          {selected?.icon}
        </span>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Profile link/url..."
        value={item.url}
        onChange={(e) => onChange("url", e.target.value)}
        className="
          w-full flex-1 rounded-md border px-3 py-2 text-sm
          focus:border-blue-500 focus:outline-none
        "
      />

      {/* Remove */}
      <button
        onClick={onRemove}
        className="
          flex h-10 w-10 items-center justify-center
          rounded-md border text-gray-400
          hover:bg-gray-100 hover:text-red-500
        "
      >
        <FiX />
      </button>
    </div>
  );
}

function PasswordInput({ label }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <div className="relative mt-1">
        <input
          type="password"
          placeholder="Password"
          className="
            w-full rounded-md border px-3 py-2 pr-10
            text-sm focus:border-blue-500 focus:outline-none
          "
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FiEye />
        </span>
      </div>
    </div>
  );
}