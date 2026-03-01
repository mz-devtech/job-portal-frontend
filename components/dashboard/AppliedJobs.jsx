"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Loader2, 
  Eye, 
  MapPin, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar
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
  const [greeting, setGreeting] = useState("");
  const [screenSize, setScreenSize] = useState('desktop');

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
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications({
        page: currentPage,
        limit: screenSize === 'mobile' ? 5 : 10,
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
      pending: { text: "Active", color: "text-green-600", dotColor: "bg-green-500", bgColor: "bg-green-50" },
      reviewed: { text: "Reviewed", color: "text-blue-600", dotColor: "bg-blue-500", bgColor: "bg-blue-50" },
      shortlisted: { text: "Shortlisted", color: "text-purple-600", dotColor: "bg-purple-500", bgColor: "bg-purple-50" },
      interview: { text: "Interview", color: "text-indigo-600", dotColor: "bg-indigo-500", bgColor: "bg-indigo-50" },
      hired: { text: "Hired", color: "text-emerald-600", dotColor: "bg-emerald-500", bgColor: "bg-emerald-50" },
      rejected: { text: "Rejected", color: "text-red-600", dotColor: "bg-red-500", bgColor: "bg-red-50" },
      withdrawn: { text: "Withdrawn", color: "text-gray-600", dotColor: "bg-gray-500", bgColor: "bg-gray-50" },
    };
    return statusMap[status] || { text: "Active", color: "text-green-600", dotColor: "bg-green-500", bgColor: "bg-green-50" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-gray-800 to-gray-900",
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-red-500 to-red-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
      "bg-gradient-to-br from-yellow-500 to-yellow-600",
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
    <div className="flex pt-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {screenSize !== 'mobile' && (
        <>
          <div className="fixed top-40 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="fixed bottom-40 left-0 w-72 h-72 bg-gradient-to-tr from-yellow-100/20 to-orange-100/20 rounded-full blur-3xl -z-10"></div>
        </>
      )}
      
      <CandidateSidebar />
      
      <main className="w-full min-h-screen px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] md:h-[calc(100vh-7rem)] md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative pb-20 md:pb-6">
        <div className="relative animate-slideDown">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {greeting}, {screenSize === 'mobile' ? 'track your apps' : 'track your applications'}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {screenSize === 'mobile' ? 'Applied' : 'Applied Jobs'} 
              <span className="text-gray-400 ml-1 sm:ml-2 text-xs sm:text-sm">({pagination.totalApplications})</span>
            </h2>
            
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-[10px] sm:text-xs text-gray-600">
                {screenSize === 'mobile' ? 'Filter:' : 'Filter by:'}
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white hover:border-blue-300 transition-all duration-200 cursor-pointer"
              >
                <option value="All">All</option>
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
        </div>

        <div className="mt-4 sm:mt-5 md:mt-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-slideUp border border-gray-100">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-12 sm:py-16 md:py-20">
                <div className="relative">
                  <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 animate-spin" />
                </div>
                <span className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500 animate-pulse">
                  {screenSize === 'mobile' ? 'Loading...' : 'Loading applications...'}
                </span>
              </div>
            ) : applications.length > 0 ? (
              <table className="w-full min-w-[600px] sm:min-w-[800px] md:min-w-[900px] text-xs sm:text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-white text-gray-400">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-medium text-[10px] sm:text-xs">Jobs</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-medium text-[10px] sm:text-xs hidden sm:table-cell">Date Applied</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-medium text-[10px] sm:text-xs">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-right font-medium text-[10px] sm:text-xs">Action</th>
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
                        className={`group border-t border-gray-100 transition-all duration-300 ${
                          isHighlighted
                            ? "border-blue-500 bg-blue-50/30 hover:bg-blue-50/50"
                            : "hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-white"
                        }`}
                      >
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <div className="flex gap-2 sm:gap-3 md:gap-4">
                            <div className={`flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg ${getLogoBgColor(companyName)} text-white font-bold flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-xs sm:text-sm`}>
                              {getCompanyInitial(companyName)}
                            </div>

                            <div>
                              <div className="flex items-center gap-1 flex-wrap">
                                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-[10px] sm:text-xs">
                                  {job?.jobTitle || "Job Title"}
                                </p>
                                <span className="ml-1 sm:ml-2 rounded-full bg-blue-50 px-1 sm:px-2 py-0.5 text-[8px] sm:text-xs text-blue-600 border border-blue-100 whitespace-nowrap">
                                  {job?.jobType || "Full Time"}
                                </span>
                              </div>
                              <p className="text-[8px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 flex items-center gap-1">
                                <Briefcase className="w-2 h-2 sm:w-3 sm:h-3" />
                                {companyName}
                              </p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 text-[8px] sm:text-xs text-gray-500">
                                <span className="flex items-center gap-0.5 sm:gap-1">
                                  <MapPin className="w-2 h-2 sm:w-3 sm:h-3" />
                                  {screenSize === 'mobile' 
                                    ? job?.location?.city || "N/A"
                                    : `${job?.location?.city || "Not specified"}, ${job?.location?.country || "Not specified"}`}
                                </span>
                                {screenSize !== 'mobile' && (
                                  <>
                                    <span className="text-gray-300 hidden sm:inline">•</span>
                                    <span className="text-gray-400 hidden sm:inline">
                                      {job?.salaryRange?.min 
                                        ? `$${job.salaryRange.min.toLocaleString()}-${job.salaryRange.max.toLocaleString()}` 
                                        : "Salary Negotiable"}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <div className="text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                              <p className="text-[10px] sm:text-xs">{formatDate(app.appliedAt)}</p>
                            </div>
                            <p className="text-[8px] sm:text-xs text-gray-400 mt-1 ml-5">
                              {formatTime(app.appliedAt)}
                            </p>
                          </div>
                        </td>

                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium ${status.bgColor} ${status.color} border border-transparent`}>
                              <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${status.dotColor} animate-pulse`} />
                              {screenSize === 'mobile' ? status.text.slice(0, 3) : status.text}
                            </span>
                            {app.viewedByEmployer && screenSize !== 'mobile' && (
                              <p className="text-[8px] sm:text-xs text-gray-400 flex items-center gap-1">
                                <Eye className="w-2 h-2 sm:w-3 sm:h-3" /> Viewed
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                          <Link
                            href={`/jobs/${job?._id}`}
                            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[8px] sm:text-xs text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            {screenSize === 'mobile' ? 'View' : 'View Details'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 sm:py-16 md:py-20 animate-slideUp">
                <div className="relative inline-block">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Briefcase className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
                  </div>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
                  No applications found
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-5 md:mb-6">
                  {statusFilter !== "All" 
                    ? `No ${statusFilter} applications found` 
                    : "You haven't applied to any jobs yet"}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group text-[10px] sm:text-xs"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>

          {!loading && applications.length > 0 && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 sm:gap-2 border-t border-gray-100 py-3 sm:py-4 text-xs sm:text-sm">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border border-gray-200 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center group"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              
              {Array.from({ length: Math.min(screenSize === 'mobile' ? 3 : 5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= (screenSize === 'mobile' ? 3 : 5)) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 2) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 1) {
                  pageNum = pagination.totalPages - (screenSize === 'mobile' ? 2 : 4) + i;
                } else {
                  pageNum = pagination.currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full transition-all duration-300 text-[10px] sm:text-xs ${
                      pagination.currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-110'
                        : 'border border-gray-200 hover:bg-gray-50'
                    } flex items-center justify-center`}
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
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border border-gray-200 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center group"
                aria-label="Next page"
              >
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {applications.length > 0 && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 animate-slideUp">
            <p className="text-[8px] sm:text-xs text-gray-600 flex items-center gap-1 sm:gap-2">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <span className="font-medium text-blue-600">Tip:</span> 
              {screenSize === 'mobile' 
                ? 'Keep applying!' 
                : 'Keep applying! Your dream job is waiting. 🌟'}
            </p>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}