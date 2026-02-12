"use client";

import { useState, useEffect } from "react";
import { 
  X, MapPin, Briefcase, GraduationCap, 
  Calendar, Award, Mail, Phone, Globe,
  Bookmark, BookmarkCheck, Loader2,
  Send, Download, ExternalLink, FileText,
  Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, User, Filter, Building2,
  Sparkles, Target, TrendingUp
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

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateDetails();
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
      if (diffDays < 7) return `${diffDays} days ago`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading candidate profile...</p>
          </div>
        ) : candidateData ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10">
              <div className="flex items-end gap-6">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
                  {candidateData.personalInfo?.profileImage ? (
                    <img
                      src={candidateData.personalInfo.profileImage}
                      alt={candidateData.personalInfo?.fullName || candidateData.user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {getInitials(
                        candidateData.personalInfo?.fullName || candidateData.user?.name
                      )}
                    </div>
                  )}
                </div>

                {/* Name & Title */}
                <div className="flex-1 text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    {candidateData.personalInfo?.fullName || candidateData.user?.name}
                  </h1>
                  <p className="text-xl text-white/90 mb-3">
                    {candidateData.personalInfo?.title || "Professional"}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    {candidateData.accountSettings?.contact?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {candidateData.accountSettings.contact.location}
                      </span>
                    )}
                    
                    {candidateData.profileDetails?.dateOfBirth && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDOB(candidateData.profileDetails.dateOfBirth)}
                      </span>
                    )}
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      candidateData.completionPercentage >= 80
                        ? 'bg-green-500 text-white'
                        : candidateData.completionPercentage >= 50
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {candidateData.completionPercentage}% Profile Complete
                    </span>

                    {/* Total Applications Badge */}
                    {applications.length > 0 && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <Briefcase className="w-4 h-4" />
                        {applications.length} {applications.length === 1 ? 'Application' : 'Applications'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveCandidate}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isSaved
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                    }`}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSaved ? (
                      <BookmarkCheck className="w-4 h-4" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  
                  <button
                    onClick={handleSendEmail}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b px-8">
              <div className="flex gap-6">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'experience', label: 'Experience & Education', icon: Briefcase },
                  { 
                    id: 'applications', 
                    label: `Applications ${applications.length > 0 ? `(${applications.length})` : ''}`, 
                    icon: FileText 
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 text-sm font-medium capitalize border-b-2 transition flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-3 gap-8">
                  {/* Left Column - Bio & Details */}
                  <div className="col-span-2 space-y-6">
                    {/* Biography */}
                    {candidateData.profileDetails?.biography && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {candidateData.profileDetails.biography}
                        </p>
                      </div>
                    )}

                    {/* Skills & Tags */}
                    {candidateData.personalInfo?.skills && candidateData.personalInfo.skills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {candidateData.personalInfo.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {candidateData.personalInfo?.education && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Education</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <GraduationCap className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-800">
                                {candidateData.personalInfo.education}
                              </p>
                              {candidateData.personalInfo?.institution && (
                                <p className="text-sm text-gray-600">
                                  {candidateData.personalInfo.institution}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Personal Info & Contact */}
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
                      
                      <div className="space-y-3">
                        {candidateData.profileDetails?.nationality && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nationality</span>
                            <span className="font-medium">{candidateData.profileDetails.nationality}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.dateOfBirth && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date of Birth</span>
                            <span className="font-medium">{formatDOB(candidateData.profileDetails.dateOfBirth)}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.gender && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Gender</span>
                            <span className="font-medium">{candidateData.profileDetails.gender}</span>
                          </div>
                        )}
                        
                        {candidateData.profileDetails?.maritalStatus && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Marital Status</span>
                            <span className="font-medium">{candidateData.profileDetails.maritalStatus}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
                      
                      <div className="space-y-3">
                        {candidateData.accountSettings?.contact?.email && (
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`mailto:${candidateData.accountSettings.contact.email}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {candidateData.accountSettings.contact.email}
                            </a>
                          </div>
                        )}
                        
                        {candidateData.accountSettings?.contact?.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`tel:${candidateData.accountSettings.contact.phone}`}
                              className="text-sm text-gray-700 hover:text-blue-600"
                            >
                              {candidateData.accountSettings.contact.phone}
                            </a>
                          </div>
                        )}
                        
                        {candidateData.personalInfo?.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <a 
                              href={candidateData.personalInfo.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {candidateData.personalInfo.website.replace(/^https?:\/\//, '')}
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
                        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Opening Resume...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download CV / Resume
                          </>
                        )}
                      </button>
                    )}

                    {/* Resume Info */}
                    {candidateData.resume && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {candidateData.resume.originalName || "Resume"}
                            </p>
                            {candidateData.resume.size && (
                              <p className="text-xs text-gray-500">
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

              {/* EXPERIENCE & EDUCATION TAB */}
              {activeTab === 'experience' && (
                <div className="space-y-8">
                  {/* Experience Summary Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {candidateData.personalInfo?.experience ? (
                          (() => {
                            const ExpIcon = getExperienceIcon(candidateData.personalInfo.experience);
                            return <ExpIcon className="w-6 h-6 text-blue-600" />;
                          })()
                        ) : (
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-blue-600 font-medium mb-1">Experience Level</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {candidateData.personalInfo?.experience || "Not specified"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {getExperienceLevel(candidateData.personalInfo?.experience)}
                          </span>
                          {candidateData.personalInfo?.experience && (
                            <span className="text-sm text-gray-600">
                              Total work experience
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education Card */}
                  {candidateData.personalInfo?.education && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-purple-600 font-medium mb-1">Education</p>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            {candidateData.personalInfo.education}
                          </h4>
                          {candidateData.personalInfo?.institution && (
                            <p className="text-gray-700">
                              <span className="font-medium">Institution:</span> {candidateData.personalInfo.institution}
                            </p>
                          )}
                          {candidateData.personalInfo?.fieldOfStudy && (
                            <p className="text-gray-700 mt-1">
                              <span className="font-medium">Field of Study:</span> {candidateData.personalInfo.fieldOfStudy}
                            </p>
                          )}
                          {candidateData.personalInfo?.graduationYear && (
                            <p className="text-gray-700 mt-1">
                              <span className="font-medium">Graduation Year:</span> {candidateData.personalInfo.graduationYear}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If no experience or education */}
                  {!candidateData.personalInfo?.experience && !candidateData.personalInfo?.education && (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">No experience or education information available</p>
                      <p className="text-sm text-gray-500 mt-1">
                        This candidate hasn't added their experience or education details yet
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  {/* Header with Stats */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Job Applications</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {applicationsLoading 
                          ? "Loading applications..." 
                          : applications.length > 0 
                            ? `Track and manage ${applications.length} application${applications.length > 1 ? 's' : ''} from this candidate`
                            : "This candidate hasn't applied to any jobs yet"
                        }
                      </p>
                    </div>
                    
                    {/* Stats Summary */}
                    {applications.length > 0 && !applicationsLoading && (
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600">Total</p>
                          <p className="text-xl font-bold text-blue-700">{applications.length}</p>
                        </div>
                        <div className="px-4 py-2 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600">Active</p>
                          <p className="text-xl font-bold text-green-700">
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
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <p className="text-gray-600">Loading applications...</p>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => {
                        const statusBadge = getStatusBadge(application.status);
                        const StatusIcon = statusBadge.icon;
                        const companyName = application.job?.employer?.companyName || 'Company';
                        const jobTitle = application.job?.jobTitle || 'Job Position';
                        const location = application.job?.location;
                        
                        return (
                          <div 
                            key={application._id} 
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                            onClick={() => setSelectedApplication(
                              selectedApplication?._id === application._id ? null : application
                            )}
                          >
                            {/* Main Application Row */}
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  {/* Company Logo Placeholder */}
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                    {getCompanyInitials(companyName)}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                      <h4 className="font-semibold text-gray-900 text-lg">
                                        {jobTitle}
                                      </h4>
                                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusBadge.label}
                                      </span>
                                    </div>
                                    
                                    <p className="text-gray-700 font-medium mb-2">
                                      {companyName}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                      {location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-4 h-4" />
                                          {location.city || location.address || 'Location not specified'}
                                          {location.isRemote && ' (Remote)'}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        {application.job?.jobType || 'Full Time'}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        Applied {formatDate(application.appliedAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* View Details Arrow */}
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${
                                  selectedApplication?._id === application._id ? 'rotate-90' : ''
                                }`} />
                              </button>
                            </div>

                            {/* Expanded Details */}
                            {selectedApplication?._id === application._id && (
                              <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-3 gap-6">
                                  {/* Application Details */}
                                  <div className="col-span-2 space-y-4">
                                    {/* Cover Letter */}
                                    {application.coverLetter && (
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h5>
                                        <div 
                                          className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ 
                                            __html: application.coverLetter || "<p>No cover letter provided.</p>" 
                                          }}
                                        />
                                      </div>
                                    )}

                                    {/* Timeline */}
                                    {application.statusHistory?.length > 0 && (
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h5>
                                        <div className="space-y-3">
                                          {application.statusHistory.map((history, idx) => {
                                            const historyStatus = getStatusBadge(history.status);
                                            const HistoryIcon = historyStatus.icon;
                                            return (
                                              <div key={idx} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                  <HistoryIcon className="w-3 h-3 text-gray-600" />
                                                </div>
                                                <div>
                                                  <p className="text-sm text-gray-800">
                                                    Status changed to <span className="font-medium">{historyStatus.label}</span>
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    {formatDate(history.updatedAt)}
                                                    {history.note && ` • ${history.note}`}
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
                                  <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Application Info</h5>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-500">Application ID</span>
                                          <span className="text-xs font-mono text-gray-700">{application._id.slice(-8)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-xs text-gray-500">Applied</span>
                                          <span className="text-xs text-gray-700">{formatDate(application.appliedAt)}</span>
                                        </div>
                                        {application.updatedAt && (
                                          <div className="flex justify-between">
                                            <span className="text-xs text-gray-500">Last Updated</span>
                                            <span className="text-xs text-gray-700">{formatDate(application.updatedAt)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h5>
                                      <div className="space-y-2">
                                        {application.job?._id && (
                                          <>
                                            <a
                                              href={`/employer/jobs/${application.job._id}/applications`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                              <span>View all applications</span>
                                              <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <a
                                              href={`/jobs/${application.job._id}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                            >
                                              <span>View job details</span>
                                              <ExternalLink className="w-4 h-4" />
                                            </a>
                                          </>
                                        )}
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
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-700 font-medium text-lg mb-2">No job applications yet</p>
                      <p className="text-gray-500 text-sm max-w-md mx-auto">
                        This candidate hasn't applied to any jobs yet. When they do, their applications will appear here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">Candidate not found</p>
            <p className="text-sm text-gray-500 mt-1">The candidate you're looking for doesn't exist or has been removed</p>
          </div>
        )}
      </div>
    </div>
  );
}