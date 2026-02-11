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
  FiHome
} from "react-icons/fi";
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";
import { useSelector, useDispatch } from "react-redux";
import { refreshUserData } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { selectUser } from "@/redux/slices/userSlice";

const SOCIAL_OPTIONS = [
  { label: "Facebook", icon: <FiFacebook />, value: "facebook" },
  { label: "Twitter", icon: <FiTwitter />, value: "twitter" },
  { label: "Instagram", icon: <FiInstagram />, value: "instagram" },
  { label: "Youtube", icon: <FiYoutube />, value: "youtube" },
  { label: "LinkedIn", icon: <FiLinkedin />, value: "linkedin" },
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
  
  const reduxUser = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log("🔍 [SETTINGS MAIN] Component mounted");
  console.log("📊 [SETTINGS MAIN] Current reduxUser:", reduxUser);
  console.log("🖼️ [SETTINGS MAIN] Current profileImagePreview:", profileImagePreview);

  // Load profile and user data on component mount
  useEffect(() => {
    console.log("🔄 [SETTINGS MAIN] useEffect - Loading user data");
    loadUserData();
  }, []);

  // Combine user and profile data when both are loaded
  useEffect(() => {
    console.log("🔄 [SETTINGS MAIN] useEffect - reduxUser changed:", reduxUser);
    
    if (reduxUser) {
      console.log("👤 [SETTINGS MAIN] Redux user updated:");
      console.log("   - Name:", reduxUser.name);
      console.log("   - Email:", reduxUser.email);
      console.log("   - Profile Image:", reduxUser.profileImage);
      console.log("   - Phone:", reduxUser.phone);
      console.log("   - Address:", reduxUser.address);
      
      setUserData(reduxUser);
      
      // Combine user data with any existing profile data
      setPersonalInfo({
        name: reduxUser.name || "",
        username: reduxUser.username || "",
        email: reduxUser.email || "",
        phone: reduxUser.phone || "",
        address: reduxUser.address || "",
        profileImage: reduxUser.profileImage || ""
      });
      
      // Set profile image from user data
      if (reduxUser.profileImage) {
        console.log("✅ [SETTINGS MAIN] Setting profile image from reduxUser:", reduxUser.profileImage);
        setProfileImagePreview(reduxUser.profileImage);
      } else {
        console.log("⚠️ [SETTINGS MAIN] No profile image in reduxUser");
      }
    } else {
      console.log("⚠️ [SETTINGS MAIN] No reduxUser available");
    }
  }, [reduxUser]);

  // Update personal info when profileData is loaded
  useEffect(() => {
    if (profileData) {
      console.log("📊 [SETTINGS MAIN] Profile data loaded:");
      console.log("   - Profile phone:", profileData.phone);
      console.log("   - Profile location:", profileData.location);
      console.log("   - Profile profileImage:", profileData.profileImage);
      console.log("   - Full profileData:", profileData);
      
      // Update phone and address from profile if they exist there
      setPersonalInfo(prev => {
        const updated = {
          ...prev,
          phone: profileData.phone || prev.phone,
          address: profileData.location || prev.address,
          // IMPORTANT: Profile image should come from USER data, not profile data
          profileImage: prev.profileImage // Keep existing profile image from user data
        };
        console.log("🔄 [SETTINGS MAIN] Updated personalInfo:", updated);
        return updated;
      });
      
      // DO NOT update profile image from profile data - it's empty in Profile model
      if (profileData.profileImage) {
        console.log("⚠️ [SETTINGS MAIN] Profile data has profileImage:", profileData.profileImage);
      } else {
        console.log("ℹ️ [SETTINGS MAIN] Profile data has NO profileImage (expected)");
      }
    }
  }, [profileData]);

  const loadUserData = async () => {
    try {
      console.log("🔄 [SETTINGS MAIN] loadUserData called");
      setLoading(true);
      
      // Get user data from Redux
      const currentUser = reduxUser;
      
      if (currentUser) {
        console.log("👤 [SETTINGS MAIN] User data from Redux:");
        console.log("   - Name:", currentUser.name);
        console.log("   - Profile Image:", currentUser.profileImage);
        console.log("   - Full user:", currentUser);
        
        setUserData(currentUser);
        setPersonalInfo({
          name: currentUser.name || "",
          username: currentUser.username || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          profileImage: currentUser.profileImage || ""
        });
        
        // Set profile image if exists
        if (currentUser.profileImage) {
          console.log("✅ [SETTINGS MAIN] Setting profile image preview from Redux:", currentUser.profileImage);
          setProfileImagePreview(currentUser.profileImage);
        } else {
          console.log("⚠️ [SETTINGS MAIN] No profile image in Redux user");
        }
      } else {
        console.log("🔄 [SETTINGS MAIN] No reduxUser, falling back to localStorage");
        // Fallback to localStorage
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          console.log("👤 [SETTINGS MAIN] User data from localStorage:", storedUser);
          setUserData(storedUser);
          setPersonalInfo({
            name: storedUser.name || "",
            username: storedUser.username || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
            address: storedUser.address || "",
            profileImage: storedUser.profileImage || ""
          });
          
          if (storedUser.profileImage) {
            console.log("✅ [SETTINGS MAIN] Setting profile image from localStorage:", storedUser.profileImage);
            setProfileImagePreview(storedUser.profileImage);
          }
        } else {
          console.log("⚠️ [SETTINGS MAIN] No user data in localStorage either");
        }
      }
      
      // Load profile data
      console.log("🔄 [SETTINGS MAIN] Fetching profile data...");
      try {
        const profile = await profileService.getMyProfile();
        if (profile) {
          console.log("✅ [SETTINGS MAIN] Profile loaded successfully:");
          console.log("   - Profile ID:", profile._id);
          console.log("   - Profile completion:", profile.completionPercentage);
          console.log("   - Profile phone:", profile.phone);
          console.log("   - Profile location:", profile.location);
          console.log("   - Profile profileImage:", profile.profileImage);
          console.log("   - Full profile:", profile);
          
          setProfileData(profile);
          
          // Update personal info with profile data (except profile image)
          setPersonalInfo(prev => {
            const updated = {
              ...prev,
              phone: profile.phone || prev.phone,
              address: profile.location || prev.address,
              // DO NOT update profileImage from profile data
              profileImage: prev.profileImage
            };
            console.log("🔄 [SETTINGS MAIN] Updated personalInfo after profile load:", updated);
            return updated;
          });
          
          // Check if profile has profileImage (it shouldn't for employers)
          if (profile.profileImage) {
            console.log("⚠️ [SETTINGS MAIN] WARNING: Profile data has profileImage:", profile.profileImage);
            console.log("⚠️ [SETTINGS MAIN] This might indicate a data inconsistency");
          }
        } else {
          console.log("ℹ️ [SETTINGS MAIN] No profile found via profileService.getMyProfile()");
        }
      } catch (profileError) {
        console.log("❌ [SETTINGS MAIN] Error fetching profile:", profileError.message);
        console.log("ℹ️ [SETTINGS MAIN] Profile not found or error");
      }
      
      console.log("✅ [SETTINGS MAIN] Data loading complete");
      console.log("📊 [SETTINGS MAIN] Final state:");
      console.log("   - userData:", userData);
      console.log("   - personalInfo:", personalInfo);
      console.log("   - profileImagePreview:", profileImagePreview);
      console.log("   - profileData:", profileData);
      
    } catch (error) {
      console.error("❌ [SETTINGS MAIN] Error loading data:", error);
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
    console.log(`🔄 [SETTINGS MAIN] Updating personalInfo.${field}:`, value);
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If updating phone or address, also update profile data
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
      console.log("📤 [SETTINGS MAIN] Uploading profile image...");
      console.log("📄 File:", file);
      
      if (!file) {
        toast.error("Please select an image");
        return;
      }

      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("🖼️ [SETTINGS MAIN] Created local preview");
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Create FormData for user update
      const formData = new FormData();
      formData.append("profileImage", file);
      
      // Add other personal data if available
      if (personalInfo.phone) {
        formData.append("phone", personalInfo.phone);
      }
      if (personalInfo.address) {
        formData.append("address", personalInfo.address);
      }
      if (personalInfo.name) {
        formData.append("name", personalInfo.name);
      }
      if (personalInfo.email) {
        formData.append("email", personalInfo.email);
      }

      console.log("📦 [SETTINGS MAIN] FormData prepared for upload");
      
      // Upload to server via authService
      setSaving(true);
      const response = await authService.updateProfile(formData);
      
      console.log("✅ [SETTINGS MAIN] Profile image upload response:", response);
      
      if (response.success) {
        toast.success("Profile image updated successfully!");
        
        // Update local state with the response data
        const updatedUserData = {
          ...userData,
          ...response.user,
          profileImage: response.user?.profileImage || profileImagePreview
        };
        
        console.log("🔄 [SETTINGS MAIN] Updated userData:", updatedUserData);
        console.log("🖼️ [SETTINGS MAIN] New profileImage URL:", response.user?.profileImage);
        
        setUserData(updatedUserData);
        setPersonalInfo(prev => ({
          ...prev,
          profileImage: response.user?.profileImage || prev.profileImage
        }));
        
        // Update profile data if it exists
        if (profileData) {
          setProfileData(prev => ({
            ...prev,
            phone: personalInfo.phone || prev?.phone,
            location: personalInfo.address || prev?.location
          }));
        }
        
        // Update the preview with the actual Cloudinary URL
        if (response.user?.profileImage) {
          console.log("✅ [SETTINGS MAIN] Setting profile image preview to Cloudinary URL:", response.user.profileImage);
          setProfileImagePreview(response.user.profileImage);
        }
        
        // Refresh user data in Redux
        console.log("🔄 [SETTINGS MAIN] Refreshing Redux data...");
        dispatch(refreshUserData());
      } else {
        console.error("❌ [SETTINGS MAIN] Upload response not successful:", response);
      }
    } catch (error) {
      console.error("❌ [SETTINGS MAIN] Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setSaving(false);
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      // Format data for API
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

      console.log("💾 [SETTINGS MAIN] Saving profile data:", formattedData);
      
      const result = await profileService.createOrUpdateEmployerProfile({
        ...formattedData,
        files: {
          logo: profileData?.companyInfo?.logoFile,
          banner: profileData?.companyInfo?.bannerFile
        }
      });

      if (result.success) {
        console.log("✅ [SETTINGS MAIN] Profile saved successfully:", result);
        toast.success("Company profile updated successfully!");
        await loadUserData();
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ [SETTINGS MAIN] Error saving profile:", error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Save personal information changes
  const savePersonalInfo = async () => {
    try {
      console.log("💾 [SETTINGS MAIN] Saving personal info...");
      console.log("📊 Personal info to save:", personalInfo);
      
      // Validate personal info
      if (!personalInfo.name || !personalInfo.email) {
        toast.error("Name and email are required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setSaving(true);
      
      // Prepare FormData for the update
      const formData = new FormData();
      
      // Add personal info fields
      formData.append("name", personalInfo.name);
      formData.append("email", personalInfo.email);
      if (personalInfo.phone) {
        formData.append("phone", personalInfo.phone);
      }
      if (personalInfo.address) {
        formData.append("address", personalInfo.address);
      }
      if (personalInfo.username) {
        formData.append("username", personalInfo.username);
      }

      console.log("📦 [SETTINGS MAIN] FormData prepared for personal info update");

      // Check if email has changed
      const emailChanged = personalInfo.email !== userData?.email;
      
      if (emailChanged) {
        toast("Please verify your new email address. Verification email will be sent.", {
          icon: "📧",
          duration: 4000
        });
      }

      // Update user profile via auth service
      const result = await authService.updateProfile(formData);
      
      console.log("✅ [SETTINGS MAIN] Personal info update response:", result);
      
      if (result.success) {
        toast.success("Personal information updated successfully!");
        
        // Update local user data
        const updatedUser = {
          ...userData,
          ...result.user,
          profileImage: result.user?.profileImage || userData?.profileImage
        };
        
        console.log("🔄 [SETTINGS MAIN] Updated user data:", updatedUser);
        
        setUserData(updatedUser);
        
        // Also update profile data with contact info
        if (profileData) {
          setProfileData(prev => ({
            ...prev,
            phone: personalInfo.phone,
            location: personalInfo.address,
            email: personalInfo.email
          }));
        }
        
        // Update profile image preview if it changed
        if (result.user?.profileImage) {
          console.log("✅ [SETTINGS MAIN] Updating profile image preview:", result.user.profileImage);
          setProfileImagePreview(result.user.profileImage);
        }
        
        // Refresh Redux store
        dispatch(refreshUserData());
        
        // Exit edit mode
        setEditingPersonal(false);
      }
      
    } catch (error) {
      console.error("❌ [SETTINGS MAIN] Error saving personal info:", error);
      toast.error(error.message || "Failed to update personal information");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      // Validate passwords
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
      
      // Call auth service to change password
      const result = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (result.success) {
        toast.success("Password changed successfully!");
        
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("❌ [SETTINGS MAIN] Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  // Handle file upload for company
  const handleFileUpload = async (field, file) => {
    try {
      console.log(`📤 [SETTINGS MAIN] Uploading ${field}:`, file);
      
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          updateCompanyInfo('logo', reader.result);
        } else if (field === 'banner') {
          updateCompanyInfo('banner', reader.result);
        }
      };
      reader.readAsDataURL(file);
      
      // Store file for upload
      if (field === 'logo') {
        updateCompanyInfo('logoFile', file);
        updateCompanyInfo('logo', reader.result);
      } else if (field === 'banner') {
        updateCompanyInfo('bannerFile', file);
        updateCompanyInfo('banner', reader.result);
      }
      
      toast.success(`${field} uploaded successfully!`);
      
    } catch (error) {
      console.error(`❌ [SETTINGS MAIN] Error handling ${field}:`, error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
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
    profileImage: profileImagePreview || userData?.profileImage || "" // Profile image comes from userData
  };

  console.log("📊 [SETTINGS MAIN] Combined data for display:");
  console.log("   - Name:", combinedData.name);
  console.log("   - Profile Image URL:", combinedData.profileImage);
  console.log("   - Phone:", combinedData.phone);
  console.log("   - Address:", combinedData.address);
  console.log("   - Full combinedData:", combinedData);

  return (
    <main className="w-full min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Settings
        </h2>
        {profileData && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
            <FiCheck />
            <span>Profile Complete ({profileData.completionPercentage || 0}%)</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b text-sm overflow-x-auto">
        <Tab 
          label="Personal Info" 
          active={activeTab === "personal"} 
          onClick={() => setActiveTab("personal")}
        />
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

      {/* Save Button - Global */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave />
              Save All Changes
            </>
          )}
        </button>
      </div>

      {/* Content based on active tab */}
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
        />
      )}
      {activeTab === "company" && (
        <CompanyInfoTab 
          data={profileData?.companyInfo || {}} 
          onUpdate={updateCompanyInfo}
          onFileUpload={handleFileUpload}
        />
      )}
      {activeTab === "founding" && (
        <FoundingInfoTab 
          data={profileData?.foundingInfo || {}}
          onUpdate={updateFoundingInfo}
        />
      )}
      {activeTab === "social" && (
        <SocialMediaTab 
          links={profileData?.socialLinks || []}
          onUpdate={updateSocialLinks}
          onAdd={addSocialLink}
          onRemove={removeSocialLink}
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
        />
      )}
    </main>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 px-1 transition whitespace-nowrap ${
        active
          ? "border-b-2 border-blue-600 font-medium text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
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
  saving 
}) {
  console.log("🖼️ [PERSONAL INFO TAB] Rendering with:");
  console.log("   - userData:", userData);
  console.log("   - profileImagePreview:", profileImagePreview);
  console.log("   - personalInfo:", personalInfo);
  console.log("   - profileData:", profileData);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    console.log("📤 [PERSONAL INFO TAB] File selected:", file);
    if (file) {
      onProfileImageUpload(file);
    }
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm space-y-8">
      {/* Profile Image */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiImage className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">
              Profile Image
            </h3>
          </div>
          <button
            onClick={() => {
              console.log("🖱️ [PERSONAL INFO TAB] Change photo clicked");
              document.getElementById('profile-image-input')?.click();
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Change Photo
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {profileImagePreview ? (
                <>
                  <img 
                    src={profileImagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("❌ [PERSONAL INFO TAB] Image failed to load:", profileImagePreview);
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/128";
                    }}
                    onLoad={() => console.log("✅ [PERSONAL INFO TAB] Image loaded successfully")}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Click to change</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Click "Change Photo" to upload a new profile picture
          </p>
          {profileImagePreview && (
            <p className="mt-2 text-xs text-gray-400">
              Current image: {profileImagePreview.length > 50 ? profileImagePreview.substring(0, 50) + "..." : profileImagePreview}
            </p>
          )}
        </div>
      </section>

      {/* Personal Information */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiUser className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">
              Personal Information
            </h3>
          </div>
          <button
            onClick={onToggleEditPersonal}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <FiEdit className="w-4 h-4" />
            {editingPersonal ? "Cancel Edit" : "Edit"}
          </button>
        </div>

        {editingPersonal ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => onUpdatePersonal("name", e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={personalInfo.username}
                  onChange={(e) => onUpdatePersonal("username", e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => onUpdatePersonal("email", e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="your.email@example.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Changing your email will require verification
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => onUpdatePersonal("phone", e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex items-center gap-2">
                  <FiHome className="text-gray-400 flex-shrink-0" />
                  <textarea
                    rows={3}
                    value={personalInfo.address}
                    onChange={(e) => onUpdatePersonal("address", e.target.value)}
                    className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onToggleEditPersonal}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onSavePersonalInfo}
                disabled={saving}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {personalInfo.name || userData?.name || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Username</p>
                <p className="text-sm font-medium text-gray-900">
                  {personalInfo.username || userData?.username || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {personalInfo.email || userData?.email || "Not set"}
                  {userData?.isEmailVerified && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Verified</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <FiPhone className="text-gray-400" />
                  {personalInfo.phone || userData?.phone || profileData?.phone || "Not set"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <FiHome className="text-gray-400 flex-shrink-0" />
                  {personalInfo.address || userData?.address || profileData?.location || "Not set"}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500">Account Role</p>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
                {userData?.role || "Not set"}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Account Summary */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Account Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-xs text-gray-500">Profile Completion</p>
            <p className="text-2xl font-bold text-blue-600">{profileData?.completionPercentage || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${profileData?.completionPercentage || 0}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-xs text-gray-500">Account Status</p>
            <p className="text-2xl font-bold text-green-600">Active</p>
            <p className="text-xs text-green-600 mt-1">
              {userData?.isEmailVerified ? "Email Verified" : "Email Not Verified"}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="text-2xl font-bold text-purple-600">
              {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "N/A"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CompanyInfoTab({ data, onUpdate, onFileUpload }) {
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
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800">
        Logo & Banner Image
      </h3>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4">
          <UploadBox 
            title="Upload Logo" 
            preview={data?.logo}
            onChange={handleLogoUpload}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <UploadBox 
            title="Banner Image" 
            large 
            preview={data?.banner}
            onChange={handleBannerUpload}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Company name *
        </label>
        <input
          type="text"
          value={data?.companyName || ""}
          onChange={(e) => onUpdate("companyName", e.target.value)}
          placeholder="Enter company name"
          className="mt-2 w-full rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          About us *
        </label>
        <textarea
          rows={5}
          value={data?.aboutUs || ""}
          onChange={(e) => onUpdate("aboutUs", e.target.value)}
          placeholder="Write down about your company here. Let the candidate know who we are..."
          className="mt-2 w-full rounded-md border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
    </div>
  );
}

function FoundingInfoTab({ data, onUpdate }) {
  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Select 
          label="Organization Type" 
          value={data?.organizationType || ""}
          options={ORGANIZATION_TYPES}
          onChange={(value) => onUpdate("organizationType", value)}
        />
        <Select 
          label="Industry Types" 
          value={data?.industryType || ""}
          options={INDUSTRY_TYPES}
          onChange={(value) => onUpdate("industryType", value)}
        />
        <Select 
          label="Team Size" 
          value={data?.teamSize || ""}
          options={TEAM_SIZES}
          onChange={(value) => onUpdate("teamSize", value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <DateInput 
          label="Year of Establishment" 
          value={data?.yearOfEstablishment ? new Date(data.yearOfEstablishment).toISOString().split('T')[0] : ""}
          onChange={(value) => onUpdate("yearOfEstablishment", value)}
        />
        <TextInput
          label="Company Website"
          value={data?.companyWebsite || ""}
          onChange={(value) => onUpdate("companyWebsite", value)}
          placeholder="Website url..."
          icon={<FiLink />}
          type="url"
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Company Vision
        </label>
        <textarea
          rows={5}
          value={data?.companyVision || ""}
          onChange={(e) => onUpdate("companyVision", e.target.value)}
          placeholder="Tell us what Vision of your company..."
          className="mt-2 w-full rounded-md border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function SocialMediaTab({ links, onUpdate, onAdd, onRemove }) {
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
            onChange={(key, value) => onUpdate(index, key, value)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-4 flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
      >
        <FiPlus />
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
  saving 
}) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 shadow-sm space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <FiMail className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Company Contact Information
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Map Location *</label>
            <input
              type="text"
              value={profileData?.location || userData?.address || ""}
              onChange={(e) => onUpdateContact("location", e.target.value)}
              placeholder="Enter your company location"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Company Phone *</label>
            <div className="mt-1 flex">
              <div className="flex items-center gap-2 border border-r-0 rounded-l-md px-3 bg-gray-50 text-sm min-w-[100px]">
                <span>🇺🇸</span>
                <span>+1</span>
              </div>
              <input
                type="tel"
                value={profileData?.phone || userData?.phone || ""}
                onChange={(e) => onUpdateContact("phone", e.target.value)}
                placeholder="Company phone number"
                className="w-full rounded-r-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Company Contact Email *</label>
            <div className="relative mt-1">
              <input
                type="email"
                value={profileData?.email || userData?.email || ""}
                onChange={(e) => onUpdateContact("email", e.target.value)}
                placeholder="contact@company.com"
                className="w-full rounded-md border px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiMail />
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This email is used for company communications and job applications
            </p>
          </div>
        </div>
      </section>

      <hr />

      <section>
        <div className="flex items-center gap-2 mb-4">
          <FiLock className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Change Password
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <PasswordInput 
            label="Current Password" 
            value={passwordData.currentPassword}
            onChange={(value) => onUpdatePassword("currentPassword", value)}
            show={showPassword.current}
            onToggle={() => togglePasswordVisibility('current')}
          />
          <PasswordInput 
            label="New Password" 
            value={passwordData.newPassword}
            onChange={(value) => onUpdatePassword("newPassword", value)}
            show={showPassword.new}
            onToggle={() => togglePasswordVisibility('new')}
          />
          <PasswordInput 
            label="Confirm Password" 
            value={passwordData.confirmPassword}
            onChange={(value) => onUpdatePassword("confirmPassword", value)}
            show={showPassword.confirm}
            onToggle={() => togglePasswordVisibility('confirm')}
          />
        </div>
        <button
          onClick={onChangePassword}
          disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
          className="mt-4 flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </section>

      <hr />

      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Delete Your Company
        </h3>
        <div className="flex items-start gap-2 p-4 bg-red-50 rounded-md mb-4">
          <FiAlertCircle className="text-red-500 mt-1 flex-shrink-0" />
          <p className="text-sm text-red-700">
            <strong>Warning:</strong> Deleting your profile will permanently remove all your company information, jobs, and related data. This action cannot be undone.
          </p>
        </div>
        <p className="text-sm text-gray-500 max-w-2xl mb-4">
          If you delete your profile, you will no longer be able to post jobs, view candidates, or access any of your company data. You will need to create a new profile if you wish to use our services again in the future.
        </p>
        <button
          onClick={onDelete}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          ⛔ Delete Company Profile
        </button>
      </section>
    </div>
  );
}

function UploadBox({ title, large, preview, onChange }) {
  const handleClick = () => {
    const inputId = `file-input-${title.replace(/\s+/g, '-').toLowerCase()}`;
    document.getElementById(inputId)?.click();
  };

  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <div
        className={`mt-2 flex cursor-pointer items-center justify-center rounded-md border border-dashed bg-gray-50 hover:bg-gray-100 ${
          large ? "h-48" : "h-32"
        } ${preview ? "p-2" : ""}`}
        onClick={handleClick}
      >
        {preview ? (
          <div className="text-center w-full h-full">
            <img 
              src={preview} 
              alt={title}
              className={`mx-auto ${large ? "h-full w-full object-cover rounded-md" : "h-24 w-24 object-cover rounded-full"}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = large ? "https://via.placeholder.com/800x200" : "https://via.placeholder.com/128";
              }}
            />
            <p className="mt-2 text-xs text-blue-600">Click to change</p>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <FiUpload className="mx-auto text-xl" />
            <p className="mt-2 text-sm">Click to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </div>
        )}
        <input
          id={`file-input-${title.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // Create a change event to pass the file
              const event = { target: { files: [file] } };
              onChange(event);
            }
          }}
        />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          required
        >
          {options.map((option, index) => (
            <option key={index} value={option === "Select..." ? "" : option}>
              {option}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <div className="relative mt-2">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
        <FiCalendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, icon, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      </div>
    </div>
  );
}

function SocialRow({ item, onChange, onRemove }) {
  const selected = SOCIAL_OPTIONS.find((s) => s.value === item.platform);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-48">
        <select
          value={item.platform}
          onChange={(e) => onChange("platform", e.target.value)}
          className="w-full appearance-none rounded-md border px-3 py-2 pr-8 text-sm focus:border-blue-500 focus:outline-none"
        >
          {SOCIAL_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
          {selected?.icon}
        </span>
      </div>
      <input
        type="url"
        placeholder="Profile link/url..."
        value={item.url}
        onChange={(e) => onChange("url", e.target.value)}
        className="w-full flex-1 rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        onClick={onRemove}
        className="flex h-10 w-10 items-center justify-center rounded-md border text-gray-400 hover:bg-gray-100 hover:text-red-500 self-start sm:self-auto"
      >
        <FiX />
      </button>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, onToggle }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label} *</label>
      <div className="relative mt-1">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-md border px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiEye />
        </button>
      </div>
    </div>
  );
}