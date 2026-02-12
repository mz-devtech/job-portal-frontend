"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiMoreVertical,
  FiBriefcase,
  FiUsers,
  FiPlusCircle,
  FiEye,
  FiXCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiUserPlus,
  FiStar,
  FiMapPin,
  FiBookmark,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { jobService } from "@/services/jobService";
import { profileService } from "@/services/profileService";
import toast from "react-hot-toast";

export default function EmployerMain() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    savedCandidates: 0,
  });
  const [loading, setLoading] = useState({
    jobs: true,
    candidates: true,
    stats: true,
  });

  // Fetch employer dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch employer jobs stats
      setLoading(prev => ({ ...prev, jobs: true, stats: true }));
      
      // Get employer jobs with limit 5 for recent jobs
      const jobsResponse = await jobService.getEmployerJobs({ 
        page: 1, 
        limit: 5,
        sortBy: 'postedDate',
        sortOrder: 'desc'
      });
      
      if (jobsResponse.success) {
        setRecentJobs(jobsResponse.jobs || []);
        setStats(prev => ({
          ...prev,
          totalJobs: jobsResponse.stats?.totalJobs || 0,
          activeJobs: jobsResponse.stats?.activeJobs || 0,
          totalApplications: jobsResponse.stats?.totalApplications || 0,
          pendingApplications: jobsResponse.stats?.pendingApplications || 0,
        }));
      }

      // Fetch saved candidates count FIRST (lighter API call)
      setLoading(prev => ({ ...prev, stats: true }));
      try {
        const savedCount = await profileService.getSavedCandidatesCount();
        setStats(prev => ({
          ...prev,
          savedCandidates: savedCount || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch saved candidates count:", error);
        setStats(prev => ({ ...prev, savedCandidates: 0 }));
      }

      // Fetch saved candidates list (only if we have saved candidates)
      setLoading(prev => ({ ...prev, candidates: true }));
      try {
        // First check if we have any saved candidates
        const savedCount = stats.savedCandidates > 0 ? stats.savedCandidates : await profileService.getSavedCandidatesCount();
        
        if (savedCount > 0) {
          const savedResponse = await profileService.getSavedCandidates({ 
            page: 1, 
            limit: 6
          });
          
          if (savedResponse.success) {
            setSavedCandidates(savedResponse.savedCandidates || []);
            // Update count again from pagination to be sure
            setStats(prev => ({
              ...prev,
              savedCandidates: savedResponse.pagination?.totalSaved || savedCount,
            }));
          }
        } else {
          setSavedCandidates([]);
        }
      } catch (error) {
        console.error("Failed to fetch saved candidates list:", error);
        setSavedCandidates([]);
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading({
        jobs: false,
        candidates: false,
        stats: false,
      });
    }
  };

  // Handle unsave candidate
  const handleUnsaveCandidate = async (candidateId) => {
    try {
      await profileService.unsaveCandidate(candidateId);
      // Remove from list and update count
      setSavedCandidates(prev => prev.filter(c => c.candidate?._id !== candidateId));
      setStats(prev => ({
        ...prev,
        savedCandidates: Math.max(0, prev.savedCandidates - 1)
      }));
      toast.success("Candidate removed from saved list");
    } catch (error) {
      console.error("Failed to unsave candidate:", error);
      toast.error("Failed to unsave candidate");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
  };

  // Get status badge for jobs
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

  // Get user name from localStorage
  const getUserName = () => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return user.name?.split(' ')[0] || 'Employer';
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return 'Employer';
  };

  return (
    <main
      className="
        mt-28
        w-full
        min-h-screen
        bg-gray-50
        px-4 py-4
        sm:px-6 sm:py-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)]
        md:overflow-y-auto
      "
    >
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {getUserName()}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your job postings today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={<FiBriefcase className="w-5 h-5" />}
          bg="bg-blue-50"
          iconBg="bg-blue-100 text-blue-600"
          link="/employer/my-jobs?status=Active"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          icon={<FiUsers className="w-5 h-5" />}
          bg="bg-purple-50"
          iconBg="bg-purple-100 text-purple-600"
          link="/employer/my-jobs"
        />
        <StatCard
          title="Pending Reviews"
          value={stats.pendingApplications}
          icon={<FiClock className="w-5 h-5" />}
          bg="bg-yellow-50"
          iconBg="bg-yellow-100 text-yellow-600"
          link="/employer/my-jobs"
        />
        <StatCard
          title="Saved Candidates"
          value={stats.savedCandidates}
          icon={<FiUserPlus className="w-5 h-5" />}
          bg="bg-green-50"
          iconBg="bg-green-100 text-green-600"
          link="/employer/saved-candidates"
        />
      </div>

      {/* Full Width - Recent Jobs */}
      <div className="w-full mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Recently Posted Jobs</h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                {stats.activeJobs} Active
              </span>
            </div>
            <Link 
              href="/employer/my-jobs" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View all jobs
              <span className="text-lg leading-none">→</span>
            </Link>
          </div>

          {/* Jobs List */}
          {loading.jobs ? (
            <div className="p-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your jobs...</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-base font-semibold text-gray-700 mb-2">No jobs posted yet</h4>
              <p className="text-sm text-gray-500 mb-6">Start posting jobs to attract candidates</p>
              <Link 
                href="/post-job" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <FiPlusCircle className="w-4 h-4 mr-2" />
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <RecentJobRow 
                  key={job._id} 
                  job={job} 
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          title="Post a New Job"
          description="Create a new job posting"
          icon={<FiPlusCircle className="w-5 h-5" />}
          href="/post-job"
          color="bg-blue-600 hover:bg-blue-700"
        />
        <QuickActionCard
          title="Find Candidates"
          description="Search through candidate database"
          icon={<FiUsers className="w-5 h-5" />}
          href="/candidates"
          color="bg-purple-600 hover:bg-purple-700"
        />
        <QuickActionCard
          title="View Applications"
          description="Review new applications"
          icon={<FiEye className="w-5 h-5" />}
          href="/employer/my-jobs"
          color="bg-green-600 hover:bg-green-700"
        />
        <QuickActionCard
          title="Company Profile"
          description="Update your company info"
          icon={<FiBriefcase className="w-5 h-5" />}
          href="/employer/profile"
          color="bg-orange-600 hover:bg-orange-700"
        />
      </div>
    </main>
  );
}

/* ============================================ */
/* STAT CARD COMPONENT */
/* ============================================ */
function StatCard({ title, value, icon, bg, iconBg, link }) {
  const CardContent = () => (
    <div className={`flex items-center justify-between rounded-lg p-5 ${bg} hover:shadow-md transition cursor-pointer`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value || 0}</p>
      </div>
      <div className={`rounded-md p-3 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );

  return link ? (
    <Link href={link}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
}

/* ============================================ */
/* RECENT JOB ROW COMPONENT */
/* ============================================ */
function RecentJobRow({ job, formatDate, getStatusBadge }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const statusBadge = getStatusBadge(job);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job._id}`} className="group">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                {job.jobTitle}
              </h4>
            </Link>
            {job.isFeatured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                <FiStar className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
            {job.isHighlighted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Highlighted
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {job.jobType || 'Full Time'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FiMapPin className="w-3 h-3" />
              {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
            </span>
            {job.location?.isRemote && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                Remote
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3">
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusBadge.text}
            </span>
            <span className="text-xs text-gray-500">
              Posted {formatDate(job.postedDate)}
            </span>
            {job.daysRemaining > 0 && job.status === 'Active' && (
              <span className="text-xs text-orange-600">
                {job.daysRemaining} days left
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={`/employer/jobs/${job._id}/applications`}
            className="text-right group"
          >
            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
              {job.applicationsCount || 0}
            </p>
            <p className="text-xs text-gray-500 group-hover:text-blue-600 transition">
              Applications
            </p>
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showDropdown && (
              <RecentJobActionsDropdown 
                jobId={job._id}
                job={job}
                onClose={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================ */
/* RECENT JOB ACTIONS DROPDOWN */
/* ============================================ */
function RecentJobActionsDropdown({ jobId, job, onClose }) {
  return (
    <div
      className="absolute right-0 top-8 z-20 w-56 rounded-lg border bg-white shadow-lg py-1"
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
          <FiEdit className="w-4 h-4" />
          Edit Job
        </div>
      </Link>

      <div className="border-t my-1"></div>

      {job.status === 'Active' && job.daysRemaining > 0 && (
        <Link href={`/employer/jobs/${jobId}/expire`}>
          <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition cursor-pointer">
            <FiXCircle className="w-4 h-4" />
            Mark as Expired
          </div>
        </Link>
      )}

      <Link href={`/employer/jobs/${jobId}/delete`}>
        <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer">
          <FiTrash2 className="w-4 h-4" />
          Delete Job
        </div>
      </Link>
    </div>
  );
}

/* ============================================ */
/* QUICK ACTION CARD COMPONENT */
/* ============================================ */
function QuickActionCard({ title, description, icon, href, color }) {
  return (
    <Link href={href}>
      <div className={`${color} rounded-lg p-5 text-white transition shadow-sm hover:shadow-md cursor-pointer`}>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          <span className="text-white/60 text-lg leading-none">→</span>
        </div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </Link>
  );
}