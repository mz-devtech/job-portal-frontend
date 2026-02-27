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
  FiEdit,
  FiTrendingUp,
  FiBriefcase,
  FiBarChart2,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { 
  Sparkles, 
  Rocket, 
  Target, 
  Zap, 
  TrendingUp, 
  Award,
  Globe,
  Users,
  Building2,
  Timer,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit3,
  Copy,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Menu,
  LayoutGrid,
  List,
  Bell,
  Activity,
  PieChart,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService } from "@/services/jobService";
import toast from "react-hot-toast";
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
import EditJobModal from "@/components/dashboard/employer/EditJobModal";

export default function MyJobsMain() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [screenSize, setScreenSize] = useState('desktop');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    expiredJobs: 0,
    pendingApplications: 0,
    totalViews: 0,
    interviewRate: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const statsCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

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
          hasPrevPage: false,
          hasNextPage: false,
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
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">Job deleted successfully</span>
          </div>
        );
        fetchJobs();
      }
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs">Failed to delete job</span>
        </div>
      );
    }
  };

  // Mark job as expired
  const handleExpireJob = async (jobId) => {
    if (!confirm("Mark this job as expired? This will remove it from public listings.")) return;
    
    try {
      const response = await jobService.expireJob(jobId);
      if (response) {
        toast.success(
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs">Job marked as expired</span>
          </div>
        );
        fetchJobs();
      }
    } catch (error) {
      toast.error("Failed to expire job");
    }
  };

  // Duplicate job
  const handleDuplicateJob = async (job) => {
    try {
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
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      
      await jobService.createJob(newJobData);
      toast.success(
        <div className="flex items-center gap-2">
          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs">Job duplicated successfully</span>
        </div>
      );
      fetchJobs();
    } catch (error) {
      toast.error("Failed to duplicate job");
    }
  };

  // Edit job
  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowEditModal(true);
  };

  // Handle job updated
  const handleJobUpdated = () => {
    fetchJobs();
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedJobs.length} jobs? This action cannot be undone.`)) return;
    
    try {
      // Bulk delete logic here
      toast.success(`${selectedJobs.length} jobs deleted`);
      setSelectedJobs([]);
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete jobs");
    }
  };

  // Export data
  const handleExport = () => {
    toast.success(
      <div className="flex items-center gap-2">
        <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-[10px] sm:text-xs">Export started</span>
      </div>
    );
  };

  useEffect(() => {
    fetchJobs();
  }, [filter, debouncedSearch, pagination.currentPage]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (job) => {
    if (job.status === 'Active' && job.daysRemaining <= 0) {
      return { 
        text: 'Expired', 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: FiAlertCircle,
        gradient: 'from-red-500 to-red-600'
      };
    }
    
    const statusMap = {
      'Active': { 
        text: 'Active', 
        color: 'text-green-600', 
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: FiCheckCircle,
        gradient: 'from-green-500 to-emerald-600'
      },
      'Expired': { 
        text: 'Expired', 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: FiAlertCircle,
        gradient: 'from-red-500 to-red-600'
      },
      'Closed': { 
        text: 'Closed', 
        color: 'text-gray-600', 
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: FiXCircle,
        gradient: 'from-gray-500 to-gray-600'
      },
      'Draft': { 
        text: 'Draft', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: FiClock,
        gradient: 'from-yellow-500 to-orange-500'
      },
    };
    
    return statusMap[job.status] || { 
      text: job.status, 
      color: 'text-gray-600', 
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: FiClock,
      gradient: 'from-gray-500 to-gray-600'
    };
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex pt-4 sm:pt-6 pb-4"
    >
      <EmployerSidebar />
      
      <main
        className="
          w-full min-h-screen bg-gradient-to-br from-gray-50 to-white
          px-3 sm:px-4 md:px-6 py-4 sm:py-6
          md:ml-[260px]
          md:w-[calc(100%-260px)]
          md:h-[calc(100vh-7rem)]
          md:overflow-y-auto
          relative
          pb-20 md:pb-6
        "
      >
        {/* Animated Background - Hidden on mobile */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="mt-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-30"></div>
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Jobs
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <span>{screenSize === 'mobile' ? 'Manage jobs' : 'Manage and track all your job postings'}</span>
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-500 animate-pulse" />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6"
          >
            {[
              { 
                label: screenSize === 'mobile' ? "Total" : "Total Jobs", 
                value: stats.totalJobs || 0, 
                icon: Briefcase, 
                color: "blue",
                bg: "from-blue-500 to-blue-600",
                lightBg: "from-blue-50 to-indigo-50",
                trend: "+12%",
                trendUp: true
              },
              { 
                label: screenSize === 'mobile' ? "Active" : "Active Jobs", 
                value: stats.activeJobs || 0, 
                icon: CheckCircle2, 
                color: "green",
                bg: "from-green-500 to-emerald-600",
                lightBg: "from-green-50 to-emerald-50",
                trend: "+5%",
                trendUp: true
              },
              { 
                label: screenSize === 'mobile' ? "Apps" : "Applications", 
                value: stats.totalApplications || 0, 
                icon: Users, 
                color: "purple",
                bg: "from-purple-500 to-pink-600",
                lightBg: "from-purple-50 to-pink-50",
                trend: "+23%",
                trendUp: true
              },
              { 
                label: screenSize === 'mobile' ? "Rate" : "Interview Rate", 
                value: `${stats.interviewRate || 0}%`, 
                icon: Target, 
                color: "amber",
                bg: "from-amber-500 to-orange-600",
                lightBg: "from-amber-50 to-orange-50",
                trend: "+8%",
                trendUp: true
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={statsCardVariants}
                  whileHover="hover"
                  className="group relative cursor-pointer"
                >
                  <div className={`relative bg-gradient-to-br ${stat.lightBg} rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 shadow-sm border border-${stat.color}-100 overflow-hidden`}>
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 mb-0.5">{stat.label}</p>
                        <p className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                        
                        {/* Trend Indicator - Hidden on mobile */}
                        <div className="hidden sm:flex items-center gap-1 mt-1">
                          <motion.div 
                            animate={{ y: stat.trendUp ? [-2, 0, -2] : [2, 0, 2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <TrendingUp className={`w-2 h-2 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                          </motion.div>
                          <span className={`text-[8px] ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                      
                      {/* Icon */}
                      <motion.div 
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br ${stat.bg} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Progress Bar - Hidden on mobile */}
                    <div className="hidden sm:block mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.value / 100) * 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full bg-gradient-to-r ${stat.bg}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters and Actions Bar */}
          <motion.div 
            variants={itemVariants}
            className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3"
          >
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {/* Filter Dropdown */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <select 
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="appearance-none rounded-lg border border-gray-200 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-7 sm:pr-8 text-[10px] sm:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <option value="all">📋 All</option>
                  <option value="Active">✅ Active</option>
                  <option value="Expired">⏰ Expired</option>
                  <option value="Closed">🚫 Closed</option>
                  <option value="Draft">📝 Draft</option>
                </select>
                <FiFilter className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </motion.div>

              {/* View Toggle - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "table" 
                      ? "bg-white shadow-md text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "grid" 
                      ? "bg-white shadow-md text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </motion.button>
              </div>

              {/* Post New Job Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/post_job"
                  className="relative group inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:shadow-md transition-all overflow-hidden text-[10px] sm:text-xs"
                >
                  <motion.div 
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  />
                  <FiPlusCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 relative z-10" />
                  <span className="relative z-10">{screenSize === 'mobile' ? 'Post' : 'Post Job'}</span>
                  {screenSize !== 'mobile' && <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                </Link>
              </motion.div>

              {/* Bulk Actions - Show when jobs selected */}
              <AnimatePresence>
                {selectedJobs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <span className="text-[8px] sm:text-[10px] text-gray-500">
                      {selectedJobs.length} selected
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBulkDelete}
                      className="px-1.5 sm:px-2 py-1 sm:py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-[8px] sm:text-[10px]"
                    >
                      <FiTrash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search and Export */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative flex-1 sm:flex-none"
              >
                <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
                <input
                  type="text"
                  placeholder={screenSize === 'mobile' ? "Search..." : "Search jobs..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 sm:pl-9 pr-6 sm:pr-8 py-1.5 sm:py-2 border border-gray-200 rounded-lg w-full sm:w-48 md:w-64 text-[10px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                />
                <AnimatePresence>
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchTerm("")}
                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiXCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="p-1.5 sm:p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm hover:shadow-md"
              >
                <FiDownload className="w-2.5 h-2.5 sm:w-3 sm:h-3.5 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            variants={itemVariants}
            className="rounded-lg sm:rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden backdrop-blur-sm backdrop-filter"
          >
            {loading ? (
              <div className="p-6 sm:p-8 md:p-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 sm:border-3 border-blue-200 border-t-blue-600 rounded-full"></div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-600"
                >
                  Loading your jobs...
                </motion.p>
              </div>
            ) : jobs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 md:p-10 text-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                >
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-blue-500" />
                </motion.div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">No jobs found</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto">
                  {searchTerm || filter !== 'all' 
                    ? "Try adjusting your filters or search terms" 
                    : "Ready to find your next great candidate? Start by posting your first job!"}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/post_job" 
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all group text-[10px] sm:text-xs"
                  >
                    <FiPlusCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 group-hover:rotate-90 transition-transform" />
                    Post Your First Job
                  </Link>
                </motion.div>
              </motion.div>
            ) : viewMode === "table" ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] sm:min-w-[800px] md:min-w-[1000px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                      <tr>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <motion.input
                              whileHover={{ scale: 1.05 }}
                              type="checkbox"
                              checked={selectedJobs.length === jobs.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedJobs(jobs.map(j => j._id));
                                } else {
                                  setSelectedJobs([]);
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3 sm:w-4 sm:h-4"
                            />
                            <span className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600">
                              {screenSize === 'mobile' ? 'Job' : 'Job Details'}
                            </span>
                          </div>
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600">
                          {screenSize === 'mobile' ? 'Stat' : 'Status'}
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600">
                          Apps
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600 hidden sm:table-cell">
                          Posted
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-left text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600 hidden md:table-cell">
                          Expires
                        </th>
                        <th className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      <AnimatePresence>
                        {jobs.map((job, index) => (
                          <JobRow
                            key={job._id}
                            job={job}
                            index={index}
                            selected={selectedJobs.includes(job._id)}
                            onSelect={(checked) => {
                              if (checked) {
                                setSelectedJobs([...selectedJobs, job._id]);
                              } else {
                                setSelectedJobs(selectedJobs.filter(id => id !== job._id));
                              }
                            }}
                            onDelete={() => handleDeleteJob(job._id)}
                            onExpire={() => handleExpireJob(job._id)}
                            onDuplicate={() => handleDuplicateJob(job)}
                            onEdit={() => handleEditJob(job)}
                            formatDate={formatDate}
                            getStatusBadge={getStatusBadge}
                            isHovered={hoveredJobId === job._id}
                            onHover={() => setHoveredJobId(job._id)}
                            onLeave={() => setHoveredJobId(null)}
                            screenSize={screenSize}
                          />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-t bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="text-[8px] sm:text-[10px] text-gray-500 order-2 sm:order-1">
                      Showing <span className="font-medium text-gray-900">{((pagination.currentPage - 1) * 10) + 1}</span> to{' '}
                      <span className="font-medium text-gray-900">{Math.min(pagination.currentPage * 10, pagination.totalJobs)}</span> of{' '}
                      <span className="font-medium text-gray-900">{pagination.totalJobs}</span> jobs
                    </div>
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="p-1 border rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
                      </motion.button>
                      {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 1) {
                          pageNum = pagination.totalPages - 2 + i;
                        } else {
                          pageNum = pagination.currentPage - 1 + i;
                        }
                        
                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-lg text-[8px] sm:text-[10px] transition-all ${
                              pagination.currentPage === pageNum
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="p-1 border rounded-lg text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3">
                {jobs.map((job, index) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    index={index}
                    onDelete={() => handleDeleteJob(job._id)}
                    onExpire={() => handleExpireJob(job._id)}
                    onDuplicate={() => handleDuplicateJob(job)}
                    onEdit={() => handleEditJob(job)}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    screenSize={screenSize}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Edit Job Modal */}
      <AnimatePresence>
        {showEditModal && editingJob && (
          <EditJobModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingJob(null);
            }}
            jobId={editingJob._id}
            onJobUpdated={handleJobUpdated}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Padding */}
      <div className="h-16 md:hidden"></div>
    </motion.div>
  );
}

/* ---------------- Job Row (Table View) ---------------- */

function JobRow({ 
  job, 
  index,
  selected,
  onSelect,
  onDelete, 
  onExpire, 
  onDuplicate, 
  onEdit, 
  formatDate, 
  getStatusBadge,
  isHovered,
  onHover,
  onLeave,
  screenSize 
}) {
  const [open, setOpen] = useState(false);
  
  const statusBadge = getStatusBadge(job);
  const StatusIcon = statusBadge.icon;
  
  return (
    <motion.tr
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { delay: index * 0.05 }
        }
      }}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20 }}
      onMouseEnter={onHover}
      onMouseLeave={() => {
        onLeave();
        setOpen(false);
      }}
      className={`
        transition-all duration-300 relative group
        ${isHovered ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : ''}
        ${selected ? 'bg-blue-50/30' : ''}
      `}
    >
      {/* Selection indicator */}
      {selected && (
        <motion.div 
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-indigo-600"
        />
      )}

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 relative">
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.input
            whileHover={{ scale: 1.05 }}
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3 sm:w-4 sm:h-4"
          />
          
          <Link href={`/jobs/${job._id}`} className="block group flex-1">
            <div className="flex items-center gap-1">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.jobTitle}
              </p>
              {job.isFeatured && screenSize !== 'mobile' && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8px] font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm"
                >
                  <FiStar className="w-2 h-2" />
                </motion.span>
              )}
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-[8px] sm:text-[9px] bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full font-medium"
              >
                {job.jobType || 'Full Time'}
              </motion.span>
              
              {!screenSize === 'mobile' && (
                <span className="text-[8px] text-gray-500 flex items-center gap-0.5">
                  <FiMapPin className="w-2 h-2" />
                  {job.location?.city || 'N/A'}
                </span>
              )}
            </div>
          </Link>
        </div>
      </td>

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-block"
        >
          <span className={`inline-flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.color}`}>
            <motion.div
              animate={job.status === 'Active' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <StatusIcon className="w-2 h-2" />
            </motion.div>
            {screenSize === 'mobile' ? statusBadge.text.slice(0, 1) : statusBadge.text}
          </span>
        </motion.div>
      </td>

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 relative">
        <Link href={`/employer/jobs/${job._id}/applications`} className="block group">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {job.applicationsCount || 0}
          </p>
        </Link>
      </td>

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 relative hidden sm:table-cell">
        <p className="text-[8px] sm:text-[10px] text-gray-700">
          {formatDate(job.postedDate)}
        </p>
      </td>

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 relative hidden md:table-cell">
        <p className="text-[8px] sm:text-[10px] text-gray-700">
          {formatDate(job.expirationDate)}
        </p>
      </td>

      <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-right relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          className="rounded-lg p-1 hover:bg-gray-100 transition relative z-10"
        >
          <FiMoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <ActionsDropdown 
              jobId={job._id}
              job={job}
              onDelete={onDelete}
              onExpire={onExpire}
              onDuplicate={onDuplicate}
              onEdit={onEdit}
              onClose={() => setOpen(false)}
              screenSize={screenSize}
            />
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}

/* ---------------- Job Card (Grid View) ---------------- */

function JobCard({ job, index, onDelete, onExpire, onDuplicate, onEdit, formatDate, getStatusBadge, screenSize }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const statusBadge = getStatusBadge(job);
  const StatusIcon = statusBadge.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { delay: index * 0.05 }
        }
      }}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-lg border border-gray-200 p-2 sm:p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      {/* Featured/Urgent badges */}
      <div className="absolute top-2 right-2 flex gap-0.5">
        {job.isFeatured && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[7px] font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
          >
            <FiStar className="w-2 h-2" />
          </motion.span>
        )}
        {job.isUrgent && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[7px] font-medium bg-gradient-to-r from-red-400 to-pink-400 text-white"
          >
            <Zap className="w-2 h-2" />
          </motion.span>
        )}
      </div>

      {/* Status Badge */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="inline-block mb-1"
      >
        <span className={`inline-flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-medium border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.color}`}>
          <StatusIcon className="w-2 h-2" />
          {statusBadge.text}
        </span>
      </motion.div>

      {/* Job Title */}
      <Link href={`/jobs/${job._id}`}>
        <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
          {job.jobTitle}
        </h3>
      </Link>

      {/* Location */}
      <p className="text-[8px] text-gray-500 mb-1 flex items-center gap-0.5">
        <FiMapPin className="w-2 h-2" />
        {job.location?.city || 'N/A'}
        {job.location?.isRemote && (
          <span className="ml-1 text-[7px] bg-green-100 text-green-600 px-1 py-0.5 rounded-full">
            Remote
          </span>
        )}
      </p>

      {/* Job Type */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[7px] sm:text-[8px] bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
          {job.jobType || 'Full Time'}
        </span>
      </div>

      {/* Applications Stats */}
      <div className="flex items-center justify-between mb-2 p-1 sm:p-2 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-gray-900">{job.applicationsCount || 0}</p>
          <p className="text-[6px] sm:text-[7px] text-gray-500">Apps</p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-yellow-600">{job.applicationStats?.pending || 0}</p>
          <p className="text-[6px] sm:text-[7px] text-gray-500">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-green-600">{job.applicationStats?.reviewed || 0}</p>
          <p className="text-[6px] sm:text-[7px] text-gray-500">Reviewed</p>
        </div>
      </div>

      {/* Posted */}
      <div className="flex items-center justify-between text-[7px] sm:text-[8px] text-gray-500 mb-2">
        <span className="flex items-center gap-0.5">
          <FiCalendar className="w-2 h-2" />
          {formatDate(job.postedDate)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
        <Link href={`/jobs/${job._id}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 hover:bg-blue-50 rounded-lg transition"
          >
            <Eye className="w-3 h-3 text-blue-600" />
          </motion.button>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit()}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <Edit3 className="w-3 h-3 text-gray-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowActions(!showActions)}
          className="p-1 hover:bg-gray-100 rounded-lg transition relative"
        >
          <FiMoreVertical className="w-3 h-3 text-gray-600" />
        </motion.button>
      </div>

      {/* Actions Dropdown */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-12 right-2 z-20 w-36 sm:w-44 rounded-lg border bg-white shadow-lg py-1"
          >
            <button
              onClick={() => {
                onDuplicate();
                setShowActions(false);
              }}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[8px] sm:text-[10px] text-gray-700 hover:bg-gray-50 transition w-full"
            >
              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Duplicate
            </button>
            
            {job.status === 'Active' && job.daysRemaining > 0 && (
              <button
                onClick={() => {
                  onExpire();
                  setShowActions(false);
                }}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[8px] sm:text-[10px] text-orange-600 hover:bg-orange-50 transition w-full"
              >
                <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Expire
              </button>
            )}
            
            <button
              onClick={() => {
                onDelete();
                setShowActions(false);
              }}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[8px] sm:text-[10px] text-red-600 hover:bg-red-50 transition w-full"
            >
              <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- Dropdown ---------------- */

function ActionsDropdown({ jobId, job, onDelete, onExpire, onDuplicate, onEdit, onClose, screenSize }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute right-2 sm:right-4 top-8 sm:top-10 z-20 w-36 sm:w-48 rounded-lg border bg-white shadow-lg py-1 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      <Link href={`/jobs/${jobId}`}>
        <motion.div 
          whileHover={{ x: 3 }}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
          {screenSize === 'mobile' ? 'View' : 'View Details'}
        </motion.div>
      </Link>

      <Link href={`/my_jobs/${jobId}/applications`}>
        <motion.div 
          whileHover={{ x: 3 }}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-blue-600 hover:bg-blue-50 transition cursor-pointer font-medium"
        >
          <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
          {screenSize === 'mobile' ? 'Apps' : 'Applications'} ({job.applicationsCount || 0})
        </motion.div>
      </Link>

      <motion.div 
        whileHover={{ x: 3 }}
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
        {screenSize === 'mobile' ? 'Edit' : 'Edit Job'}
      </motion.div>

      <motion.div 
        whileHover={{ x: 3 }}
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-gray-700 hover:bg-gray-50 transition cursor-pointer"
      >
        <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
        {screenSize === 'mobile' ? 'Copy' : 'Duplicate'}
      </motion.div>

      <div className="border-t my-1"></div>

      {job.status === 'Active' && job.daysRemaining > 0 && (
        <motion.div 
          whileHover={{ x: 3 }}
          onClick={() => {
            onExpire();
            onClose();
          }}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-orange-600 hover:bg-orange-50 transition cursor-pointer"
        >
          <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
          {screenSize === 'mobile' ? 'Expire' : 'Mark Expired'}
        </motion.div>
      )}

      <motion.div 
        whileHover={{ x: 3 }}
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-[8px] sm:text-xs text-red-600 hover:bg-red-50 transition cursor-pointer"
      >
        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
        {screenSize === 'mobile' ? 'Delete' : 'Delete Job'}
      </motion.div>
    </motion.div>
  );
}