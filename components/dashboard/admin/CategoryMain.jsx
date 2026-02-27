"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
  FiLayers,
  FiBookmark,
  FiTag,
  FiBriefcase,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiHome,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { categoryService } from "@/services/categoryService";
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

const CategoryMan = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });

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

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter and sort categories
  useEffect(() => {
    let filtered = [...categories];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(cat => 
        filters.status === 'active' ? cat.isActive !== false : cat.isActive === false
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'jobs') {
        return filters.sortOrder === 'asc'
          ? (a.jobCount || 0) - (b.jobCount || 0)
          : (b.jobCount || 0) - (a.jobCount || 0);
      } else if (filters.sortBy === 'created') {
        return filters.sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [searchTerm, categories, filters]);

  // Show notification
  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to load categories. Please try again.");
      showNotification("Failed to load categories", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification("Category name is required", "error");
      return;
    }

    try {
      if (editingCategory) {
        // Update category
        const updated = await categoryService.updateCategory(editingCategory._id, {
          name: formData.name,
          description: formData.description,
        });
        
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? updated : cat
          )
        );
        showNotification("Category updated successfully", "success");
      } else {
        // Add category
        const newCategory = await categoryService.createCategory({
          name: formData.name,
          description: formData.description,
        });
        
        setCategories((prev) => [...prev, newCategory]);
        showNotification("Category created successfully", "success");
      }
      
      closeModal();
    } catch (error) {
      console.error("Submit error:", error);
      showNotification("Failed to save category", "error");
    }
  };

  // Delete Handler
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      setDeleteLoading(true);
      await categoryService.deleteCategory(selectedCategory._id);
      setCategories((prev) => prev.filter((cat) => cat._id !== selectedCategory._id));
      showNotification(`Category "${selectedCategory.name}" deleted successfully`, "success");
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Failed to delete category", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle category status
  const handleToggleStatus = async (category) => {
    try {
      const updated = await categoryService.updateCategory(category._id, {
        isActive: !category.isActive
      });
      
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === category._id ? updated : cat
        )
      );
      
      showNotification(
        `Category ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Status update error:", error);
      showNotification("Failed to update category status", "error");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    showNotification("Filters cleared", "info");
  };

  // Get category color based on name
  const getCategoryColor = (name) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
      { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
      { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-600' },
      { bg: 'bg-yellow-100', text: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-600' },
      { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-500 to-red-600' },
      { bg: 'bg-indigo-100', text: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
      { bg: 'bg-pink-100', text: 'text-pink-600', gradient: 'from-pink-500 to-pink-600' },
      { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Get stats
  const getStats = () => {
    const total = categories.length;
    const active = categories.filter(c => c.isActive !== false).length;
    const totalJobs = categories.reduce((acc, cat) => acc + (cat.jobCount || 0), 0);
    return { total, active, totalJobs };
  };

  const stats = getStats();

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiFolder className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium">
            {screenSize === 'mobile' ? 'Loading...' : 'Loading categories...'}
          </p>
        </div>
      </div>
    );
  }

  if (loading && categories.length === 0) {
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
              <FiFolder className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 font-medium"
          >
            {screenSize === 'mobile' ? 'Loading...' : 'Loading categories...'}
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
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Delete Category</h3>
                  <p className="text-xs sm:text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 md:mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name}</span>? 
                This will affect all jobs in this category.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            ></div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-lg sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6"
            >
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    {editingCategory ? "Update category details" : "Create a new job category"}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiX size={screenSize === 'mobile' ? 18 : 20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Web Development"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter category description (optional)"
                    rows={screenSize === 'mobile' ? 3 : 4}
                  />
                </div>

                <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-xs sm:text-sm text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!formData.name.trim()}
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mt-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            {screenSize === 'mobile' ? 'Manage categories' : 'Organize and manage job categories'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FiList className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCategories}
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
            {(searchTerm || filters.status !== 'all') && (
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[8px] sm:text-xs font-bold">
                1
              </span>
            )}
          </motion.button>
          
          {/* Add button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md text-xs sm:text-sm"
          >
            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Categories</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.total)}</p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-[8px] sm:text-xs bg-white/20 px-1 sm:px-2 py-0.5 rounded-sm">
                  {stats.active} Active
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiFolder className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Active Categories</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.active)}</p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Currently in use</p>
            </div>
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={statCardVariants}
          whileHover="hover"
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] sm:text-xs opacity-90 mb-1">Total Jobs</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(stats.totalJobs)}</p>
              <p className="text-[8px] sm:text-xs opacity-75 mt-1">Across all categories</p>
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
                Filter Categories
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Search */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Search
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                  <input
                    type="text"
                    placeholder={screenSize === 'mobile' ? "Search..." : "Search by name or description..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
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
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                  }}
                  className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="jobs-desc">Most Jobs</option>
                  <option value="jobs-asc">Least Jobs</option>
                  <option value="created-desc">Newest First</option>
                  <option value="created-asc">Oldest First</option>
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
            className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
          >
            <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-[10px] sm:text-xs flex-1">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-2 sm:px-3 py-1 bg-red-600 text-white text-[8px] sm:text-xs rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid/List */}
      <motion.div
        variants={containerVariants}
        className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6" 
          : "space-y-3 sm:space-y-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {currentItems.length > 0 ? (
            currentItems.map((category) => {
              const colors = getCategoryColor(category.name);
              const isActive = category.isActive !== false;
              
              return viewMode === 'grid' ? (
                // Grid View
                <motion.div
                  key={category._id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -4 }}
                  onHoverStart={() => setHoveredCategory(category._id)}
                  onHoverEnd={() => setHoveredCategory(null)}
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden group relative"
                >
                  {/* Header with gradient */}
                  <div className={`h-16 sm:h-18 md:h-20 bg-gradient-to-r ${colors.gradient} relative`}>
                    {/* Icon */}
                    <div className="absolute -bottom-6 sm:-bottom-7 md:-bottom-8 left-2 sm:left-3 md:left-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white shadow-lg flex items-center justify-center border-3 sm:border-4 border-white">
                        <FiTag className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${colors.text}`} />
                      </div>
                    </div>
                    
                    {/* Status badge */}
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center gap-0.5 sm:gap-1 ${
                        isActive 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isActive ? (
                          <FiCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        ) : (
                          <FiXCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        )}
                        <span className="hidden sm:inline">{isActive ? 'Active' : 'Inactive'}</span>
                        <span className="sm:hidden">{isActive ? 'A' : 'I'}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-8 sm:pt-9 md:pt-10 p-3 sm:p-4">
                    {/* Category info */}
                    <div className="mb-2 sm:mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg truncate">{category.name}</h3>
                      {category.description && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
                      <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">{category.jobCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Jobs</p>
                      </div>
                      <div className="text-center p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                          {category.activeJobsCount || 0}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Active</p>
                      </div>
                    </div>
                    
                    {/* Created date */}
                    <p className="text-[8px] sm:text-[10px] text-gray-400 mb-2 sm:mb-3 md:mb-4 flex items-center gap-1">
                      <FiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(category)}
                        className="flex-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2"
                      >
                        <FiEdit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleStatus(category)}
                        className={`flex-1 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 rounded-lg transition-colors text-[8px] sm:text-[10px] md:text-xs font-medium flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 ${
                          isActive
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <FiXCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Deact</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Act</span>
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(category)}
                        className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCategory === category._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
                  />
                </motion.div>
              ) : (
                // List View
                <motion.div
                  key={category._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 relative"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <FiTag className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                    </div>
                    
                    {/* Category info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 items-start sm:items-center w-full">
                      <div className="sm:col-span-2">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{category.name}</h3>
                        {category.description && (
                          <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-full sm:max-w-md">
                            {category.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="sm:col-span-1">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-medium flex items-center gap-1 w-fit ${
                          isActive 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isActive ? (
                            <FiCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          ) : (
                            <FiXCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          )}
                          <span className="hidden sm:inline">{isActive ? 'Active' : 'Inactive'}</span>
                          <span className="sm:hidden">{isActive ? 'A' : 'I'}</span>
                        </span>
                      </div>
                      
                      <div className="sm:col-span-1 text-center">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{category.jobCount || 0}</p>
                        <p className="text-[8px] sm:text-[10px] text-gray-500">Jobs</p>
                      </div>
                      
                      <div className="sm:col-span-1 text-[8px] sm:text-[10px] text-gray-400">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleToggleStatus(category)}
                        className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        {isActive ? (
                          <FiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        ) : (
                          <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
              >
                <FiFolder className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-gray-400" />
              </motion.div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                No categories found
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-5 md:mb-6">
                {searchTerm || filters.status !== 'all'
                  ? "Try adjusting your filters to find what you're looking for"
                  : "Get started by creating your first category"}
              </p>
              {(searchTerm || filters.status !== 'all') ? (
                <button
                  onClick={clearFilters}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md text-[10px] sm:text-xs"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={openAddModal}
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md text-[10px] sm:text-xs flex items-center gap-1 sm:gap-2 mx-auto"
                >
                  <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  Add First Category
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {filteredCategories.length > itemsPerPage && (
        <motion.div
          variants={itemVariants}
          className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-gray-600">
              Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-semibold">
                {Math.min(indexOfLastItem, filteredCategories.length)}
              </span>{' '}
              of <span className="font-semibold">{filteredCategories.length}</span> categories
            </p>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
              
              {[...Array(Math.min(screenSize === 'mobile' ? 3 : 5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= (screenSize === 'mobile' ? 3 : 5)) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - (screenSize === 'mobile' ? 2 : 4) + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                      currentPage === pageNum
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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

export default CategoryMan;