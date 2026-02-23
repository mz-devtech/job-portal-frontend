"use client";

import Link from 'next/link';
import { Search, MapPin, Loader2, Building2, TrendingUp, Filter, X, Star, ChevronRight, Users, Briefcase, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Navbar from '@/components/Navbar';
import SecondNavbar from '@/components/SecondNavbar';
import Footer from '@/components/Footer';
import { employerService } from '@/services/employerService';
import { motion, AnimatePresence } from 'framer-motion';

export default function FindEmployers() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [featured, setFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industryType: '',
    featured: false,
    page: 1,
    limit: 12,
    sortBy: 'companyInfo.companyName',
    sortOrder: 'asc'
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEmployers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [filterOptions, setFilterOptions] = useState({
    industryTypes: [],
    locations: []
  });

  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedLocation = useDebounce(locationTerm, 500);

  // Load initial data
  useEffect(() => {
    fetchEmployers();
  }, []);

  // Update filters when debounced values change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      location: debouncedLocation,
      page: 1
    }));
  }, [debouncedSearch, debouncedLocation]);

  // Fetch employers when filters change
  useEffect(() => {
    fetchEmployers();
  }, [
    filters.search,
    filters.location,
    filters.industryType,
    filters.featured,
    filters.page,
    filters.sortBy,
    filters.sortOrder
  ]);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.industryType) params.industryType = filters.industryType;
      if (filters.featured) params.featured = true;
      
      params.page = filters.page;
      params.limit = filters.limit;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const response = await employerService.getAllEmployers(params);
      
      setEmployers(response.employers || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalEmployers: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      
      if (response.filters) {
        setFilterOptions({
          industryTypes: response.filters.industryTypes || [],
          locations: response.filters.locations || []
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch employers:', error);
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      location: locationTerm,
      page: 1
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setIndustryType('');
    setFeatured(false);
    setFilters({
      search: '',
      location: '',
      industryType: '',
      featured: false,
      page: 1,
      limit: 12,
      sortBy: 'companyInfo.companyName',
      sortOrder: 'asc'
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.industryType) count++;
    if (filters.featured) count++;
    if (filters.search) count++;
    if (filters.location) count++;
    return count;
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Navbar />
      <SecondNavbar />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-pink-100/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="bg-gradient-to-b from-white via-blue-50/20 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-6"
          >
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Find Employers</span>
          </motion.div>

          {/* Header Section */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8 text-center md:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Find Employers
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Discover top companies and explore their job opportunities
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 group flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search by company name..."
                  className="w-full text-sm outline-none bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="flex-1 group flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full text-sm outline-none bg-transparent"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
              >
                <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {getActiveFilterCount()}
                  </motion.span>
                )}
              </button>

              <button
                onClick={handleSearch}
                className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg overflow-hidden group font-medium"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">
                  {loading ? 'Searching...' : 'Search'}
                </span>
              </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-blue-500" />
                      Advanced Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-300 hover:rotate-90 transform"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Industry Type Filter */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry Type
                      </label>
                      <select
                        value={filters.industryType}
                        onChange={(e) => handleFilterChange('industryType', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      >
                        <option value="">All Industries</option>
                        {employerService.getIndustryTypes().map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Sort By */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      >
                        <option value="companyInfo.companyName">Company Name</option>
                        <option value="stats.openJobs">Open Positions</option>
                        <option value="completionPercentage">Profile Completeness</option>
                      </select>
                    </motion.div>

                    {/* Sort Order */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                      </label>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 flex items-center justify-between"
                  >
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.featured}
                        onChange={(e) => handleFilterChange('featured', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-300 group-hover:scale-110"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                        Show featured only
                      </span>
                    </label>

                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1 group"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      Clear all filters
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Stats */}
          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-between items-center mb-6"
          >
            <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              {pagination.totalEmployers > 0 ? (
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1}-
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalEmployers)} of {pagination.totalEmployers} employers
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  No employers found
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="border-0 bg-transparent text-sm focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors duration-300"
              >
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
                <option value={48}>48 per page</option>
              </select>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
            >
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="ml-4 text-gray-600 animate-pulse">Loading employers...</span>
            </motion.div>
          ) : (
            <>
              {/* Employers Grid */}
              {employers.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {employers.map((employer, index) => (
                    <motion.div
                      key={employer._id}
                      variants={{
                        initial: { opacity: 0, y: 30 },
                        animate: { opacity: 1, y: 0 }
                      }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EmployerCard employer={employer} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
                >
                  <div className="relative inline-block mb-4">
                    <Building2 className="w-16 h-16 text-gray-300" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No employers found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      Clear all filters
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-wrap justify-center items-center gap-2"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="group px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-1">
                      <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
                      Previous
                    </span>
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                          pagination.currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="group px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-1">
                      Next
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </>
  );
}

// Employer Card Component
function EmployerCard({ employer }) {
  const [isHovered, setIsHovered] = useState(false);
  const logo = employerService.getCompanyLogo(employer);
  const location = employerService.formatLocation(employer);
  const isComplete = employerService.isProfileComplete(employer);
  
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  // Get color based on company name
  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-blue-500'
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <Link href={`/find-employers/${employer.user?._id || employer._id}`} className="block">
      <motion.div 
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5, scale: 1.02 }}
        className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer h-full flex flex-col"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              {logo ? (
                <div className="relative">
                  <img 
                    src={logo} 
                    alt={employer.companyInfo?.companyName || 'Company'} 
                    className="w-16 h-16 object-contain rounded-xl border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300"
                  />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${getAvatarColor(employer.companyInfo?.companyName)} flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {getInitials(employer.companyInfo?.companyName || employer.user?.name)}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>
              )}
              
              {employer.isFeatured && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <div className="relative">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-lg truncate group-hover:text-blue-600 transition-colors duration-300">
                {employer.companyInfo?.companyName || employer.user?.name || 'Company Name'}
              </h3>
              
              {location && (
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </p>
              )}

              {employer.foundingInfo?.industryType && (
                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 transition-all duration-300">
                  {employer.foundingInfo.industryType}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <motion.p 
                  animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold text-blue-600"
                >
                  {employer.stats?.openJobs || 0}
                </motion.p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Open Jobs
                </p>
              </div>
              <div className="text-center flex-1 border-l border-r border-gray-100">
                <motion.p 
                  animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-2xl font-bold text-gray-700"
                >
                  {employer.stats?.totalJobs || 0}
                </motion.p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Total Jobs
                </p>
              </div>
              <div className="text-center flex-1">
                <motion.p 
                  animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-2xl font-bold text-green-600"
                >
                  {employer.completionPercentage || 0}%
                </motion.p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3" />
                  Profile
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-medium py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Profile & Open Jobs
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}