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
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
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

  const router = useRouter();

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
      
      // Remove from local state
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
    return new Date(dateString).toLocaleDateString('en-US', {
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
      return { status: 'expired', label: 'Deadline Expired', color: 'bg-gray-100 text-gray-400' };
    } else if (daysRemaining <= 3) {
      return { status: 'urgent', label: `${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} Remaining`, color: 'bg-red-100 text-red-600' };
    } else {
      return { status: 'active', label: `${daysRemaining} Days Remaining`, color: 'bg-green-100 text-green-600' };
    }
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-600';
      case 'part-time':
        return 'bg-green-100 text-green-600';
      case 'internship':
        return 'bg-purple-100 text-purple-600';
      case 'contract':
        return 'bg-yellow-100 text-yellow-600';
      case 'remote':
        return 'bg-indigo-100 text-indigo-600';
      case 'freelance':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <Navbar />
      <SecondNavbar />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Favorite Jobs <span className="text-gray-500">({pagination.totalSavedJobs})</span>
              </h2>
              <p className="text-gray-500 mt-1">Your saved job listings</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <FiBriefcase size={16} />
                Browse More Jobs
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiLoader size={32} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading your favourite jobs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <FiAlertCircle size={64} className="text-red-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading favourite jobs</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={fetchSavedJobs}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <FiBookmark size={64} className="text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No favourite jobs yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                When you find jobs you're interested in, click the bookmark icon to save them here for easy access.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <>
              {/* Job List */}
              <div className="space-y-4">
                {savedJobs.map((item) => {
                  const job = item.job;
                  if (!job) return null;
                  
                  const jobStatus = getJobStatus(job.expirationDate);
                  const daysRemaining = calculateDaysRemaining(job.expirationDate);
                  
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-lg border bg-white p-6 transition hover:shadow-md"
                    >
                      {/* Left - Job Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Company Logo */}
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                          {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                              {job.jobTitle}
                            </h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getJobTypeColor(job.jobType)}`}>
                              {job.jobType}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <FiMapPin size={14} /> 
                              {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiDollarSign size={14} />
                              {formatSalary(job.salaryRange)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCalendar size={14} />
                              Saved on {formatDate(item.savedDate)}
                            </span>
                          </div>

                          {/* Experience Level and Education */}
                          <div className="flex flex-wrap gap-3">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {job.experienceLevel}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {job.educationLevel}
                            </span>
                            {job.location?.isRemote && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                Remote
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right - Actions */}
                      <div className="flex items-center gap-4 ml-4">
                        {/* Remove Button */}
                        <button
                          onClick={(e) => handleRemoveSavedJob(job._id, e)}
                          disabled={removingJobId === job._id}
                          className="text-gray-400 hover:text-red-600 transition p-1"
                          title="Remove from favourites"
                        >
                          {removingJobId === job._id ? (
                            <FiLoader size={18} className="animate-spin" />
                          ) : (
                            <FiTrash2 size={18} />
                          )}
                        </button>

                        {/* Status/Apply Button */}
                        {jobStatus.status === 'expired' ? (
                          <span className={`rounded px-4 py-2 text-sm ${jobStatus.color}`}>
                            {jobStatus.label}
                          </span>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                            <span className={`rounded px-3 py-1 text-xs ${jobStatus.color}`}>
                              <FiClock className="inline mr-1" size={12} />
                              {jobStatus.label}
                            </span>
                            <button
                              onClick={() => router.push(`/jobs/${job._id}#apply`)}
                              className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
                            >
                              Apply Now <FiChevronRight />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="h-9 w-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FiChevronLeft size={14} />
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
                        className={`h-9 w-9 rounded-full border text-sm transition
                          ${pagination.currentPage === pageNum 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-100'
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
                    className="h-9 w-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
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
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center font-bold text-blue-600">
          {job.employer?.companyName?.[0] || 'C'}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{job.jobTitle}</h4>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FiMapPin size={12} /> {job.location?.city}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${getJobTypeColor(job.jobType)}`}>
              {job.jobType}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-gray-400 hover:text-red-600"
        >
          {removing ? <FiLoader size={14} className="animate-spin" /> : <FiTrash2 size={14} />}
        </button>
        <Link 
          href={`/jobs/${job._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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
    return { status: 'expired', label: 'Deadline Expired', color: 'bg-gray-100 text-gray-400' };
  } else if (daysRemaining <= 3) {
    return { status: 'urgent', label: `${daysRemaining} Day${daysRemaining !== 1 ? 's' : ''} Left`, color: 'bg-red-100 text-red-600' };
  } else {
    return { status: 'active', label: `${daysRemaining} Days Left`, color: 'bg-green-100 text-green-600' };
  }
}

function getJobTypeColor(type) {
  switch (type?.toLowerCase()) {
    case 'full-time':
      return 'bg-blue-100 text-blue-600';
    case 'part-time':
      return 'bg-green-100 text-green-600';
    case 'internship':
      return 'bg-purple-100 text-purple-600';
    case 'contract':
      return 'bg-yellow-100 text-yellow-600';
    case 'remote':
      return 'bg-indigo-100 text-indigo-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}