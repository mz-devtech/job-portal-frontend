"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiBookmark,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiChevronLeft,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiTrash2,
  FiLoader,
  FiAlertCircle,
  FiHeart,
  FiStar,
} from "react-icons/fi";
import { Sparkles, TrendingUp, Award, ArrowRight } from "lucide-react";

import { savedJobService } from "@/services/savedJobService";

const FavouriteJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSavedJobs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [removingJobId, setRemovingJobId] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'savedDate',
    sortOrder: 'desc',
  });
  const [greeting, setGreeting] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [filters.page]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await savedJobService.getSavedJobs(filters);
      setSavedJobs(response.savedJobs || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalSavedJobs: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
      setError(err.message || 'Failed to load favourite jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId, e) => {
    e.stopPropagation(); // Prevent navigation
    
    if (removingJobId === jobId) return;
    
    try {
      setRemovingJobId(jobId);
      await savedJobService.unsaveJob(jobId);
      
      // Remove from local state with animation
      setSavedJobs(prev => prev.filter(item => item.job?._id !== jobId));
      
      // Update pagination count
      setPagination(prev => ({
        ...prev,
        totalSavedJobs: prev.totalSavedJobs - 1,
      }));
      
    } catch (error) {
      console.error('Failed to remove saved job:', error);
    } finally {
      setRemovingJobId(null);
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || salaryRange.min === 0) return 'Negotiable';
    
    const currencySymbol = salaryRange.currency === 'USD' ? '$' : 
                          salaryRange.currency === 'EUR' ? '€' : 
                          salaryRange.currency === 'GBP' ? '£' : 
                          salaryRange.currency;
    
    return `${currencySymbol}${salaryRange.min.toLocaleString()} - ${currencySymbol}${salaryRange.max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateDaysRemaining = (expirationDate) => {
    const now = new Date();
    const exp = new Date(expirationDate);
    const diffTime = exp - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getJobStatus = (expirationDate) => {
    const daysRemaining = calculateDaysRemaining(expirationDate);
    if (daysRemaining <= 0) {
      return { status: 'expired', label: 'Deadline Expired', color: 'bg-gray-100 text-gray-400', borderColor: 'border-gray-200' };
    } else if (daysRemaining <= 3) {
      return { status: 'urgent', label: `${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} Remaining`, color: 'bg-red-50 text-red-600 border border-red-200', borderColor: 'border-red-200' };
    } else {
      return { status: 'active', label: `${daysRemaining} Days Remaining`, color: 'bg-green-50 text-green-600 border border-green-200', borderColor: 'border-green-200' };
    }
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'part-time':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'internship':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'contract':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'remote':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
      case 'freelance':
        return 'bg-pink-50 text-pink-600 border border-pink-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <>
     
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 relative">
        {/* Decorative Elements */}
        <div className="fixed top-40 right-0 w-72 h-72 bg-gradient-to-br from-pink-100/20 to-purple-100/20 rounded-full blur-3xl -z-10"></div>
        <div className="fixed bottom-40 left-0 w-72 h-72 bg-gradient-to-tr from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with Animation */}
          <div className="relative animate-slideDown mb-8">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {greeting}, here are your favorites
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Favorite Jobs
                  </h2>
                  <div className="px-2.5 py-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <span className="text-xs font-semibold text-pink-600">{pagination.totalSavedJobs}</span>
                  </div>
                </div>
                <p className="text-gray-500 mt-1 text-sm">Your saved job listings, ready when you are</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="group flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-all px-4 py-2 rounded-xl hover:bg-blue-50"
                >
                  <FiBriefcase size={16} />
                  Browse More Jobs
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State with Animation */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 animate-slideUp">
              <div className="relative">
                <FiLoader size={40} className="text-pink-600 animate-spin" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-200/20 to-transparent animate-shimmer"></div>
              </div>
              <p className="text-gray-600 mt-4 animate-pulse">Loading your favourite jobs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 animate-slideUp">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto">
                  <FiAlertCircle size={40} className="text-red-500" />
                </div>
                <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading favourite jobs</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchSavedJobs}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-20 animate-slideUp">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <FiBookmark size={40} className="text-gray-400" />
                </div>
                <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                <FiHeart className="w-4 h-4 text-pink-400 absolute -bottom-1 -left-1 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No favourite jobs yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                When you find jobs you're interested in, click the bookmark icon to save them here for easy access.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-slideUp">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <FiBriefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Saved</p>
                      <p className="text-xl font-bold text-blue-600">{pagination.totalSavedJobs}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Active Jobs</p>
                      <p className="text-xl font-bold text-green-600">
                        {savedJobs.filter(item => calculateDaysRemaining(item.job?.expirationDate) > 0).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <FiStar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expiring Soon</p>
                      <p className="text-xl font-bold text-purple-600">
                        {savedJobs.filter(item => {
                          const days = calculateDaysRemaining(item.job?.expirationDate);
                          return days > 0 && days <= 3;
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job List with Animations */}
              <div className="space-y-4">
                {savedJobs.map((item, index) => {
                  const job = item.job;
                  if (!job) return null;
                  
                  const jobStatus = getJobStatus(job.expirationDate);
                  const daysRemaining = calculateDaysRemaining(job.expirationDate);
                  
                  return (
                    <div
                      key={item._id}
                      className="group relative bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slideUp overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Animated background effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left - Job Info */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Company Logo with Animation */}
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
                          </div>

                          {/* Job Details */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors cursor-pointer text-base">
                                {job.jobTitle}
                              </h3>
                              <span className={`rounded-full px-3 py-1 text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                                {job.jobType}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <FiMapPin size={14} className="text-gray-400" /> 
                                {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiDollarSign size={14} className="text-gray-400" />
                                {formatSalary(job.salaryRange)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiCalendar size={14} className="text-gray-400" />
                                Saved {formatDate(item.savedDate)}
                              </span>
                            </div>

                            {/* Experience Level and Education */}
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {job.experienceLevel}
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {job.educationLevel}
                              </span>
                              {job.location?.isRemote && (
                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">
                                  Remote
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-4 ml-0 lg:ml-4">
                          {/* Remove Button with Animation */}
                          <button
                            onClick={(e) => handleRemoveSavedJob(job._id, e)}
                            disabled={removingJobId === job._id}
                            className="text-gray-400 hover:text-red-600 transition-all duration-300 p-2 hover:bg-red-50 rounded-lg group/btn"
                            title="Remove from favourites"
                          >
                            {removingJobId === job._id ? (
                              <FiLoader size={18} className="animate-spin" />
                            ) : (
                              <FiTrash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                            )}
                          </button>

                          {/* Status/Apply Button */}
                          {jobStatus.status === 'expired' ? (
                            <span className={`rounded-lg px-4 py-2 text-sm ${jobStatus.color}`}>
                              {jobStatus.label}
                            </span>
                          ) : (
                            <div className="flex flex-col items-end gap-2">
                              <span className={`rounded-full px-3 py-1 text-xs flex items-center gap-1 ${jobStatus.color}`}>
                                <FiClock className="inline" size={12} />
                                {jobStatus.label}
                              </span>
                              <button
                                onClick={() => router.push(`/jobs/${job._id}#apply`)}
                                className="group/btn flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2 text-sm text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                              >
                                Apply Now 
                                <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination with Enhanced Styling */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2 animate-slideUp">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="h-9 w-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white hover:border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
                  >
                    <FiChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-9 w-9 rounded-full border text-sm transition-all duration-300
                          ${pagination.currentPage === pageNum 
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow-md scale-110' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="h-9 w-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:text-white hover:border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
                  >
                    <FiChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
     
    </>
  );
};

export default FavouriteJobs;

/* ---------------- Quick Job Card Component (Optional) ---------------- */

export function QuickJobCard({ job, onRemove }) {
  const [removing, setRemoving] = useState(false);
  
  if (!job) return null;
  
  const daysRemaining = calculateDaysRemaining(job.expirationDate);
  const jobStatus = getJobStatus(job.expirationDate);
  
  const handleRemove = async (e) => {
    e.stopPropagation();
    if (removing) return;
    
    try {
      setRemoving(true);
      await savedJobService.unsaveJob(job._id);
      if (onRemove) onRemove(job._id);
    } catch (error) {
      console.error('Failed to remove job:', error);
    } finally {
      setRemoving(false);
    }
  };
  
  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {job.employer?.companyName?.[0] || 'C'}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm group-hover:text-pink-600 transition-colors">{job.jobTitle}</h4>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FiMapPin size={12} /> {job.location?.city}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${getJobTypeColor(job.jobType)}`}>
              {job.jobType}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-gray-400 hover:text-red-600 transition-all p-1 hover:bg-red-50 rounded-lg"
        >
          {removing ? <FiLoader size={14} className="animate-spin" /> : <FiTrash2 size={14} />}
        </button>
        <Link 
          href={`/jobs/${job._id}`}
          className="text-pink-600 hover:text-purple-800 text-sm font-medium transition-all hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}

// Helper functions (you can move these to a separate utils file)
function calculateDaysRemaining(expirationDate) {
  const now = new Date();
  const exp = new Date(expirationDate);
  const diffTime = exp - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function getJobStatus(expirationDate) {
  const daysRemaining = calculateDaysRemaining(expirationDate);
  if (daysRemaining <= 0) {
    return { status: 'expired', label: 'Deadline Expired', color: 'bg-gray-100 text-gray-400', borderColor: 'border-gray-200' };
  } else if (daysRemaining <= 3) {
    return { status: 'urgent', label: `${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} Left`, color: 'bg-red-50 text-red-600 border border-red-200', borderColor: 'border-red-200' };
  } else {
    return { status: 'active', label: `${daysRemaining} Days Left`, color: 'bg-green-50 text-green-600 border border-green-200', borderColor: 'border-green-200' };
  }
}

function getJobTypeColor(type) {
  switch (type?.toLowerCase()) {
    case 'full-time':
      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'part-time':
      return 'bg-green-50 text-green-600 border border-green-200';
    case 'internship':
      return 'bg-purple-50 text-purple-600 border border-purple-200';
    case 'contract':
      return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    case 'remote':
      return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
}

/* Add these styles to your global CSS file */
const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-slideDown {
    animation: slideDown 0.6s ease-out forwards;
  }

  .animate-slideUp {
    opacity: 0;
    animation: slideUp 0.6s ease-out forwards;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Add the styles to your component or global CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}