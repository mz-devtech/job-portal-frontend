"use client";

import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, Bookmark, Loader2, BookmarkCheck, TrendingUp, Clock, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import FilterSidebar from "@/components/FilterSidebar";
import DynamicNavbar from "@/components/DynamicNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { jobService } from "@/services/jobService";
import { savedJobService } from "@/services/savedJobService";
import { searchHistoryService } from "@/services/searchHistoryService";

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

  // Load popular, trending, and recent searches on mount
  useEffect(() => {
    loadPopularSearches();
    loadTrendingSearches();
    loadRecentSearches();
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

      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4 relative">
            <div className="flex items-center gap-2 flex-1 border rounded-lg px-4 py-3 relative">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by: Job title, Position, Keyword..."
                className="w-full text-sm outline-none"
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
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2 border-b">
                    <p className="text-xs font-medium text-gray-500">Suggestions</p>
                  </div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.suggestion || suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>{suggestion.suggestion || suggestion}</span>
                      {suggestion.count && (
                        <span className="ml-auto text-xs text-gray-400">
                          {suggestion.count} searches
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-1 border rounded-lg px-4 py-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, state or zip code"
                className="w-full text-sm outline-none"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 border px-5 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.entries(filters).some(([key, val]) => 
                !['search', 'location', 'page', 'limit'].includes(key) && 
                val !== '' && 
                val !== false && 
                val !== 1 && 
                val !== 12
              ) && (
                <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </button>

            <FilterSidebar
              isOpen={openFilter}
              onClose={() => setOpenFilter(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg text-sm font-medium"
            >
              {loading ? "Searching..." : "Find Job"}
            </button>
          </div>

          {/* Filter Status */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {pagination.totalJobs > 0 ? (
                <>Showing {(filters.page - 1) * filters.limit + 1}-
                {Math.min(filters.page * filters.limit, pagination.totalJobs)} of {pagination.totalJobs} jobs</>
              ) : (
                <>No jobs found</>
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
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Search Stats Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Searches */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Recent Searches</h3>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={() => searchHistoryService.clearSearchHistory()}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((search) => (
                    <div key={search._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition group">
                      <button
                        onClick={() => handleQuickSearch(search.searchQuery)}
                        className="flex-1 text-left text-sm text-gray-700 hover:text-blue-600"
                      >
                        {search.searchQuery || search.location || 'Search'}
                      </button>
                      <button
                        onClick={() => handleClearRecentSearch(search._id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent searches
                  </p>
                )}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Top 10 Popular</h3>
              </div>
              <div className="space-y-3">
                {popularSearches.slice(0, 10).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search.searchQuery)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-amber-700' :
                        'text-gray-300'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-gray-700 truncate">{search.searchQuery}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded whitespace-nowrap">
                      {search.totalSearches} searches
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingSearches.slice(0, 10).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search.searchQuery)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-300">
                        #{index + 1}
                      </span>
                      <span className="text-gray-700 truncate">{search.searchQuery}</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded whitespace-nowrap">
                      {search.recentSearches} recent
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="mt-8 flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading jobs...</span>
            </div>
          ) : (
            <>
              {/* Jobs Grid */}
              {jobs.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} onSaveToggle={fetchJobs} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
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
                        className={`w-10 h-10 rounded-lg ${
                          pagination.currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer/>
    </>
  );
}

// Job Card Component
function JobCard({ job, onSaveToggle }) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time':
        return 'bg-blue-100 text-blue-600';
      case 'part-time':
        return 'bg-green-100 text-green-600';
      case 'internship':
        return 'bg-purple-100 text-purple-600';
      case 'contract':
        return 'bg-yellow-100 text-yellow-600';
      case 'temporary':
        return 'bg-orange-100 text-orange-600';
      case 'remote':
        return 'bg-indigo-100 text-indigo-600';
      case 'freelance':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
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
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition group relative">
      <Link href={`/jobs/${job._id}`} className="block">
        <div className="flex justify-between items-start">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${getJobTypeColor(job.jobType)}`}
          >
            {job.jobType || 'Full-time'}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">
          {job.jobTitle}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Salary: {formatSalary(job.salaryRange)}
        </p>

        <div className="flex items-center gap-3 mt-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {job.employer?.companyName || job.employer?.name || 'Company'}
            </p>
            <p className="text-xs text-gray-500">
              {job.location?.city || 'Not specified'}{job.location?.city && job.location?.country ? ', ' : ''}
              {job.location?.country || ''}
              {job.location?.isRemote && ' • Remote'}
            </p>
          </div>
        </div>

        {/* Job Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Days remaining */}
        {job.daysRemaining > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            Expires in {job.daysRemaining} day{job.daysRemaining !== 1 ? 's' : ''}
          </div>
        )}
      </Link>
      
      {/* Save Button */}
      <button
        onClick={handleSaveJob}
        disabled={saving}
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition p-1"
        title={isSaved ? "Remove from saved" : "Save job"}
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="w-5 h-5 fill-current text-blue-600" />
        ) : (
          <Bookmark className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}