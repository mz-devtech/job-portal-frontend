"use client";

import { useState, useEffect } from "react";
import {
  FiUpload, FiMoreVertical, FiTrash2, FiEdit2, FiX,
  FiSave, FiPlus, FiChevronDown, FiCalendar, FiBriefcase,
  FiBook, FiGlobe, FiMapPin, FiPhone, FiMail, FiEye,
  FiEyeOff, FiLock, FiUser, FiCheck, FiLink, FiFile,
  FiRefreshCw
} from "react-icons/fi";
import { profileService } from "@/services/candidateprofileService";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export default function CandidateSettingsMain() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Get user from auth service
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      console.log("👤 [CandidateSettingsMain] Fetching profile for user:", currentUser?.id);

      // Try to get profile from API
      try {
        const profileData = await profileService.getMyProfile();
        setProfile(profileData);
        console.log("✅ [CandidateSettingsMain] Profile loaded:", profileData ? "Yes" : "No");
      } catch (error) {
        // If no profile exists, set to null
        setProfile(null);
        console.log("ℹ️ [CandidateSettingsMain] No profile exists yet");
      }
    } catch (error) {
      console.error("❌ [CandidateSettingsMain] Error fetching data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("lastSettingsTab", tab);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      console.log("💾 [CandidateSettingsMain] Saving data for tab:", activeTab);

      const result = await profileService.createOrUpdateCandidateProfile(data);

      // Update local state
      setProfile(result);

      // Show success message
      toast.success("Settings saved successfully!");

      return result;
    } catch (error) {
      console.error("❌ [CandidateSettingsMain] Save error:", error);
      toast.error("Failed to save settings: " + (error.message || "Unknown error"));
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchUserData();
    toast.success("Refreshing profile data...");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastTab = localStorage.getItem("lastSettingsTab");
      if (lastTab && ["personal", "profile", "social", "account"].includes(lastTab)) {
        setActiveTab(lastTab);
      }
    }
  }, []);

  if (loading) {
    return (
      <main className="mt-28 w-full min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-28 w-full min-h-screen bg-gray-50 px-4 py-4 sm:px-6 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {profile ? "Edit your existing profile" : "Create your profile"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>

          {profile?.completionPercentage !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${profile.completionPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {profile.completionPercentage}% complete
              </span>
            </div>
          )}
        </div>
      </div>

    // In the return statement, replace the Profile Status Alert section with:

      {/* Profile Status Alert - Only show if profile exists and is incomplete */}
      {profile && !profile.isProfileComplete && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Complete your profile
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your profile is {profile.completionPercentage}% complete.
                  Complete all sections to increase your visibility to employers.
                </p>
                <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profile.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert - Show when profile is complete */}
      {profile && profile.isProfileComplete && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Profile Complete! 🎉
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your profile is 100% complete and visible to employers.
                  Keep it updated for better job opportunities.
                </p>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profile.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 border-b flex gap-6 text-sm font-medium">
        <Tab
          label="Personal"
          active={activeTab === "personal"}
          onClick={() => handleTabChange("personal")}
          icon={<FiUser size={16} />}
        />
        <Tab
          label="Profile"
          active={activeTab === "profile"}
          onClick={() => handleTabChange("profile")}
          icon={<FiBriefcase size={16} />}
        />
        <Tab
          label="Social Links"
          active={activeTab === "social"}
          onClick={() => handleTabChange("social")}
          icon={<FiGlobe size={16} />}
        />
        <Tab
          label="Account Setting"
          active={activeTab === "account"}
          onClick={() => handleTabChange("account")}
          icon={<FiLock size={16} />}
        />
      </div>

      {/* Content */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        {activeTab === "personal" && (
          <PersonalTab
            profile={profile}
            user={user}
            onSave={handleSave}
            saving={saving}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
          />
        )}
        {activeTab === "social" && (
          <SocialLinksTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
          />
        )}
        {activeTab === "account" && (
          <AccountSettingsTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </div>
    </main>
  );
}

/* ---------------- Tabs ---------------- */

function Tab({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-3 transition-all ${active
          ? "border-b-2 border-blue-600 text-blue-600 font-medium"
          : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================= PERSONAL TAB ================= */

function PersonalTab({ profile, user, onSave, saving }) {
  const [formData, setFormData] = useState({
    fullName: profile?.personalInfo?.fullName || user?.name || "",
    title: profile?.personalInfo?.title || "",
    experience: profile?.personalInfo?.experience || "",
    education: profile?.personalInfo?.education || "",
    website: profile?.personalInfo?.website || "",
    profileImage: null,
    cv: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(
    profile?.personalInfo?.profileImage || user?.avatar || "/default-avatar.png"
  );
  const [cvFiles, setCvFiles] = useState(profile?.personalInfo?.cvUrl ? [
    {
      id: 1,
      title: "Current Resume",
      size: "PDF",
      url: profile.personalInfo.cvUrl
    }
  ] : []);

  const handleFileChange = (field, file) => {
    if (field === "profileImage") {
      setFormData(prev => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (field === "cv") {
      setFormData(prev => ({ ...prev, cv: file }));

      const newCv = {
        id: Date.now(),
        title: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        file: file,
      };
      setCvFiles(prev => [...prev, newCv]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        personalInfo: {
          fullName: formData.fullName,
          title: formData.title,
          experience: formData.experience,
          education: formData.education,
          website: formData.website,
        },
        files: {
          profileImage: formData.profileImage,
          cv: formData.cv,
        }
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const removeCvFile = (id) => {
    setCvFiles(prev => prev.filter(file => file.id !== id));
    if (id === 1) {
      // If removing the current resume from backend
      setFormData(prev => ({ ...prev, cv: null }));
    }
  };

  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-6">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Picture */}
        <div className="lg:col-span-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </p>

          <div className="relative">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Browse photo</span> or drop here
              </p>
              <p className="mt-1 text-xs text-gray-400">
                A photo larger than 400px work best. Max photo size 5MB.
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleFileChange("profileImage", e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="Full name *"
              placeholder="Esther Howard"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              required
            />

            <FormInput
              label="Title/headline *"
              placeholder="UI/UX Designer"
              value={formData.title}
              onChange={(value) => handleInputChange("title", value)}
              required
            />

            <FormSelect
              label="Experience *"
              value={formData.experience}
              onChange={(value) => handleInputChange("experience", value)}
              options={[
                { value: "", label: "Select experience" },
                { value: "Fresher", label: "Fresher" },
                { value: "0-1 years", label: "0-1 years" },
                { value: "1-3 years", label: "1-3 years" },
                { value: "3-5 years", label: "3-5 years" },
                { value: "5-10 years", label: "5-10 years" },
                { value: "10+ years", label: "10+ years" },
              ]}
              icon={<FiBriefcase className="text-gray-400" />}
              required
            />

            <FormSelect
              label="Education *"
              value={formData.education}
              onChange={(value) => handleInputChange("education", value)}
              options={[
                { value: "", label: "Select education" },
                { value: "High School", label: "High School" },
                { value: "Diploma", label: "Diploma" },
                { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                { value: "Master's Degree", label: "Master's Degree" },
                { value: "PhD", label: "PhD" },
                { value: "Other", label: "Other" },
              ]}
              icon={<FiBook className="text-gray-400" />}
              required
            />

            <div className="sm:col-span-2">
              <FormInput
                label="Personal Website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(value) => handleInputChange("website", value)}
                icon={<FiLink className="text-gray-400" />}
                type="url"
              />
            </div>
          </div>

          {/* CV/Resume Section */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">
              Your CV/Resume
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvFiles.map((cv) => (
                <ResumeCard
                  key={cv.id}
                  title={cv.title}
                  size={cv.size}
                  url={cv.url}
                  onDelete={() => removeCvFile(cv.id)}
                />
              ))}

              {/* Add CV Button */}
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-500 transition-colors">
                <FiUpload className="text-gray-400 mb-2" size={20} />
                <p className="text-sm text-gray-600">Add CV/Resume</p>
                <p className="text-xs text-gray-400 mt-1">Only PDF (Max 5MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileChange("cv", e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || !formData.fullName || !formData.title}
            className="mt-8 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= PROFILE TAB ================= */

function ProfileTab({ profile, onSave, saving }) {
  const [formData, setFormData] = useState({
    nationality: profile?.profileDetails?.nationality || "",
    dateOfBirth: profile?.profileDetails?.dateOfBirth
      ? new Date(profile.profileDetails.dateOfBirth).toISOString().split('T')[0]
      : "",
    gender: profile?.profileDetails?.gender || "",
    maritalStatus: profile?.profileDetails?.maritalStatus || "",
    education: profile?.profileDetails?.education || "",
    experience: profile?.profileDetails?.experience || "",
    biography: profile?.profileDetails?.biography || "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        profileDetails: {
          ...formData,
          dateOfBirth: formData.dateOfBirth || undefined,
        }
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-6">
        Profile Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Nationality"
          value={formData.nationality}
          onChange={(value) => handleInputChange("nationality", value)}
          options={[
            { value: "", label: "Select nationality" },
            { value: "Bangladeshi", label: "Bangladeshi" },
            { value: "Indian", label: "Indian" },
            { value: "American", label: "American" },
            { value: "British", label: "British" },
            { value: "Canadian", label: "Canadian" },
            { value: "Australian", label: "Australian" },
            { value: "Other", label: "Other" },
          ]}
          icon={<FiGlobe className="text-gray-400" />}
        />

        <FormInput
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(value) => handleInputChange("dateOfBirth", value)}
          icon={<FiCalendar className="text-gray-400" />}
        />

        <FormSelect
          label="Gender"
          value={formData.gender}
          onChange={(value) => handleInputChange("gender", value)}
          options={[
            { value: "", label: "Select gender" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
            { value: "Prefer not to say", label: "Prefer not to say" },
          ]}
          icon={<FiUser className="text-gray-400" />}
        />

        <FormSelect
          label="Marital Status"
          value={formData.maritalStatus}
          onChange={(value) => handleInputChange("maritalStatus", value)}
          options={[
            { value: "", label: "Select status" },
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
          ]}
        />

        <FormSelect
          label="Education"
          value={formData.education}
          onChange={(value) => handleInputChange("education", value)}
          options={[
            { value: "", label: "Select education" },
            { value: "High School", label: "High School" },
            { value: "Diploma", label: "Diploma" },
            { value: "Bachelor's Degree", label: "Bachelor's Degree" },
            { value: "Master's Degree", label: "Master's Degree" },
            { value: "PhD", label: "PhD" },
            { value: "Other", label: "Other" },
          ]}
          icon={<FiBook className="text-gray-400" />}
        />

        <FormSelect
          label="Experience"
          value={formData.experience}
          onChange={(value) => handleInputChange("experience", value)}
          options={[
            { value: "", label: "Select experience" },
            { value: "Fresher", label: "Fresher" },
            { value: "0-1 years", label: "0-1 years" },
            { value: "1-3 years", label: "1-3 years" },
            { value: "3-5 years", label: "3-5 years" },
            { value: "5-10 years", label: "5-10 years" },
            { value: "10+ years", label: "10+ years" },
          ]}
          icon={<FiBriefcase className="text-gray-400" />}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biography
        </label>
        <textarea
          rows={6}
          value={formData.biography}
          onChange={(e) => handleInputChange("biography", e.target.value)}
          placeholder="Write about your background, skills, achievements, and career goals..."
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
        <p className="mt-1 text-xs text-gray-500">
          Tell employers about yourself. This will appear on your public profile.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="mt-8 flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave size={16} />
            Save Changes
          </>
        )}
      </button>
    </>
  );
}

/* ================= SOCIAL LINKS TAB ================= */

function SocialLinksTab({ profile, onSave, saving }) {
  // Fix: Properly initialize with profile data or empty array
  const [socialLinks, setSocialLinks] = useState(() => {
    if (profile?.socialLinks && profile.socialLinks.length > 0) {
      // Map the social links from profile, ensuring platform and url fields exist
      return profile.socialLinks.map(link => ({
        platform: link.platform || "",
        url: link.url || "",
        _id: link._id // Keep the _id if it exists
      }));
    }
    // Default empty links
    return [
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
    ];
  });

  const socialPlatforms = [
    { value: "facebook", label: "Facebook", icon: "🔵" },
    { value: "twitter", label: "Twitter", icon: "🐦" },
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "youtube", label: "YouTube", icon: "▶️" },
    { value: "github", label: "GitHub", icon: "💻" },
    { value: "behance", label: "Behance", icon: "🎨" },
    { value: "dribbble", label: "Dribbble", icon: "🏀" },
    { value: "pinterest", label: "Pinterest", icon: "📌" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
    { value: "snapchat", label: "Snapchat", icon: "👻" },
    { value: "whatsapp", label: "WhatsApp", icon: "💚" },
    { value: "telegram", label: "Telegram", icon: "✈️" },
    { value: "discord", label: "Discord", icon: "🎮" },
    { value: "medium", label: "Medium", icon: "📝" },
    { value: "reddit", label: "Reddit", icon: "👽" },
    { value: "quora", label: "Quora", icon: "❓" },
    { value: "stackoverflow", label: "Stack Overflow", icon: "💻" },
    { value: "gitlab", label: "GitLab", icon: "🦊" },
    { value: "bitbucket", label: "Bitbucket", icon: "🚀" },
    { value: "vimeo", label: "Vimeo", icon: "🎬" },
    { value: "twitch", label: "Twitch", icon: "🟣" },
    { value: "skype", label: "Skype", icon: "💬" },
    { value: "slack", label: "Slack", icon: "💼" },
    { value: "zoom", label: "Zoom", icon: "📹" },
    { value: "flickr", label: "Flickr", icon: "📸" },
    { value: "tumblr", label: "Tumblr", icon: "📱" },
    { value: "vk", label: "VK", icon: "🇷🇺" },
    { value: "wechat", label: "WeChat", icon: "💬" },
    { value: "weibo", label: "Weibo", icon: "🇨🇳" },
    { value: "line", label: "Line", icon: "💚" },
    { value: "kakao", label: "Kakao", icon: "💛" },
    { value: "whatsapp_business", label: "WhatsApp Business", icon: "💼" },
    { value: "messenger", label: "Messenger", icon: "💙" },
    { value: "signal", label: "Signal", icon: "🔒" },
  ];

  const updateLink = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  const addLink = () => {
    setSocialLinks(prev => [...prev, { platform: "", url: "" }]);
  };

  const removeLink = (index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty links
      const validLinks = socialLinks.filter(
        link => link.platform && link.url
      );

      const dataToSave = {
        socialLinks: validLinks
      };

      console.log("Saving social links:", dataToSave);
      await onSave(dataToSave);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <>
      <h3 className="text-base font-semibold text-gray-800 mb-6">
        Social Media Profiles
      </h3>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-3">
              <select
                value={link.platform}
                onChange={(e) => updateLink(index, "platform", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <option value="">Select Platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.icon} {platform.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-8">
              <input
                type="url"
                placeholder="Profile link/url..."
                value={link.url}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div className="col-span-1">
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-md py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <FiPlus size={16} />
        Add New Social Link
      </button>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="mt-8 w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave size={16} />
            Save Social Links
          </>
        )}
      </button>
    </>
  );
}

/* ================= ACCOUNT SETTINGS TAB ================= */

function AccountSettingsTab({ profile, onSave, saving }) {
  const [formData, setFormData] = useState({
    // Contact Info
    contact: {
      location: profile?.accountSettings?.contact?.location || "",
      phone: profile?.accountSettings?.contact?.phone || "",
      email: profile?.accountSettings?.contact?.email || "",
    },
    // Notifications
    notifications: {
      shortlisted: profile?.accountSettings?.notifications?.shortlisted ?? true,
      saved: profile?.accountSettings?.notifications?.saved ?? true,
      jobExpired: profile?.accountSettings?.notifications?.jobExpired ?? true,
      rejected: profile?.accountSettings?.notifications?.rejected ?? true,
      jobAlerts: profile?.accountSettings?.notifications?.jobAlerts ?? true,
    },
    // Job Alerts
    jobAlerts: {
      role: profile?.accountSettings?.jobAlerts?.role || "",
      location: profile?.accountSettings?.jobAlerts?.location || "",
    },
    // Privacy
    privacy: {
      profilePublic: profile?.accountSettings?.privacy?.profilePublic ?? true,
      resumePublic: profile?.accountSettings?.privacy?.resumePublic ?? false,
    },
    // Password Change
    password: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleNotificationChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: checked }
    }));
  };

  const handleJobAlertChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      jobAlerts: { ...prev.jobAlerts, [field]: value }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      password: { ...prev.password, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        accountSettings: {
          notifications: formData.notifications,
          jobAlerts: formData.jobAlerts,
          privacy: formData.privacy,
          contact: formData.contact,
        }
      };

      await onSave(dataToSave);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= CONTACT INFO ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPhone size={16} />
          Contact Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Map Location"
            placeholder="City, state, country name"
            value={formData.contact.location}
            onChange={(value) => handleContactChange("location", value)}
            icon={<FiMapPin className="text-gray-400" />}
          />

          <FormInput
            label="Phone"
            placeholder="+880 1234 56789"
            value={formData.contact.phone}
            onChange={(value) => handleContactChange("phone", value)}
            icon={<FiPhone className="text-gray-400" />}
            type="tel"
          />

          <div className="md:col-span-2">
            <FormInput
              label="Email"
              placeholder="email@example.com"
              value={formData.contact.email}
              onChange={(value) => handleContactChange("email", value)}
              icon={<FiMail className="text-gray-400" />}
              type="email"
            />
          </div>
        </div>
      </section>

      {/* ================= NOTIFICATIONS ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-3">
          {[
            { id: "shortlisted", label: "Notify me when employers shortlist me" },
            { id: "saved", label: "Notify me when employers save my profile" },
            { id: "jobExpired", label: "Notify me when my applied jobs are expired" },
            { id: "rejected", label: "Notify me when employers reject me" },
            { id: "jobAlerts", label: "Notify me when I have up to 5 new job alerts" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.notifications[item.id]}
                  onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${formData.notifications[item.id]
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                  }`}>
                  {formData.notifications[item.id] && (
                    <FiCheck size={12} className="text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ================= JOB ALERTS ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Job Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Preferred Role"
            placeholder="e.g., Software Engineer, Product Designer"
            value={formData.jobAlerts.role}
            onChange={(value) => handleJobAlertChange("role", value)}
          />

          <FormInput
            label="Preferred Location"
            placeholder="City, state, country name"
            value={formData.jobAlerts.location}
            onChange={(value) => handleJobAlertChange("location", value)}
            icon={<FiMapPin className="text-gray-400" />}
          />
        </div>
      </section>

      {/* ================= PRIVACY SETTINGS ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Privacy Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Profile Privacy</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.privacy.profilePublic
                    ? "Your profile is visible to employers"
                    : "Your profile is private"}
                </p>
              </div>
              <Toggle
                enabled={formData.privacy.profilePublic}
                onToggle={() => handlePrivacyChange("profilePublic", !formData.privacy.profilePublic)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-800">Resume Privacy</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.privacy.resumePublic
                    ? "Your resume is visible to employers"
                    : "Your resume is private"}
                </p>
              </div>
              <Toggle
                enabled={formData.privacy.resumePublic}
                onToggle={() => handlePrivacyChange("resumePublic", !formData.privacy.resumePublic)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHANGE PASSWORD ================= */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Change Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            value={formData.password.current}
            onChange={(value) => handlePasswordChange("current", value)}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={formData.password.new}
            onChange={(value) => handlePasswordChange("new", value)}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm new password"
            value={formData.password.confirm}
            onChange={(value) => handlePasswordChange("confirm", value)}
          />
        </div>
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

        <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
          <FiTrash2 size={14} />
          Close Account
        </button>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving All Settings...
          </>
        ) : (
          <>
            <FiSave size={16} />
            Save All Settings
          </>
        )}
      </button>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function FormInput({ label, placeholder, value, onChange, icon, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${icon ? "pl-10" : ""
            }`}
          required={required}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, value, onChange, options, icon, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors appearance-none ${icon ? "pl-10" : ""
            }`}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function PasswordInput({ label, placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <FiLock className="text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}

function ResumeCard({ title, size, url, onDelete }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <FiFile className="text-blue-600" />
            <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">{size}</p>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      <div className="mt-3 flex gap-3 text-sm">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
          >
            <FiEye size={14} /> View
          </a>
        )}
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
          <FiEdit2 size={14} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-red-500 hover:text-red-600"
        >
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'
        }`} />
    </button>
  );
}