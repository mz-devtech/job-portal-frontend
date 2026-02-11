"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  FiMail,
  FiMapPin,
  FiImage
} from "react-icons/fi";
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService"; // ADD THIS IMPORT
import { updateProfileCompletion, refreshUserData } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SOCIAL_PLATFORMS = [
  { label: "Facebook", value: "facebook" },
  { label: "Twitter", value: "twitter" },
  { label: "Instagram", value: "instagram" },
  { label: "Youtube", value: "youtube" },
  { label: "LinkedIn", value: "linkedin" },
];

const STEPS = [
  { id: "personal", label: "Personal Info", icon: <FiUser /> },
  { id: "company", label: "Company Info", icon: <FiBriefcase /> },
  { id: "founding", label: "Founding Info", icon: <FiGlobe /> },
  { id: "social", label: "Social Media", icon: <FiShare2 /> },
  { id: "contact", label: "Contact", icon: <FiPhone /> },
];

export default function AccountSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileImageUploaded, setProfileImageUploaded] = useState(false); // ADD THIS STATE
  const [formData, setFormData] = useState({
    personal: {
      profileImage: null,
      phone: "",
      address: "",
    },
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

  const dispatch = useDispatch();
  const router = useRouter();

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

  // ADD THIS FUNCTION: Handle profile image upload separately
  const uploadProfileImage = async () => {
    try {
      if (formData.personal.profileImage && formData.personal.profileImage instanceof File) {
        console.log("📤 Uploading personal profile image...");
        
        const personalFormData = new FormData();
        personalFormData.append("profileImage", formData.personal.profileImage);
        
        // Add phone and address if available
        if (formData.personal.phone) {
          personalFormData.append("phone", formData.personal.phone);
        }
        if (formData.personal.address) {
          personalFormData.append("address", formData.personal.address);
        }

        console.log("📦 Personal data to upload:", {
          hasProfileImage: true,
          phone: formData.personal.phone,
          address: formData.personal.address
        });

        const result = await authService.updateProfile(personalFormData);
        
        if (result.success) {
          console.log("✅ Personal profile image uploaded successfully");
          setProfileImageUploaded(true);
          
          // Update localStorage with new profile image
          if (typeof window !== "undefined") {
            try {
              const currentUserStr = localStorage.getItem("user");
              if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                const updatedUser = {
                  ...currentUser,
                  profileImage: result.user?.profileImage || currentUser.profileImage,
                  phone: formData.personal.phone || currentUser.phone,
                  address: formData.personal.address || currentUser.address,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                console.log("✅ Updated user profile image in localStorage");
              }
            } catch (error) {
              console.error("Error updating localStorage:", error);
            }
          }
          
          return true;
        }
      }
      return false; // No image to upload
    } catch (error) {
      console.error("❌ Error uploading profile image:", error);
      // Don't throw error here, just log it
      return false;
    }
  };

  const handleSubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitted || loading) return;
    
    try {
      console.log("📋 Form submitted:", formData);
      setLoading(true);
      setIsSubmitted(true);

      // STEP 1: First upload the personal profile image (if exists)
      if (formData.personal.profileImage && formData.personal.profileImage instanceof File) {
        console.log("🔄 Step 1: Uploading personal profile image...");
        await uploadProfileImage();
      } else {
        console.log("ℹ️ No personal profile image to upload");
      }

      // STEP 2: Format and send company data
      console.log("🔄 Step 2: Formatting employer data...");
      const formattedData = profileService.formatEmployerData(formData);
      
      console.log("📦 Formatted data for API:", formattedData);

      // STEP 3: Call profile service for company profile
      console.log("🔄 Step 3: Creating/updating employer profile...");
      const result = await profileService.createOrUpdateEmployerProfile(formattedData);
      
      console.log("✅ Profile update result:", result);

      if (result.success) {
        // STEP 4: Update Redux store with profile completion
        if (result.profile) {
          console.log("🔄 Step 4: Updating Redux store...");
          
          dispatch(updateProfileCompletion({
            isProfileComplete: true,
            profile: result.profile
          }));
          
          await dispatch(refreshUserData()).unwrap();
          
          console.log("✅ Profile completion state updated in Redux");
        }

        // STEP 5: Update localStorage with combined data
        if (typeof window !== "undefined") {
          try {
            const currentUserStr = localStorage.getItem("user");
            if (currentUserStr) {
              const currentUser = JSON.parse(currentUserStr);
              
              // Get profile image from result if available, or keep existing
              let profileImageUrl = currentUser.profileImage;
              
              // If we uploaded a profile image, try to get it from the response
              if (profileImageUploaded) {
                // The profile image URL should now be in the user object after authService.updateProfile
                const updatedUser = authService.getCurrentUser();
                profileImageUrl = updatedUser?.profileImage || profileImageUrl;
              }
              
              const updatedUser = {
                ...currentUser,
                isProfileComplete: true,
                profile: result.profile,
                phone: formData.personal.phone || currentUser.phone,
                address: formData.personal.address || currentUser.address,
                profileImage: profileImageUrl
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
              console.log("✅ Updated user in localStorage with all data");
            }
            
            localStorage.setItem("profileComplete", "true");
          } catch (localStorageError) {
            console.error("Error updating localStorage:", localStorageError);
          }
        }

        // STEP 6: Show success and redirect
        setLoading(false);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          console.log("🔀 Redirecting to home page...");
          router.push("/home");
        }, 3000);

        return result;
      } else {
        throw new Error(result.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("❌ Error submitting profile:", error);
      toast.error(error.message || "Failed to save profile. Please try again.");
      
      // Reset states on error
      setLoading(false);
      setIsSubmitted(false);
    }
  };

  // Effect to handle modal close and redirect
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        console.log("Auto-redirecting to home page...");
        router.push("/home");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, router]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={formData.personal} updateData={updateFormData} />;
      case 1:
        return <CompanyInfoStep data={formData.company} updateData={updateFormData} />;
      case 2:
        return <FoundingInfoStep data={formData.founding} updateData={updateFormData} />;
      case 3:
        return (
          <SocialMediaStep
            links={formData.social}
            updateLink={updateSocialLinks}
            addLink={addSocialLink}
            removeLink={removeSocialLink}
          />
        );
      case 4:
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
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Completed
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
              disabled={currentStep === 0 || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md border text-sm ${
                currentStep === 0 || loading
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiArrowLeft />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {currentStep === STEPS.length - 1 ? "Saving..." : "Loading..."}
                </>
              ) : (
                <>
                  {currentStep === STEPS.length - 1 ? "Complete Setup" : "Save & Next →"}
                </>
              )}
            </button>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onRedirect={() => router.push("/home")} />
      )}
    </>
  );
}

/* ================= PERSONAL INFO STEP ================= */

function PersonalInfoStep({ data, updateData }) {
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleFileChange = (field, file) => {
    updateData("personal", field, file);
    
    // Create preview for profile image
    if (field === "profileImage") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Add your personal details to complete your profile</p>
      </div>

      {/* Profile Image */}
      <div>
        <h3 className="mb-4 text-sm font-medium text-gray-800">
          Profile Image
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          <UploadBox
            title="Upload Profile Photo"
            note="A photo larger than 400 pixels work best. Max photo size 5 MB."
            value={data.profileImage}
            preview={profileImagePreview}
            onChange={(file) => handleFileChange("profileImage", file)}
            type="profile"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <div className="flex">
          <div className="flex items-center gap-2 border rounded-l-md px-3 bg-gray-50 text-sm min-w-[100px]">
            <span>🇺🇸</span>
            <span>+1</span>
          </div>
          <input
            type="tel"
            placeholder="Phone number..."
            value={data.phone}
            onChange={(e) => updateData("personal", "phone", e.target.value)}
            className="w-full border border-l-0 rounded-r-md px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Address *
        </label>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="Enter your full address"
            value={data.address}
            onChange={(e) => updateData("personal", "address", e.target.value)}
            className="w-full rounded-md border px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPANY INFO STEP ================= */

function CompanyInfoStep({ data, updateData }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const handleFileChange = (field, file) => {
    updateData("company", field, file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === "logo") {
        setLogoPreview(reader.result);
      } else if (field === "banner") {
        setBannerPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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
            preview={logoPreview}
            onChange={(file) => handleFileChange("logo", file)}
            type="logo"
          />

          {/* Banner */}
          <UploadBox
            title="Banner Image"
            note="Banner images optimal dimension 1520x400. Supported format JPEG, PNG. Max photo size 5 MB."
            wide
            value={data.banner}
            preview={bannerPreview}
            onChange={(file) => handleFileChange("banner", file)}
            type="banner"
          />
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Company name *
        </label>
        <input
          type="text"
          placeholder="Enter company name"
          value={data.name}
          onChange={(e) => updateData("company", "name", e.target.value)}
          className="w-full rounded-md border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* About Us */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          About Us *
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
            required
          />
        </div>
      </div>
    </div>
  );
}

/* ================= FOUNDING INFO STEP ================= */

function FoundingInfoStep({ data, updateData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Organization Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Type *
          </label>
          <div className="relative">
            <select
              value={data.organizationType}
              onChange={(e) => updateData("founding", "organizationType", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select...</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Public Limited">Public Limited</option>
              <option value="LLC">LLC</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Startup">Startup</option>
              <option value="Government">Government</option>
              <option value="Educational">Educational</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Industry Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Types *
          </label>
          <div className="relative">
            <select
              value={data.industryType}
              onChange={(e) => updateData("founding", "industryType", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select...</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Transportation">Transportation</option>
              <option value="Media">Media</option>
              <option value="Construction">Construction</option>
              <option value="Energy">Energy</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Automotive">Automotive</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size *
          </label>
          <div className="relative">
            <select
              value={data.teamSize}
              onChange={(e) => updateData("founding", "teamSize", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
              required
            >
              <option value="">Select...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Year of Establishment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Establishment *
          </label>
          <div className="relative">
            <input
              type="date"
              value={data.year}
              onChange={(e) => updateData("founding", "year", e.target.value)}
              className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
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

/* ================= SOCIAL MEDIA STEP ================= */

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

/* ================= CONTACT STEP ================= */

function ContactStep({ data, updateData }) {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Map Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Map Location *
        </label>
        <input
          type="text"
          placeholder="Enter your location"
          value={data.location}
          onChange={(e) => updateData("contact", "location", e.target.value)}
          className="w-full border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone *
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
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>

        <div className="flex items-center border rounded-md px-3 py-2">
          <span className="text-gray-400 mr-2">✉️</span>
          <input
            type="email"
            placeholder="Email address"
            value={data.email}
            onChange={(e) => updateData("contact", "email", e.target.value)}
            className="w-full text-sm focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
}

/* ================= SUCCESS MODAL ================= */

function SuccessModal({ onRedirect }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onRedirect();
    }
  }, [countdown, onRedirect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
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
            Your company profile has been successfully created and is now active.
            You can now post jobs and start finding candidates.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-2xl mb-2">🏢</div>
              <p className="text-sm font-medium text-gray-700">Company Profile</p>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 bg-green-50 text-green-700">
                <div className="w-2 h-2 rounded-full bg-current"></div>
                Active
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-2xl mb-2">👤</div>
              <p className="text-sm font-medium text-gray-700">Personal Info</p>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 bg-green-50 text-green-700">
                <div className="w-2 h-2 rounded-full bg-current"></div>
                Complete
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="text-2xl mb-2">🌐</div>
              <p className="text-sm font-medium text-gray-700">Social Links</p>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-1 bg-green-50 text-green-700">
                <div className="w-2 h-2 rounded-full bg-current"></div>
                Connected
              </div>
            </div>
          </div>

          {/* Countdown Message */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Redirecting to dashboard in <span className="font-bold text-blue-600">{countdown}</span> seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${(3 - countdown) * 33.33}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRedirect}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FiHome className="w-4 h-4" />
              Go to Dashboard Now
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

function UploadBox({ title, note, wide, value, preview, onChange, type }) {
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
      
      {preview || value ? (
        <div className="text-green-600">
          {type === "logo" && preview ? (
            <img 
              src={preview} 
              alt="Logo preview" 
              className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
            />
          ) : type === "banner" && preview ? (
            <img 
              src={preview} 
              alt="Banner preview" 
              className="w-full h-32 object-cover rounded-md mx-auto mb-2"
            />
          ) : type === "profile" && preview ? (
            <img 
              src={preview} 
              alt="Profile preview" 
              className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
            />
          ) : (
            <FiCheck className="text-2xl mx-auto" />
          )}
          <p className="mt-2 text-sm">File uploaded</p>
          <p className="text-xs text-gray-400">Click to change</p>
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