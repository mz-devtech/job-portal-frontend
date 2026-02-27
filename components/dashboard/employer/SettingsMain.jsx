"use client";

import { useState, useEffect } from "react";
import { 
  FiUpload, 
  FiChevronDown, 
  FiCalendar, 
  FiLink,
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiYoutube, 
  FiLinkedin,
  FiX, 
  FiPlus,
  FiEye,
  FiSave,
  FiCheck,
  FiAlertCircle,
  FiMail,
  FiUser,
  FiEdit,
  FiLock,
  FiMapPin,
  FiImage,
  FiPhone,
  FiHome,
  FiCamera,
  FiGlobe,
  FiBriefcase,
  FiShare2,
  FiLoader,
  FiTrash2
} from "react-icons/fi";
import { Sparkles, Shield, ArrowRight, Building, Users, Globe, Share2, Phone, Briefcase, CheckCircle } from 'lucide-react';
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";
import { useSelector, useDispatch } from "react-redux";
import { refreshUserData } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { selectUser } from "@/redux/slices/userSlice";

const SOCIAL_OPTIONS = [
  { label: "Facebook", icon: <FiFacebook />, value: "facebook", color: "bg-blue-100 text-blue-600" },
  { label: "Twitter", icon: <FiTwitter />, value: "twitter", color: "bg-sky-100 text-sky-600" },
  { label: "Instagram", icon: <FiInstagram />, value: "instagram", color: "bg-pink-100 text-pink-600" },
  { label: "Youtube", icon: <FiYoutube />, value: "youtube", color: "bg-red-100 text-red-600" },
  { label: "LinkedIn", icon: <FiLinkedin />, value: "linkedin", color: "bg-blue-100 text-blue-700" },
];

const ORGANIZATION_TYPES = [
  "Select...",
  "Private Limited",
  "Public Limited",
  "LLC",
  "Non-Profit",
  "Startup",
  "Government",
  "Educational"
];

const INDUSTRY_TYPES = [
  "Select...",
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Hospitality",
  "Transportation",
  "Media",
  "Construction",
  "Energy",
  "Agriculture",
  "Telecommunications",
  "Automotive"
];

const TEAM_SIZES = [
  "Select...",
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+"
];

export default function SettingsMain() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    profileImage: ""
  });
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  
  const reduxUser = useSelector(selectUser);
  const dispatch = useDispatch();

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width >= 640 && width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Load profile and user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Combine user and profile data when both are loaded
  useEffect(() => {
    if (reduxUser) {
      setUserData(reduxUser);
      
      setPersonalInfo({
        name: reduxUser.name || "",
        username: reduxUser.username || "",
        email: reduxUser.email || "",
        phone: reduxUser.phone || "",
        address: reduxUser.address || "",
        profileImage: reduxUser.profileImage || ""
      });
      
      if (reduxUser.profileImage) {
        setProfileImagePreview(reduxUser.profileImage);
      }
    }
  }, [reduxUser]);

  // Update personal info when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setPersonalInfo(prev => ({
        ...prev,
        phone: profileData.phone || prev.phone,
        address: profileData.location || prev.address,
        profileImage: prev.profileImage
      }));
    }
  }, [profileData]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      const currentUser = reduxUser || authService.getCurrentUser();
      
      if (currentUser) {
        setUserData(currentUser);
        setPersonalInfo({
          name: currentUser.name || "",
          username: currentUser.username || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          profileImage: currentUser.profileImage || ""
        });
        
        if (currentUser.profileImage) {
          setProfileImagePreview(currentUser.profileImage);
        }
      }
      
      try {
        const profile = await profileService.getMyProfile();
        if (profile) {
          setProfileData(profile);
          
          setPersonalInfo(prev => ({
            ...prev,
            phone: profile.phone || prev.phone,
            address: profile.location || prev.address,
          }));
        }
      } catch (profileError) {
        console.log("No profile found");
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      companyInfo: {
        ...prev?.companyInfo,
        [field]: value
      }
    }));
  };

  const updateFoundingInfo = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      foundingInfo: {
        ...prev?.foundingInfo,
        [field]: value
      }
    }));
  };

  const updateSocialLinks = (index, field, value) => {
    const updatedLinks = [...(profileData?.socialLinks || [])];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    setProfileData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };

  const addSocialLink = () => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: [
        ...(prev?.socialLinks || []),
        { platform: "facebook", url: "" }
      ]
    }));
  };

  const removeSocialLink = (index) => {
    const updatedLinks = [...(profileData?.socialLinks || [])];
    updatedLinks.splice(index, 1);
    setProfileData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };

  const updateContactInfo = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePasswordData = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePersonalInfo = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'phone' || field === 'address') {
      if (field === 'phone') {
        updateContactInfo('phone', value);
      }
      if (field === 'address') {
        updateContactInfo('location', value);
      }
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = async (file) => {
    try {
      if (!file) {
        toast.error("Please select an image");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profileImage", file);
      
      if (personalInfo.phone) formData.append("phone", personalInfo.phone);
      if (personalInfo.address) formData.append("address", personalInfo.address);
      if (personalInfo.name) formData.append("name", personalInfo.name);
      if (personalInfo.email) formData.append("email", personalInfo.email);

      setSaving(true);
      const response = await authService.updateProfile(formData);
      
      if (response.success) {
        toast.success("Profile image updated successfully!");
        
        const updatedUserData = {
          ...userData,
          ...response.user,
          profileImage: response.user?.profileImage || profileImagePreview
        };
        
        setUserData(updatedUserData);
        setPersonalInfo(prev => ({
          ...prev,
          profileImage: response.user?.profileImage || prev.profileImage
        }));
        
        if (profileData) {
          setProfileData(prev => ({
            ...prev,
            phone: personalInfo.phone || prev?.phone,
            location: personalInfo.address || prev?.location
          }));
        }
        
        if (response.user?.profileImage) {
          setProfileImagePreview(response.user.profileImage);
        }
        
        dispatch(refreshUserData());
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setSaving(false);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const formattedData = {
        companyInfo: profileData?.companyInfo || {},
        foundingInfo: profileData?.foundingInfo || {},
        socialLinks: profileData?.socialLinks || [],
        contact: {
          location: profileData?.location || personalInfo.address || "",
          phone: profileData?.phone || personalInfo.phone || "",
          email: profileData?.email || personalInfo.email || ""
        }
      };

      const result = await profileService.createOrUpdateEmployerProfile({
        ...formattedData,
        files: {
          logo: profileData?.companyInfo?.logoFile,
          banner: profileData?.companyInfo?.bannerFile
        }
      });

      if (result.success) {
        toast.success("Company profile updated successfully!");
        await loadUserData();
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Save personal information changes
  const savePersonalInfo = async () => {
    try {
      if (!personalInfo.name || !personalInfo.email) {
        toast.error("Name and email are required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setSaving(true);
      
      const formData = new FormData();
      formData.append("name", personalInfo.name);
      formData.append("email", personalInfo.email);
      if (personalInfo.phone) formData.append("phone", personalInfo.phone);
      if (personalInfo.address) formData.append("address", personalInfo.address);
      if (personalInfo.username) formData.append("username", personalInfo.username);

      const emailChanged = personalInfo.email !== userData?.email;
      
      if (emailChanged) {
        toast("Please verify your new email address", { icon: "📧" });
      }

      const result = await authService.updateProfile(formData);
      
      if (result.success) {
        toast.success("Personal information updated!");
        
        const updatedUser = {
          ...userData,
          ...result.user,
          profileImage: result.user?.profileImage || userData?.profileImage
        };
        
        setUserData(updatedUser);
        
        if (profileData) {
          setProfileData(prev => ({
            ...prev,
            phone: personalInfo.phone,
            location: personalInfo.address,
            email: personalInfo.email
          }));
        }
        
        if (result.user?.profileImage) {
          setProfileImagePreview(result.user.profileImage);
        }
        
        dispatch(refreshUserData());
        setEditingPersonal(false);
      }
      
    } catch (error) {
      console.error("Error saving personal info:", error);
      toast.error(error.message || "Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }

      setSaving(true);
      
      const result = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (result.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // Handle file upload for company
  const handleFileUpload = async (field, file) => {
    try {
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          updateCompanyInfo('logo', reader.result);
        } else if (field === 'banner') {
          updateCompanyInfo('banner', reader.result);
        }
      };
      reader.readAsDataURL(file);
      
      if (field === 'logo') {
        updateCompanyInfo('logoFile', file);
      } else if (field === 'banner') {
        updateCompanyInfo('bannerFile', file);
      }
      
      toast.success(`${field} uploaded successfully!`);
      
    } catch (error) {
      console.error(`Error handling ${field}:`, error);
      toast.error(`Failed to upload ${field}`);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      await profileService.deleteProfile();
      toast.success("Profile deleted successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white px-3 py-4 sm:px-4 md:ml-[270px] md:w-[calc(100%-270px)]">
        <div className="relative text-center animate-fadeIn">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 flex items-center gap-2 justify-center">
            <FiLoader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            Loading profile data...
          </p>
        </div>
      </div>
    );
  }

  // Get combined data for display
  const combinedData = {
    ...userData,
    ...profileData,
    phone: personalInfo.phone || userData?.phone || profileData?.phone || "",
    address: personalInfo.address || userData?.address || profileData?.location || "",
    profileImage: profileImagePreview || userData?.profileImage || ""
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white px-3 sm:px-4 py-4 sm:py-6 md:ml-[270px] md:w-[calc(100%-270px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto relative pb-20 md:pb-6">
      
      {/* Animated Background - Hidden on mobile */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <FiUser className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
              Settings
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-pulse" />
            </h2>
          </div>
          {profileData && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full animate-slideIn">
              <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{profileData.completionPercentage || 0}% Complete</span>
            </div>
          )}
        </div>

        {/* Tabs - Horizontal Scroll on Mobile */}
        <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-4 border-b text-[10px] sm:text-xs overflow-x-auto pb-1 animate-fadeIn scrollbar-hide">
          <Tab 
            label={screenSize === 'mobile' ? "Personal" : "Personal Info"} 
            icon={<FiUser className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            active={activeTab === "personal"} 
            hovered={hoveredTab === "personal"}
            onHover={() => setHoveredTab("personal")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => setActiveTab("personal")}
            screenSize={screenSize}
          />
          <Tab 
            label={screenSize === 'mobile' ? "Company" : "Company Info"} 
            icon={<Building className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            active={activeTab === "company"} 
            hovered={hoveredTab === "company"}
            onHover={() => setHoveredTab("company")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => setActiveTab("company")}
            screenSize={screenSize}
          />
          <Tab 
            label={screenSize === 'mobile' ? "Founding" : "Founding Info"} 
            icon={<Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            active={activeTab === "founding"} 
            hovered={hoveredTab === "founding"}
            onHover={() => setHoveredTab("founding")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => setActiveTab("founding")}
            screenSize={screenSize}
          />
          <Tab 
            label={screenSize === 'mobile' ? "Social" : "Social Media"} 
            icon={<Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            active={activeTab === "social"} 
            hovered={hoveredTab === "social"}
            onHover={() => setHoveredTab("social")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => setActiveTab("social")}
            screenSize={screenSize}
          />
          <Tab 
            label={screenSize === 'mobile' ? "Account" : "Account"} 
            icon={<FiLock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            active={activeTab === "account"} 
            hovered={hoveredTab === "account"}
            onHover={() => setHoveredTab("account")}
            onLeave={() => setHoveredTab(null)}
            onClick={() => setActiveTab("account")}
            screenSize={screenSize}
          />
        </div>

        {/* Save Button - Global */}
        <div className="mt-3 flex justify-end animate-fadeIn">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="group relative flex items-center gap-1 sm:gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {saving ? (
              <>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{screenSize === 'mobile' ? 'Saving...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <FiSave className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{screenSize === 'mobile' ? 'Save' : 'Save All Changes'}</span>
                {screenSize !== 'mobile' && <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform duration-300" />}
              </>
            )}
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="mt-3 animate-fadeIn">
          {activeTab === "personal" && (
            <PersonalInfoTab 
              userData={combinedData}
              profileData={profileData}
              personalInfo={personalInfo}
              profileImagePreview={profileImagePreview}
              editingPersonal={editingPersonal}
              onUpdatePersonal={updatePersonalInfo}
              onToggleEditPersonal={() => setEditingPersonal(!editingPersonal)}
              onSavePersonalInfo={savePersonalInfo}
              onProfileImageUpload={handleProfileImageUpload}
              saving={saving}
              screenSize={screenSize}
            />
          )}
          {activeTab === "company" && (
            <CompanyInfoTab 
              data={profileData?.companyInfo || {}} 
              onUpdate={updateCompanyInfo}
              onFileUpload={handleFileUpload}
              screenSize={screenSize}
            />
          )}
          {activeTab === "founding" && (
            <FoundingInfoTab 
              data={profileData?.foundingInfo || {}}
              onUpdate={updateFoundingInfo}
              screenSize={screenSize}
            />
          )}
          {activeTab === "social" && (
            <SocialMediaTab 
              links={profileData?.socialLinks || []}
              onUpdate={updateSocialLinks}
              onAdd={addSocialLink}
              onRemove={removeSocialLink}
              screenSize={screenSize}
            />
          )}
          {activeTab === "account" && (
            <AccountSettingsTab 
              profileData={profileData}
              userData={combinedData}
              passwordData={passwordData}
              onUpdateContact={updateContactInfo}
              onUpdatePassword={updatePasswordData}
              onChangePassword={handlePasswordChange}
              onDelete={handleDeleteProfile}
              saving={saving}
              screenSize={screenSize}
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
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, icon, active, hovered, onHover, onLeave, onClick, screenSize }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center gap-1 sm:gap-1.5 pb-2 px-1.5 sm:px-2 text-[10px] sm:text-xs font-medium transition-all duration-300 relative group whitespace-nowrap ${
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

function PersonalInfoTab({ 
  userData, 
  profileData, 
  personalInfo, 
  profileImagePreview,
  editingPersonal, 
  onUpdatePersonal, 
  onToggleEditPersonal, 
  onSavePersonalInfo, 
  onProfileImageUpload,
  saving,
  screenSize 
}) {
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onProfileImageUpload(file);
    }
  };

  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-gray-200 space-y-4 sm:space-y-5">
      {/* Profile Image */}
      <section className="animate-slideIn">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <FiImage className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800">
              Profile Image
            </h3>
          </div>
          <button
            onClick={() => document.getElementById('profile-image-input')?.click()}
            className="group flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiCamera className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
            {screenSize === 'mobile' ? '' : 'Change'}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div 
            className="relative"
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
          >
            <div className={`w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-3 border-white shadow-lg transition-transform duration-300 ${isHoveringImage ? 'scale-105' : ''}`}>
              {profileImagePreview ? (
                <img 
                  src={profileImagePreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FiUser className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Upload overlay */}
            <div className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity duration-300 ${isHoveringImage ? 'opacity-100' : 'opacity-0'}`}>
              <FiCamera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="mt-2 text-[8px] sm:text-xs text-gray-500">
            {screenSize === 'mobile' ? 'Tap to change' : 'Click "Change" to upload a new profile picture'}
          </p>
        </div>
      </section>

      {/* Personal Information */}
      <section className="animate-slideIn">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <FiUser className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
            <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>
          <button
            onClick={onToggleEditPersonal}
            className="group flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiEdit className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${editingPersonal ? 'rotate-180' : 'group-hover:scale-110'}`} />
            {screenSize === 'mobile' ? (editingPersonal ? 'Cancel' : 'Edit') : (editingPersonal ? 'Cancel' : 'Edit')}
          </button>
        </div>

        {editingPersonal ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => onUpdatePersonal("name", e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={personalInfo.username}
                  onChange={(e) => onUpdatePersonal("username", e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="Choose a username"
                />
              </div>
              <div>
                <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => onUpdatePersonal("email", e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  placeholder="your.email@example.com"
                />
                <p className="mt-1 text-[8px] sm:text-xs text-gray-400">
                  Changing email requires verification
                </p>
              </div>
              <div>
                <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => onUpdatePersonal("phone", e.target.value)}
                    className="w-full rounded-md border border-gray-200 pl-6 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
                  Address
                </label>
                <div className="relative">
                  <FiHome className="absolute left-1.5 sm:left-2 top-2 sm:top-2.5 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <textarea
                    rows={2}
                    value={personalInfo.address}
                    onChange={(e) => onUpdatePersonal("address", e.target.value)}
                    className="w-full rounded-md border border-gray-200 pl-6 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onToggleEditPersonal}
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onSavePersonalInfo}
                disabled={saving}
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:shadow-md transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50/50 p-2 sm:p-3 rounded-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <p className="text-[8px] sm:text-xs text-gray-500">Full Name</p>
                <p className="text-[10px] sm:text-sm font-medium text-gray-900">
                  {personalInfo.name || userData?.name || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-gray-500">Username</p>
                <p className="text-[10px] sm:text-sm font-medium text-gray-900">
                  {personalInfo.username || userData?.username || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-gray-500">Email Address</p>
                <p className="text-[10px] sm:text-sm font-medium text-gray-900 flex items-center gap-1">
                  {personalInfo.email || userData?.email || "Not set"}
                  {userData?.isEmailVerified && (
                    <span className="text-[8px] sm:text-xs text-green-600 bg-green-50 px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <FiCheck className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Verified
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-gray-500">Phone Number</p>
                <p className="text-[10px] sm:text-sm font-medium text-gray-900 flex items-center gap-1">
                  <FiPhone className="text-gray-400 w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {personalInfo.phone || userData?.phone || profileData?.phone || "Not set"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[8px] sm:text-xs text-gray-500">Address</p>
                <p className="text-[10px] sm:text-sm font-medium text-gray-900 flex items-center gap-1">
                  <FiHome className="text-gray-400 w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  {personalInfo.address || userData?.address || profileData?.location || "Not set"}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-[8px] sm:text-xs text-gray-500">Account Role</p>
              <span className="inline-block px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
                {userData?.role || "Not set"}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Account Summary */}
      <section className="animate-slideIn">
        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1 sm:gap-1.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
          Account Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-3 rounded-md border border-blue-100">
            <p className="text-[8px] sm:text-xs text-gray-500">Profile Completion</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-blue-600">{profileData?.completionPercentage || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 mt-1">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1 sm:h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${profileData?.completionPercentage || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-2 sm:p-3 rounded-md border border-green-100">
            <p className="text-[8px] sm:text-xs text-gray-500">Account Status</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-green-600">Active</p>
            <p className="text-[8px] sm:text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-600 rounded-full animate-pulse"></span>
              {userData?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 sm:p-3 rounded-md border border-purple-100">
            <p className="text-[8px] sm:text-xs text-gray-500">Member Since</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-purple-600">
              {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "N/A"}
            </p>
            <p className="text-[8px] sm:text-xs text-gray-600 mt-1">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CompanyInfoTab({ data, onUpdate, onFileUpload, screenSize }) {
  const [activeUpload, setActiveUpload] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload('logo', file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload('banner', file);
    }
  };

  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-gray-200 space-y-3 sm:space-y-4">
      <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800 flex items-center gap-1 sm:gap-1.5">
        <Building className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
        Logo & Banner Image
      </h3>

      <div className="grid grid-cols-12 gap-2 sm:gap-3">
        <div className="col-span-12 md:col-span-4">
          <UploadBox 
            title="Upload Logo" 
            preview={data?.logo}
            onUpload={handleLogoUpload}
            onFocus={() => setActiveUpload('logo')}
            onBlur={() => setActiveUpload(null)}
            isActive={activeUpload === 'logo'}
            type="logo"
            screenSize={screenSize}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <UploadBox 
            title="Banner Image" 
            large 
            preview={data?.banner}
            onUpload={handleBannerUpload}
            onFocus={() => setActiveUpload('banner')}
            onBlur={() => setActiveUpload(null)}
            isActive={activeUpload === 'banner'}
            type="banner"
            screenSize={screenSize}
          />
        </div>
      </div>

      <div>
        <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
          Company name *
        </label>
        <input
          type="text"
          value={data?.companyName || ""}
          onChange={(e) => onUpdate("companyName", e.target.value)}
          placeholder="Enter company name"
          className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400"
        />
      </div>

      <div>
        <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
          About us *
        </label>
        <textarea
          rows={screenSize === 'mobile' ? 3 : 4}
          value={data?.aboutUs || ""}
          onChange={(e) => onUpdate("aboutUs", e.target.value)}
          placeholder="Write down about your company here..."
          className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400 resize-none"
        />
      </div>
    </div>
  );
}

function FoundingInfoTab({ data, onUpdate, screenSize }) {
  const [activeField, setActiveField] = useState(null);

  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
        <Select 
          label="Organization Type" 
          value={data?.organizationType || ""}
          options={ORGANIZATION_TYPES}
          onChange={(value) => onUpdate("organizationType", value)}
          onFocus={() => setActiveField('org')}
          onBlur={() => setActiveField(null)}
          isActive={activeField === 'org'}
          screenSize={screenSize}
        />
        <Select 
          label="Industry Types" 
          value={data?.industryType || ""}
          options={INDUSTRY_TYPES}
          onChange={(value) => onUpdate("industryType", value)}
          onFocus={() => setActiveField('industry')}
          onBlur={() => setActiveField(null)}
          isActive={activeField === 'industry'}
          screenSize={screenSize}
        />
        <Select 
          label="Team Size" 
          value={data?.teamSize || ""}
          options={TEAM_SIZES}
          onChange={(value) => onUpdate("teamSize", value)}
          onFocus={() => setActiveField('team')}
          onBlur={() => setActiveField(null)}
          isActive={activeField === 'team'}
          screenSize={screenSize}
        />
      </div>

      <div className="mt-2 sm:mt-3 grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
        <DateInput 
          label="Year of Establishment" 
          value={data?.yearOfEstablishment ? new Date(data.yearOfEstablishment).toISOString().split('T')[0] : ""}
          onChange={(value) => onUpdate("yearOfEstablishment", value)}
          onFocus={() => setActiveField('year')}
          onBlur={() => setActiveField(null)}
          isActive={activeField === 'year'}
          screenSize={screenSize}
        />
        <TextInput
          label="Company Website"
          value={data?.companyWebsite || ""}
          onChange={(value) => onUpdate("companyWebsite", value)}
          placeholder="https://..."
          icon={<FiLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          type="url"
          onFocus={() => setActiveField('website')}
          onBlur={() => setActiveField(null)}
          isActive={activeField === 'website'}
          screenSize={screenSize}
        />
      </div>

      <div className="mt-2 sm:mt-3">
        <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">
          Company Vision
        </label>
        <textarea
          rows={screenSize === 'mobile' ? 3 : 4}
          value={data?.companyVision || ""}
          onChange={(e) => onUpdate("companyVision", e.target.value)}
          placeholder="Tell us about your company vision..."
          className="w-full rounded-md border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400 resize-none"
          onFocus={() => setActiveField('vision')}
          onBlur={() => setActiveField(null)}
        />
      </div>
    </div>
  );
}

function SocialMediaTab({ links, onUpdate, onAdd, onRemove, screenSize }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-gray-200">
      <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
        Social Media Profile
      </h3>
      <div className="space-y-2">
        {links.map((item, index) => (
          <SocialRow
            key={index}
            item={item}
            index={index}
            hovered={hoveredIndex === index}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            onChange={(key, value) => onUpdate(index, key, value)}
            onRemove={() => onRemove(index)}
            screenSize={screenSize}
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-2 sm:mt-3 flex items-center gap-1 rounded-md bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all border border-gray-200 hover:border-blue-400 group"
      >
        <FiPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-90 transition-transform duration-300" />
        Add New Social Link
      </button>
    </div>
  );
}

function AccountSettingsTab({ 
  profileData, 
  userData, 
  passwordData, 
  onUpdateContact, 
  onUpdatePassword, 
  onChangePassword, 
  onDelete, 
  saving,
  screenSize 
}) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeField, setActiveField] = useState(null);

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-gray-200 space-y-4 sm:space-y-5">
      <section className="animate-slideIn">
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          <FiMail className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
          <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800">
            Company Contact Information
          </h3>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div>
            <label className="text-[8px] sm:text-xs text-gray-600 mb-1 block">Map Location *</label>
            <div className="relative">
              <FiMapPin className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <input
                type="text"
                value={profileData?.location || userData?.address || ""}
                onChange={(e) => onUpdateContact("location", e.target.value)}
                placeholder="Enter your company location"
                className="w-full rounded-md border border-gray-200 pl-6 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400"
                onFocus={() => setActiveField('location')}
                onBlur={() => setActiveField(null)}
              />
            </div>
          </div>
          <div>
            <label className="text-[8px] sm:text-xs text-gray-600 mb-1 block">Company Phone *</label>
            <div className="flex">
              <div className="flex items-center gap-1 border border-r-0 rounded-l-md px-1.5 sm:px-2 bg-gray-50 text-[8px] sm:text-xs min-w-[60px] sm:min-w-[70px]">
                <span>🇺🇸</span>
                <span>+1</span>
              </div>
              <input
                type="tel"
                value={profileData?.phone || userData?.phone || ""}
                onChange={(e) => onUpdateContact("phone", e.target.value)}
                placeholder="Company phone number"
                className="w-full rounded-r-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400"
                onFocus={() => setActiveField('phone')}
                onBlur={() => setActiveField(null)}
              />
            </div>
          </div>
          <div>
            <label className="text-[8px] sm:text-xs text-gray-600 mb-1 block">Company Contact Email *</label>
            <div className="relative">
              <FiMail className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <input
                type="email"
                value={profileData?.email || userData?.email || ""}
                onChange={(e) => onUpdateContact("email", e.target.value)}
                placeholder="contact@company.com"
                className="w-full rounded-md border border-gray-200 pl-6 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-blue-400"
                onFocus={() => setActiveField('email')}
                onBlur={() => setActiveField(null)}
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      <section className="animate-slideIn">
        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          <FiLock className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4" />
          <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800">
            Change Password
          </h3>
        </div>
        <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
          <PasswordInput 
            label="Current Password" 
            value={passwordData.currentPassword}
            onChange={(value) => onUpdatePassword("currentPassword", value)}
            show={showPassword.current}
            onToggle={() => togglePasswordVisibility('current')}
            onFocus={() => setActiveField('current')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'current'}
            screenSize={screenSize}
          />
          <PasswordInput 
            label="New Password" 
            value={passwordData.newPassword}
            onChange={(value) => onUpdatePassword("newPassword", value)}
            show={showPassword.new}
            onToggle={() => togglePasswordVisibility('new')}
            onFocus={() => setActiveField('new')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'new'}
            screenSize={screenSize}
          />
          <PasswordInput 
            label="Confirm Password" 
            value={passwordData.confirmPassword}
            onChange={(value) => onUpdatePassword("confirmPassword", value)}
            show={showPassword.confirm}
            onToggle={() => togglePasswordVisibility('confirm')}
            onFocus={() => setActiveField('confirm')}
            onBlur={() => setActiveField(null)}
            isActive={activeField === 'confirm'}
            screenSize={screenSize}
          />
        </div>
        <button
          onClick={onChangePassword}
          disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
          className="mt-2 sm:mt-3 group relative flex items-center gap-1 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white hover:shadow-md transition-all transform hover:scale-105 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {saving ? (
            <>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Changing...
            </>
          ) : (
            <>
              {screenSize === 'mobile' ? 'Change' : 'Change Password'}
              {screenSize !== 'mobile' && <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />}
            </>
          )}
        </button>
      </section>

      <hr className="border-gray-200" />

      <section className="animate-slideIn">
        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1 sm:gap-1.5">
          <FiAlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          Delete Your Company
        </h3>
        <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 bg-red-50 rounded-md border border-red-100 mb-2">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0 w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <p className="text-[8px] sm:text-xs text-red-700">
            <strong>Warning:</strong> Deleting your profile will permanently remove all your company information, jobs, and related data. This action cannot be undone.
          </p>
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-white bg-gradient-to-r from-red-600 to-red-500 rounded-md hover:shadow-md transition-all transform hover:scale-105"
        >
          <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          {screenSize === 'mobile' ? 'Delete' : 'Delete Company Profile'}
        </button>
      </section>
    </div>
  );
}

function UploadBox({ title, large, preview, onUpload, onFocus, onBlur, isActive, type, screenSize }) {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    const inputId = `file-input-${title.replace(/\s+/g, '-').toLowerCase()}`;
    document.getElementById(inputId)?.click();
  };

  return (
    <div>
      <p className="text-[8px] sm:text-xs font-medium text-gray-600 mb-1">{title}</p>
      <div
        className={`relative flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-all duration-300 overflow-hidden group
          ${large ? "h-24 sm:h-28 md:h-32" : "h-20 sm:h-22 md:h-24"}
          ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
          ${preview ? "bg-gray-50" : ""}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={0}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-300 ${isHovering ? 'scale-105' : ''}`}
            />
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
              <FiCamera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <FiUpload className={`mx-auto text-sm sm:text-base transition-transform duration-300 ${isHovering ? 'scale-110' : ''}`} />
            <p className="mt-1 text-[8px] sm:text-xs">{screenSize === 'mobile' ? 'Upload' : 'Click to upload'}</p>
            <p className="text-[6px] sm:text-xs text-gray-400">{screenSize === 'mobile' ? '5MB max' : 'PNG, JPG up to 5MB'}</p>
          </div>
        )}
        <input
          id={`file-input-${title.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange, onFocus, onBlur, isActive, screenSize }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">{label} *</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full appearance-none rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs pr-5 sm:pr-7 transition-all duration-300 focus:outline-none focus:ring-1
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
        >
          {options.map((option, index) => (
            <option key={index} value={option === "Select..." ? "" : option}>
              {option}
            </option>
          ))}
        </select>
        <FiChevronDown className={`pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 transition-all duration-300 w-3 h-3 sm:w-3.5 sm:h-3.5
          ${isActive || isHovered ? 'text-blue-500 rotate-180' : 'text-gray-400'}
        `} />
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange, onFocus, onBlur, isActive, screenSize }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">{label} *</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs transition-all duration-300 focus:outline-none focus:ring-1
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
        />
        <FiCalendar className={`pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 transition-all duration-300 w-3 h-3 sm:w-3.5 sm:h-3.5
          ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400'}
        `} />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, icon, type = "text", onFocus, onBlur, isActive, screenSize }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-[8px] sm:text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <span className={`absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 transition-all duration-300
          ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400'}
        `}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full rounded-md border pl-6 sm:pl-7 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs transition-all duration-300 focus:outline-none focus:ring-1
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
        />
      </div>
    </div>
  );
}

function SocialRow({ item, index, hovered, onHover, onLeave, onChange, onRemove, screenSize }) {
  const selected = SOCIAL_OPTIONS.find((s) => s.value === item.platform);

  return (
    <div 
      className={`flex flex-col gap-2 sm:flex-row sm:items-center p-1.5 sm:p-2 rounded-md transition-all duration-300 ${hovered ? 'bg-gray-50' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="relative w-full sm:w-36">
        <select
          value={item.platform}
          onChange={(e) => onChange("platform", e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 pr-5 sm:pr-7 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-all"
        >
          {SOCIAL_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-gray-400">
          {selected?.icon}
        </span>
      </div>
      <input
        type="url"
        placeholder="Profile link/url..."
        value={item.url}
        onChange={(e) => onChange("url", e.target.value)}
        className="w-full flex-1 rounded-md border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 transition-all"
      />
      <button
        onClick={onRemove}
        className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-gray-200 transition-all duration-300 self-end sm:self-auto
          ${hovered ? 'bg-red-50 border-red-200 text-red-500' : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'}
        `}
      >
        <FiX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle, onFocus, onBlur, isActive, screenSize }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="text-[8px] sm:text-xs text-gray-600 mb-1 block">{label} *</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder="••••••••"
          className={`w-full rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 pr-6 sm:pr-8 text-[10px] sm:text-xs transition-all duration-300 focus:outline-none focus:ring-1
            ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-400'}
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 transition-all duration-300
            ${isActive || isHovered ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          <FiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}