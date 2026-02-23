"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiSettings,
  FiGlobe,
  FiBell,
  FiShield,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLink,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCamera,
  FiUpload,
  FiBriefcase,
  FiBook,
  FiCalendar,
  FiAward,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiLogOut,
  FiHome,
  FiUsers,
  FiPieChart,
} from "react-icons/fi";
import { profileService } from "@/services/candidateprofileService";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export default function AdminSettingsMain() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  // Animation variants (same as UsersMain)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -2 }
  };

  // Show notification
  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      console.log("👤 [AdminSettingsMain] Fetching profile for admin:", currentUser?.id);

      try {
        const profileData = await profileService.getMyProfile();
        setProfile(profileData);
        console.log("✅ [AdminSettingsMain] Profile loaded:", profileData ? "Yes" : "No");
      } catch (error) {
        setProfile(null);
        console.log("ℹ️ [AdminSettingsMain] No profile exists yet");
      }
    } catch (error) {
      console.error("❌ [AdminSettingsMain] Error fetching data:", error);
      showNotification('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("lastAdminSettingsTab", tab);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      console.log("💾 [AdminSettingsMain] Saving data for tab:", activeTab);

      const result = await profileService.createOrUpdateCandidateProfile(data);
      setProfile(result);
      showNotification('Settings saved successfully!', 'success');

      return result;
    } catch (error) {
      console.error("❌ [AdminSettingsMain] Save error:", error);
      showNotification('Failed to save settings: ' + (error.message || "Unknown error"), 'error');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchUserData();
    showNotification('Refreshing profile data...', 'info');
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lastTab = localStorage.getItem("lastAdminSettingsTab");
      if (lastTab && ["personal", "profile", "social", "notifications", "security", "account"].includes(lastTab)) {
        setActiveTab(lastTab);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiSettings className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading admin settings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              showToast.type === 'success' ? 'bg-green-500' :
              showToast.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white`}
          >
            {showToast.type === 'success' && <FiCheckCircle className="w-5 h-5" />}
            {showToast.type === 'error' && <FiXCircle className="w-5 h-5" />}
            {showToast.type === 'info' && <FiAlertCircle className="w-5 h-5" />}
            <span className="font-medium">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Settings
          </h1>
          <p className="text-gray-500 mt-1">
            {profile ? "Manage your admin profile and preferences" : "Set up your admin profile"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Profile Completion Card */}
      {profile && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                profile.isProfileComplete 
                  ? 'from-green-500 to-emerald-500' 
                  : 'from-yellow-500 to-orange-500'
              } flex items-center justify-center text-white text-2xl font-bold`}>
                {profile.isProfileComplete ? '✓' : `${profile.completionPercentage || 0}%`}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.isProfileComplete ? 'Profile Complete! 🎉' : 'Complete Your Profile'}
                </h3>
                <p className="text-sm text-gray-500">
                  {profile.isProfileComplete 
                    ? 'Your profile is 100% complete and visible to everyone'
                    : `Your profile is ${profile.completionPercentage || 0}% complete. Complete all sections to enhance your admin presence.`
                  }
                </p>
              </div>
            </div>
            
            {!profile.isProfileComplete && (
              <div className="w-full md:w-64">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-blue-600">{profile.completionPercentage || 0}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profile.completionPercentage || 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      profile.isProfileComplete 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("personal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "personal"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiUser className="w-4 h-4" />
            <span className="text-sm font-medium">Personal</span>
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "profile"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiBriefcase className="w-4 h-4" />
            <span className="text-sm font-medium">Profile</span>
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("social")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "social"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiGlobe className="w-4 h-4" />
            <span className="text-sm font-medium">Social Links</span>
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("notifications")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "notifications"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiBell className="w-4 h-4" />
            <span className="text-sm font-medium">Notifications</span>
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("security")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "security"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiShield className="w-4 h-4" />
            <span className="text-sm font-medium">Security</span>
          </motion.button>

          <motion.button
            variants={tabVariants}
            whileHover="hover"
            onClick={() => handleTabChange("account")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "account"
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FiLock className="w-4 h-4" />
            <span className="text-sm font-medium">Account</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        {activeTab === "personal" && (
          <PersonalTab
            profile={profile}
            user={user}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
        {activeTab === "profile" && (
          <ProfileTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
        {activeTab === "social" && (
          <SocialLinksTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationsTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
        {activeTab === "security" && (
          <SecurityTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
        {activeTab === "account" && (
          <AccountSettingsTab
            profile={profile}
            onSave={handleSave}
            saving={saving}
            showNotification={showNotification}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/* ================= PERSONAL TAB ================= */

function PersonalTab({ profile, user, onSave, saving, showNotification }) {
  const [formData, setFormData] = useState({
    fullName: profile?.personalInfo?.fullName || user?.name || "",
    title: profile?.personalInfo?.title || "Administrator",
    department: profile?.personalInfo?.department || "",
    employeeId: profile?.personalInfo?.employeeId || "",
    joiningDate: profile?.personalInfo?.joiningDate || "",
    officeLocation: profile?.personalInfo?.officeLocation || "",
    website: profile?.personalInfo?.website || "",
    profileImage: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(
    profile?.personalInfo?.profileImage || user?.avatar || "/default-avatar.png"
  );

  const handleFileChange = (field, file) => {
    if (field === "profileImage") {
      setFormData(prev => ({ ...prev, profileImage: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
          department: formData.department,
          employeeId: formData.employeeId,
          joiningDate: formData.joiningDate,
          officeLocation: formData.officeLocation,
          website: formData.website,
        },
        files: {
          profileImage: formData.profileImage,
        }
      };

      await onSave(dataToSave);
      showNotification('Personal information saved successfully!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiUser className="w-5 h-5 text-blue-500" />
        Personal Information
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Picture */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.label
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
              >
                <FiCamera className="w-4 h-4" />
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
              </motion.label>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Upload a profile photo
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              required
            />

            <FormInput
              label="Job Title"
              placeholder="e.g., System Administrator"
              value={formData.title}
              onChange={(value) => handleInputChange("title", value)}
            />

            <FormInput
              label="Department"
              placeholder="e.g., IT Department"
              value={formData.department}
              onChange={(value) => handleInputChange("department", value)}
            />

            <FormInput
              label="Employee ID"
              placeholder="EMP-12345"
              value={formData.employeeId}
              onChange={(value) => handleInputChange("employeeId", value)}
            />

            <FormInput
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(value) => handleInputChange("joiningDate", value)}
            />

            <FormInput
              label="Office Location"
              placeholder="City, building, floor"
              value={formData.officeLocation}
              onChange={(value) => handleInputChange("officeLocation", value)}
            />

            <div className="md:col-span-2">
              <FormInput
                label="Personal Website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(value) => handleInputChange("website", value)}
                type="url"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={saving || !formData.fullName}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ================= PROFILE TAB ================= */

function ProfileTab({ profile, onSave, saving, showNotification }) {
  const [formData, setFormData] = useState({
    nationality: profile?.profileDetails?.nationality || "",
    dateOfBirth: profile?.profileDetails?.dateOfBirth
      ? new Date(profile.profileDetails.dateOfBirth).toISOString().split('T')[0]
      : "",
    gender: profile?.profileDetails?.gender || "",
    experience: profile?.profileDetails?.experience || "",
    education: profile?.profileDetails?.education || "",
    certifications: profile?.profileDetails?.certifications || "",
    skills: profile?.profileDetails?.skills || "",
    languages: profile?.profileDetails?.languages || "",
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
      showNotification('Profile details saved successfully!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiBriefcase className="w-5 h-5 text-blue-500" />
        Professional Profile
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
        />

        <FormInput
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(value) => handleInputChange("dateOfBirth", value)}
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
        />

        <FormInput
          label="Certifications"
          placeholder="e.g., AWS Certified, PMP, etc."
          value={formData.certifications}
          onChange={(value) => handleInputChange("certifications", value)}
        />

        <FormInput
          label="Skills"
          placeholder="e.g., Management, Communication, etc."
          value={formData.skills}
          onChange={(value) => handleInputChange("skills", value)}
        />

        <FormInput
          label="Languages"
          placeholder="e.g., English, Bengali, etc."
          value={formData.languages}
          onChange={(value) => handleInputChange("languages", value)}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biography
          </label>
          <textarea
            rows={6}
            value={formData.biography}
            onChange={(e) => handleInputChange("biography", e.target.value)}
            placeholder="Write about your background, experience, expertise, and achievements..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4" />
            Save Changes
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= SOCIAL LINKS TAB ================= */

function SocialLinksTab({ profile, onSave, saving, showNotification }) {
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
    ];
  });

  const socialPlatforms = [
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "twitter", label: "Twitter", icon: "🐦" },
    { value: "facebook", label: "Facebook", icon: "🔵" },
    { value: "instagram", label: "Instagram", icon: "📷" },
    { value: "github", label: "GitHub", icon: "💻" },
    { value: "stackoverflow", label: "Stack Overflow", icon: "💻" },
    { value: "medium", label: "Medium", icon: "📝" },
    { value: "youtube", label: "YouTube", icon: "▶️" },
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

      await onSave(dataToSave);
      showNotification('Social links saved successfully!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiGlobe className="w-5 h-5 text-blue-500" />
        Social Media Profiles
      </h3>

      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex gap-3 items-start"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <select
                  value={link.platform}
                  onChange={(e) => updateLink(index, "platform", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Platform</option>
                  {socialPlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.icon} {platform.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <input
                  type="url"
                  placeholder="Profile link/url..."
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeLink(index)}
              className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addLink}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <FiPlus className="w-4 h-4" />
        Add New Social Link
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4" />
            Save Social Links
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= NOTIFICATIONS TAB ================= */

function NotificationsTab({ profile, onSave, saving, showNotification }) {
  const [formData, setFormData] = useState({
    system: {
      userRegistrations: profile?.notificationSettings?.system?.userRegistrations ?? true,
      jobPostings: profile?.notificationSettings?.system?.jobPostings ?? true,
      applications: profile?.notificationSettings?.system?.applications ?? true,
      reports: profile?.notificationSettings?.system?.reports ?? true,
    },
    email: {
      dailyDigest: profile?.notificationSettings?.email?.dailyDigest ?? true,
      weeklyReport: profile?.notificationSettings?.email?.weeklyReport ?? true,
      alerts: profile?.notificationSettings?.email?.alerts ?? true,
      marketing: profile?.notificationSettings?.email?.marketing ?? false,
    },
    push: {
      desktop: profile?.notificationSettings?.push?.desktop ?? true,
      mobile: profile?.notificationSettings?.push?.mobile ?? true,
      critical: profile?.notificationSettings?.push?.critical ?? true,
    },
  });

  const handleSystemChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      system: { ...prev.system, [field]: checked }
    }));
  };

  const handleEmailChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      email: { ...prev.email, [field]: checked }
    }));
  };

  const handlePushChange = (field, checked) => {
    setFormData(prev => ({
      ...prev,
      push: { ...prev.push, [field]: checked }
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        notificationSettings: formData
      };

      await onSave(dataToSave);
      showNotification('Notification preferences saved!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiBell className="w-5 h-5 text-blue-500" />
        Notification Preferences
      </h3>

      {/* System Notifications */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">System Notifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "userRegistrations", label: "New user registrations" },
            { id: "jobPostings", label: "New job postings" },
            { id: "applications", label: "New job applications" },
            { id: "reports", label: "Report generation completed" },
          ].map((item) => (
            <label key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">{item.label}</span>
              <Toggle
                enabled={formData.system[item.id]}
                onToggle={() => handleSystemChange(item.id, !formData.system[item.id])}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Email Notifications */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "dailyDigest", label: "Daily digest email" },
            { id: "weeklyReport", label: "Weekly activity report" },
            { id: "alerts", label: "Important alerts" },
            { id: "marketing", label: "Marketing and updates" },
          ].map((item) => (
            <label key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">{item.label}</span>
              <Toggle
                enabled={formData.email[item.id]}
                onToggle={() => handleEmailChange(item.id, !formData.email[item.id])}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Push Notifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "desktop", label: "Desktop notifications" },
            { id: "mobile", label: "Mobile push notifications" },
            { id: "critical", label: "Critical alerts only" },
          ].map((item) => (
            <label key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm text-gray-700">{item.label}</span>
              <Toggle
                enabled={formData.push[item.id]}
                onToggle={() => handlePushChange(item.id, !formData.push[item.id])}
              />
            </label>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4" />
            Save Notification Settings
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= SECURITY TAB ================= */

function SecurityTab({ profile, onSave, saving, showNotification }) {
  const [formData, setFormData] = useState({
    twoFactorEnabled: profile?.securitySettings?.twoFactorEnabled ?? false,
    sessionTimeout: profile?.securitySettings?.sessionTimeout || "30",
    loginAlerts: profile?.securitySettings?.loginAlerts ?? true,
    ipWhitelist: profile?.securitySettings?.ipWhitelist || "",
    password: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      password: { ...prev.password, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.password.new && formData.password.new !== formData.password.confirm) {
        showNotification('New passwords do not match!', 'error');
        return;
      }

      const dataToSave = {
        securitySettings: {
          twoFactorEnabled: formData.twoFactorEnabled,
          sessionTimeout: formData.sessionTimeout,
          loginAlerts: formData.loginAlerts,
          ipWhitelist: formData.ipWhitelist,
        }
      };

      if (formData.password.current && formData.password.new) {
        dataToSave.password = {
          current: formData.password.current,
          new: formData.password.new,
        };
      }

      await onSave(dataToSave);
      showNotification('Security settings saved!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiShield className="w-5 h-5 text-blue-500" />
        Security Settings
      </h3>

      {/* Two Factor Authentication */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h4>
            <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
          </div>
          <Toggle
            enabled={formData.twoFactorEnabled}
            onToggle={() => handleChange("twoFactorEnabled", !formData.twoFactorEnabled)}
          />
        </div>
      </div>

      {/* Session Management */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Session Management</h4>
        <FormSelect
          label="Session Timeout"
          value={formData.sessionTimeout}
          onChange={(value) => handleChange("sessionTimeout", value)}
          options={[
            { value: "15", label: "15 minutes" },
            { value: "30", label: "30 minutes" },
            { value: "60", label: "1 hour" },
            { value: "120", label: "2 hours" },
            { value: "240", label: "4 hours" },
            { value: "480", label: "8 hours" },
          ]}
        />
      </div>

      {/* Login Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-800">Login Alerts</h4>
            <p className="text-xs text-gray-500 mt-1">Receive email alerts on new login</p>
          </div>
          <Toggle
            enabled={formData.loginAlerts}
            onToggle={() => handleChange("loginAlerts", !formData.loginAlerts)}
          />
        </div>
      </div>

      {/* IP Whitelist */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">IP Whitelist</h4>
        <FormInput
          label="Allowed IP Addresses"
          placeholder="Enter IP addresses separated by commas"
          value={formData.ipWhitelist}
          onChange={(value) => handleChange("ipWhitelist", value)}
        />
        <p className="text-xs text-gray-500">Leave empty to allow all IPs. Separate multiple IPs with commas.</p>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Change Password</h4>
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
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4" />
            Save Security Settings
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= ACCOUNT SETTINGS TAB ================= */

function AccountSettingsTab({ profile, onSave, saving, showNotification }) {
  const [formData, setFormData] = useState({
    contact: {
      email: profile?.accountSettings?.contact?.email || "",
      phone: profile?.accountSettings?.contact?.phone || "",
      location: profile?.accountSettings?.contact?.location || "",
    },
    preferences: {
      language: profile?.accountSettings?.preferences?.language || "en",
      timezone: profile?.accountSettings?.preferences?.timezone || "UTC",
      dateFormat: profile?.accountSettings?.preferences?.dateFormat || "MM/DD/YYYY",
    },
    privacy: {
      profilePublic: profile?.accountSettings?.privacy?.profilePublic ?? true,
      activityVisible: profile?.accountSettings?.privacy?.activityVisible ?? true,
      showEmail: profile?.accountSettings?.privacy?.showEmail ?? false,
    },
  });

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        accountSettings: formData
      };

      await onSave(dataToSave);
      showNotification('Account settings saved!', 'success');
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <FiLock className="w-5 h-5 text-blue-500" />
        Account Settings
      </h3>

      {/* Contact Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email Address"
            placeholder="admin@example.com"
            value={formData.contact.email}
            onChange={(value) => handleContactChange("email", value)}
            type="email"
          />

          <FormInput
            label="Phone Number"
            placeholder="+880 1234 56789"
            value={formData.contact.phone}
            onChange={(value) => handleContactChange("phone", value)}
            type="tel"
          />

          <div className="md:col-span-2">
            <FormInput
              label="Location"
              placeholder="City, country"
              value={formData.contact.location}
              onChange={(value) => handleContactChange("location", value)}
            />
          </div>
        </div>
      </div>

      {/* Account Preferences */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Account Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Language"
            value={formData.preferences.language}
            onChange={(value) => handlePreferenceChange("language", value)}
            options={[
              { value: "en", label: "English" },
              { value: "bn", label: "Bengali" },
              { value: "hi", label: "Hindi" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
            ]}
          />

          <FormSelect
            label="Timezone"
            value={formData.preferences.timezone}
            onChange={(value) => handlePreferenceChange("timezone", value)}
            options={[
              { value: "UTC", label: "UTC" },
              { value: "Asia/Dhaka", label: "Asia/Dhaka (GMT+6)" },
              { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
              { value: "America/New_York", label: "America/New York (EST)" },
              { value: "Europe/London", label: "Europe/London (GMT)" },
            ]}
          />

          <FormSelect
            label="Date Format"
            value={formData.preferences.dateFormat}
            onChange={(value) => handlePreferenceChange("dateFormat", value)}
            options={[
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Privacy Settings</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-800">Profile Visibility</h5>
              <p className="text-xs text-gray-500">Make your profile visible to everyone</p>
            </div>
            <Toggle
              enabled={formData.privacy.profilePublic}
              onToggle={() => handlePrivacyChange("profilePublic", !formData.privacy.profilePublic)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-800">Activity Visibility</h5>
              <p className="text-xs text-gray-500">Show your activity to other users</p>
            </div>
            <Toggle
              enabled={formData.privacy.activityVisible}
              onToggle={() => handlePrivacyChange("activityVisible", !formData.privacy.activityVisible)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h5 className="text-sm font-medium text-gray-800">Show Email</h5>
              <p className="text-xs text-gray-500">Display your email address on profile</p>
            </div>
            <Toggle
              enabled={formData.privacy.showEmail}
              onToggle={() => handlePrivacyChange("showEmail", !formData.privacy.showEmail)}
            />
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h5 className="text-sm font-medium text-red-800">Delete Your Account</h5>
              <p className="text-xs text-red-600 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete Account
            </motion.button>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FiSave className="w-4 h-4" />
            Save All Settings
          </>
        )}
      </motion.button>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function FormInput({ label, placeholder, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        required={required}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PasswordInput({ label, placeholder, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
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
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}