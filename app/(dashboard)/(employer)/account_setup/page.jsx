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
  FiImage,
  FiCamera,
  FiAward,
  FiTarget,
  FiHeart,
  FiStar
} from "react-icons/fi";
import { Sparkles, CheckCircle, Shield, ArrowRight, Building, Users, Globe, Share2, Phone, Briefcase } from 'lucide-react';
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";
import { updateProfileCompletion, refreshUserData } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SOCIAL_PLATFORMS = [
  { label: "Facebook", value: "facebook", color: "bg-blue-100 text-blue-600", icon: "📘" },
  { label: "Twitter", value: "twitter", color: "bg-sky-100 text-sky-600", icon: "🐦" },
  { label: "Instagram", value: "instagram", color: "bg-pink-100 text-pink-600", icon: "📷" },
  { label: "Youtube", value: "youtube", color: "bg-red-100 text-red-600", icon: "▶️" },
  { label: "LinkedIn", value: "linkedin", color: "bg-blue-100 text-blue-700", icon: "💼" },
];

const STEPS = [
  { id: "personal", label: "Personal Info", icon: <FiUser />, color: "from-blue-500 to-indigo-500" },
  { id: "company", label: "Company Info", icon: <FiBriefcase />, color: "from-indigo-500 to-purple-500" },
  { id: "founding", label: "Founding Info", icon: <FiGlobe />, color: "from-purple-500 to-pink-500" },
  { id: "social", label: "Social Media", icon: <FiShare2 />, color: "from-pink-500 to-red-500" },
  { id: "contact", label: "Contact", icon: <FiPhone />, color: "from-red-500 to-orange-500" },
];

export default function AccountSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileImageUploaded, setProfileImageUploaded] = useState(false);
  const [stepProgress, setStepProgress] = useState([false, false, false, false, false]);
  
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

  // Update step progress when form data changes
  useEffect(() => {
    const newProgress = [...stepProgress];
    
    // Check personal step
    newProgress[0] = !!(formData.personal.phone && formData.personal.address);
    
    // Check company step
    newProgress[1] = !!(formData.company.name && formData.company.about);
    
    // Check founding step
    newProgress[2] = !!(formData.founding.organizationType && formData.founding.industryType && formData.founding.teamSize && formData.founding.year);
    
    // Check social step (at least one social link)
    newProgress[3] = formData.social.some(link => link.platform && link.url);
    
    // Check contact step
    newProgress[4] = !!(formData.contact.location && formData.contact.phone && formData.contact.email);
    
    setStepProgress(newProgress);
  }, [formData]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const uploadProfileImage = async () => {
    try {
      if (formData.personal.profileImage && formData.personal.profileImage instanceof File) {
        console.log("📤 Uploading personal profile image...");
        
        const personalFormData = new FormData();
        personalFormData.append("profileImage", formData.personal.profileImage);
        
        if (formData.personal.phone) {
          personalFormData.append("phone", formData.personal.phone);
        }
        if (formData.personal.address) {
          personalFormData.append("address", formData.personal.address);
        }

        const result = await authService.updateProfile(personalFormData);
        
        if (result.success) {
          console.log("✅ Personal profile image uploaded successfully");
          setProfileImageUploaded(true);
          
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
              }
            } catch (error) {
              console.error("Error updating localStorage:", error);
            }
          }
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("❌ Error uploading profile image:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted || loading) return;
    
    try {
      setLoading(true);
      setIsSubmitted(true);

      toast.loading('Setting up your profile...', { id: 'setup' });

      if (formData.personal.profileImage && formData.personal.profileImage instanceof File) {
        await uploadProfileImage();
      }

      const formattedData = profileService.formatEmployerData(formData);
      const result = await profileService.createOrUpdateEmployerProfile(formattedData);

      if (result.success) {
        if (result.profile) {
          dispatch(updateProfileCompletion({
            isProfileComplete: true,
            profile: result.profile
          }));
          
          await dispatch(refreshUserData()).unwrap();
        }

        if (typeof window !== "undefined") {
          try {
            const currentUserStr = localStorage.getItem("user");
            if (currentUserStr) {
              const currentUser = JSON.parse(currentUserStr);
              
              let profileImageUrl = currentUser.profileImage;
              
              if (profileImageUploaded) {
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
            }
            
            localStorage.setItem("profileComplete", "true");
          } catch (localStorageError) {
            console.error("Error updating localStorage:", localStorageError);
          }
        }

        toast.success('Profile setup completed successfully!', { id: 'setup' });
        
        setLoading(false);
        setShowSuccessModal(true);
        
        setTimeout(() => {
          router.push("/home");
        }, 3000);

        return result;
      } else {
        throw new Error(result.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("❌ Error submitting profile:", error);
      toast.error(error.message || "Failed to save profile. Please try again.", { id: 'setup' });
      
      setLoading(false);
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Jobpilot
                </div>
              </div>
              <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full animate-pulse">
                Setup
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Setup Progress
              </span>
              <div className="h-2 w-48 rounded-full bg-gray-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out relative"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Completed
              </p>
            </div>
          </div>
        </header>

        {/* Steps Navigation */}
        <div className="relative bg-white/50 backdrop-blur-sm border-b border-gray-200/50 px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <Step
                  key={step.id}
                  icon={step.icon}
                  label={step.label}
                  active={index === currentStep}
                  completed={stepProgress[index]}
                  color={step.color}
                  onClick={() => {
                    if (stepProgress[index] || index <= currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                  isLast={index === STEPS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="animate-fadeInUp">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-6 border-t border-gray-200/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || loading}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                currentStep === 0 || loading
                  ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50"
                  : "text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg transform hover:-translate-x-1"
              }`}
            >
              <FiArrowLeft className="w-4 h-4 group-hover:animate-bounceX" />
              Previous
            </button>

            <button
              onClick={nextStep}
              disabled={loading || !stepProgress[currentStep]}
              className={`group relative flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium overflow-hidden transition-all duration-300 ${
                loading || !stepProgress[currentStep]
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{currentStep === STEPS.length - 1 ? "Saving..." : "Loading..."}</span>
                </>
              ) : (
                <>
                  <span>{currentStep === STEPS.length - 1 ? "Complete Setup" : "Save & Next"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>

          {/* Progress Tips */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3 text-blue-500" />
              Your information is secure and encrypted
              <Shield className="w-3 h-3 text-blue-500" />
            </p>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onRedirect={() => router.push("/home")} />
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-3px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounceX {
          animation: bounceX 1s infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}

/* ================= PERSONAL INFO STEP ================= */

function PersonalInfoStep({ data, updateData }) {
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (field, file) => {
    updateData("personal", field, file);
    
    if (field === "profileImage") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 mb-4 group hover:scale-110 transition-transform duration-300">
          <FiUser className="w-8 h-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">Add your personal details to complete your profile</p>
      </div>

      {/* Profile Image */}
      <div className="group">
        <h3 className="mb-4 text-sm font-medium text-gray-700 flex items-center gap-2">
          <FiCamera className="text-blue-500" />
          Profile Image
        </h3>

        <div className="flex justify-center">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 p-1 transition-transform duration-300 ${isHovering ? 'scale-110' : ''}`}>
              <div className="w-full h-full rounded-full bg-white overflow-hidden">
                {profileImagePreview || data.profileImage ? (
                  <img 
                    src={profileImagePreview || (data.profileImage instanceof File ? URL.createObjectURL(data.profileImage) : data.profileImage)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <FiUser className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Upload button overlay */}
            <label 
              htmlFor="profile-upload"
              className={`absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            >
              <FiUploadCloud className="w-5 h-5 text-white" />
              <input
                id="profile-upload"
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
        <p className="text-xs text-gray-400 text-center mt-2">Click the camera icon to upload (Max 5MB)</p>
      </div>

      {/* Phone Number */}
      <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1">
            <FiPhone className="w-4 h-4 text-blue-500" />
            Phone Number <span className="text-red-500">*</span>
          </span>
        </label>
        <div className="flex group">
          <div className="flex items-center gap-2 border rounded-l-xl px-4 bg-gradient-to-r from-gray-50 to-white text-sm min-w-[100px] group-focus-within:border-blue-400 transition-all duration-300">
            <span className="text-lg">🇺🇸</span>
            <span className="text-gray-600">+1</span>
          </div>
          <input
            type="tel"
            placeholder="Enter your phone number..."
            value={data.phone}
            onChange={(e) => updateData("personal", "phone", e.target.value)}
            className="w-full border border-l-0 rounded-r-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400"
            required
          />
        </div>
      </div>

      {/* Address */}
      <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1">
            <FiMapPin className="w-4 h-4 text-blue-500" />
            Address <span className="text-red-500">*</span>
          </span>
        </label>
        <div className="relative group">
          <textarea
            rows={3}
            placeholder="Enter your full address"
            value={data.address}
            onChange={(e) => updateData("personal", "address", e.target.value)}
            className="w-full rounded-xl border px-4 py-3 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:border-blue-400 resize-none"
            required
          />
          <FiMapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
}

/* ================= COMPANY INFO STEP ================= */

function CompanyInfoStep({ data, updateData }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('logo');

  const handleFileChange = (field, file) => {
    updateData("company", field, file);
    
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
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-4 group hover:scale-110 transition-transform duration-300">
          <Building className="w-8 h-8 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Company Information
        </h2>
        <p className="text-gray-600">Tell us about your company</p>
      </div>

      {/* Logo & Banner Tabs */}
      <div className="bg-gray-50 rounded-xl p-1 inline-flex mb-4">
        <button
          onClick={() => setActiveTab('logo')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'logo' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          Logo
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'banner' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          Banner
        </button>
      </div>

      {/* Upload Area */}
      <div className="animate-fadeIn">
        {activeTab === 'logo' ? (
          <UploadBox
            title="Upload Logo"
            note="A photo larger than 400 pixels work best. Max photo size 5 MB."
            value={data.logo}
            preview={logoPreview}
            onChange={(file) => handleFileChange("logo", file)}
            type="logo"
            icon="🏢"
          />
        ) : (
          <UploadBox
            title="Banner Image"
            note="Banner images optimal dimension 1520x400. Supported format JPEG, PNG. Max photo size 5 MB."
            value={data.banner}
            preview={bannerPreview}
            onChange={(file) => handleFileChange("banner", file)}
            type="banner"
            icon="🖼️"
            wide
          />
        )}
      </div>

      {/* Company Name */}
      <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1">
            <Building className="w-4 h-4 text-indigo-500" />
            Company name <span className="text-red-500">*</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="Enter company name"
          value={data.name}
          onChange={(e) => updateData("company", "name", e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-300 hover:border-indigo-400"
          required
        />
      </div>

      {/* About Us */}
      <div className="animate-slideUp" style={{ animationDelay: '200ms' }}>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1">
            <FiFileText className="w-4 h-4 text-indigo-500" />
            About Us <span className="text-red-500">*</span>
          </span>
        </label>

        <div className="rounded-xl border group focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-300">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b px-4 py-2.5 text-gray-500 bg-gray-50/50">
            <FiBold className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
            <FiItalic className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
            <FiUnderline className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
            <FiLink className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
            <FiList className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
            <FiAlignLeft className="hover:text-indigo-600 cursor-pointer transition-colors duration-300" />
          </div>

          {/* Editor */}
          <textarea
            rows={6}
            placeholder="Write down about your company here. Let the candidate know who we are..."
            value={data.about}
            onChange={(e) => updateData("company", "about", e.target.value)}
            className="w-full resize-none px-4 py-3 text-sm focus:outline-none rounded-b-xl"
            required
          />
        </div>
      </div>
    </div>
  );
}

/* ================= FOUNDING INFO STEP ================= */

function FoundingInfoStep({ data, updateData }) {
  const [activeField, setActiveField] = useState(null);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4 group hover:scale-110 transition-transform duration-300">
          <Globe className="w-8 h-8 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Founding Information
        </h2>
        <p className="text-gray-600">Tell us about your company's background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Type */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.organizationType}
              onChange={(e) => updateData("founding", "organizationType", e.target.value)}
              onFocus={() => setActiveField('org')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none transition-all duration-300 hover:border-purple-400"
              required
            >
              <option value="">Select organization type...</option>
              <option value="Private Limited">Private Limited</option>
              <option value="Public Limited">Public Limited</option>
              <option value="LLC">LLC</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Startup">Startup</option>
              <option value="Government">Government</option>
              <option value="Educational">Educational</option>
            </select>
            <FiChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'org' ? 'text-purple-500 rotate-180' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Industry Types */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Types <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.industryType}
              onChange={(e) => updateData("founding", "industryType", e.target.value)}
              onFocus={() => setActiveField('industry')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none transition-all duration-300 hover:border-purple-400"
              required
            >
              <option value="">Select industry...</option>
              <option value="Technology">💻 Technology</option>
              <option value="Finance">💰 Finance</option>
              <option value="Healthcare">🏥 Healthcare</option>
              <option value="Education">📚 Education</option>
              <option value="Retail">🛍️ Retail</option>
              <option value="Manufacturing">🏭 Manufacturing</option>
              <option value="Real Estate">🏢 Real Estate</option>
              <option value="Hospitality">🍽️ Hospitality</option>
              <option value="Transportation">🚚 Transportation</option>
              <option value="Media">📺 Media</option>
            </select>
            <FiChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'industry' ? 'text-purple-500 rotate-180' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Team Size */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Size <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={data.teamSize}
              onChange={(e) => updateData("founding", "teamSize", e.target.value)}
              onFocus={() => setActiveField('team')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none transition-all duration-300 hover:border-purple-400"
              required
            >
              <option value="">Select team size...</option>
              <option value="1-10">👥 1-10 employees</option>
              <option value="11-50">👥 11-50 employees</option>
              <option value="51-200">👥 51-200 employees</option>
              <option value="201-500">👥 201-500 employees</option>
              <option value="501-1000">👥 501-1000 employees</option>
              <option value="1000+">👥 1000+ employees</option>
            </select>
            <FiChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'team' ? 'text-purple-500 rotate-180' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Year of Establishment */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Establishment <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={data.year}
              onChange={(e) => updateData("founding", "year", e.target.value)}
              onFocus={() => setActiveField('year')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 hover:border-purple-400"
              required
            />
            <FiCalendar className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'year' ? 'text-purple-500' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Company Website */}
        <div className="md:col-span-2 group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Website
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://www.yourcompany.com"
              value={data.website}
              onChange={(e) => updateData("founding", "website", e.target.value)}
              onFocus={() => setActiveField('website')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 hover:border-purple-400"
            />
            <FiLink className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'website' ? 'text-purple-500' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </div>

      {/* Company Vision */}
      <div className="animate-slideUp" style={{ animationDelay: '300ms' }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-1">
            <FiTarget className="w-4 h-4 text-purple-500" />
            Company Vision
          </span>
        </label>
        <textarea
          rows={4}
          placeholder="Tell us about your company vision and future goals..."
          value={data.vision}
          onChange={(e) => updateData("founding", "vision", e.target.value)}
          className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 hover:border-purple-400 resize-none"
        />
        <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Share your dreams and aspirations for the company
        </p>
      </div>
    </div>
  );
}

/* ================= SOCIAL MEDIA STEP ================= */

function SocialMediaStep({ links, updateLink, addLink, removeLink }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-red-100 mb-4 group hover:scale-110 transition-transform duration-300">
          <Share2 className="w-8 h-8 text-pink-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Social Media
        </h2>
        <p className="text-gray-600">Connect your social media profiles</p>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <div 
            key={index}
            className="group animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Link {index + 1}
            </label>

            <div className="flex gap-3 items-center">
              {/* Platform */}
              <div className="relative">
                <select
                  className="w-40 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none appearance-none transition-all duration-300 hover:border-pink-400"
                  value={link.platform}
                  onChange={(e) => updateLink(index, "platform", e.target.value)}
                >
                  <option value="">Select Platform</option>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.icon} {p.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* URL */}
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300 hover:border-pink-400"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                />
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeLink(index)}
                className={`w-12 h-12 flex items-center justify-center border rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300 transform ${
                  hoveredIndex === index ? 'scale-110' : ''
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Platform hint */}
            {link.platform && !link.url && (
              <p className="mt-1 text-xs text-pink-600 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Add your {link.platform} profile URL
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add New */}
      <button
        type="button"
        onClick={addLink}
        className="w-full border-2 border-dashed rounded-xl py-4 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:border-pink-400 hover:text-pink-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
      >
        <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        Add New Social Link
      </button>

      {/* Social Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500" />
          Adding social media profiles helps build trust with potential candidates
        </p>
      </div>
    </div>
  );
}

/* ================= CONTACT STEP ================= */

function ContactStep({ data, updateData }) {
  const [activeField, setActiveField] = useState(null);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 animate-fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-orange-100 mb-4 group hover:scale-110 transition-transform duration-300">
          <Phone className="w-8 h-8 text-red-600 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Contact Information
        </h2>
        <p className="text-gray-600">How can candidates reach you?</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Map Location */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <FiMapPin className="w-4 h-4 text-red-500" />
              Map Location <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your office location"
              value={data.location}
              onChange={(e) => updateData("contact", "location", e.target.value)}
              onFocus={() => setActiveField('location')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 hover:border-red-400"
              required
            />
            <FiMapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              activeField === 'location' ? 'text-red-500 scale-110' : 'text-gray-400'
            }`} />
          </div>
        </div>

        {/* Phone */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <FiPhone className="w-4 h-4 text-red-500" />
              Phone <span className="text-red-500">*</span>
            </span>
          </label>

          <div className="flex">
            <div className="flex items-center gap-2 border rounded-l-xl px-4 bg-gradient-to-r from-gray-50 to-white text-sm min-w-[100px] group-focus-within:border-red-400 transition-all duration-300">
              <span className="text-lg">🇧🇩</span>
              <span className="text-gray-600">+880</span>
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={data.phone}
              onChange={(e) => updateData("contact", "phone", e.target.value)}
              onFocus={() => setActiveField('phone')}
              onBlur={() => setActiveField(null)}
              className="w-full border border-l-0 rounded-r-xl px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 hover:border-red-400"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <FiMail className="w-4 h-4 text-red-500" />
              Email <span className="text-red-500">*</span>
            </span>
          </label>

          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className="text-lg">✉️</span>
            </div>
            <input
              type="email"
              placeholder="contact@yourcompany.com"
              value={data.email}
              onChange={(e) => updateData("contact", "email", e.target.value)}
              onFocus={() => setActiveField('email')}
              onBlur={() => setActiveField(null)}
              className="w-full border rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-300 hover:border-red-400"
              required
            />
          </div>
        </div>
      </div>

      {/* Contact Tips */}
      <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <FiHeart className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Why accurate contact info matters</p>
            <p className="text-xs text-gray-600">
              Candidates will use this information to reach out for opportunities and interviews. 
              Make sure it's always up to date!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SUCCESS MODAL ================= */

function SuccessModal({ onRedirect }) {
  const [countdown, setCountdown] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRedirect();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 opacity-50"></div>
        
        {/* Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Modal Content */}
        <div className="relative p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 animate-bounceIn">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
            🎉 Congratulations!
            <Sparkles className="w-6 h-6 text-yellow-500 animate-spin-slow" />
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 mb-2 text-lg">
            Your company profile setup is 100% complete
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Your company profile has been successfully created and is now active.
            You can now post jobs and start finding amazing candidates.
          </p>

          {/* Stats Cards with Animation */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: "🏢", title: "Company Profile", status: "Active", color: "green" },
              { icon: "👤", title: "Personal Info", status: "Complete", color: "blue" },
              { icon: "🌐", title: "Social Links", status: "Connected", color: "purple" }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-2 animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                  {item.icon}
                </div>
                <p className="text-xs font-medium text-gray-700 mb-1">{item.title}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-${item.color}-50 text-${item.color}-700`}>
                  <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 animate-pulse`}></div>
                  {item.status}
                </div>
              </div>
            ))}
          </div>

          {/* Countdown Message */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
              <span>Redirecting to dashboard in</span>
              <span className="relative">
                <span className="absolute inset-0 animate-ping bg-blue-400 rounded-full opacity-25"></span>
                <span className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full">
                  {countdown}
                </span>
              </span>
              <span>seconds...</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 relative"
                style={{ width: `${(3 - countdown) * 33.33}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleClose}
              className="group relative flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <FiHome className="w-4 h-4" />
              Go to Dashboard Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <FiHeart className="w-3 h-3 text-red-400" />
              Need help? 
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-300">
                Contact Support
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-300">
                View Setup Guide
              </a>
              <FiHeart className="w-3 h-3 text-red-400" />
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-confetti {
          animation: confetti 3s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Step({ icon, label, active, completed, color, onClick, isLast }) {
  return (
    <button
      onClick={onClick}
      disabled={!completed && !active}
      className={`relative flex items-center gap-2 transition-all duration-300 group ${
        active
          ? "text-blue-600 font-medium scale-105"
          : completed
          ? "text-green-600 cursor-pointer hover:text-green-700"
          : "text-gray-400 cursor-not-allowed"
      }`}
    >
      <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
        active
          ? "bg-gradient-to-r " + color + " text-white shadow-lg"
          : completed
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-400"
      }`}>
        {completed ? <FiCheck className="w-4 h-4" /> : icon}
        
        {/* Pulse effect for active step */}
        {active && (
          <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20"></div>
        )}
      </div>
      <span className={`text-sm hidden md:inline transition-all duration-300 ${
        active ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-400'
      }`}>
        {label}
      </span>
      
      {/* Connector line */}
      {!isLast && (
        <div className={`hidden md:block absolute -right-8 top-1/2 w-8 h-0.5 transition-all duration-300 ${
          completed ? 'bg-green-600' : 'bg-gray-300'
        }`} />
      )}
    </button>
  );
}

function UploadBox({ title, note, wide, value, preview, onChange, type, icon }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-all duration-300 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      } ${wide ? "md:col-span-2" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
        <div className="text-green-600 animate-scaleIn">
          {type === "logo" && preview ? (
            <div className="relative group">
              <img 
                src={preview} 
                alt="Logo preview" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 rounded-full p-2">
                  <FiCamera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ) : type === "banner" && preview ? (
            <div className="relative group">
              <img 
                src={preview} 
                alt="Banner preview" 
                className="w-full h-40 object-cover rounded-lg mx-auto mb-3 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 rounded-full p-2">
                  <FiCamera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ) : type === "profile" && preview ? (
            <div className="relative group">
              <img 
                src={preview} 
                alt="Profile preview" 
                className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 rounded-full p-2">
                  <FiCamera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <FiCheck className="text-4xl text-green-500 mx-auto mb-2 animate-bounceIn" />
          )}
          <p className="mt-2 text-sm font-medium text-gray-700">File uploaded successfully!</p>
          <p className="text-xs text-gray-400">Click or drag to change</p>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {icon || <FiUploadCloud className="mx-auto text-gray-400" />}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-700">Browse photo</span> or drop here
          </p>
          <p className="mt-1 text-xs text-gray-400">{note}</p>
        </>
      )}
      
      {/* Upload progress indicator (simulated) */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-xl backdrop-blur-sm">
          <p className="text-sm font-medium text-blue-600 animate-pulse">Drop to upload</p>
        </div>
      )}
    </div>
  );
}