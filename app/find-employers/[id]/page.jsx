"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MapPin, Globe, Phone, Mail, 
  Facebook, Twitter, Linkedin, 
  Briefcase, Calendar, Users, 
  Building2, Award, TrendingUp,
  Loader2, AlertCircle, Share2,
  Bookmark, CheckCircle, Clock,
  DollarSign, GraduationCap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { employerService } from "@/services/employerService";
import { jobService } from "@/services/jobService";

export default function SingleEmployer() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState({ active: [], closed: [] });
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [following, setFollowing] = useState(false);
  const [jobFilters, setJobFilters] = useState({
    status: 'active',
    page: 1,
    limit: 6
  });

  useEffect(() => {
    if (id) {
      fetchEmployerDetails();
    }
  }, [id]);

  const fetchEmployerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await employerService.getEmployerById(id);
      
      setEmployer(response.employer);
      setJobs(response.jobs || { active: [], closed: [] });
      setStats(response.stats);
      setRecentApplications(response.recentApplications || []);
      setFollowing(response.employer.isFollowing || false);
      
    } catch (err) {
      console.error('Failed to fetch employer:', err);
      setError(err.message || 'Failed to load employer details');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    // Implement follow/unfollow functionality
    setFollowing(!following);
    // Add API call here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employer?.companyInfo?.companyName || employer?.user?.name}`,
          text: `Check out ${employer?.companyInfo?.companyName || employer?.user?.name} on our job portal`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleJobFilterChange = (status) => {
    setJobFilters(prev => ({ ...prev, status, page: 1 }));
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <SecondNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading employer profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !employer) {
    return (
      <>
        <Navbar />
        <SecondNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {error === 'Employer not found' ? 'Employer Not Found' : 'Error Loading Profile'}
            </h2>
            <p className="text-gray-500 mb-6">
              {error === 'Employer not found' 
                ? "The employer you're looking for doesn't exist or has been removed."
                : error || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/find-employers')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                ← Back to Employers
              </button>
              <button
                onClick={fetchEmployerDetails}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const companyName = employer.companyInfo?.companyName || employer.user?.name || 'Company Name';
  const logo = employerService.getCompanyLogo(employer);
  const banner = employerService.getCompanyBanner(employer);
  const location = employerService.formatLocation(employer);
  const isComplete = employerService.isProfileComplete(employer);

  return (
    <>
      <Navbar />
      <SecondNavbar />

      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link> /{" "}
            <Link href="/find-employers" className="hover:text-blue-600">Find Employers</Link> /{" "}
            <span className="text-gray-800 font-medium">{companyName}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            {banner ? (
              <img 
                src={banner} 
                alt={companyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <Building2 className="w-20 h-20 text-white/20" />
              </div>
            )}
            
            {/* Profile Image Overlay */}
            <div className="absolute -bottom-12 left-8">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt={companyName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {companyName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    {companyName}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    {location && (
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin size={16} />
                        {location}
                      </span>
                    )}
                    {employer.foundingInfo?.industryType && (
                      <>
                        <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                        <span className="text-sm">{employer.foundingInfo.industryType}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-8 flex gap-2">
              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  following
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Users size={18} />
                {following ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition flex items-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Navigation Tabs */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="flex border-b">
                  {['about', 'jobs', 'insights'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 text-sm font-medium capitalize transition ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      {/* About Us */}
                      {employer.companyInfo?.aboutUs && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">About Us</h3>
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {employer.companyInfo.aboutUs}
                          </p>
                        </div>
                      )}

                      {/* Company Benefits */}
                      {employer.companyInfo?.benefits && employer.companyInfo.benefits.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {employer.companyInfo.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Company Vision */}
                      {employer.foundingInfo?.companyVision && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">Company Vision</h3>
                          <p className="text-gray-600 leading-relaxed">
                            {employer.foundingInfo.companyVision}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'jobs' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Open Positions ({stats?.activeJobs || 0})
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleJobFilterChange('active')}
                            className={`px-4 py-2 text-sm rounded-lg transition ${
                              jobFilters.status === 'active'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Active
                          </button>
                          <button
                            onClick={() => handleJobFilterChange('closed')}
                            className={`px-4 py-2 text-sm rounded-lg transition ${
                              jobFilters.status === 'closed'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Closed
                          </button>
                        </div>
                      </div>

                      {jobs.active.length > 0 ? (
                        <div className="space-y-4">
                          {jobs.active.slice(0, jobFilters.limit).map((job) => (
                            <JobCard key={job._id} job={job} employerName={companyName} />
                          ))}
                          
                          {jobs.active.length > jobFilters.limit && (
                            <button
                              onClick={() => router.push(`/jobs?employer=${employer.user._id}`)}
                              className="w-full py-3 text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View all {stats?.activeJobs} jobs →
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No open positions at the moment</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-6">Company Insights</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
                          <p className="text-2xl font-bold text-blue-600">{stats?.totalJobs || 0}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                          <p className="text-2xl font-bold text-green-600">{stats?.activeJobs || 0}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                          <p className="text-2xl font-bold text-purple-600">{stats?.totalApplications || 0}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Hired</p>
                          <p className="text-2xl font-bold text-orange-600">{stats?.applicationStatus?.hired || 0}</p>
                        </div>
                      </div>

                      {/* Application Status Distribution */}
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="font-medium text-gray-800 mb-4">Application Status Distribution</h4>
                        <div className="space-y-3">
                          {Object.entries(stats?.applicationStatus || {}).map(([status, count]) => (
                            count > 0 && (
                              <div key={status} className="flex items-center gap-3">
                                <span className="w-24 text-sm capitalize text-gray-600">{status}:</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ 
                                      width: `${(count / (stats?.totalApplications || 1)) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{count}</span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Company Info Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Company Information</h3>
                
                <div className="space-y-4">
                  {employer.foundingInfo?.yearOfEstablishment && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Founded</p>
                        <p className="font-medium text-gray-800">
                          {new Date(employer.foundingInfo.yearOfEstablishment).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.organizationType && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Organization Type</p>
                        <p className="font-medium text-gray-800">
                          {employer.foundingInfo.organizationType}
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.teamSize && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Team Size</p>
                        <p className="font-medium text-gray-800">
                          {employer.foundingInfo.teamSize} employees
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.companyWebsite && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a 
                          href={`https://${employer.foundingInfo.companyWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {employer.foundingInfo.companyWebsite}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  {employer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a href={`tel:${employer.phone}`} className="font-medium text-gray-800 hover:text-blue-600">
                          {employer.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {employer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a href={`mailto:${employer.email}`} className="font-medium text-gray-800 hover:text-blue-600">
                          {employer.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">{location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {employer.socialLinks && employer.socialLinks.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Connect With Us</h3>
                  
                  <div className="flex gap-3">
                    {employer.socialLinks.map((link, index) => {
                      const getIcon = (platform) => {
                        switch(platform) {
                          case 'facebook': return <Facebook className="w-5 h-5" />;
                          case 'twitter': return <Twitter className="w-5 h-5" />;
                          case 'linkedin': return <Linkedin className="w-5 h-5" />;
                          default: return <Globe className="w-5 h-5" />;
                        }
                      };

                      const getColor = (platform) => {
                        switch(platform) {
                          case 'facebook': return 'bg-blue-600 hover:bg-blue-700';
                          case 'twitter': return 'bg-sky-500 hover:bg-sky-600';
                          case 'linkedin': return 'bg-blue-700 hover:bg-blue-800';
                          default: return 'bg-gray-600 hover:bg-gray-700';
                        }
                      };

                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-lg transition ${getColor(link.platform)}`}
                        >
                          {getIcon(link.platform)}
                          <span className="text-sm capitalize">{link.platform}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Profile Completion */}
              {employer.isOwner && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Profile Completion</h3>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{employer.completionPercentage || 0}% Complete</span>
                      {isComplete && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${employer.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {!isComplete && (
                    <Link
                      href={`/profile/employer/${employer.user._id}/edit`}
                      className="block text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                      Complete Your Profile
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Job Card Component for employer profile
function JobCard({ job, employerName }) {
  const router = useRouter();

  const formatSalary = (salaryRange) => {
    if (!salaryRange || !salaryRange.min || salaryRange.min === 0) return 'Negotiable';
    const currencySymbol = salaryRange.currency === 'USD' ? '$' : 
                          salaryRange.currency === 'EUR' ? '€' : 
                          salaryRange.currency === 'GBP' ? '£' : 
                          salaryRange.currency || '$';
    return `${currencySymbol}${salaryRange.min.toLocaleString()} - ${currencySymbol}${salaryRange.max.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'bg-blue-100 text-blue-600';
      case 'part-time': return 'bg-green-100 text-green-600';
      case 'internship': return 'bg-purple-100 text-purple-600';
      case 'contract': return 'bg-yellow-100 text-yellow-600';
      case 'remote': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div 
      onClick={() => router.push(`/jobs/${job._id}`)}
      className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-800 mb-1 hover:text-blue-600">
            {job.jobTitle}
          </h4>
          <p className="text-sm text-gray-600">{employerName}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${getJobTypeColor(job.jobType)}`}>
          {job.jobType}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location?.city || 'Remote'}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign size={14} />
          {formatSalary(job.salaryRange)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {job.daysRemaining > 0 
            ? `${job.daysRemaining} days left`
            : 'Expired'}
        </span>
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}