"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiMoreVertical,
  FiEye,
  FiPlusCircle,
  FiXCircle,
  FiTrash2,
  FiSearch,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { jobService } from "@/services/jobService";
import toast from "react-hot-toast";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";

export default function MyJobsMain() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    expiredJobs: 0,
    pendingApplications: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch employer's jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getEmployerJobs({ 
        status: filter === "all" ? undefined : filter,
        search: debouncedSearch || undefined,
        page: pagination.currentPage,
        limit: 10,
      });
      
      if (response.success) {
        setJobs(response.jobs || []);
        setStats(response.stats || {});
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalJobs: response.jobs?.length || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    
    try {
      const result = await jobService.deleteJob(jobId);
      if (result) {
        toast.success("Job deleted successfully");
        fetchJobs(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  // Mark job as expired
  const handleExpireJob = async (jobId) => {
    if (!confirm("Mark this job as expired? This will remove it from public listings.")) return;
    
    try {
      const response = await jobService.expireJob(jobId);
      if (response) {
        toast.success("Job marked as expired");
        fetchJobs(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to expire job");
    }
  };

  // Duplicate job
  const handleDuplicateJob = async (job) => {
    try {
      // Create a new job object from existing one
      const newJobData = {
        jobTitle: `${job.jobTitle} (Copy)`,
        jobDescription: job.jobDescription,
        jobType: job.jobType,
        minSalary: job.salaryRange?.min,
        maxSalary: job.salaryRange?.max,
        currency: job.salaryRange?.currency,
        isNegotiable: job.salaryRange?.isNegotiable,
        country: job.location?.country,
        city: job.location?.city,
        state: job.location?.state,
        zipCode: job.location?.zipCode,
        address: job.location?.address,
        isRemote: job.location?.isRemote,
        experienceLevel: job.experienceLevel,
        educationLevel: job.educationLevel,
        vacancies: job.vacancies,
        jobCategory: job.jobCategory,
        tags: job.tags,
        benefits: job.benefits,
        applicationMethod: job.applicationMethod,
        applicationEmail: job.applicationEmail,
        applicationUrl: job.applicationUrl,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };
      
      await jobService.createJob(newJobData);
      toast.success("Job duplicated successfully");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to duplicate job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filter, debouncedSearch, pagination.currentPage]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (job) => {
    if (job.status === 'Active' && job.daysRemaining <= 0) {
      return { text: 'Expired', color: 'text-red-600', bg: 'bg-red-50', icon: FiAlertCircle };
    }
    
    const statusMap = {
      'Active': { text: 'Active', color: 'text-green-600', bg: 'bg-green-50', icon: FiCheckCircle },
      'Expired': { text: 'Expired', color: 'text-red-600', bg: 'bg-red-50', icon: FiAlertCircle },
      'Closed': { text: 'Closed', color: 'text-gray-600', bg: 'bg-gray-50', icon: FiXCircle },
      'Draft': { text: 'Draft', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FiClock },
    };
    
    return statusMap[job.status] || { text: job.status, color: 'text-gray-600', bg: 'bg-gray-50', icon: FiClock };
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex pt-28">
      <EmployerSidebar />
      
      <main
        className="
          w-full min-h-screen bg-gray-50
          px-4 py-6 sm:px-6
          md:ml-[260px]
          md:w-[calc(100%-260px)]
          md:h-[calc(100vh-7rem)]
          md:overflow-y-auto
        "
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track all your job postings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeJobs || 0}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalApplications || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingApplications || 0}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select 
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="rounded-lg border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Jobs</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>

            <Link
              href="/post-job"
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
            >
              <FiPlusCircle className="w-4 h-4" />
              Post New Job
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border rounded-lg w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-3 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all' 
                  ? "Try adjusting your filters or search terms" 
                  : "You haven't posted any jobs yet"}
              </p>
              <Link 
                href="/post-job" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FiPlusCircle className="w-5 h-5 mr-2" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Job Details</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Applications</th>
                      <th className="px-6 py-4 text-left font-medium">Posted Date</th>
                      <th className="px-6 py-4 text-left font-medium">Expires</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <JobRow
                        key={job._id}
                        job={job}
                        onDelete={() => handleDeleteJob(job._id)}
                        onExpire={() => handleExpireJob(job._id)}
                        onDuplicate={() => handleDuplicateJob(job)}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalJobs)} of {pagination.totalJobs} jobs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
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
                          className={`w-8 h-8 rounded-lg text-sm ${
                            pagination.currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Job Row ---------------- */

function JobRow({ job, onDelete, onExpire, onDuplicate, formatDate, getStatusBadge }) {
  const [open, setOpen] = useState(false);
  
  const statusBadge = getStatusBadge(job);
  const StatusIcon = statusBadge.icon;
  
  return (
    <tr
      onMouseLeave={() => setOpen(false)}
      className={`
        transition hover:bg-gray-50
        ${job.isHighlighted ? "bg-blue-50/40" : ""}
      `}
    >
      {/* Job Details */}
      <td className="px-6 py-4">
        <Link href={`/jobs/${job._id}`} className="block group">
          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition">
            {job.jobTitle}
            {job.isFeatured && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
              {job.jobType || 'Full Time'}
            </span>
            <span className="text-xs text-gray-500">
              📍 {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
            </span>
            {job.location?.isRemote && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                Remote
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Vacancies: {job.vacancies || 1} • 
            Salary: {job.salaryRange?.min ? `$${job.salaryRange.min.toLocaleString()}-${job.salaryRange.max.toLocaleString()}` : 'Negotiable'}
          </p>
        </Link>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {statusBadge.text}
        </span>
        {job.daysRemaining > 0 && job.status === 'Active' && (
          <p className="text-xs text-gray-500 mt-2">
            {job.daysRemaining} days left
          </p>
        )}
      </td>

      {/* Applications */}
      <td className="px-6 py-4">
        <Link 
          href={`/employer/jobs/${job._id}/applications`}
          className="block group"
        >
          <p className="font-medium text-gray-900 group-hover:text-blue-600">
            {job.applicationsCount || 0} Applications
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {job.applicationStats?.pending > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                Pending: {job.applicationStats.pending}
              </span>
            )}
            {job.applicationStats?.interview > 0 && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                Interview: {job.applicationStats.interview}
              </span>
            )}
          </div>
        </Link>
      </td>

      {/* Posted Date */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-700">{formatDate(job.postedDate)}</p>
      </td>

      {/* Expires */}
      <td className="px-6 py-4">
        <p className={`text-sm ${job.daysRemaining <= 3 && job.daysRemaining > 0 ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>
          {formatDate(job.expirationDate)}
        </p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right relative">
        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          className="rounded-md p-2 hover:bg-gray-100 transition"
        >
          <FiMoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {open && (
          <ActionsDropdown 
            jobId={job._id}
            job={job}
            onDelete={onDelete}
            onExpire={onExpire}
            onDuplicate={onDuplicate}
            onClose={() => setOpen(false)}
          />
        )}
      </td>
    </tr>
  );
}

/* ---------------- Dropdown ---------------- */

function ActionsDropdown({ jobId, job, onDelete, onExpire, onDuplicate, onClose }) {
  return (
    <div
      className="absolute right-6 top-12 z-20 w-56 rounded-lg border bg-white shadow-lg py-1"
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      <Link href={`/jobs/${jobId}`}>
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <FiEye className="w-4 h-4" />
          View Job Details
        </div>
      </Link>

      <Link href={`/employer/jobs/${jobId}/applications`}>
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-50 transition cursor-pointer font-medium">
          <FiUsers className="w-4 h-4" />
          View Applications ({job.applicationsCount || 0})
        </div>
      </Link>

      <Link href={`/employer/jobs/${jobId}/edit`}>
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer">
          <FiPlusCircle className="w-4 h-4" />
          Edit Job
        </div>
      </Link>

      <div 
        onClick={onDuplicate}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <FiPlusCircle className="w-4 h-4" />
        Duplicate Job
      </div>

      <div className="border-t my-1"></div>

      {job.status === 'Active' && job.daysRemaining > 0 && (
        <div 
          onClick={onExpire}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition cursor-pointer"
        >
          <FiXCircle className="w-4 h-4" />
          Mark as Expired
        </div>
      )}

      <div 
        onClick={onDelete}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
      >
        <FiTrash2 className="w-4 h-4" />
        Delete Job
      </div>
    </div>
  );
}