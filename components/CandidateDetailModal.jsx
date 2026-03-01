"use client";

import { useState, useEffect } from "react";
import { 
  X, MapPin, Briefcase, GraduationCap, 
  Calendar, Award, Mail, Phone, Globe,
  Bookmark, BookmarkCheck, Loader2,
  Send, Download, ExternalLink, FileText,
  Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, User, Filter, Building2,
  Sparkles, Target, TrendingUp, Heart,
  Star, Shield, BadgeCheck, Zap
} from "lucide-react";
import { candidateService } from "@/services/candidateService";
import { profileService } from "@/services/profileService";
import toast from "react-hot-toast";

export default function CandidateDetailModal({ isOpen, onClose, candidateId, candidate }) {
  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState(candidate || null);
  const [applications, setApplications] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('animate-scaleIn');
  const [screenSize, setScreenSize] = useState('desktop');

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

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateDetails();
      setModalAnimation('animate-scaleIn');
    }
  }, [isOpen, candidateId]);

  const fetchCandidateDetails = async () => {
    setLoading(true);
    try {
      const response = await candidateService.getCandidateById(candidateId);
      console.log("Candidate API Response:", response);
      
      setCandidateData(response.candidate);
      
      // Handle applications
      let apps = [];
      if (response.applications && Array.isArray(response.applications)) {
        apps = response.applications;
      } else if (response.candidate?.applications && Array.isArray(response.candidate.applications)) {
        apps = response.candidate.applications;
      } else if (response.candidate?.jobApplications && Array.isArray(response.candidate.jobApplications)) {
        apps = response.candidate.jobApplications;
      }
      
      console.log("Applications found:", apps);
      setApplications(apps);
      
      setIsSaved(response.candidate.stats?.isSaved || false);
      
      if (apps.length === 0) {
        fetchCandidateApplications();
      }
    } catch (error) {
      console.error("Failed to fetch candidate details:", error);
      toast.error(error.message || "Failed to load candidate details");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateApplications = async () => {
    if (!candidateId) return;
    
    setApplicationsLoading(true);
    try {
      let apps = [];
      
      try {
        const response = await candidateService.getCandidateApplications?.(candidateId);
        if (response?.applications) {
          apps = response.applications;
        }
      } catch (e) {
        console.log("No direct applications endpoint");
      }
      
      if (apps.length === 0) {
        try {
          const profile = await profileService.getPublicProfile(candidateId);
          if (profile?.applications) {
            apps = profile.applications;
          }
        } catch (e) {
          console.log("No applications in profile");
        }
      }
      
      // Mock applications for testing - REMOVE IN PRODUCTION
      if (apps.length === 0 && process.env.NODE_ENV === 'development') {
        console.log("Using mock applications for testing");
        apps = getMockApplications();
      }
      
      console.log("Fetched applications:", apps);
      setApplications(apps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Mock applications for testing - REMOVE IN PRODUCTION
  const getMockApplications = () => {
    return [
      {
        _id: "app1",
        status: "interview",
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        coverLetter: "<p>I am very excited about this opportunity and believe my skills align perfectly with your requirements.</p>",
        job: {
          _id: "job1",
          jobTitle: "Senior Frontend Developer",
          jobType: "Full Time",
          location: {
            city: "San Francisco",
            country: "USA",
            isRemote: true
          },
          employer: {
            companyName: "Tech Corp Inc.",
            logo: null
          }
        },
        statusHistory: [
          {
            status: "pending",
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            note: "Application submitted"
          },
          {
            status: "reviewed",
            updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
            note: "Under review"
          },
          {
            status: "interview",
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            note: "Selected for interview"
          }
        ]
      },
      {
        _id: "app2",
        status: "pending",
        appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        coverLetter: "<p>I have 5 years of experience in React and Node.js and would love to join your team.</p>",
        job: {
          _id: "job2",
          jobTitle: "React Developer",
          jobType: "Full Time",
          location: {
            city: "New York",
            country: "USA",
            isRemote: false
          },
          employer: {
            companyName: "Startup Labs",
            logo: null
          }
        },
        statusHistory: [
          {
            status: "pending",
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            note: "Application submitted"
          }
        ]
      }
    ];
  };

  const handleSaveCandidate = async () => {
    if (!candidateData?.user?._id) return;
    
    setSaving(true);
    try {
      if (isSaved) {
        await candidateService.unsaveCandidate(candidateData.user._id);
        setIsSaved(false);
        toast.success("Candidate removed from saved list");
      } else {
        await candidateService.saveCandidate(candidateData.user._id);
        setIsSaved(true);
        toast.success("Candidate saved successfully");
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
      toast.error("Failed to save candidate");
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = () => {
    const email = candidateData?.accountSettings?.contact?.email || candidateData?.user?.email;
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      toast.error("Email address not available");
    }
  };

  const handleDownloadCV = async () => {
    const cvUrl = candidateData?.personalInfo?.cvUrl || 
                  candidateData?.resume?.url || 
                  candidateData?.cvUrl;
    
    if (cvUrl) {
      try {
        setDownloading(true);
        window.open(cvUrl, '_blank');
        toast.success("Opening resume...");
      } catch (error) {
        console.error("Failed to open resume:", error);
        toast.error("Failed to open resume");
      } finally {
        setDownloading(false);
      }
    } else {
      if (candidateData?.user?._id) {
        setDownloading(true);
        try {
          const profile = await profileService.getPublicProfile(candidateData.user._id);
          
          if (profile?.personalInfo?.cvUrl) {
            window.open(profile.personalInfo.cvUrl, '_blank');
            toast.success("Opening resume...");
          } else {
            toast.error("Resume not available for this candidate");
          }
        } catch (error) {
          console.error("Failed to download resume:", error);
          toast.error("Failed to download resume");
        } finally {
          setDownloading(false);
        }
      } else {
        toast.error("Resume not available");
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDOB = (dob) => {
    if (!dob) return null;
    try {
      const date = new Date(dob);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
      'reviewed': { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: 'Reviewed' },
      'shortlisted': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Shortlisted' },
      'interview': { bg: 'bg-purple-100', text: 'text-purple-700', icon: User, label: 'Interview' },
      'hired': { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Award, label: 'Hired' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' },
    };
    return statusMap[status?.toLowerCase()] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      icon: AlertCircle, 
      label: status || 'Unknown' 
    };
  };

  const getExperienceLevel = (experience) => {
    if (!experience) return "Not specified";
    
    const expMap = {
      "0-1 years": "Entry Level",
      "1-3 years": "Junior",
      "3-5 years": "Mid-Level",
      "5-10 years": "Senior",
      "10+ years": "Expert"
    };
    
    return expMap[experience] || experience;
  };

  const getExperienceIcon = (experience) => {
    if (!experience) return Briefcase;
    
    if (experience.includes("0-1")) return Sparkles;
    if (experience.includes("1-3")) return TrendingUp;
    if (experience.includes("3-5")) return Target;
    if (experience.includes("5-10")) return Award;
    if (experience.includes("10+")) return TrendingUp;
    
    return Briefcase;
  };

  const getCompanyInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl ${modalAnimation}`}>
        {/* Decorative elements - hidden on mobile */}
        {screenSize !== 'mobile' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1 sm:p-1.5 md:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90 z-20 group"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
            <div className="relative">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-blue-100 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 animate-pulse">
              {screenSize === 'mobile' ? 'Loading...' : 'Loading candidate profile...'}
            </p>
          </div>
        ) : candidateData ? (
          <>
            {/* Header with Gradient */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {/* Profile Image */}
                <div className="group relative">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-lg sm:rounded-xl border-3 sm:border-4 border-white bg-white shadow-xl overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                    {candidateData.personalInfo?.profileImage ? (
                      <img
                        src={candidateData.personalInfo.profileImage}
                        alt={candidateData.personalInfo?.fullName || candidateData.user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                        {getInitials(
                          candidateData.personalInfo?.fullName || candidateData.user?.name
                        )}
                      </div>
                    )}
                  </div>
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500"></div>
                  
                  {/* Verified Badge */}
                  {candidateData.completionPercentage >= 80 && (
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 fill-white animate-pulse" />
                        <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-ping"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Name & Title */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold animate-slideInLeft">
                      {candidateData.personalInfo?.fullName || candidateData.user?.name}
                    </h1>
                    {candidateData.completionPercentage >= 80 && (
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-white/90 mb-1 sm:mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
                    {candidateData.personalInfo?.title || "Professional"}
                    {candidateData.personalInfo?.title && (
                      <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                    )}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 text-[8px] sm:text-[10px] md:text-xs text-white/80">
                    {candidateData.accountSettings?.contact?.location && (
                      <span className="flex items-center gap-0.5 sm:gap-1 hover:text-white transition-colors duration-300 group">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[150px]">
                          {candidateData.accountSettings.contact.location}
                        </span>
                      </span>
                    )}
                    
                    {candidateData.profileDetails?.dateOfBirth && screenSize !== 'mobile' && (
                      <span className="flex items-center gap-0.5 sm:gap-1 hover:text-white transition-colors duration-300 group">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                        {formatDOB(candidateData.profileDetails.dateOfBirth)}
                      </span>
                    )}
                    
                    <span className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium transition-all duration-300 hover:scale-105 ${
                      candidateData.completionPercentage >= 80
                        ? 'bg-green-500 text-white'
                        : candidateData.completionPercentage >= 50
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                      {screenSize === 'mobile' ? `${candidateData.completionPercentage}%` : `${candidateData.completionPercentage}% Complete`}
                    </span>

                    {/* Total Applications Badge */}
                    {applications.length > 0 && (
                      <span className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 md:px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300">
                        <Briefcase className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        <span className="hidden xs:inline">{applications.length}</span>
                        <span className="xs:hidden">{applications.length}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 md:mt-0 self-end">
                  <button
                    onClick={handleSaveCandidate}
                    disabled={saving}
                    className={`group relative flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] md:text-xs transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                      isSaved
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {saving ? (
                      <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 animate-spin" />
                    ) : isSaved ? (
                      <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 fill-current animate-bounceIn" />
                    ) : (
                      <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                    )}
                    <span className="hidden xs:inline">{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                  
                  <button
                    onClick={handleSendEmail}
                    className="group relative bg-white text-blue-600 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] md:text-xs hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg overflow-hidden flex items-center gap-0.5 sm:gap-1 md:gap-1.5"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="hidden xs:inline">Contact</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b px-4 sm:px-5 md:px-6 lg:px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10 overflow-x-auto">
              <div className="flex gap-1 sm:gap-2 min-w-max">
                {[
                  { id: 'profile', label: screenSize === 'mobile' ? 'Profile' : 'Profile', icon: User },
                  { id: 'experience', label: screenSize === 'mobile' ? 'Exp' : 'Experience', icon: Briefcase },
                  { 
                    id: 'applications', 
                    label: screenSize === 'mobile' 
                      ? `Apps${applications.length > 0 ? ` (${applications.length})` : ''}` 
                      : `Applications ${applications.length > 0 ? `(${applications.length})` : ''}`, 
                    icon: FileText 
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-2 sm:py-2.5 md:py-3 px-2 sm:px-2.5 md:px-3 text-[8px] sm:text-[10px] md:text-xs font-medium capitalize transition-all duration-300 flex items-center gap-0.5 sm:gap-1 md:gap-1.5 group whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                      activeTab === tab.id ? 'text-blue-600' : ''
                    }`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-slideIn"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {/* Left Column - Bio & Details - Full width on mobile */}
                  <div className="sm:col-span-2 space-y-3 sm:space-y-4">
                    {/* Biography */}
                    {candidateData.profileDetails?.biography && (
                      <div className="group bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          About
                        </h3>
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 leading-relaxed whitespace-pre-line group-hover:text-gray-700 transition-colors duration-300">
                          {candidateData.profileDetails.biography}
                        </p>
                      </div>
                    )}

                    {/* Skills & Tags */}
                    {candidateData.personalInfo?.skills && candidateData.personalInfo.skills.length > 0 && (
                      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {candidateData.personalInfo.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 rounded-lg text-[8px] sm:text-[10px] hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-105 cursor-default"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {candidateData.personalInfo?.education && (
                      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all duration-300">
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                          <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          Education
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-2 sm:p-3 rounded-lg">
                          <div className="flex items-start gap-1 sm:gap-2">
                            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-800 text-[8px] sm:text-[10px] md:text-xs">
                                {candidateData.personalInfo.education}
                              </p>
                              {candidateData.personalInfo?.institution && (
                                <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-600 mt-0.5">
                                  <span className="font-medium">Institution:</span> {candidateData.personalInfo.institution}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Personal Info & Contact */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        Personal Info
                      </h3>
                      
                      <div className="space-y-1 sm:space-y-1.5">
                        {candidateData.profileDetails?.nationality && (
                          <div className="flex justify-between items-center py-1 border-b border-gray-200/50">
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500">Nationality</span>
                            <span className="font-medium text-gray-800 text-[7px] sm:text-[8px] md:text-[10px]">{candidateData.profileDetails.nationality}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.dateOfBirth && (
                          <div className="flex justify-between items-center py-1 border-b border-gray-200/50">
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500">DOB</span>
                            <span className="font-medium text-gray-800 text-[7px] sm:text-[8px] md:text-[10px]">{formatDOB(candidateData.profileDetails.dateOfBirth)}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.gender && (
                          <div className="flex justify-between items-center py-1 border-b border-gray-200/50">
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500">Gender</span>
                            <span className="font-medium text-gray-800 text-[7px] sm:text-[8px] md:text-[10px]">{candidateData.profileDetails.gender}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.maritalStatus && screenSize !== 'mobile' && (
                          <div className="flex justify-between items-center py-1">
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500">Marital Status</span>
                            <span className="font-medium text-gray-800 text-[7px] sm:text-[8px] md:text-[10px]">{candidateData.profileDetails.maritalStatus}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        Contact
                      </h3>
                      
                      <div className="space-y-1 sm:space-y-1.5">
                        {candidateData.accountSettings?.contact?.email && (
                          <div className="flex items-center gap-1 sm:gap-2 p-1 hover:bg-white rounded-lg transition-all duration-300 group">
                            <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                            <a 
                              href={`mailto:${candidateData.accountSettings.contact.email}`}
                              className="text-[7px] sm:text-[8px] md:text-[10px] text-blue-600 hover:underline flex-1 truncate"
                            >
                              {screenSize === 'mobile' 
                                ? candidateData.accountSettings.contact.email.slice(0, 15) + '...' 
                                : candidateData.accountSettings.contact.email}
                            </a>
                          </div>
                        )}
                        
                        {candidateData.accountSettings?.contact?.phone && (
                          <div className="flex items-center gap-1 sm:gap-2 p-1 hover:bg-white rounded-lg transition-all duration-300 group">
                            <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                            <a 
                              href={`tel:${candidateData.accountSettings.contact.phone}`}
                              className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-700 hover:text-blue-600 flex-1"
                            >
                              {candidateData.accountSettings.contact.phone}
                            </a>
                          </div>
                        )}
                        
                        {candidateData.personalInfo?.website && screenSize !== 'mobile' && (
                          <div className="flex items-center gap-1 sm:gap-2 p-1 hover:bg-white rounded-lg transition-all duration-300 group">
                            <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                            <a 
                              href={candidateData.personalInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[7px] sm:text-[8px] md:text-[10px] text-blue-600 hover:underline flex-1 truncate"
                            >
                              {candidateData.personalInfo.website.replace(/^https?:\/\//, '').slice(0, 15)}...
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CV Download Button */}
                    {(candidateData.personalInfo?.cvUrl || candidateData.resume?.url || candidateData.cvUrl) && (
                      <button
                        onClick={handleDownloadCV}
                        disabled={downloading}
                        className="group relative w-full flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] md:text-xs hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl overflow-hidden font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {downloading ? (
                          <>
                            <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                            <span className="hidden xs:inline">Opening...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="hidden xs:inline">Download CV</span>
                            <span className="xs:hidden">CV</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Resume Info */}
                    {candidateData.resume && screenSize !== 'mobile' && (
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 sm:p-3 border border-gray-200">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-1 bg-white rounded-lg">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-gray-800">
                              {candidateData.resume.originalName || "Resume"}
                            </p>
                            {candidateData.resume.size && (
                              <p className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-500">
                                {(candidateData.resume.size / 1024).toFixed(0)} KB
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXPERIENCE TAB */}
              {activeTab === 'experience' && (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Experience Summary Card */}
                  <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        {candidateData.personalInfo?.experience ? (
                          (() => {
                            const ExpIcon = getExperienceIcon(candidateData.personalInfo.experience);
                            return <ExpIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />;
                          })()
                        ) : (
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] sm:text-[10px] text-white/80 font-medium mb-0.5 flex items-center gap-0.5 sm:gap-1">
                          <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                          Experience Level
                        </p>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-0.5">
                          {candidateData.personalInfo?.experience || "Not specified"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <span className="px-1.5 sm:px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-[8px] sm:text-[10px] font-medium">
                            {getExperienceLevel(candidateData.personalInfo?.experience)}
                          </span>
                          {candidateData.personalInfo?.experience && screenSize !== 'mobile' && (
                            <span className="text-[8px] sm:text-[10px] text-white/80">
                              Total experience
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education Card */}
                  {candidateData.personalInfo?.education && (
                    <div className="group bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg sm:rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[8px] sm:text-[10px] text-purple-600 font-medium mb-0.5">Education</p>
                          <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-0.5 group-hover:text-purple-600 transition-colors duration-300">
                            {candidateData.personalInfo.education}
                          </h4>
                          {candidateData.personalInfo?.institution && (
                            <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-700">
                              <span className="font-medium">Institution:</span> {candidateData.personalInfo.institution}
                            </p>
                          )}
                          {candidateData.personalInfo?.fieldOfStudy && screenSize !== 'mobile' && (
                            <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-700 mt-0.5">
                              <span className="font-medium">Field:</span> {candidateData.personalInfo.fieldOfStudy}
                            </p>
                          )}
                          {candidateData.personalInfo?.graduationYear && screenSize !== 'mobile' && (
                            <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-700 mt-0.5">
                              <span className="font-medium">Year:</span> {candidateData.personalInfo.graduationYear}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If no experience or education */}
                  {!candidateData.personalInfo?.experience && !candidateData.personalInfo?.education && (
                    <div className="text-center py-8 sm:py-10 md:py-12 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200">
                      <div className="relative inline-block">
                        <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-100 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mt-2 sm:mt-3 mb-0.5 sm:mb-1">No information available</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500 max-w-md mx-auto">
                        Candidate hasn't added experience or education details yet
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Header with Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4">
                    <div>
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 flex items-center gap-1 sm:gap-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        Job Applications
                      </h3>
                      <p className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5">
                        {applicationsLoading 
                          ? "Loading..." 
                          : applications.length > 0 
                            ? `${applications.length} application${applications.length > 1 ? 's' : ''}`
                            : "No applications yet"
                        }
                      </p>
                    </div>
                    
                    {/* Stats Summary */}
                    {applications.length > 0 && !applicationsLoading && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <p className="text-[6px] sm:text-[7px] md:text-[8px] text-blue-600">Total</p>
                          <p className="text-xs sm:text-sm md:text-base font-bold text-blue-700">{applications.length}</p>
                        </div>
                        <div className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                          <p className="text-[6px] sm:text-[7px] md:text-[8px] text-green-600">Active</p>
                          <p className="text-xs sm:text-sm md:text-base font-bold text-green-700">
                            {applications.filter(app => 
                              !['rejected', 'hired'].includes(app.status?.toLowerCase?.() || '')
                            ).length}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Applications List */}
                  {applicationsLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="relative">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-100 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-600 animate-pulse">Loading...</p>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {applications.map((application, index) => {
                        const statusBadge = getStatusBadge(application.status);
                        const StatusIcon = statusBadge.icon;
                        const companyName = application.job?.employer?.companyName || 'Company';
                        const jobTitle = application.job?.jobTitle || 'Job Position';
                        const location = application.job?.location;
                        
                        return (
                          <div 
                            key={application._id} 
                            className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedApplication(
                              selectedApplication?._id === application._id ? null : application
                            )}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                              <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>

                            {/* Main Application Row */}
                            <div className="p-2 sm:p-3 md:p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-start gap-2 sm:gap-3">
                                    {/* Company Logo Placeholder */}
                                    <div className="relative">
                                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        {getCompanyInitials(companyName)}
                                      </div>
                                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5">
                                        <h4 className="font-semibold text-gray-900 text-[8px] sm:text-[10px] md:text-xs group-hover:text-blue-600 transition-colors duration-300 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                                          {jobTitle}
                                        </h4>
                                        <span className={`inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-[6px] sm:text-[7px] md:text-[8px] font-medium ${statusBadge.bg} ${statusBadge.text} transition-all duration-300 group-hover:scale-105`}>
                                          <StatusIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                          {screenSize === 'mobile' ? statusBadge.label.slice(0, 3) : statusBadge.label}
                                        </span>
                                      </div>
                                      
                                      <p className="text-gray-700 text-[7px] sm:text-[8px] md:text-[10px] font-medium mb-0.5 flex items-center gap-1">
                                        <Building2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-400" />
                                        <span className="truncate max-w-[100px] sm:max-w-[150px]">{companyName}</span>
                                      </p>
                                      
                                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[6px] sm:text-[7px] md:text-[8px] text-gray-600">
                                        {location && (
                                          <span className="flex items-center gap-0.5 sm:gap-1 group-hover:text-blue-600 transition-colors duration-300">
                                            <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                            {screenSize === 'mobile' ? location.city?.slice(0, 3) || 'Loc' : location.city}
                                            {location.isRemote && screenSize !== 'mobile' && ' (Remote)'}
                                          </span>
                                        )}
                                        <span className="flex items-center gap-0.5 sm:gap-1 group-hover:text-blue-600 transition-colors duration-300">
                                          <Briefcase className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                          {screenSize === 'mobile' ? application.job?.jobType?.slice(0, 3) || 'FT' : application.job?.jobType || 'Full Time'}
                                        </span>
                                        <span className="flex items-center gap-0.5 sm:gap-1 group-hover:text-blue-600 transition-colors duration-300">
                                          <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                          {formatDate(application.appliedAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* View Details Arrow */}
                                <button className="p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 group-hover:scale-110">
                                  <ChevronRight className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 transition-all duration-300 ${
                                    selectedApplication?._id === application._id ? 'rotate-90 text-blue-600' : ''
                                  }`} />
                                </button>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {selectedApplication?._id === application._id && (
                              <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 animate-slideDown">
                                <div className="pt-2 sm:pt-3 border-t border-gray-200">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                                    {/* Application Details */}
                                    <div className="md:col-span-2 space-y-2 sm:space-y-3">
                                      {/* Cover Letter */}
                                      {application.coverLetter && (
                                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 sm:p-3">
                                          <h5 className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-gray-700 mb-1 flex items-center gap-0.5 sm:gap-1">
                                            <FileText className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
                                            Cover Letter
                                          </h5>
                                          <div 
                                            className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-600 prose prose-xs max-w-none"
                                            dangerouslySetInnerHTML={{ 
                                              __html: application.coverLetter || "<p>No cover letter provided.</p>" 
                                            }}
                                          />
                                        </div>
                                      )}

                                      {/* Timeline */}
                                      {application.statusHistory?.length > 0 && (
                                        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 sm:p-3">
                                          <h5 className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-gray-700 mb-1 flex items-center gap-0.5 sm:gap-1">
                                            <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
                                            Timeline
                                          </h5>
                                          <div className="space-y-1 sm:space-y-1.5">
                                            {application.statusHistory.map((history, idx) => {
                                              const historyStatus = getStatusBadge(history.status);
                                              const HistoryIcon = historyStatus.icon;
                                              return (
                                                <div key={idx} className="flex items-start gap-1 sm:gap-2 group/item">
                                                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover/item:scale-110 transition-transform duration-300">
                                                    <HistoryIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-600" />
                                                  </div>
                                                  <div>
                                                    <p className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-800">
                                                      <span className="font-medium text-blue-600">{historyStatus.label}</span>
                                                    </p>
                                                    <p className="text-[5px] sm:text-[6px] md:text-[7px] text-gray-500">
                                                      {formatDate(history.updatedAt)}
                                                      {history.note && screenSize !== 'mobile' && ` • ${history.note.slice(0, 30)}${history.note.length > 30 ? '...' : ''}`}
                                                    </p>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Sidebar - Application Meta */}
                                    <div className="space-y-2 sm:space-y-3">
                                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 sm:p-3">
                                        <h5 className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-gray-700 mb-1 flex items-center gap-0.5 sm:gap-1">
                                          <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
                                          Info
                                        </h5>
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center py-0.5 border-b border-gray-200/50">
                                            <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-500">App ID</span>
                                            <span className="text-[6px] sm:text-[7px] md:text-[8px] font-mono text-gray-700 bg-white px-1 py-0.5 rounded">{application._id.slice(-4)}</span>
                                          </div>
                                          <div className="flex justify-between items-center py-0.5 border-b border-gray-200/50">
                                            <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-500">Applied</span>
                                            <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-700 font-medium">{formatDate(application.appliedAt)}</span>
                                          </div>
                                          {application.updatedAt && (
                                            <div className="flex justify-between items-center py-0.5">
                                              <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-500">Updated</span>
                                              <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-700 font-medium">{formatDate(application.updatedAt)}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Quick Actions */}
                                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg p-2 sm:p-3">
                                        <h5 className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-gray-700 mb-1 flex items-center gap-0.5 sm:gap-1">
                                          <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />
                                          Actions
                                        </h5>
                                        <div className="space-y-1">
                                          {application.job?._id && (
                                            <>
                                              <a
                                                href={`/employer/jobs/${application.job._id}/applications`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between w-full px-1.5 sm:px-2 py-1 text-[6px] sm:text-[7px] md:text-[8px] text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group/action"
                                              >
                                                <span>All apps</span>
                                                <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform duration-300" />
                                              </a>
                                              <a
                                                href={`/jobs/${application.job._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between w-full px-1.5 sm:px-2 py-1 text-[6px] sm:text-[7px] md:text-[8px] text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300 group/action"
                                              >
                                                <span>Job details</span>
                                                <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform duration-300" />
                                              </a>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-10 md:py-12 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="relative inline-block">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mt-2 sm:mt-3 mb-0.5 sm:mb-1">No applications yet</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500 max-w-md mx-auto">
                        Candidate hasn't applied to any jobs yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-14 md:py-16">
            <div className="relative inline-block">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <User className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-100 rounded-full animate-pulse"></div>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mb-1">Candidate not found</p>
            <p className="text-[8px] sm:text-[10px] text-gray-500 max-w-md mx-auto">
              The candidate you're looking for doesn't exist or has been removed
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}