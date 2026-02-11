"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Loader2, 
  Eye, 
  MapPin, 
  Briefcase,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { applicationService } from "@/services/applicationService";
import CandidateSidebar from "@/components/dashboard/CandidateSidebar";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications({
        page: currentPage,
        limit: 10,
        status: statusFilter !== "All" ? statusFilter : "",
      });
      
      setApplications(response.applications || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalApplications: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { text: "Active", color: "text-green-600", dotColor: "bg-green-500" },
      reviewed: { text: "Reviewed", color: "text-blue-600", dotColor: "bg-blue-500" },
      shortlisted: { text: "Shortlisted", color: "text-purple-600", dotColor: "bg-purple-500" },
      interview: { text: "Interview", color: "text-indigo-600", dotColor: "bg-indigo-500" },
      hired: { text: "Hired", color: "text-emerald-600", dotColor: "bg-emerald-500" },
      rejected: { text: "Rejected", color: "text-red-600", dotColor: "bg-red-500" },
      withdrawn: { text: "Withdrawn", color: "text-gray-600", dotColor: "bg-gray-500" },
    };
    return statusMap[status] || { text: "Active", color: "text-green-600", dotColor: "bg-green-500" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // Fix hydration: Use consistent date formatting
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompanyInitial = (companyName) => {
    return companyName?.charAt(0) || "C";
  };

  const getLogoBgColor = (companyName) => {
    const colors = [
      "bg-green-500",
      "bg-pink-500",
      "bg-black",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-yellow-500",
    ];
    
    const hash = companyName?.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0) || 0;
    
    return colors[hash % colors.length];
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex pt-28">
      <CandidateSidebar />
      
      <main
        className="
          w-full min-h-screen bg-gray-50
          px-4 py-4 sm:px-6 sm:py-6
          md:ml-[260px] md:w-[calc(100%-260px)]
          md:h-[calc(100vh-7rem)] md:overflow-y-auto
        "
      >
        {/* Header with Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Applied Jobs <span className="text-gray-400">({pagination.totalApplications})</span>
          </h2>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm text-gray-600">
              Filter by:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusChange}
              className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="pending">Active</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 text-gray-600">Loading applications...</span>
              </div>
            ) : applications.length > 0 ? (
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-gray-50 text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Jobs</th>
                    <th className="px-6 py-3 text-left font-medium">Date Applied</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => {
                    const job = app.job || {};
                    const employer = job?.employer || {};
                    const companyName = employer.companyName || employer.name || "Company";
                    const status = getStatusDisplay(app.status);
                    const isHighlighted = app.status === "shortlisted" || app.status === "interview";
                    
                    return (
                      <tr
                        key={app._id}
                        className={`border-t ${
                          isHighlighted
                            ? "border-blue-500 bg-blue-50/30"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Job Info */}
                        <td className="px-6 py-4">
                          <div className="flex gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded ${getLogoBgColor(companyName)} text-white font-bold flex-shrink-0`}
                            >
                              {getCompanyInitial(companyName)}
                            </div>

                            <div>
                              <p className="font-medium text-gray-900">
                                {job?.jobTitle || "Job Title"}
                                <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                                  {job?.jobType || "Full Time"}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {companyName}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {job?.location?.city || "Not specified"}, {job?.location?.country || "Not specified"}
                                </span>
                                <span>•</span>
                                <span>
                                  {job?.salaryRange?.min 
                                    ? `$${job.salaryRange.min.toLocaleString()}-${job.salaryRange.max.toLocaleString()}` 
                                    : "Salary Negotiable"
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <div className="text-gray-500">
                            <p>{formatDate(app.appliedAt)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(app.appliedAt)}
                              {app.daysSinceApplied ? ` • ${app.daysSinceApplied} days ago` : ''}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 ${status.color}`}>
                            <span className={`h-2 w-2 rounded-full ${status.dotColor}`} />
                            {status.text}
                          </span>
                          {app.viewedByEmployer && (
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> Viewed by employer
                            </p>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/jobs/${job?._id}`}
                            className="inline-block rounded bg-blue-600 px-4 py-1.5 text-xs text-white hover:bg-blue-700 transition"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No applications found
                </h3>
                <p className="text-gray-500 mb-6">
                  {statusFilter !== "All" 
                    ? `No ${statusFilter} applications found` 
                    : "You haven't applied to any jobs yet"}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Pagination - Fixed Hydration */}
          {!loading && applications.length > 0 && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t py-4 text-sm">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="h-8 w-8 rounded-full border text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center justify-center"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
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
                    className={`h-8 w-8 rounded-full ${
                      pagination.currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-50'
                    } transition flex items-center justify-center`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pagination.currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="h-8 w-8 rounded-full border text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center justify-center"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}