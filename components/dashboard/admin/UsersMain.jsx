"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiBriefcase,
  FiMail,
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
  FiLock,
  FiUnlock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPieChart,
  FiBarChart2,
  FiUserPlus,
  FiMessageSquare,
  FiClock,
  FiActivity,
  FiGlobe,
  FiMapPin,
  FiPhone,
  FiCamera,
  FiUpload,
  FiSettings,
  FiLogOut,
  FiHome,
  FiLayers,
  FiCreditCard,
} from "react-icons/fi";

const UsersMain = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byRole: [],
    verification: {
      verified: 0,
      unverified: 0
    }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredUser, setHoveredUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
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

  // Animation variants
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

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await adminService.getAllUsers(filters);
      
      if (response && response.success) {
        setUsers(response.users || []);
        setStats(response.stats || { total: 0, byRole: [], verification: { verified: 0, unverified: 0 } });
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalUsers: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.role, filters.status, filters.search, filters.sortBy, filters.sortOrder]);

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
      role: 'all',
      status: 'all',
      search: '',
      page: 1,
      limit: 10,
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

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setDeleteLoading(true);
      await adminService.deleteUser(selectedUser._id);
      
      setUsers(users.filter(user => user._id !== selectedUser._id));
      
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      
      showNotification('User deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification('Failed to delete user', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      showNotification(`User role updated to ${newRole}`, 'success');
    } catch (error) {
      console.error("Error updating role:", error);
      showNotification('Failed to update role', 'error');
    }
  };

  // Get role badge color and icon
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: <FiShield className="w-3 h-3" />,
          label: 'Admin'
        };
      case 'employer':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          icon: <FiBriefcase className="w-3 h-3" />,
          label: 'Employer'
        };
      case 'candidate':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <FiUser className="w-3 h-3" />,
          label: 'Candidate'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: <FiUser className="w-3 h-3" />,
          label: role
        };
    }
  };

  // Get status badge
  const getStatusBadge = (isVerified) => {
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

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading && users.length === 0) {
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
              <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium"
          >
            {screenSize === 'mobile' ? 'Loading...' : 'Loading users...'}
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
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Delete User</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? 
                All associated data will be permanently removed.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
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
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {screenSize === 'mobile' ? 'Manage users' : 'Manage and monitor all users on the platform'}
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
            onClick={fetchUsers}
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
            {(filters.role !== 'all' || filters.status !== 'all' || filters.search) && (
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-xs font-bold">
                1
              </span>
            )}
          </motion.button>
          
          {/* Add user button - hidden on mobile */}
          {screenSize !== 'mobile' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <FiUserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add User</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Total Users */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Users</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.total)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[8px] sm:text-xs bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.verification.verified} Verified
                </span>
                <span className="text-[8px] sm:text-xs bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.verification.unverified} Pending
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Candidates */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Candidates</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {stats.byRole.find(r => r._id === 'candidate')?.count || 0}
              </p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Job seekers</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Employers */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Employers</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {stats.byRole.find(r => r._id === 'employer')?.count || 0}
              </p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Companies hiring</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Admins */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Admins</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {stats.byRole.find(r => r._id === 'admin')?.count || 0}
              </p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">System administrators</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiShield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
                Filter Users
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
                    placeholder={screenSize === 'mobile' ? "Search..." : "Search by name or email..."}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Role Filter */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="candidate">Candidates</option>
                  <option value="employer">Employers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
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
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="email-asc">Email A-Z</option>
                  <option value="email-desc">Email Z-A</option>
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
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
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
              onClick={fetchUsers}
              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Grid/List */}
      <motion.div
        variants={containerVariants}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" 
          : "space-y-3 sm:space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {users.length > 0 ? (
            users.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.isEmailVerified);
              
              return viewMode === 'grid' ? (
                // Grid View
                <motion.div
                  key={user._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4 }}
                  onHoverStart={() => setHoveredUser(user._id)}
                  onHoverEnd={() => setHoveredUser(null)}
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden group"
                >
                  <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${roleBadge.bg}`} />
                  
                  <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                    {/* Avatar */}
                    <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                          {user.avatar || user.profileImage ? (
                            <img 
                              src={user.avatar || user.profileImage} 
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white bg-gradient-to-r ${roleBadge.bg}`}>
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        
                        {/* Status indicator */}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full border-2 border-white ${
                            user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* User info */}
                    <div className="text-center mb-2 sm:mb-3 md:mb-4">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg truncate">{user.name}</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.email}</p>
                      <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 sm:mt-1">
                        Joined {user.createdAt}
                      </p>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4 flex-wrap">
                      <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium text-white flex items-center gap-0.5 sm:gap-1 ${roleBadge.bg}`}>
                        {roleBadge.icon}
                        <span className="hidden sm:inline">{roleBadge.label}</span>
                        <span className="sm:hidden">{roleBadge.label.slice(0, 1)}</span>
                      </span>
                      <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1 ${statusBadge.bg}`}>
                        {statusBadge.icon}
                        <span className="hidden sm:inline">{statusBadge.label}</span>
                        <span className="sm:hidden">{statusBadge.label.slice(0, 1)}</span>
                      </span>
                    </div>
                    
                    {/* Additional info based on role */}
                    {user.role === 'employer' && user.company && (
                      <div className="text-center text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 md:mb-4">
                        <p className="font-medium truncate">{user.company}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">{user.jobsCount || 0} jobs posted</p>
                      </div>
                    )}
                    
                    {user.role === 'candidate' && (
                      <div className="text-center text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3 md:mb-4">
                        <p>{user.applicationsCount || 0} applications</p>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2 sm:pt-3 md:pt-4 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 sm:p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <FiEdit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </motion.button>
                      
                      {user.role !== 'admin' && (
                        <select
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          value={user.role}
                          className="text-[8px] sm:text-[10px] border border-gray-300 rounded-lg px-1 sm:px-2 py-0.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="candidate">Candidate</option>
                          <option value="employer">Employer</option>
                        </select>
                      )}
                      
                      {user.role !== 'admin' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover overlay effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredUser === user._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
                  />
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={user._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 relative"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                        {user.avatar || user.profileImage ? (
                          <img 
                            src={user.avatar || user.profileImage} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-sm sm:text-base font-bold text-white bg-gradient-to-r ${roleBadge.bg}`}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                        user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    
                    {/* User info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-start sm:items-center w-full">
                      <div className="sm:col-span-2">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{user.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium text-white flex items-center gap-1 w-fit ${roleBadge.bg}`}>
                          {roleBadge.icon}
                          <span className="hidden sm:inline">{roleBadge.label}</span>
                          <span className="sm:hidden">{roleBadge.label.slice(0, 1)}</span>
                        </span>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center gap-1 w-fit ${statusBadge.bg}`}>
                          {statusBadge.icon}
                          <span className="hidden sm:inline">{statusBadge.label}</span>
                          <span className="sm:hidden">{statusBadge.label.slice(0, 1)}</span>
                        </span>
                      </div>
                      
                      <div className="sm:col-span-1 text-[8px] sm:text-[10px] text-gray-500">
                        {user.createdAt}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEye className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        </button>
                      )}
                      
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
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
              >
                <FiUsers className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                No users found
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-5 md:mb-6">
                {filters.search || filters.role !== 'all' || filters.status !== 'all'
                  ? "Try adjusting your filters to find what you're looking for"
                  : "There are no users to display at the moment"}
              </p>
              {(filters.search || filters.role !== 'all' || filters.status !== 'all') && (
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
                {Math.min(pagination.currentPage * filters.limit, pagination.totalUsers)}
              </span>{' '}
              of <span className="font-semibold">{pagination.totalUsers}</span> users
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

export default UsersMain;