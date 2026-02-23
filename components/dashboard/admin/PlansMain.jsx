"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiToggleLeft,
  FiToggleRight,
  FiDollarSign,
  FiBriefcase,
  FiUsers,
  FiClock,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiFilter,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiHome,
  FiCreditCard,
  FiPackage,
  FiShoppingBag,
  FiHeart,
  FiZap,
  FiCalendar,
  FiCpu,
  FiGlobe,
  FiShield,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { planService } from "@/services/planService";
import toast from "react-hot-toast";

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

const PlansMain = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [mounted, setMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    billingType: 'all',
    sortBy: 'price',
    sortOrder: 'asc'
  });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceYearly: "",
    jobLimit: "",
    urgentFeatured: false,
    highlightJob: false,
    candidateLimit: "",
    resumeVisibility: "",
    support24: false,
    recommended: false,
    billingPeriod: "monthly",
    isActive: true,
  });

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
    fetchStats();
  }, []);

  // Show notification
  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      const data = await planService.getPlans();
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setError("Failed to load plans. Please try again.");
      showNotification("Failed to load plans", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await planService.getPlanStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Filter and sort plans
  const getFilteredPlans = () => {
    let filtered = [...plans];

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(plan => 
        filters.status === 'active' ? plan.isActive : !plan.isActive
      );
    }

    // Apply billing type filter
    if (filters.billingType !== 'all') {
      filtered = filtered.filter(plan => 
        plan.billingPeriod === filters.billingType || 
        (filters.billingType === 'both' && plan.billingPeriod === 'both')
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return filters.sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      } else if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'jobs') {
        return filters.sortOrder === 'asc'
          ? (a.jobLimit || 0) - (b.jobLimit || 0)
          : (b.jobLimit || 0) - (a.jobLimit || 0);
      }
      return 0;
    });

    return filtered;
  };

  const filteredPlans = getFilteredPlans();

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      price: "",
      priceYearly: "",
      jobLimit: "1",
      urgentFeatured: false,
      highlightJob: false,
      candidateLimit: "0",
      resumeVisibility: "0",
      support24: false,
      recommended: false,
      billingPeriod: "monthly",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      priceYearly: plan.priceYearly || "",
      jobLimit: plan.jobLimit,
      urgentFeatured: plan.urgentFeatured,
      highlightJob: plan.highlightJob,
      candidateLimit: plan.candidateLimit,
      resumeVisibility: plan.resumeVisibility,
      support24: plan.support24,
      recommended: plan.recommended,
      billingPeriod: plan.billingPeriod || "monthly",
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showNotification("Plan name and price are required", "error");
      return;
    }

    try {
      if (editingPlan) {
        // Update existing plan
        const updated = await planService.updatePlan(editingPlan._id, formData);
        setPlans((prev) =>
          prev.map((plan) =>
            plan._id === editingPlan._id ? updated : plan
          )
        );
        showNotification("Plan updated successfully", "success");
      } else {
        // Create new plan
        const newPlan = await planService.createPlan(formData);
        setPlans((prev) => [...prev, newPlan]);
        showNotification("Plan created successfully", "success");
      }
      
      closeModal();
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Submit error:", error);
      showNotification("Failed to save plan", "error");
    }
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlan) return;

    try {
      setDeleteLoading(true);
      await planService.deletePlan(selectedPlan._id);
      setPlans((prev) => prev.filter((plan) => plan._id !== selectedPlan._id));
      showNotification(`Plan "${selectedPlan.name}" deleted successfully`, "success");
      setShowDeleteModal(false);
      setSelectedPlan(null);
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Failed to delete plan", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (plan) => {
    try {
      const updated = await planService.togglePlanStatus(plan._id);
      setPlans((prev) =>
        prev.map((p) => (p._id === plan._id ? updated : p))
      );
      showNotification(
        `Plan ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Toggle status error:", error);
      showNotification("Failed to update plan status", "error");
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      billingType: 'all',
      sortBy: 'price',
      sortOrder: 'asc'
    });
    showNotification("Filters cleared", "info");
  };

  // Get plan color based on name
  const getPlanColor = (name) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600', light: 'bg-blue-50' },
      { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600', light: 'bg-purple-50' },
      { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600', light: 'bg-green-50' },
      { bg: 'bg-yellow-100', text: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-600', light: 'bg-yellow-50' },
      { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-500 to-red-600', light: 'bg-red-50' },
      { bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50' },
      { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-500 to-pink-600', light: 'bg-pink-50' },
      { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600', light: 'bg-orange-50' },
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Format number
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get feature icon
  const getFeatureIcon = (feature) => {
    switch(feature) {
      case 'urgentFeatured': return <FiZap className="w-3 h-3" />;
      case 'highlightJob': return <FiStar className="w-3 h-3" />;
      case 'support24': return <FiClock className="w-3 h-3" />;
      default: return <FiCheckCircle className="w-3 h-3" />;
    }
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FiCreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (loading && plans.length === 0) {
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
              <FiCreditCard className="w-8 h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading plans...
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
      className="p-6 space-y-6"
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
              'bg-blue-500'
            } text-white`}
          >
            {showToast.type === 'success' && <FiCheckCircle className="w-5 h-5" />}
            {showToast.type === 'error' && <FiXCircle className="w-5 h-5" />}
            {showToast.type === 'info' && <FiAlertCircle className="w-5 h-5" />}
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
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Plan</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedPlan?.name}</span>? 
                This will affect all employers subscribed to this plan.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingPlan ? "Edit Plan" : "Create New Plan"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingPlan ? "Update plan details" : "Create a new subscription plan"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Professional, Enterprise"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="39.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yearly Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="399.00"
                      value={formData.priceYearly}
                      onChange={(e) =>
                        setFormData({ ...formData, priceYearly: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Limit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="5"
                      value={formData.jobLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, jobLimit: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Use 999 for unlimited</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="50"
                      value={formData.candidateLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, candidateLimit: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = unlimited</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Visibility Days
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="30"
                      value={formData.resumeVisibility}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resumeVisibility: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">0 = lifetime</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Period
                    </label>
                    <select
                      value={formData.billingPeriod}
                      onChange={(e) =>
                        setFormData({ ...formData, billingPeriod: e.target.value })
                      }
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="monthly">Monthly Only</option>
                      <option value="yearly">Yearly Only</option>
                      <option value="both">Both Monthly & Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    Plan Features
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-sm p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.urgentFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            urgentFeatured: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <FiZap className="text-yellow-500" />
                      Urgent & Featured Jobs
                    </label>

                    <label className="flex items-center gap-2 text-sm p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.highlightJob}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highlightJob: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <FiStar className="text-yellow-500" />
                      Highlight Job with Colors
                    </label>

                    <label className="flex items-center gap-2 text-sm p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.support24}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            support24: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <FiClock className="text-blue-500" />
                      24/7 Critical Support
                    </label>

                    <label className="flex items-center gap-2 text-sm p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recommended}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recommended: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <FiAward className="text-purple-500" />
                      Recommended Plan
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">Active</span>
                    <span className="text-gray-500">(visible to employers)</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
                  >
                    {editingPlan ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex mt-[-50px] flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Subscription Plans
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage pricing plans for employers
          </p>
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
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchPlans}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          
          {/* Filter toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
          >
            <FiFilter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {(filters.status !== 'all' || filters.billingType !== 'all') && (
              <span className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                1
              </span>
            )}
          </motion.button>
          
          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            Add Plan
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div variants={itemVariants} className="grid mt-[-100px] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            variants={statCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Plans</p>
                <p className="text-3xl font-bold">{stats.totalPlans}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <FiPackage className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Active Plans</p>
                <p className="text-3xl font-bold">{stats.activePlans}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <FiCheckCircle className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Recommended</p>
                <p className="text-3xl font-bold">{stats.recommendedPlans}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <FiStar className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statCardVariants}
            whileHover="hover"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Avg. Price</p>
                <p className="text-3xl font-bold">${stats.avgPrice?.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <FiDollarSign className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiFilter className="w-5 h-5 text-blue-500" />
                Filter Plans
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
              
              {/* Billing Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Type
                </label>
                <select
                  value={filters.billingType}
                  onChange={(e) => setFilters(prev => ({ ...prev, billingType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="monthly">Monthly Only</option>
                  <option value="yearly">Yearly Only</option>
                  <option value="both">Both Monthly & Yearly</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="jobs-asc">Jobs: Low to High</option>
                  <option value="jobs-desc">Jobs: High to Low</option>
                </select>
              </div>
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
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 text-sm flex-1">{error}</p>
            <button
              onClick={fetchPlans}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plans Grid/List */}
      <motion.div
        variants={containerVariants}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => {
              const colors = getPlanColor(plan.name);
              const isActive = plan.isActive;
              
              return viewMode === 'grid' ? (
                // Grid View
                <motion.div
                  key={plan._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4 }}
                  onHoverStart={() => setHoveredPlan(plan._id)}
                  onHoverEnd={() => setHoveredPlan(null)}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group relative"
                >
                  {/* Header with gradient */}
                  <div className={`h-24 bg-gradient-to-r ${colors.gradient} relative`}>
                    {/* Recommended badge */}
                    {plan.recommended && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-medium flex items-center gap-1">
                          <FiStar className="w-3 h-3" />
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        isActive 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isActive ? (
                          <FiCheckCircle className="w-3 h-3" />
                        ) : (
                          <FiXCircle className="w-3 h-3" />
                        )}
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Plan icon */}
                    <div className="absolute -bottom-8 left-4">
                      <div className="w-16 h-16 rounded-xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                        <FiCreditCard className={`w-8 h-8 ${colors.text}`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-10 p-4">
                    {/* Plan name and price */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      {plan.priceYearly > 0 && (
                        <p className="text-sm text-gray-500">
                          {formatPrice(plan.priceYearly)}/year
                        </p>
                      )}
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FiBriefcase className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-gray-600">
                          <span className="font-semibold">{plan.jobLimit === 999 ? 'Unlimited' : plan.jobLimit}</span> Jobs
                        </span>
                      </div>
                      
                      {plan.urgentFeatured && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiZap className="text-yellow-500 w-4 h-4" />
                          <span className="text-gray-600">Urgent & Featured Jobs</span>
                        </div>
                      )}
                      
                      {plan.highlightJob && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiStar className="text-yellow-500 w-4 h-4" />
                          <span className="text-gray-600">Highlight Job with Colors</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <FiUsers className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-gray-600">
                          <span className="font-semibold">
                            {plan.candidateLimit === 0 ? 'Unlimited' : plan.candidateLimit}
                          </span> Candidates
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <FiClock className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-gray-600">
                          Resume visibility: <span className="font-semibold">
                            {plan.resumeVisibility === 0 ? 'Lifetime' : `${plan.resumeVisibility} days`}
                          </span>
                        </span>
                      </div>
                      
                      {plan.support24 && (
                        <div className="flex items-center gap-2 text-sm">
                          <FiClock className="text-blue-500 w-4 h-4" />
                          <span className="text-gray-600">24/7 Critical Support</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Billing period */}
                    <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      Billing: {plan.billingPeriod === 'monthly' ? 'Monthly only' : 
                               plan.billingPeriod === 'yearly' ? 'Yearly only' : 'Monthly & Yearly'}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(plan)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleStatus(plan)}
                        className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                          isActive
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <FiToggleLeft className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <FiToggleRight className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(plan)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredPlan === plan._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
                  />
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={plan._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className={`bg-white rounded-xl shadow-md border border-gray-200 p-4 relative ${
                    !plan.isActive ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <FiCreditCard className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    
                    {/* Plan info */}
                    <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          {plan.recommended && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium text-gray-900">{formatPrice(plan.price)}</span>
                          <span className="text-xs text-gray-500">/month</span>
                          {plan.priceYearly > 0 && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span className="text-sm text-gray-600">{formatPrice(plan.priceYearly)}/year</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <span className="text-sm">
                          <span className="font-semibold">{plan.jobLimit === 999 ? '∞' : plan.jobLimit}</span> Jobs
                        </span>
                      </div>
                      
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 w-fit ${
                          isActive 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isActive ? (
                            <FiCheckCircle className="w-3 h-3" />
                          ) : (
                            <FiXCircle className="w-3 h-3" />
                          )}
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="col-span-1 text-center">
                        <p className="text-sm font-semibold text-gray-900">{plan.candidateLimit === 0 ? '∞' : plan.candidateLimit}</p>
                        <p className="text-xs text-gray-500">Candidates</p>
                      </div>
                      
                      <div className="col-span-1 text-xs text-gray-400">
                        {plan.billingPeriod}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(plan)}
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        {isActive ? (
                          <FiToggleLeft className="w-4 h-4" />
                        ) : (
                          <FiToggleRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(plan)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={itemVariants}
              className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
              >
                <FiCreditCard className="w-12 h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No plans found
              </h3>
              <p className="text-gray-500 mb-6">
                {filters.status !== 'all' || filters.billingType !== 'all'
                  ? "Try adjusting your filters to find what you're looking for"
                  : "Get started by creating your first subscription plan"}
              </p>
              {(filters.status !== 'all' || filters.billingType !== 'all') ? (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={openAddModal}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-2 mx-auto"
                >
                  <FiPlus className="w-4 h-4" />
                  Add First Plan
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default PlansMain;