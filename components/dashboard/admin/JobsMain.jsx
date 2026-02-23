"use client";

import { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";
import { formatDistanceToNow } from "date-fns";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Eye, 
  Users, 
  Clock,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Building2,
  Globe,
  DollarSign,
  Award,
  TrendingUp,
  PieChart,
  BarChart3,
  Sparkles,
  Zap,
  Shield,
  Star,
  Heart,
  Share2,
  Bookmark,
  Download,
  Mail,
  Phone,
  Link2,
  Flag,
  Archive,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Bell,
  Menu,
  Home,
  PlusCircle,
  Edit3,
  Copy,
  Printer,
  Upload,
  DownloadCloud,
  Cloud,
  Sun,
  Moon,
  Wind,
  Feather,
  Flower2,
  Leaf,
  TreePine,
  Mountain,
  Waves,
  Flame,
  Snowflake,
  CloudRain,
  CloudSun,
  CloudMoon,
  Cloudy,
  CloudFog,
  CloudLightning,
  CloudSnow,
  CloudHail,
  CloudDrizzle,
  CloudyIcon,
  CloudCog,
  CloudOff,
  CloudDownload,
  CloudUpload,
  CloudLightningIcon,
  CloudMoonIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudSunIcon,
  CloudyIcon as CloudyIcon2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JobsMain = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    draft: 0,
    closed: 0,
    totalViews: 0,
    totalApplications: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 12,
    sortBy: 'newest',
    type: '',
    location: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [theme, setTheme] = useState('light');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredJob, setHoveredJob] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

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

  const statCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  // Fetch all jobs
  const fetchAllJobs = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await jobService.getAllJobs(filters);
      
      if (response && response.success) {
        setJobs(response.jobs || []);
        setStats(response.stats || {});
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalJobs: 0
        });
        setError(null);
        
        // Show success toast
        showNotification('Jobs loaded successfully!', 'success');
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again.");
      showNotification('Failed to load jobs', 'error');
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchAllJobs();
  }, [filters.page, filters.status, filters.search, filters.sortBy, filters.type, filters.location]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      page: 1,
      limit: 12,
      sortBy: 'newest',
      type: '',
      location: ''
    });
    showNotification('Filters cleared', 'info');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    
    try {
      setDeleteLoading(true);
      await jobService.softDeleteJob(selectedJob._id);
      
      // Remove job from list
      setJobs(jobs.filter(job => job._id !== selectedJob._id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        [selectedJob.status.toLowerCase()]: prev[selectedJob.status.toLowerCase()] - 1
      }));
      
      showNotification('Job deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error deleting job:", error);
      showNotification('Failed to delete job', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Bulk delete selected jobs
  const handleBulkDelete = async () => {
    if (selectedJobs.length === 0) return;
    
    try {
      setDeleteLoading(true);
      
      // Delete all selected jobs
      await Promise.all(selectedJobs.map(jobId => jobService.softDeleteJob(jobId)));
      
      // Remove deleted jobs from list
      setJobs(jobs.filter(job => !selectedJobs.includes(job._id)));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - selectedJobs.length
      }));
      
      showNotification(`${selectedJobs.length} jobs deleted successfully`, 'success');
      setSelectedJobs([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error("Error bulk deleting jobs:", error);
      showNotification('Failed to delete some jobs', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle job selection
  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Select all jobs
  const selectAllJobs = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job._id));
    }
  };

  // Get status badge with icon
  const getStatusBadge = (status, isExpired) => {
    if (isExpired || status === 'Expired') {
      return {
        bg: "bg-gradient-to-r from-gray-100 to-gray-200",
        text: "text-gray-700",
        icon: <Clock className="w-3 h-3" />,
        label: "Expired"
      };
    }
    
    switch (status) {
      case 'Active':
        return {
          bg: "bg-gradient-to-r from-green-100 to-emerald-200",
          text: "text-green-700",
          icon: <Zap className="w-3 h-3" />,
          label: "Active"
        };
      case 'Draft':
        return {
          bg: "bg-gradient-to-r from-yellow-100 to-amber-200",
          text: "text-yellow-700",
          icon: <Edit3 className="w-3 h-3" />,
          label: "Draft"
        };
      case 'Closed':
        return {
          bg: "bg-gradient-to-r from-red-100 to-rose-200",
          text: "text-red-700",
          icon: <XCircle className="w-3 h-3" />,
          label: "Closed"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-gray-200",
          text: "text-gray-700",
          icon: <Briefcase className="w-3 h-3" />,
          label: status
        };
    }
  };

  // Format salary
  const formatSalary = (job) => {
    if (!job.salaryRange) return "Not specified";
    
    const { min, max, currency, isNegotiable } = job.salaryRange;
    
    if (min === 0 && max === 0) {
      return isNegotiable ? "Negotiable" : "Not specified";
    }
    
    const currencySymbol = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'BDT': '৳',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$'
    }[currency] || currency;
    
    if (min && max) {
      return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currencySymbol}${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currencySymbol}${max.toLocaleString()}`;
    }
    
    return isNegotiable ? "Negotiable" : "Not specified";
  };

  // Format date
  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Get gradient based on job type
  const getJobTypeGradient = (type) => {
    const gradients = {
      'Full-time': 'from-blue-500 to-indigo-600',
      'Part-time': 'from-green-500 to-teal-600',
      'Contract': 'from-purple-500 to-pink-600',
      'Temporary': 'from-orange-500 to-red-600',
      'Internship': 'from-cyan-500 to-blue-600',
      'Remote': 'from-emerald-500 to-green-600',
      'Freelance': 'from-violet-500 to-purple-600'
    };
    return gradients[type] || 'from-gray-500 to-gray-600';
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Briefcase className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading amazing opportunities...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              showToast.type === 'success' ? 'bg-green-500' :
              showToast.type === 'error' ? 'bg-red-500' :
              showToast.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
            } text-white`}
          >
            {showToast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {showToast.type === 'error' && <XCircle className="w-5 h-5" />}
            {showToast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{showToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Job</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedJob?.jobTitle}</span>? 
                All associated data will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteJob}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Stats */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl mt-[-80px] shadow-xl border border-gray-200 p-6 mb-6 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 mt-[-40px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-100 to-teal-100 rounded-full blur-3xl opacity-50 -ml-20 -mb-20" />
        
        <div className="relative ">
          <div className="flex flex-col md:flex-row justify-between  items-start md:items-center gap-4 mb-6">
            <div>
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
               All Job
              </motion.h2>
              <p className="text-gray-500 mt-1">Manage and monitor all job postings</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              {/* Refresh button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchAllJobs}
                disabled={refreshing}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              {/* Filter toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {Object.values(filters).filter(v => v && v !== '' && v !== 1 && v !== 12).length > 0 && (
                  <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {Object.values(filters).filter(v => v && v !== '' && v !== 1 && v !== 12).length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          {showStats && (
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
            >
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Briefcase className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Total Jobs</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">📊</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Zap className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Active</p>
                <p className="text-2xl font-bold">{stats.active || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">⚡</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Edit3 className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Draft</p>
                <p className="text-2xl font-bold">{stats.draft || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">📝</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Clock className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Expired</p>
                <p className="text-2xl font-bold">{stats.expired || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">⏰</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <XCircle className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Closed</p>
                <p className="text-2xl font-bold">{stats.closed || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">🔒</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Eye className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">👁️</div>
              </motion.div>
              
              <motion.div
                variants={statCardVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                <Users className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90">Applications</p>
                <p className="text-2xl font-bold">{stats.totalApplications || 0}</p>
                <div className="absolute bottom-2 right-2 text-4xl opacity-10">👥</div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-500" />
                Advanced Filters
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Jobs
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    searchFocused ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostViewed">Most Viewed</option>
                  <option value="mostApplied">Most Applied</option>
                  <option value="expiringSoon">Expiring Soon</option>
                </select>
              </div>
              
              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Per Page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="12">12 per page</option>
                  <option value="24">24 per page</option>
                  <option value="36">36 per page</option>
                  <option value="48">48 per page</option>
                </select>
              </div>
            </div>
            
            {/* Active filters */}
            {Object.values(filters).filter(v => v && v !== '' && v !== 1 && v !== 12).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Search: {filters.search}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('search', '')} />
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Status: {filters.status}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('status', '')} />
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Type: {filters.type}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange('type', '')} />
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl border border-gray-200 px-6 py-3 flex items-center gap-4 z-40"
          >
            <span className="text-sm font-medium text-gray-700">
              {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
            </span>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={selectAllJobs}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {selectedJobs.length === jobs.length ? 'Deselect All' : 'Select All'}
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800">Error Loading Jobs</h4>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchAllJobs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jobs Grid/List */}
      <motion.div
        variants={containerVariants}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              const status = getStatusBadge(job.status, job.isExpired);
              const jobTypeGradient = getJobTypeGradient(job.jobType);
              const isSelected = selectedJobs.includes(job._id);
              
              return viewMode === 'grid' ? (
                // Grid View
                <motion.div
                  key={job._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onHoverStart={() => setHoveredJob(job._id)}
                  onHoverEnd={() => setHoveredJob(null)}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-100 hover:border-blue-200'
                  } overflow-hidden relative group`}
                >
                  {/* Selection checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJobSelection(job._id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Decorative gradient bar */}
                  <div className={`h-2 bg-gradient-to-r ${jobTypeGradient}`} />
                  
                  <div className="p-6">
                    {/* Header with logo and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md"
                        >
                          {job.employer?.avatar ? (
                            <img 
                              src={job.employer.avatar} 
                              alt={job.employer.companyName || job.employer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-8 h-8 text-gray-500" />
                          )}
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                            {job.jobTitle}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {job.employer?.companyName || job.employer?.name || 'Unknown Company'}
                          </p>
                        </div>
                      </div>
                      
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}
                      >
                        {status.icon}
                        {status.label}
                      </motion.span>
                    </div>
                    
                    {/* Job details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="line-clamp-1">
                          {job.location?.city}, {job.location?.country}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{job.jobType}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-green-600">
                          {formatSalary(job)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{job.applicationsCount || 0} applicants</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{job.views || 0} views</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Posted {formatDate(job.postedDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{job.daysRemaining} days left</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            +{job.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Hover overlay effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredJob === job._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
                  />
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={job._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className={`bg-white rounded-xl shadow-md border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-100 hover:border-blue-200'
                  } p-4 relative`}
                >
                  <div className="flex items-center gap-4">
                    {/* Selection checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJobSelection(job._id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {job.employer?.avatar ? (
                        <img 
                          src={job.employer.avatar} 
                          alt={job.employer.companyName || job.employer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    
                    {/* Job info */}
                    <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                      <div className="col-span-2">
                        <h3 className="font-semibold text-gray-900">{job.jobTitle}</h3>
                        <p className="text-sm text-gray-500">{job.employer?.companyName || job.employer?.name}</p>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="line-clamp-1">{job.location?.city}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job)}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${status.bg} ${status.text}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
              >
                <Briefcase className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 mb-6">
                {filters.search || filters.status || filters.type
                  ? "Try adjusting your filters to find what you're looking for"
                  : "There are no jobs to display at the moment"}
              </p>
              {(filters.search || filters.status || filters.type) && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(pagination.currentPage - 1) * filters.limit + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(pagination.currentPage * filters.limit, pagination.totalJobs)}
              </span>{' '}
              of <span className="font-semibold">{pagination.totalJobs}</span> jobs
            </p>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
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
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      pagination.currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobsMain;