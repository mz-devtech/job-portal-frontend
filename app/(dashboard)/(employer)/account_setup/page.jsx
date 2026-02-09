"use client";

import { useState } from "react";
import {
  FiUploadCloud,
  FiUser,
  FiGlobe,
  FiShare2,
  FiPhone,
  FiBriefcase,
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiList,
  FiAlignLeft,
  FiChevronDown,
  FiCalendar,
  FiX,
  FiPlus,
  FiCheck,
  FiArrowLeft,
  FiHome,
  FiFileText,
} from "react-icons/fi";

const SOCIAL_PLATFORMS = [
  { label: "Facebook", value: "facebook" },
  { label: "Twitter", value: "twitter" },
  { label: "Instagram", value: "instagram" },
  { label: "Youtube", value: "youtube" },
  { label: "LinkedIn", value: "linkedin" },
];

const STEPS = [
  { id: "company", label: "Company Info", icon: <FiUser /> },
  { id: "founding", label: "Founding Info", icon: <FiGlobe /> },
  { id: "social", label: "Social Media Profile", icon: <FiShare2 /> },
  { id: "contact", label: "Contact", icon: <FiPhone /> },
];

export default function AccountSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    company: {
      name: "",
      about: "",
      logo: null,
      banner: null,
    },
    founding: {
      organizationType: "",
      industryType: "",
      teamSize: "",
      year: "",
      website: "",
      vision: "",
    },
    social: [
      { platform: "facebook", url: "" },
      { platform: "twitter", url: "" },
      { platform: "instagram", url: "" },
      { platform: "youtube", url: "" },
    ],
    contact: {
      location: "",
      phone: "",
      email: "",
    },
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - show success modal
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateSocialLinks = (index, field, value) => {
    const updatedLinks = [...formData.social];
    updatedLinks[index][field] = value;
    setFormData(prev => ({
      ...prev,
      social: updatedLinks
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      social: [...prev.social, { platform: "", url: "" }]
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Here you would typically send data to your backend
    // Show success modal after submission
    setShowSuccessModal(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <CompanyInfoStep data={formData.company} updateData={updateFormData} />;
      case 1:
        return <FoundingInfoStep data={formData.founding} updateData={updateFormData} />;
      case 2:
        return (
          <SocialMediaStep
            links={formData.social}
            updateLink={updateSocialLinks}
            addLink={addSocialLink}
            removeLink={removeSocialLink}
          />
        );
      case 3:
        return <ContactStep data={formData.contact} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-8 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FiBriefcaseIcon />
            Jobpilot
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-500">Setup Progress</span>
            <div className="h-1 w-40 rounded bg-gray-200">
              <div 
                className="h-1 rounded bg-blue-600 transition-all duration-300"
                style={{ width: `${(currentStep + 1) * 25}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {Math.round((currentStep + 1) * 25)}% Completed
            </p>
          </div>
        </header>

        {/* Steps Navigation */}
        <div className="flex items-center gap-8 border-b px-8 py-4 text-sm">
          {STEPS.map((step, index) => (
            <Step
              key={step.id}
              icon={step.icon}
              label={step.label}
              active={index === currentStep}
              completed={index < currentStep}
              onClick={() => {
                if (index <= currentStep) setCurrentStep(index);
              }}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Content Area */}
        <main className="mx-auto max-w-4xl px-6 py-10">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md border text-sm ${
                currentStep === 0
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiArrowLeft />
              Previous
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              {currentStep === STEPS.length - 1 ? "Complete Setup" : "Save & Next →"}
            </button>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </>
  );
}

/* ================= SUCCESS MODAL ================= */

function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            🎉 Congratulations!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-2">
            Your company profile setup is 100% complete
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Donec hendrerit, ante mattis pellentesque eleifend, tortor
            urna malesuada ante, eget aliquam nulla augue hendrerit
            ligula. Nunc mauris arcu, mattis sed sem vitae.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon="🏢" 
              title="Company Profile" 
              value="Active" 
              status="success" 
            />
            <StatCard 
              icon="👥" 
              title="Team Members" 
              value="Ready" 
              status="success" 
            />
            <StatCard 
              icon="🌐" 
              title="Social Links" 
              value="Connected" 
              status="success" 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              <FiHome className="w-4 h-4" />
              Go to Dashboard
            </button>

            <button
              onClick={() => {
                // Handle post job action
                console.log("Post job clicked");
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FiFileText className="w-4 h-4" />
              Post Your First Job
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-gray-500">
              Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a> or 
              <a href="#" className="text-blue-600 hover:underline ml-2">View Setup Guide</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, status }) {
  const statusColors = {
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 ${statusColors[status]}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
        {value}
      </div>
    </div>
  );
}

/* ================= STEP COMPONENTS ================= */

function CompanyInfoStep({ data, updateData }) {
  return (
    <div className="space-y-6">
      {/* Logo & Banner */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-800">
          Logo & Banner Image
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Logo */}
          <UploadBox
            title="Upload Logo"
            note="A photo larger than 400 pixels work best. Max photo size 5 MB."
            value={data.logo}
            onChange={(file) => updateData("company", "logo", file)}
          />

          {/* Banner */}
          <UploadBox
            title="Banner Image"
            note="Banner images optimal dimension 1520x400. Supported format JPEG, PNG. Max photo size 5 MB."
            wide
            value={data.banner}
            onChange={(file) => updateData("company", "banner", file)}
          />
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Company name
        </label>
        <input
          type="text"
          placeholder="Enter company name"
          value={data.name}
          onChange={(e) => updateData("company", "name", e.target.value)}
          className="w-full rounded-md border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* About Us */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          About Us
        </label>

        <div className="rounded-md border">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-3 py-2 text-gray-500">
            <FiBold />
            <FiItalic />
            <FiUnderline />
            <FiLink />
            <FiList />
            <FiAlignLeft />
          </div>

          {/* Editor */}
          <textarea
            rows={6}
            placeholder="Write down about your company here. Let the candidate know who we are..."
            value={data.about}
            onChange={(e) => updateData("company", "about", e.target.value)}
            className="w-full resize-none px-4 py-3 text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function FoundingInfoStep({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Type
          </label>
          <div className="relative">
            <select
              value={data.organizationType}
              onChange={(e) => updateData("founding", "organizationType", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="">Select...</option>
              <option value="private">Private Limited</option>
              <option value="public">Public Limited</option>
              <option value="llc">LLC</option>
              <option value="nonprofit">Non-Profit</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Industry Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Types
          </label>
          <div className="relative">
            <select
              value={data.industryType}
              onChange={(e) => updateData("founding", "industryType", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="">Select...</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size
          </label>
          <div className="relative">
            <select
              value={data.teamSize}
              onChange={(e) => updateData("founding", "teamSize", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
            >
              <option value="">Select...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year of Establishment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Establishment
          </label>
          <div className="relative">
            <input
              type="date"
              value={data.year}
              onChange={(e) => updateData("founding", "year", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Website
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="Website url..."
              value={data.website}
              onChange={(e) => updateData("founding", "website", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Company Vision */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Vision
        </label>
        <textarea
          rows={5}
          placeholder="Tell us about your company vision..."
          value={data.vision}
          onChange={(e) => updateData("founding", "vision", e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SocialMediaStep({ links, updateLink, addLink, removeLink }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Link {index + 1}
            </label>

            <div className="flex gap-3 items-center">
              {/* Platform */}
              <select
                className="w-40 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={link.platform}
                onChange={(e) => updateLink(index, "platform", e.target.value)}
              >
                <option value="">Select Platform</option>
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              {/* URL */}
              <input
                type="url"
                placeholder="Profile link/url..."
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="w-9 h-9 flex items-center justify-center border rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500 transition"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <button
        type="button"
        onClick={addLink}
        className="w-full border border-dashed rounded-md py-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2"
      >
        <FiPlus />
        Add New Social Link
      </button>
    </div>
  );
}

function ContactStep({ data, updateData }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Map Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Map Location
        </label>
        <input
          type="text"
          placeholder="Enter your location"
          value={data.location}
          onChange={(e) => updateData("contact", "location", e.target.value)}
          className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>

        <div className="flex">
          {/* Country Code */}
          <div className="flex items-center gap-2 border rounded-l-md px-3 bg-gray-50 text-sm min-w-[100px]">
            <span>🇧🇩</span>
            <span>+880</span>
          </div>

          {/* Number */}
          <input
            type="tel"
            placeholder="Phone number..."
            value={data.phone}
            onChange={(e) => updateData("contact", "phone", e.target.value)}
            className="w-full border border-l-0 rounded-r-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>

        <div className="flex items-center border rounded-md px-3 py-2">
          <span className="text-gray-400 mr-2">✉️</span>
          <input
            type="email"
            placeholder="Email address"
            value={data.email}
            onChange={(e) => updateData("contact", "email", e.target.value)}
            className="w-full text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Step({ icon, label, active, completed, onClick, isLast }) {
  return (
    <button
      onClick={onClick}
      disabled={!completed && !active}
      className={`flex items-center gap-2 pb-3 transition ${
        active
          ? "border-b-2 border-blue-600 text-blue-600 font-medium"
          : completed
          ? "text-green-600 cursor-pointer hover:text-green-700"
          : "text-gray-400 cursor-not-allowed"
      }`}
    >
      {completed ? <FiCheck className="text-green-600" /> : icon}
      {label}
      {!isLast && (
        <div className={`ml-6 h-0.5 w-8 ${completed ? 'bg-green-600' : 'bg-gray-300'}`} />
      )}
    </button>
  );
}

function UploadBox({ title, note, wide, value, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center cursor-pointer hover:border-blue-400 transition ${
        wide ? "md:col-span-2" : ""
      }`}
      onClick={() => document.getElementById(`file-input-${title}`)?.click()}
    >
      <input
        id={`file-input-${title}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {value ? (
        <div className="text-green-600">
          <FiCheck className="text-2xl mx-auto" />
          <p className="mt-2 text-sm">File uploaded</p>
        </div>
      ) : (
        <>
          <FiUploadCloud className="text-2xl text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Browse photo</span> or drop here
          </p>
        </>
      )}
      <p className="mt-1 text-xs text-gray-400">{note}</p>
    </div>
  );
}

function FiBriefcaseIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="text-blue-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-9 4h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
      />
    </svg>
  );
}