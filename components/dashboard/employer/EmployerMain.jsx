"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiTrendingUp,
  FiPieChart,
  FiDollarSign,
  FiAward,
  FiZap,
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiDownload,
  FiChevronRight,
  FiBell,
  FiMail,
  FiMessageSquare,
  FiCalendar,
  FiHome,
  FiBookmark,
} from "react-icons/fi";
import { jobService } from "@/services/jobService";
import { profileService } from "@/services/profileService";
import toast from "react-hot-toast";

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
} from "recharts";

export default function EmployerMain() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    savedCandidates: 0,
    totalViews: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState({
    jobs: true,
    candidates: true,
    stats: true,
  });
  const [timeRange, setTimeRange] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [activeChartIndex, setActiveChartIndex] = useState(0);

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

  // Fetch employer dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
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
          totalViews: jobsResponse.stats?.totalViews || 0,
          conversionRate: jobsResponse.stats?.totalJobs ? 
            ((jobsResponse.stats?.totalApplications / jobsResponse.stats?.totalJobs) * 100).toFixed(1) : 0,
        }));
      }

      // Fetch saved candidates count
      try {
        const savedCount = await profileService.getSavedCandidatesCount();
        setStats(prev => ({
          ...prev,
          savedCandidates: savedCount || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch saved candidates count:", error);
      }

      // Fetch saved candidates list
      setLoading(prev => ({ ...prev, candidates: true }));
      try {
        const savedCount = stats.savedCandidates > 0 ? stats.savedCandidates : await profileService.getSavedCandidatesCount();
        
        if (savedCount > 0) {
          const savedResponse = await profileService.getSavedCandidates({ 
            page: 1, 
            limit: 6
          });
          
          if (savedResponse.success) {
            setSavedCandidates(savedResponse.savedCandidates || []);
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
      setRefreshing(false);
    }
  };

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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

  // Generate chart data (mock for now - replace with real data)
  const getApplicationTrends = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: Math.floor(Math.random() * 10) + 1,
        views: Math.floor(Math.random() * 50) + 10,
      });
    }
    return data;
  };

  const getJobTypeDistribution = () => {
    const types = recentJobs.reduce((acc, job) => {
      const type = job.jobType || 'Full Time';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(types).map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading.stats && loading.jobs) {
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
              <FiBriefcase className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading your dashboard...
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
      className="mt-4 w-full min-h-screen bg-gray-50 px-6 py-4 sm:px-6 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)]"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Employer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {getUserName()}! Here's what's happening with your job postings.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
          </select>
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {/* Post Job Button */}
          <Link href="/post_job">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              Post New Job
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Jobs */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Active Jobs</p>
              <p className="text-3xl font-bold">{formatNumber(stats.activeJobs)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-sm">
                  {stats.totalJobs} Total
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiBriefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-4xl opacity-10">📊</div>
        </motion.div>

        {/* Total Applications */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Applications</p>
              <p className="text-3xl font-bold">{formatNumber(stats.totalApplications)}</p>
              <p className="text-xs opacity-75 mt-2">
                {stats.conversionRate}% conversion rate
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiUsers className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-4xl opacity-10">👥</div>
        </motion.div>

        {/* Pending Reviews */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Pending Reviews</p>
              <p className="text-3xl font-bold">{formatNumber(stats.pendingApplications)}</p>
              <p className="text-xs opacity-75 mt-2">Awaiting your response</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-4xl opacity-10">⏳</div>
        </motion.div>

        {/* Saved Candidates */}
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Saved Candidates</p>
              <p className="text-3xl font-bold">{formatNumber(stats.savedCandidates)}</p>
              <p className="text-xs opacity-75 mt-2">In your talent pool</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FiUserPlus className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-4xl opacity-10">⭐</div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Application Trends Chart */}
        <motion.div
          variants={statCardVariants}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
              <p className="text-sm text-gray-500">Daily applications and job views</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveChartIndex(0)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  activeChartIndex === 0 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setActiveChartIndex(1)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  activeChartIndex === 1 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                Bar
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartIndex === 0 ? (
                <AreaChart data={getApplicationTrends()}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke={COLORS.primary}
                    fill="url(#colorApplications)"
                    name="Applications"
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={COLORS.success}
                    fill="url(#colorViews)"
                    name="Views"
                  />
                </AreaChart>
              ) : (
                <BarChart data={getApplicationTrends()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="applications" fill={COLORS.primary} name="Applications" />
                  <Bar dataKey="views" fill={COLORS.success} name="Views" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Job Distribution */}
        <motion.div
          variants={statCardVariants}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getJobTypeDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getJobTypeDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {getJobTypeDistribution().map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Jobs Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Recently Posted Jobs</h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                {stats.activeJobs} Active
              </span>
            </div>
            <Link 
              href="/employer/my-jobs" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
            >
              View all jobs
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Jobs List */}
          {loading.jobs ? (
            <div className="p-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading your jobs...</p>
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FiBriefcase className="w-10 h-10 text-blue-600" />
              </motion.div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">No jobs posted yet</h4>
              <p className="text-sm text-gray-500 mb-6">Start posting jobs to attract top talent</p>
              <Link href="/post-job">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <FiPlusCircle className="w-4 h-4" />
                  Post Your First Job
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentJobs.map((job, index) => (
                <RecentJobRow 
                  key={job._id} 
                  job={job} 
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuickActionCard
          title="Post a New Job"
          description="Create a new job posting to attract candidates"
          icon={<FiPlusCircle className="w-6 h-6" />}
          href="/post-job"
          gradient="from-blue-500 to-blue-600"
          iconBg="bg-blue-100"
        />
        <QuickActionCard
          title="Find Candidates"
          description="Search through our candidate database"
          icon={<FiUsers className="w-6 h-6" />}
          href="/candidates"
          gradient="from-purple-500 to-purple-600"
          iconBg="bg-purple-100"
        />
        <QuickActionCard
          title="Review Applications"
          description="Check and respond to new applications"
          icon={<FiEye className="w-6 h-6" />}
          href="/employer/my-jobs"
          gradient="from-green-500 to-emerald-600"
          iconBg="bg-green-100"
        />
        <QuickActionCard
          title="Company Profile"
          description="Update your company information"
          icon={<FiHome className="w-6 h-6" />}
          href="/employer/profile"
          gradient="from-orange-500 to-orange-600"
          iconBg="bg-orange-100"
        />
      </motion.div>

      {/* Saved Candidates Section (if any) */}
      {savedCandidates.length > 0 && (
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">Saved Candidates</h3>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                  {stats.savedCandidates} Saved
                </span>
              </div>
              <Link 
                href="/employer/saved-candidates" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
              >
                View all candidates
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCandidates.slice(0, 3).map((saved, index) => (
                  <SavedCandidateCard 
                    key={saved.candidate?._id || index} 
                    saved={saved} 
                    onUnsave={handleUnsaveCandidate}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ============================================ */
/* RECENT JOB ROW COMPONENT */
/* ============================================ */
function RecentJobRow({ job, formatDate, getStatusBadge, index }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const statusBadge = getStatusBadge(job);
  const StatusIcon = statusBadge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="px-6 py-4 hover:bg-gray-50 transition relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job._id}`} className="group">
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                {job.jobTitle}
              </h4>
            </Link>
            {job.isFeatured && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                <FiStar className="w-3 h-3 mr-1" />
                Featured
              </motion.span>
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
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusBadge.text}
            </motion.span>
            <span className="text-xs text-gray-500">
              Posted {formatDate(job.postedDate)}
            </span>
            {job.daysRemaining > 0 && job.status === 'Active' && (
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs text-orange-600 font-medium"
              >
                {job.daysRemaining} days left
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href={`/employer/jobs/${job._id}/applications`}
            className="text-right group"
          >
            <motion.p 
              whileHover={{ scale: 1.1 }}
              className="font-semibold text-gray-900 group-hover:text-blue-600 transition"
            >
              {job.applicationsCount || 0}
            </motion.p>
            <p className="text-xs text-gray-500 group-hover:text-blue-600 transition">
              Applications
            </p>
          </Link>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiMoreVertical className="w-4 h-4 text-gray-600" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <RecentJobActionsDropdown 
                  jobId={job._id}
                  job={job}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================ */
/* RECENT JOB ACTIONS DROPDOWN */
/* ============================================ */
function RecentJobActionsDropdown({ jobId, job, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-8 z-20 w-56 rounded-lg border bg-white shadow-lg py-1"
      onClick={(e) => e.stopPropagation()}
      onMouseLeave={onClose}
    >
      <Link href={`/jobs/${jobId}`}>
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <FiEye className="w-4 h-4" />
          View Job Details
        </motion.div>
      </Link>

      <Link href={`/employer/jobs/${jobId}/applications`}>
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-gray-50 transition cursor-pointer font-medium"
        >
          <FiUsers className="w-4 h-4" />
          View Applications ({job.applicationsCount || 0})
        </motion.div>
      </Link>

      <Link href={`/employer/jobs/${jobId}/edit`}>
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <FiEdit className="w-4 h-4" />
          Edit Job
        </motion.div>
      </Link>

      <div className="border-t my-1"></div>

      <Link href={`/employer/jobs/${jobId}/delete`}>
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <FiTrash2 className="w-4 h-4" />
          Delete Job
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ============================================ */
/* QUICK ACTION CARD COMPONENT */
/* ============================================ */
function QuickActionCard({ title, description, icon, href, gradient, iconBg }) {
  return (
    <Link href={href}>
      <motion.div
        variants={{
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
        }}
        whileHover={{ 
          scale: 1.03,
          y: -4,
          transition: { duration: 0.2 }
        }}
        className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${iconBg} bg-opacity-20 rounded-lg backdrop-blur-sm`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <FiChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-white/80">{description}</p>
        </div>
        <div className="absolute bottom-2 right-2 text-6xl opacity-10">→</div>
      </motion.div>
    </Link>
  );
}

/* ============================================ */
/* SAVED CANDIDATE CARD COMPONENT */
/* ============================================ */
function SavedCandidateCard({ saved, onUnsave }) {
  const candidate = saved.candidate;
  
  if (!candidate) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {candidate.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{candidate.name}</h4>
            <p className="text-xs text-gray-500">{candidate.jobTitle || 'Candidate'}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onUnsave(candidate._id)}
          className="text-red-500 hover:text-red-600"
        >
          <FiTrash2 className="w-4 h-4" />
        </motion.button>
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {candidate.experience || 'Experience'}
        </span>
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
          {candidate.skills?.length || 0} skills
        </span>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <FiCalendar className="w-3 h-3" />
          Saved {new Date(saved.savedAt).toLocaleDateString()}
        </span>
        <Link href={`/candidates/${candidate._id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View Profile
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}