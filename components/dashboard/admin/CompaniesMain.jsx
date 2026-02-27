"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPieChart,
  FiBarChart2,
  FiGlobe,
  FiPhone,
  FiCamera,
  FiUpload,
  FiSettings,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiGithub,
  FiDollarSign,
  FiClock,
  FiUserCheck,
  FiUserPlus,
  FiActivity,
  FiLayers,
  FiCreditCard,
  FiMap,
  FiNavigation,
  FiPackage,
  FiTruck,
  FiShoppingBag,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMessageSquare,
  FiBell,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

// Define static animation variants outside component to prevent recreation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
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
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
};

// Missing FiZap icon import - add it if needed
const FiZap = (props) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const CompaniesMain = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    byIndustry: []
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filters
  const [filters, setFilters] = useState({
    verified: 'all',
    industry: 'all',
    search: '',
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

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

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Industry options - defined as const outside component or memoized
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Hospitality",
    "Transportation",
    "Media",
    "Construction",
    "Energy",
    "Agriculture",
    "Telecommunications",
    "Automotive",
    "Other"
  ];

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await adminService.getAllCompanies(filters);
      
      if (response && response.success) {
        setCompanies(response.companies || []);
        setStats(response.stats || { total: 0, verified: 0, pending: 0, byIndustry: [] });
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCompanies: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to load companies. Please try again.");
      showNotification('Failed to load companies', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filters.page, filters.verified, filters.industry, filters.search, filters.sortBy, filters.sortOrder]);

  // Show notification
  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      verified: 'all',
      industry: 'all',
      search: '',
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
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

  // Handle company deletion
  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;
    
    try {
      setDeleteLoading(true);
      await adminService.deleteCompany(selectedCompany._id);
      
      setCompanies(companies.filter(company => company._id !== selectedCompany._id));
      
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        [selectedCompany.isProfileComplete ? 'verified' : 'pending']: 
          prev[selectedCompany.isProfileComplete ? 'verified' : 'pending'] - 1
      }));
      
      showNotification('Company deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error("Error deleting company:", error);
      showNotification('Failed to delete company', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle company verification
  const handleVerifyCompany = async (companyId) => {
    try {
      await adminService.verifyCompany(companyId);
      
      setCompanies(companies.map(company => 
        company._id === companyId 
          ? { ...company, isProfileComplete: true, completionPercentage: 100 }
          : company
      ));
      
      setStats(prev => ({
        ...prev,
        verified: prev.verified + 1,
        pending: prev.pending - 1
      }));
      
      showNotification('Company verified successfully', 'success');
    } catch (error) {
      console.error("Error verifying company:", error);
      showNotification('Failed to verify company', 'error');
    }
  };

  // Get verification badge
  const getVerificationBadge = (isVerified) => {
    return isVerified ? {
      bg: 'bg-green-100 text-green-600',
      icon: <FiCheckCircle className="w-3 h-3" />,
      label: 'Verified'
    } : {
      bg: 'bg-yellow-100 text-yellow-600',
      icon: <FiAlertCircle className="w-3 h-3" />,
      label: 'Pending'
    };
  };

  // Format number - deterministic function without Date.now() or Math.random()
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Get industry icon
  const getIndustryIcon = (industry) => {
    const icons = {
      'Technology': <FiLayers className="w-4 h-4" />,
      'Finance': <FiDollarSign className="w-4 h-4" />,
      'Healthcare': <FiHeart className="w-4 h-4" />,
      'Education': <FiBookmark className="w-4 h-4" />,
      'Retail': <FiShoppingBag className="w-4 h-4" />,
      'Manufacturing': <FiPackage className="w-4 h-4" />,
      'Real Estate': <FiHome className="w-4 h-4" />,
      'Hospitality': <FiUsers className="w-4 h-4" />,
      'Transportation': <FiTruck className="w-4 h-4" />,
      'Media': <FiCamera className="w-4 h-4" />,
      'Construction': <FiNavigation className="w-4 h-4" />,
      'Energy': <FiZap className="w-4 h-4" />,
      'Agriculture': <FiMap className="w-4 h-4" />,
      'Telecommunications': <FiMessageSquare className="w-4 h-4" />,
      'Automotive': <FiTruck className="w-4 h-4" />
    };
    return icons[industry] || <FiBriefcase className="w-4 h-4" />;
  };

  // Don't render until after mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiHome className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium">
            Loading companies...
          </p>
        </div>
      </div>
    );
  }

  if (loading && companies.length === 0) {
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
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiHome className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium"
          >
            {screenSize === 'mobile' ? 'Loading...' : 'Loading companies...'}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 ${
              showToast.type === 'success' ? 'bg-green-500' :
              showToast.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white text-xs sm:text-sm`}
          >
            {showToast.type === 'success' && <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            {showToast.type === 'error' && <FiXCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
            {showToast.type === 'info' && <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Delete Company</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCompany?.companyName}</span>? 
                All jobs and associated data will be permanently removed.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCompany}
                  disabled={deleteLoading}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <FiRefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span className="hidden sm:inline">Deleting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{screenSize === 'mobile' ? 'Delete' : 'Delete'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mt-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Company Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {screenSize === 'mobile' ? 'Manage companies' : 'Manage and monitor all registered companies'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* View mode toggle - hidden on mobile */}
          {screenSize !== 'mobile' && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-md text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCompanies}
            disabled={refreshing}
            className="p-1.5 sm:p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {/* Filter toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md text-xs sm:text-sm"
          >
            <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Show'} Filters</span>
            <span className="sm:hidden">Filter</span>
            {(filters.verified !== 'all' || filters.industry !== 'all' || filters.search) && (
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-xs font-bold">
                1
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Total Companies */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Companies</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.total)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[8px] sm:text-xs bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.verified} Verified
                </span>
                <span className="text-[8px] sm:text-xs bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.pending} Pending
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiHome className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Verified Companies */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Verified Companies</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.verified)}</p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Trusted employers</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Pending Verification */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Pending Verification</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.pending)}</p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Awaiting review</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiClock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Total Jobs Posted */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Jobs Posted</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {companies.reduce((acc, company) => acc + (company.jobsCount || 0), 0)}
              </p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Across all companies</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-4 sm:p-5 md:p-6"
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiFilter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Filter Companies
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    placeholder={screenSize === 'mobile' ? "Search..." : "Search by company name, email..."}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Verification Filter */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Verification Status
                </label>
                <select
                  value={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.value)}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Companies</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>
              
              {/* Industry Filter */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="companyInfo.companyName-asc">Name A-Z</option>
                  <option value="companyInfo.companyName-desc">Name Z-A</option>
                  <option value="jobsCount-desc">Most Jobs</option>
                  <option value="jobsCount-asc">Least Jobs</option>
                </select>
              </div>
            </div>
            
            {/* Items per page */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-4">
              <label className="text-[10px] sm:text-xs font-medium text-gray-700">
                Show:
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
                <option value="48">48</option>
              </select>
              <span className="text-[10px] sm:text-xs text-gray-500">per page</span>
            </div>
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
            className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
          >
            <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-[10px] sm:text-xs flex-1">{error}</p>
            <button
              onClick={fetchCompanies}
              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Companies Grid/List */}
      <motion.div
        variants={containerVariants}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" 
          : "space-y-3 sm:space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {companies.length > 0 ? (
            companies.map((company) => {
              const verificationBadge = getVerificationBadge(company.isProfileComplete);
              
              return viewMode === 'grid' ? (
                // Grid View
                <motion.div
                  key={company._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4 }}
                  onHoverStart={() => setHoveredCompany(company._id)}
                  onHoverEnd={() => setHoveredCompany(null)}
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden group"
                >
                  {/* Banner/Header */}
                  <div className="relative h-16 sm:h-20 md:h-24 bg-gradient-to-r from-blue-500 to-purple-600">
                    {company.banner && (
                      <img 
                        src={company.banner} 
                        alt={company.companyName}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* Logo */}
                    <div className="absolute -bottom-5 sm:-bottom-6 md:-bottom-8 left-2 sm:left-3 md:left-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-2 sm:border-3 md:border-4 border-white">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={company.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <FiHome className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Verification badge */}
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      <span className={`px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1 ${verificationBadge.bg}`}>
                        {verificationBadge.icon}
                        {screenSize === 'mobile' ? verificationBadge.label.slice(0, 1) : verificationBadge.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6 sm:pt-7 md:pt-8 lg:pt-10 p-3 sm:p-4">
                    {/* Company info */}
                    <div className="mb-2 sm:mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">{company.companyName}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 mt-0.5 sm:mt-1">
                        <FiMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="truncate">{company.location || 'Location not specified'}</span>
                      </p>
                    </div>
                    
                    {/* Industry and size */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                      <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[8px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1">
                        {getIndustryIcon(company.industryType)}
                        <span className="truncate max-w-[60px] sm:max-w-[80px]">{company.industryType}</span>
                      </span>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[8px] sm:text-[10px]">
                        {company.teamSize} emp
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                      <div className="text-center">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{company.jobsCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Jobs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{company.activeJobsCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{company.applicationsCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Apps</p>
                      </div>
                    </div>
                    
                    {/* Contact info - show only on desktop */}
                    {screenSize !== 'mobile' && (
                      <div className="space-y-1 mb-3 sm:mb-4 text-[10px] sm:text-xs">
                        {company.email && (
                          <p className="text-gray-600 flex items-center gap-1 sm:gap-2">
                            <FiMail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                            <span className="truncate">{company.email}</span>
                          </p>
                        )}
                        {company.phone && (
                          <p className="text-gray-600 flex items-center gap-1 sm:gap-2">
                            <FiPhone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                            {company.phone}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Joined date */}
                    <p className="text-[8px] sm:text-[10px] text-gray-400 mb-3 sm:mb-4">
                      Joined {company.joinedDate}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowCompanyModal(true);
                        }}
                        className="flex-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1"
                      >
                        <FiEye className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        <span>{screenSize === 'mobile' ? '' : 'View'}</span>
                      </motion.button>
                      
                      {!company.isProfileComplete && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVerifyCompany(company._id)}
                          className="flex-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1"
                        >
                          <FiCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Hover overlay effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCompany === company._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
                  />
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={company._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 relative"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Logo */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiHome className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Company info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 items-start sm:items-center w-full">
                      <div className="sm:col-span-2">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{company.companyName}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <FiMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {company.location || 'N/A'}
                        </p>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-600 rounded-lg text-[8px] sm:text-xs">
                          {company.industryType}
                        </span>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[8px] sm:text-xs font-medium flex items-center gap-1 w-fit ${verificationBadge.bg}`}>
                          {verificationBadge.icon}
                          {verificationBadge.label}
                        </span>
                      </div>
                      
                      <div className="sm:col-span-1 text-center">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{company.jobsCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Jobs</p>
                      </div>
                      
                      <div className="sm:col-span-1 text-center">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{company.applicationsCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Apps</p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowCompanyModal(true);
                        }}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      {!company.isProfileComplete && (
                        <button
                          onClick={() => handleVerifyCompany(company._id)}
                          className="p-1 sm:p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <button className="p-1 sm:p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <FiMoreVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
              >
                <FiHome className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                No companies found
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-5 md:mb-6">
                {filters.search || filters.verified !== 'all' || filters.industry !== 'all'
                  ? "Try adjusting your filters to find what you're looking for"
                  : "There are no companies to display at the moment"}
              </p>
              {(filters.search || filters.verified !== 'all' || filters.industry !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md text-[10px] sm:text-xs"
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
          className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-gray-600">
              Showing <span className="font-semibold">{(pagination.currentPage - 1) * filters.limit + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(pagination.currentPage * filters.limit, pagination.totalCompanies)}
              </span>{' '}
              of <span className="font-semibold">{pagination.totalCompanies}</span> companies
            </p>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-1.5 sm:p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
              
              {[...Array(Math.min(screenSize === 'mobile' ? 3 : 5, pagination.totalPages))].map((_, i) => {
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
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
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
                className="p-1.5 sm:p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CompaniesMain;