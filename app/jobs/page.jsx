"use client";

import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, Bookmark, Loader2, BookmarkCheck, TrendingUp, Clock, X, Sparkles, Zap, Award, Heart, Star, Briefcase, DollarSign, Users, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import FilterSidebar from "@/components/FilterSidebar";
import DynamicNavbar from "@/components/DynamicNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { jobService } from "@/services/jobService";
import { savedJobService } from "@/services/savedJobService";
import { searchHistoryService } from "@/services/searchHistoryService";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [openFilter, setOpenFilter] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [popularSearches, setPopularSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    jobCategory: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
    isRemote: false,
    country: "",
    city: "",
    state: "",
    zipCode: "",
    page: 1,
    limit: 12,
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounce search terms
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedLocation = useDebounce(locationTerm, 500);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Load popular, trending, and recent searches on mount
  useEffect(() => {
    loadPopularSearches();
    loadTrendingSearches();
    loadRecentSearches();
    loadFeaturedJobs();
  }, []);

  // Update filters when debounced values change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: debouncedSearch,
      location: debouncedLocation,
      page: 1 // Reset to first page on new search
    }));
  }, [debouncedSearch, debouncedLocation]);

  // Fetch search suggestions when search term changes
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length >= 2) {
      fetchSearchSuggestions(debouncedSearch);
    } else {
      setSearchSuggestions([]);
    }
  }, [debouncedSearch]);

  const loadPopularSearches = async () => {
    try {
      const popular = await searchHistoryService.getPopularSearches();
      setPopularSearches(popular.slice(0, 10));
    } catch (error) {
      console.error("Failed to load popular searches:", error);
    }
  };

  const loadTrendingSearches = async () => {
    try {
      const trending = await searchHistoryService.getTrendingSearches();
      setTrendingSearches(trending.slice(0, 10));
    } catch (error) {
      console.error("Failed to load trending searches:", error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const recent = await searchHistoryService.getUserSearchHistory();
      setRecentSearches(recent.slice(0, 10));
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  const loadFeaturedJobs = async () => {
    try {
      // Get featured jobs for the hero section
      const response = await jobService.getFeaturedJobs(3);
      setFeaturedJobs(response.jobs || []);
    } catch (error) {
      console.error("Failed to load featured jobs:", error);
    }
  };

  const fetchSearchSuggestions = async (query) => {
    try {
      const suggestions = await searchHistoryService.getSearchSuggestions(query, 8);
      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to fetch search suggestions:", error);
    }
  };

  // Fetch jobs function
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      // Prepare API parameters - only send non-empty values
      const params = {};
      
      // Text search
      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }
      
      // Location search
      if (filters.location && filters.location.trim() !== '') {
        params.location = filters.location.trim();
      }
      
      // Specific location fields
      if (filters.city && filters.city.trim() !== '') {
        params.city = filters.city.trim();
      }
      
      if (filters.state && filters.state.trim() !== '') {
        params.state = filters.state.trim();
      }
      
      if (filters.zipCode && filters.zipCode.trim() !== '') {
        params.zipCode = filters.zipCode.trim();
      }
      
      // Other filters
      if (filters.jobType && filters.jobType !== 'All' && filters.jobType !== '') {
        params.jobType = filters.jobType;
      }
      
      if (filters.jobCategory && filters.jobCategory !== 'All' && filters.jobCategory !== '') {
        params.jobCategory = filters.jobCategory;
      }
      
      if (filters.experienceLevel && filters.experienceLevel !== 'All' && filters.experienceLevel !== '') {
        params.experienceLevel = filters.experienceLevel;
      }
      
      if (filters.minSalary && filters.minSalary !== '') {
        params.minSalary = filters.minSalary;
      }
      
      if (filters.maxSalary && filters.maxSalary !== '') {
        params.maxSalary = filters.maxSalary;
      }
      
      if (filters.isRemote) {
        params.isRemote = true;
      }
      
      if (filters.country && filters.country !== 'All' && filters.country !== '') {
        params.country = filters.country;
      }
      
      // Pagination
      params.page = filters.page || 1;
      params.limit = filters.limit || 12;
      params.sortBy = 'postedDate';
      params.sortOrder = 'desc';

      console.log('🔍 Fetching jobs with params:', params);

      const response = await jobService.searchJobs(params);
      
      // Fetch saved status for each job
      const jobsWithSavedStatus = await Promise.all(
        (response.jobs || []).map(async (job) => {
          try {
            const isSaved = await savedJobService.checkJobSaved(job._id);
            return { ...job, isSaved };
          } catch (error) {
            console.error(`Failed to check saved status for job ${job._id}:`, error);
            return { ...job, isSaved: false };
          }
        })
      );
      
      setJobs(jobsWithSavedStatus);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalJobs: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });

      // Save search to history
      await saveSearchToHistory();
      
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Save search to history
  const saveSearchToHistory = async () => {
    try {
      const searchData = {
        searchQuery: filters.search || '',
        location: filters.location || '',
        city: filters.city || '',
        state: filters.state || '',
        zipCode: filters.zipCode || '',
        filters: {
          jobType: filters.jobType,
          jobCategory: filters.jobCategory,
          experienceLevel: filters.experienceLevel,
          minSalary: filters.minSalary,
          maxSalary: filters.maxSalary,
          isRemote: filters.isRemote,
          country: filters.country
        }
      };

      // Only save if there's actual search content
      if (searchData.searchQuery || searchData.location || 
          searchData.city || searchData.state || searchData.zipCode ||
          Object.values(searchData.filters).some(v => v && v !== '')) {
        await searchHistoryService.saveSearch(searchData);
        loadRecentSearches();
      }
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchJobs();
  }, [
    filters.search,
    filters.location,
    filters.city,
    filters.state,
    filters.zipCode,
    filters.jobType,
    filters.jobCategory,
    filters.experienceLevel,
    filters.minSalary,
    filters.maxSalary,
    filters.isRemote,
    filters.country,
    filters.page
  ]);

  const handleSearch = () => {
    // Force a re-fetch by updating filters
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      location: locationTerm,
      page: 1
    }));
    setShowSuggestions(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
    setOpenFilter(false);
  };

  const handleQuickSearch = (searchTerm, isLocation = false) => {
    if (isLocation) {
      setLocationTerm(searchTerm);
      setFilters(prev => ({
        ...prev,
        location: searchTerm,
        page: 1
      }));
    } else {
      setSearchTerm(searchTerm);
      setFilters(prev => ({
        ...prev,
        search: searchTerm,
        page: 1
      }));
    }
    setShowSuggestions(false);
  };

  const handleClearRecentSearch = async (searchId) => {
    try {
      setRecentSearches(prev => prev.filter(item => item._id !== searchId));
    } catch (error) {
      console.error("Failed to clear recent search:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setFilters(prev => ({
      ...prev,
      search: suggestion,
      page: 1
    }));
    setShowSuggestions(false);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setFilters({
      search: "",
      location: "",
      jobType: "",
      jobCategory: "",
      experienceLevel: "",
      minSalary: "",
      maxSalary: "",
      isRemote: false,
      country: "",
      city: "",
      state: "",
      zipCode: "",
      page: 1,
      limit: 12,
    });
    setShowSuggestions(false);
  };

  return (
    <>
      <DynamicNavbar />
      <SecondNavbar />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <main className="min-h-screen bg-transparent px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section with Stats */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8 text-center"
          >
            <motion.div 
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 rounded-full mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-medium text-blue-700">Find Your Dream Job Today</span>
            </motion.div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Discover Thousands of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Job Opportunities
              </span>
            </h1>
            
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              Browse through curated jobs from top companies and find the perfect match for your skills
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 p-4 relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20" />
            <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-xl opacity-20" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 relative bg-white/50">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or company"
                  className="w-full text-xs outline-none bg-transparent"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                    >
                      <div className="p-2 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <p className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          Suggestions
                        </p>
                      </div>
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleSuggestionClick(suggestion.suggestion || suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-xs text-gray-700 flex items-center gap-2 transition-all duration-300"
                        >
                          <Search className="w-3 h-3 text-gray-400" />
                          <span className="flex-1">{suggestion.suggestion || suggestion}</span>
                          {suggestion.count && (
                            <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                              {suggestion.count} searches
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 bg-white/50">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  className="w-full text-xs outline-none bg-transparent"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenFilter(true)}
                className="relative flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
              >
                <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-xs">Filters</span>
                {Object.entries(filters).some(([key, val]) => 
                  !['search', 'location', 'page', 'limit'].includes(key) && 
                  val !== '' && 
                  val !== false && 
                  val !== 1 && 
                  val !== 12
                ) && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>

              <FilterSidebar
                isOpen={openFilter}
                onClose={() => setOpenFilter(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-white px-6 py-2.5 rounded-xl text-xs font-medium shadow-lg hover:shadow-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Find Jobs
                      <Search className="w-3 h-3" />
                    </>
                  )}
                </span>
              </motion.button>
            </div>

            {/* Quick Filters */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[8px] text-gray-500">Quick filters:</span>
              {['Remote', 'Full-time', 'Entry Level', 'High Salary'].map((filter, index) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-[8px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600 transition-all duration-300"
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Filter Status */}
          <motion.div 
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="mt-4 flex items-center justify-between"
          >
            <div className="text-[10px] text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200">
              {pagination.totalJobs > 0 ? (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-blue-500" />
                  Showing {((filters.page - 1) * filters.limit) + 1}-
                  {Math.min(filters.page * filters.limit, pagination.totalJobs)} of {pagination.totalJobs} jobs
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-gray-400" />
                  No jobs found
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {Object.entries(filters).some(([key, val]) => 
                !['search', 'location', 'page', 'limit'].includes(key) && 
                val !== '' && 
                val !== false && 
                val !== 1 && 
                val !== 12
              ) && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleClearFilters}
                  className="text-[10px] text-red-600 hover:text-red-800 font-medium flex items-center gap-1 group"
                >
                  <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-300" />
                  Clear filters
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Search Stats Section */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Recent Searches */}
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-semibold text-gray-800">Recent Searches</h3>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={() => searchHistoryService.clearSearchHistory()}
                    className="text-[8px] text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <motion.div 
                      key={search._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-1.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300 group"
                    >
                      <button
                        onClick={() => handleQuickSearch(search.searchQuery)}
                        className="flex-1 text-left text-[10px] text-gray-700 hover:text-blue-600 truncate"
                      >
                        {search.searchQuery || search.location || 'Search'}
                      </button>
                      <button
                        onClick={() => handleClearRecentSearch(search._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-0.5 transition-all duration-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-500 text-center py-3">
                    No recent searches
                  </p>
                )}
              </div>
            </motion.div>

            {/* Popular Searches */}
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.25 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="text-xs font-semibold text-gray-800">Top 10 Popular</h3>
              </div>
              <div className="space-y-1">
                {popularSearches.slice(0, 10).map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 3 }}
                    onClick={() => handleQuickSearch(search.searchQuery)}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold w-4 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-700' :
                        'text-gray-300'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-[10px] text-gray-700 truncate max-w-[120px]">{search.searchQuery}</span>
                    </div>
                    <span className="text-[8px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {search.totalSearches}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Trending Searches */}
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-semibold text-gray-800">Trending Now</h3>
              </div>
              <div className="space-y-1">
                {trendingSearches.slice(0, 10).map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 3 }}
                    onClick={() => handleQuickSearch(search.searchQuery)}
                    className="w-full flex items-center justify-between p-1.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-gray-300 w-4">
                        #{index + 1}
                      </span>
                      <span className="text-[10px] text-gray-700 truncate max-w-[120px]">{search.searchQuery}</span>
                    </div>
                    <span className="text-[8px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      {search.recentSearches}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Featured Jobs Section (if any) */}
          {featuredJobs.length > 0 && !filters.search && !filters.location && (
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.35 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Featured Jobs
                </h2>
                <Link href="/jobs/featured" className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
                  View all
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredJobs.map((job, index) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FeaturedJobCard job={job} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex justify-center items-center py-16 bg-white/30 backdrop-blur-sm rounded-xl border border-gray-200"
            >
              <div className="relative">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-100 rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="ml-3 text-xs text-gray-600 animate-pulse">Loading jobs...</span>
            </motion.div>
          ) : (
            <>
              {/* Jobs Grid */}
              {jobs.length > 0 ? (
                <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 }
                      }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <JobCard job={job} onSaveToggle={fetchJobs} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center py-16 bg-white/30 backdrop-blur-sm rounded-xl border border-gray-200"
                >
                  <div className="relative inline-block mb-3">
                    <Search className="w-12 h-12 text-gray-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-100 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">No jobs found</h3>
                  <p className="text-[10px] text-gray-500 mb-4 max-w-sm mx-auto">
                    Try adjusting your search or filter criteria
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearFilters}
                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center gap-1">
                      Clear all filters
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-wrap justify-center items-center gap-1.5"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-[10px]"
                  >
                    Previous
                  </motion.button>
                  
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
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-7 h-7 rounded-lg text-[10px] transition-all duration-300 ${
                          pagination.currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
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
                    className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 text-[10px]"
                  >
                    Next
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer/>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}

// Job Card Component
function JobCard({ job, onSaveToggle }) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isHovered, setIsHovered] = useState(false);

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'part-time':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'internship':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'contract':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'temporary':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'remote':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'freelance':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatSalary = (salaryRange) => {
    if (!salaryRange || !salaryRange.min || salaryRange.min === 0) return 'Negotiable';
    const currencySymbol = salaryRange.currency === 'USD' ? '$' : 
                          salaryRange.currency === 'EUR' ? '€' : 
                          salaryRange.currency === 'GBP' ? '£' : 
                          salaryRange.currency || '$';
    return `${currencySymbol}${salaryRange.min.toLocaleString()} - ${currencySymbol}${salaryRange.max.toLocaleString()}`;
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (saving) return;
    
    try {
      setSaving(true);
      
      if (isSaved) {
        await savedJobService.unsaveJob(job._id);
        setIsSaved(false);
      } else {
        await savedJobService.saveJob(job._id);
        setIsSaved(true);
      }
      
      if (onSaveToggle) {
        onSaveToggle();
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -3, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={isHovered ? { x: ['-100%', '200%'] } : {}}
        transition={{ duration: 1 }}
      />
      
      {/* Gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <Link href={`/jobs/${job._id}`} className="block relative z-10">
        <div className="flex justify-between items-start">
          <motion.span
            animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`text-[8px] font-semibold px-2 py-0.5 rounded-full border ${getJobTypeColor(job.jobType)}`}
          >
            {job.jobType || 'Full-time'}
          </motion.span>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors duration-300">
          {job.jobTitle}
        </h3>

        <p className="mt-1 text-[10px] text-gray-500 flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {formatSalary(job.salaryRange)}
        </p>

        <div className="flex items-center gap-2 mt-3">
          <motion.div 
            animate={isHovered ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg"
          >
            {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
          </motion.div>
          <div>
            <p className="text-[10px] font-medium text-gray-700">
              {job.employer?.companyName || job.employer?.name || 'Company'}
            </p>
            <p className="text-[8px] text-gray-500 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />
              {job.location?.city || 'Not specified'}{job.location?.city && job.location?.country ? ', ' : ''}
              {job.location?.country || ''}
              {job.location?.isRemote && ' • Remote'}
            </p>
          </div>
        </div>

        {/* Job Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {job.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="text-[7px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-600 transition-all duration-300"
              >
                {tag}
              </motion.span>
            ))}
            {job.tags.length > 3 && (
              <span className="text-[7px] text-gray-400 px-1 py-0.5">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Days remaining */}
        {job.daysRemaining > 0 && (
          <div className="mt-3 text-[8px] text-gray-500 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Expires in {job.daysRemaining} day{job.daysRemaining !== 1 ? 's' : ''}
          </div>
        )}
      </Link>
      
      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSaveJob}
        disabled={saving}
        className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-all duration-300 p-1 z-20"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="w-4 h-4 fill-current text-blue-600" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
      </motion.button>

      {/* Quick apply indicator */}
      <motion.div 
        className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={isHovered ? { x: [10, 0] } : {}}
      >
        <span className="text-[6px] text-blue-600 flex items-center gap-0.5">
          Quick view
          <ChevronRight className="w-2.5 h-2.5" />
        </span>
      </motion.div>
    </motion.div>
  );
}

// Featured Job Card Component
function FeaturedJobCard({ job }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0">
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 opacity-20" />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
          {job.employer?.companyName?.[0] || 'C'}
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-800 truncate max-w-[150px]">{job.jobTitle}</h4>
          <p className="text-[8px] text-gray-600">{job.employer?.companyName || 'Company'}</p>
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[8px] bg-white/80 px-1.5 py-0.5 rounded-full text-amber-700">
          {job.jobType || 'Full-time'}
        </span>
        <span className="text-[8px] text-gray-500 flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          {job.location?.city || 'Remote'}
        </span>
      </div>
    </motion.div>
  );
}