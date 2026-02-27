"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBriefcase,
  FiUsers,
  FiHome,
  FiLayers,
  FiTrendingUp,
  FiPieChart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDollarSign,
  FiEye,
  FiUserCheck,
  FiUserPlus,
  FiFileText,
  FiCalendar,
  FiMapPin,
  FiStar,
  FiAward,
  FiZap,
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiDownload,
  FiMoreVertical,
  FiChevronRight,
  FiChevronLeft,
  FiBell,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";

// Chart components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";

const OverviewAdminMain = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    overview: {
      totalJobs: 0,
      totalUsers: 0,
      totalEmployers: 0,
      totalCompanies: 0,
      totalCategories: 0,
      totalApplications: 0
    },
    jobs: {
      active: 0,
      expired: 0,
      draft: 0,
      total: 0,
      byType: []
    },
    users: {
      verified: 0,
      pending: 0,
      total: 0,
      employers: 0
    },
    companies: {
      verified: 0,
      pending: 0,
      total: 0
    },
    applications: {
      pending: 0,
      reviewed: 0,
      hired: 0,
      total: 0
    },
    charts: {
      monthlyJobs: [],
      monthlyUsers: []
    },
    recent: {
      jobs: [],
      users: [],
      applications: []
    }
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [timeRange, setTimeRange] = useState("6months");
  const [chartType, setChartType] = useState("area");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("all");
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

  // Colors for charts
  const COLORS = {
    primary: "#3B82F6",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#8B5CF6",
    purple: "#8B5CF6",
    pink: "#EC4899",
    orange: "#F97316",
    teal: "#14B8A6",
    cyan: "#06B6D4",
    indigo: "#6366F1",
    violet: "#8B5CF6",
    fuchsia: "#D946EF",
    rose: "#F43F5E",
    amber: "#FBBF24",
    lime: "#84CC16",
    emerald: "#10B981",
  };

  const CHART_COLORS = [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.danger,
    COLORS.info,
    COLORS.purple,
    COLORS.pink,
    COLORS.orange,
    COLORS.teal,
    COLORS.cyan,
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const statCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 },
    },
  };

  // Fetch data
  const fetchStats = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const data = await adminService.getAdminStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Prepare chart data
  const getMonthlyChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    for (let i = 0; i < 6; i++) {
      const monthIndex = (new Date().getMonth() - i + 12) % 12;
      data.unshift({
        month: months[monthIndex],
        jobs: stats.charts.monthlyJobs.find(m => m.month === monthIndex + 1)?.count || 0,
        users: stats.charts.monthlyUsers.find(m => m.month === monthIndex + 1)?.count || 0,
      });
    }
    
    return data;
  };

  // Get job distribution data
  const getJobTypeData = () => {
    return stats.jobs.byType.map((item, index) => ({
      name: item._id,
      value: item.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-[10px] sm:text-xs font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-[8px] sm:text-xs font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#333" className="text-xs sm:text-sm font-bold">
          {value}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + (screenSize === 'mobile' ? 5 : 10)}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + (screenSize === 'mobile' ? 6 : 12)}
          outerRadius={outerRadius + (screenSize === 'mobile' ? 7 : 14)}
          fill={fill}
        />
      </g>
    );
  };

  if (loading) {
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
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium"
          >
            {screenSize === 'mobile' ? 'Loading...' : 'Loading dashboard data...'}
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {screenSize === 'mobile' ? 'Platform overview' : "Welcome back! Here's what's happening with your platform."}
          </p>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 w-full sm:w-auto">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="flex-1 sm:flex-none px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-white border border-gray-200 rounded-lg text-[10px] sm:text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">7d</option>
            <option value="30days">30d</option>
            <option value="6months">6m</option>
            <option value="1year">1y</option>
          </select>
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStats}
            disabled={refreshing}
            className="p-1 sm:p-1.5 md:p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {/* Download report - hidden on mobile */}
          {screenSize !== 'mobile' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs"
            >
              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
              {screenSize === 'tablet' ? 'Export' : 'Export Report'}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Error message */}
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
              onClick={fetchStats}
              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {/* Total Jobs */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] sm:text-xs opacity-90 mb-0.5 sm:mb-1">Total Jobs</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{formatNumber(stats.overview.totalJobs)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.jobs.active} Active
                </span>
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.jobs.expired} Expired
                </span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg">
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] sm:text-xs opacity-90 mb-0.5 sm:mb-1">Total Users</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{formatNumber(stats.overview.totalUsers)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.users.verified} Verified
                </span>
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.users.pending} Pending
                </span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg">
              <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Total Companies */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] sm:text-xs opacity-90 mb-0.5 sm:mb-1">Total Companies</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{formatNumber(stats.overview.totalCompanies)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.companies.verified} Verified
                </span>
                <span className="text-[6px] sm:text-[10px] bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.companies.pending} Pending
                </span>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg">
              <FiHome className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        {/* Total Categories */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[8px] sm:text-xs opacity-90 mb-0.5 sm:mb-1">Categories</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{stats.overview.totalCategories}</p>
              <p className="text-[6px] sm:text-[10px] opacity-75 mt-1">Active job categories</p>
            </div>
            <div className="p-1.5 sm:p-2 md:p-3 bg-white/20 rounded-lg">
              <FiLayers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Applications */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200 relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
            <div>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Total Applications</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{stats.applications.total}</p>
            </div>
            <div className="p-1.5 sm:p-2 md:p-3 bg-blue-100 rounded-lg">
              <FiFileText className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <span className="text-gray-600">Pending</span>
              <span className="font-medium text-gray-900">{stats.applications.pending}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.applications.pending / stats.applications.total) * 100 || 0}%` }}
                className="bg-yellow-500 h-1 sm:h-1.5 rounded-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs mt-1 sm:mt-2">
              <span className="text-gray-600">Reviewed</span>
              <span className="font-medium text-gray-900">{stats.applications.reviewed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.applications.reviewed / stats.applications.total) * 100 || 0}%` }}
                className="bg-blue-500 h-1 sm:h-1.5 rounded-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs mt-1 sm:mt-2">
              <span className="text-gray-600">Hired</span>
              <span className="font-medium text-gray-900">{stats.applications.hired}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.applications.hired / stats.applications.total) * 100 || 0}%` }}
                className="bg-green-500 h-1 sm:h-1.5 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Job Status Distribution */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-2 sm:mb-3 md:mb-4">Job Status Distribution</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Active</span>
              </div>
              <span className="font-medium text-gray-900">{stats.jobs.active}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 md:h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.jobs.active / stats.jobs.total) * 100 || 0}%` }}
                className="bg-green-500 h-1 sm:h-1.5 md:h-2 rounded-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-600">Draft</span>
              </div>
              <span className="font-medium text-gray-900">{stats.jobs.draft}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 md:h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.jobs.draft / stats.jobs.total) * 100 || 0}%` }}
                className="bg-yellow-500 h-1 sm:h-1.5 md:h-2 rounded-full"
              />
            </div>
            
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-500" />
                <span className="text-gray-600">Expired</span>
              </div>
              <span className="font-medium text-gray-900">{stats.jobs.expired}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 md:h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.jobs.expired / stats.jobs.total) * 100 || 0}%` }}
                className="bg-gray-500 h-1 sm:h-1.5 md:h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mb-2 sm:mb-3 md:mb-4">Quick Stats</h3>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <FiUserCheck className="text-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-gray-600">Employers</span>
              </div>
              <span className="font-medium text-gray-900">{stats.users.employers}</span>
            </div>
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <FiEye className="text-purple-500 w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-gray-600">Avg. Views/Job</span>
              </div>
              <span className="font-medium text-gray-900">
                {stats.jobs.total ? Math.round(stats.overview.totalApplications / stats.jobs.total) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <FiZap className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-gray-600">Featured Jobs</span>
              </div>
              <span className="font-medium text-gray-900">0</span>
            </div>
            <div className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <FiAward className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-gray-600">Verified Companies</span>
              </div>
              <span className="font-medium text-gray-900">{stats.companies.verified}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Monthly Trends Chart */}
        <motion.div
          variants={statCardVariants}
          className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
            <div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Monthly Trends</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500">Job postings and user registrations</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setChartType("area")}
                className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] md:text-xs rounded-lg transition-colors ${
                  chartType === "area" 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] md:text-xs rounded-lg transition-colors ${
                  chartType === "bar" 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Bar
              </button>
            </div>
          </div>
          
          <div className="h-48 sm:h-56 md:h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={getMonthlyChartData()}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" tick={{fontSize: 10}} />
                  <YAxis stroke="#6B7280" tick={{fontSize: 10}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Area
                    type="monotone"
                    dataKey="jobs"
                    stroke={COLORS.primary}
                    fill="url(#colorJobs)"
                    name="Jobs"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={COLORS.success}
                    fill="url(#colorUsers)"
                    name="Users"
                  />
                </AreaChart>
              ) : (
                <BarChart data={getMonthlyChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" tick={{fontSize: 10}} />
                  <YAxis stroke="#6B7280" tick={{fontSize: 10}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{fontSize: '10px'}} />
                  <Bar dataKey="jobs" fill={COLORS.primary} name="Jobs" />
                  <Bar dataKey="users" fill={COLORS.success} name="Users" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Job Type Distribution */}
        <motion.div
          variants={statCardVariants}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Jobs by Type</h3>
          <div className="h-48 sm:h-56 md:h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={getJobTypeData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={screenSize === 'mobile' ? 40 : 50}
                  outerRadius={screenSize === 'mobile' ? 60 : 70}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {getJobTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 sm:mt-3 md:mt-4 space-y-1 sm:space-y-2">
            {getJobTypeData().map((item, index) => (
              <div key={index} className="flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Recent Jobs */}
        <motion.div
          variants={statCardVariants}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Recent Jobs</h3>
            <button className="text-[8px] sm:text-[10px] md:text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {screenSize === 'mobile' ? 'All' : 'View all'} <FiChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {stats.recent.jobs.slice(0, 5).map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 truncate">{job.jobTitle}</p>
                  <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 truncate">
                    {job.employer?.companyName || job.employer?.name}
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className={`text-[6px] sm:text-[7px] md:text-[8px] px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full ${
                      job.status === 'Active' ? 'bg-green-100 text-green-600' :
                      job.status === 'Draft' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status}
                    </span>
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          variants={statCardVariants}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">New Users</h3>
            <button className="text-[8px] sm:text-[10px] md:text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {screenSize === 'mobile' ? 'All' : 'View all'} <FiChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {stats.recent.users.slice(0, 5).map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className={`text-[6px] sm:text-[7px] md:text-[8px] px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full ${
                      user.role === 'employer' ? 'bg-blue-100 text-blue-600' :
                      user.role === 'admin' ? 'bg-red-100 text-red-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          variants={statCardVariants}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">Recent Applications</h3>
            <button className="text-[8px] sm:text-[10px] md:text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {screenSize === 'mobile' ? 'All' : 'View all'} <FiChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {stats.recent.applications.slice(0, 5).map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiFileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-gray-900 truncate">
                    {app.candidate?.name}
                  </p>
                  <p className="text-[7px] sm:text-[8px] md:text-[10px] text-gray-500 truncate">Applied for: {app.job?.jobTitle}</p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className={`text-[6px] sm:text-[7px] md:text-[8px] px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      app.status === 'reviewed' ? 'bg-blue-100 text-blue-600' :
                      app.status === 'hired' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewAdminMain;