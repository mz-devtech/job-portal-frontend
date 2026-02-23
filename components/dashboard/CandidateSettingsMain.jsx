"use client";

import { useState, useEffect } from "react";
import {
  FiUpload, FiMoreVertical, FiTrash2, FiEdit2, FiX,
  FiSave, FiPlus, FiChevronDown, FiCalendar, FiBriefcase,
  FiBook, FiGlobe, FiMapPin, FiPhone, FiMail, FiEye,
  FiEyeOff, FiLock, FiUser, FiCheck, FiLink, FiFile,
  FiRefreshCw, FiHome, FiCamera, FiLoader, FiAlertCircle,
  FiImage
} from "react-icons/fi";
import { Sparkles, Shield, ArrowRight, Building, Users, Share2, Phone, CheckCircle } from 'lucide-react';
import { profileService } from "@/services/candidateprofileService";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export default function CandidateSettingsMain() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

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
      <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white px-3 py-4 sm:px-4 md:ml-[270px] md:w-[calc(100%-270px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto flex items-center justify-center relative">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative text-center animate-fadeIn">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 flex items-center gap-2">
            <FiLoader className="w-4 h-4 animate-spin" />
            Loading profile data...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white px-3 py-4 sm:px-4 md:ml-[270px] md:w-[calc(100%-270px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto relative">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="flex justify-between items-center animate-fadeIn ml-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Profile Settings
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="group flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-800 transition-all px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-400 hover:bg-blue-50"
            >
              <FiRefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Refresh
            </button>

            {profile?.completionPercentage !== undefined && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                    style={{ width: `${profile.completionPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-green-600 font-medium">
                  {profile.completionPercentage}% complete
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Status Alert - Only show if profile exists and is incomplete */}
        {profile && !profile.isProfileComplete && (
          <div className="mt-4 animate-slideIn">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 flex-1">
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
          </div>
        )}

        {/* Success Alert - Show when profile is complete */}
        {profile && profile.isProfileComplete && (
          <div className="mt-4 animate-slideIn">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3 flex-1">
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
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-4 border-b text-xs overflow-x-auto pb-1 animate-fadeIn">
          <Tab 
            label="Personal Info"
            icon={<FiUser className="w-3.5 h-3.5" />}
            active={activeTab === "personal"} 
            hovered={hoveredTab === "personal"}
            onHover={() => setHoveredTab("personal")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => handleTabChange("personal")}
          />
          <Tab 
            label="Profile Details"
            icon={<FiBriefcase className="w-3.5 h-3.5" />}
            active={activeTab === "profile"} 
            hovered={hoveredTab === "profile"}
            onHover={() => setHoveredTab("profile")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => handleTabChange("profile")}
          />
          <Tab 
            label="Social Links"
            icon={<Share2 className="w-3.5 h-3.5" />}
            active={activeTab === "social"} 
            hovered={hoveredTab === "social"}
            onHover={() => setHoveredTab("social")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => handleTabChange("social")}
          />
          <Tab 
            label="Account Settings"
            icon={<FiLock className="w-3.5 h-3.5" />}
            active={activeTab === "account"} 
            hovered={hoveredTab === "account"}
            onHover={() => setHoveredTab("account")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => handleTabChange("account")}
          />
        </div>

        {/* Content */}
        <div className="mt-4 animate-fadeIn">
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
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-5px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, icon, active, hovered, onHover, onLeave, onClick }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center gap-1.5 pb-2 px-2 text-xs font-medium transition-all duration-300 relative group ${
        active
          ? "text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <span className={`transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}>
        {icon}
      </span>
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 animate-slideIn"></div>
      )}
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
  const [isHoveringImage, setIsHoveringImage] = useState(false);

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
      setFormData(prev => ({ ...prev, cv: null }));
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 space-y-5">
      {/* Profile Image */}
      <section className="animate-slideIn">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <FiImage className="text-blue-600 w-4 h-4" />
            <h3 className="text-xs font-semibold text-gray-800">
              Profile Picture
            </h3>
          </div>
          <button
            onClick={() => document.getElementById('profile-image-input')?.click()}
            className="group flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiCamera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Change
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div 
            className="relative"
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            <div className={`w-24 h-24 rounded-full overflow-hidden border-3 border-white shadow-lg transition-transform duration-300 ${isHoveringImage ? 'scale-105' : ''}`}>
              <img 
                src={profileImagePreview} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Upload overlay */}
            <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity duration-300 ${isHoveringImage ? 'opacity-100' : 'opacity-0'}`}>
              <FiCamera className="w-6 h-6 text-white" />
            </div>
            
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileChange("profileImage", e.target.files[0]);
                }
              }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Click "Change" to upload a new profile picture
          </p>
        </div>
      </section>

      {/* Basic Information */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiUser className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          <div className="md:col-span-2">
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
      </section>

      {/* CV/Resume Section */}
      <section className="animate-slideIn pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 mb-3">
          <FiFile className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Your CV/Resume
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-blue-500 hover:bg-gray-50 transition-all duration-300 group">
            <FiUpload className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" size={20} />
            <p className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">Add CV/Resume</p>
            <p className="text-xs text-gray-400 mt-1">PDF (Max 5MB)</p>
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
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={saving || !formData.fullName || !formData.title}
          className="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-medium text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {saving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="w-3.5 h-3.5" />
              Save Changes
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </div>
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
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
      <h3 className="text-xs font-semibold text-gray-800 mb-4 flex items-center gap-1.5">
        <FiBriefcase className="w-4 h-4 text-indigo-500" />
        Profile Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Biography
        </label>
        <textarea
          rows={5}
          value={formData.biography}
          onChange={(e) => handleInputChange("biography", e.target.value)}
          placeholder="Write about your background, skills, achievements, and career goals..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400 resize-none"
        />
        <p className="mt-1 text-xs text-gray-400">
          Tell employers about yourself. This will appear on your public profile.
        </p>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-medium text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {saving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="w-3.5 h-3.5" />
              Save Changes
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= SOCIAL LINKS TAB ================= */

function SocialLinksTab({ profile, onSave, saving }) {
  const [socialLinks, setSocialLinks] = useState(() => {
    if (profile?.socialLinks && profile.socialLinks.length > 0) {
      return profile.socialLinks.map(link => ({
        platform: link.platform || "",
        url: link.url || "",
        _id: link._id
      }));
    }
    return [
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
      { platform: "", url: "" },
    ];
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
      <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
        <Share2 className="w-4 h-4 text-pink-500" />
        Social Media Profiles
      </h3>

      <div className="space-y-2">
        {socialLinks.map((link, index) => (
          <div 
            key={index}
            className={`flex flex-col gap-2 sm:flex-row sm:items-center p-2 rounded-md transition-all duration-300 ${hoveredIndex === index ? 'bg-gray-50' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full sm:w-36">
              <select
                value={link.platform}
                onChange={(e) => updateLink(index, "platform", e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-200 px-3 py-1.5 pr-7 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-all"
              >
                <option value="">Select Platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.icon} {platform.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <input
              type="url"
              placeholder="Profile link/url..."
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              className="w-full flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-all"
            />

            <button
              type="button"
              onClick={() => removeLink(index)}
              className={`flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 transition-all duration-300 self-start sm:self-auto
                ${hoveredIndex === index ? 'bg-red-50 border-red-200 text-red-500' : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'}
              `}
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="mt-3 flex items-center gap-1 rounded-md bg-gray-50 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-400 group"
      >
        <FiPlus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
        Add New Social Link
      </button>

      <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-medium text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {saving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave className="w-3.5 h-3.5" />
              Save Social Links
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= ACCOUNT SETTINGS TAB ================= */

function AccountSettingsTab({ profile, onSave, saving }) {
  const [formData, setFormData] = useState({
    contact: {
      location: profile?.accountSettings?.contact?.location || "",
      phone: profile?.accountSettings?.contact?.phone || "",
      email: profile?.accountSettings?.contact?.email || "",
    },
    notifications: {
      shortlisted: profile?.accountSettings?.notifications?.shortlisted ?? true,
      saved: profile?.accountSettings?.notifications?.saved ?? true,
      jobExpired: profile?.accountSettings?.notifications?.jobExpired ?? true,
      rejected: profile?.accountSettings?.notifications?.rejected ?? true,
      jobAlerts: profile?.accountSettings?.notifications?.jobAlerts ?? true,
    },
    jobAlerts: {
      role: profile?.accountSettings?.jobAlerts?.role || "",
      location: profile?.accountSettings?.jobAlerts?.location || "",
    },
    privacy: {
      profilePublic: profile?.accountSettings?.privacy?.profilePublic ?? true,
      resumePublic: profile?.accountSettings?.privacy?.resumePublic ?? false,
    },
    password: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeField, setActiveField] = useState(null);

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

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
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
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 space-y-5">
      {/* Contact Info */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiMail className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Contact Info
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="Map Location"
            placeholder="City, state, country name"
            value={formData.contact.location}
            onChange={(value) => handleContactChange("location", value)}
            icon={<FiMapPin className="text-gray-400" />}
            onFocus={() => setActiveField('location')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'location'}
          />

          <FormInput
            label="Phone"
            placeholder="+880 1234 56789"
            value={formData.contact.phone}
            onChange={(value) => handleContactChange("phone", value)}
            icon={<FiPhone className="text-gray-400" />}
            type="tel"
            onFocus={() => setActiveField('phone')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'phone'}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Email"
              placeholder="email@example.com"
              value={formData.contact.email}
              onChange={(value) => handleContactChange("email", value)}
              icon={<FiMail className="text-gray-400" />}
              type="email"
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField(null)}
              isActive={activeField === 'email'}
            />
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Notifications */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiBell className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-2">
          {[
            { id: "shortlisted", label: "Notify me when employers shortlist me" },
            { id: "saved", label: "Notify me when employers save my profile" },
            { id: "jobExpired", label: "Notify me when my applied jobs are expired" },
            { id: "rejected", label: "Notify me when employers reject me" },
            { id: "jobAlerts", label: "Notify me when I have up to 5 new job alerts" },
          ].map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.notifications[item.id]}
                  onChange={(e) => handleNotificationChange(item.id, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                  formData.notifications[item.id]
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}>
                  {formData.notifications[item.id] && (
                    <FiCheck size={10} className="text-white" />
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Job Alerts */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiBell className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Job Alerts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="Preferred Role"
            placeholder="e.g., Software Engineer, Product Designer"
            value={formData.jobAlerts.role}
            onChange={(value) => handleJobAlertChange("role", value)}
            onFocus={() => setActiveField('role')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'role'}
          />

          <FormInput
            label="Preferred Location"
            placeholder="City, state, country name"
            value={formData.jobAlerts.location}
            onChange={(value) => handleJobAlertChange("location", value)}
            icon={<FiMapPin className="text-gray-400" />}
            onFocus={() => setActiveField('alertLocation')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'alertLocation'}
          />
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Privacy Settings */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiLock className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Privacy Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div>
                <h4 className="text-xs font-medium text-gray-800">Profile Privacy</h4>
                <p className="text-xs text-gray-500 mt-0.5">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div>
                <h4 className="text-xs font-medium text-gray-800">Resume Privacy</h4>
                <p className="text-xs text-gray-500 mt-0.5">
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

      <hr className="border-gray-200" />

      {/* Change Password */}
      <section className="animate-slideIn">
        <div className="flex items-center gap-1.5 mb-3">
          <FiLock className="text-blue-600 w-4 h-4" />
          <h3 className="text-xs font-semibold text-gray-800">
            Change Password
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <PasswordInput
            label="Current Password"
            value={formData.password.current}
            onChange={(value) => handlePasswordChange("current", value)}
            show={showPassword.current}
            onToggle={() => togglePasswordVisibility('current')}
            onFocus={() => setActiveField('current')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'current'}
          />

          <PasswordInput
            label="New Password"
            value={formData.password.new}
            onChange={(value) => handlePasswordChange("new", value)}
            show={showPassword.new}
            onToggle={() => togglePasswordVisibility('new')}
            onFocus={() => setActiveField('new')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'new'}
          />

          <PasswordInput
            label="Confirm Password"
            value={formData.password.confirm}
            onChange={(value) => handlePasswordChange("confirm", value)}
            show={showPassword.confirm}
            onToggle={() => togglePasswordVisibility('confirm')}
            onFocus={() => setActiveField('confirm')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'confirm'}
          />
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Delete Account */}
      <section className="animate-slideIn">
        <h3 className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
          <FiAlertCircle className="w-4 h-4 text-red-500" />
          Delete Your Account
        </h3>
        
        <div className="flex items-start gap-2 p-3 bg-red-50 rounded-md border border-red-100 mb-2">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0 w-3.5 h-3.5" />
          <p className="text-xs text-red-700">
            <strong>Warning:</strong> If you delete your account, you will no longer be able to get job information or receive notifications from the platform.
          </p>
        </div>
        
        <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-gradient-to-r from-red-600 to-red-500 rounded-md hover:shadow-md transition-all transform hover:scale-105">
          <FiTrash2 className="w-3.5 h-3.5" />
          Close Account
        </button>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-medium text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {saving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving All Settings...
            </>
          ) : (
            <>
              <FiSave className="w-3.5 h-3.5" />
              Save All Settings
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function FormInput({ label, placeholder, value, onChange, icon, type = "text", required = false, onFocus, onBlur, isActive }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-300
            ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400'}
          `}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full rounded-md border px-3 py-1.5 text-xs transition-all duration-300 focus:outline-none focus:ring-1
            ${icon ? "pl-7" : "pl-3"} pr-3
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
          required={required}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, value, onChange, options, icon, required = false }) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none
            ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400'}
          `}>
            {icon}
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full appearance-none rounded-md border px-3 py-1.5 text-xs pr-7 transition-all duration-300 focus:outline-none focus:ring-1
            ${icon ? "pl-7" : "pl-3"}
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300
          ${isActive || isHovered ? 'text-blue-500 rotate-180' : 'text-gray-400'}
        `} />
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle, onFocus, onBlur, isActive }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">{label}</label>
      <div className="relative">
        <div className={`absolute left-2 top-1/2 -translate-y-1/2 transition-all duration-300
          ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400'}
        `}>
          <FiLock className="w-3.5 h-3.5" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full rounded-md border pl-7 pr-8 py-1.5 text-xs transition-all duration-300 focus:outline-none focus:ring-1
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300
            ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          {show ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function ResumeCard({ title, size, url, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`rounded-lg border p-3 transition-all duration-300 ${isHovered ? 'border-blue-300 shadow-sm' : 'border-gray-200'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <FiFile className={`transition-colors duration-300 ${isHovered ? 'text-blue-600' : 'text-gray-400'}`} size={14} />
            <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">{title}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">{size}</p>
        </div>
        <button
          onClick={onDelete}
          className={`text-gray-400 hover:text-red-500 transition-colors ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      <div className="mt-2 flex gap-2 text-xs">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiEye size={12} /> View
          </a>
        )}
        <button className="flex items-center gap-0.5 text-blue-600 hover:text-blue-700 transition-colors">
          <FiEdit2 size={12} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-0.5 text-red-500 hover:text-red-600 transition-colors"
        >
          <FiTrash2 size={12} /> Delete
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
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// Missing icon import
import { FiBell } from "react-icons/fi";