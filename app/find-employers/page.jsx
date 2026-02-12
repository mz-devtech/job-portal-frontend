"use client";

import Link from 'next/link';
import { Search, MapPin, Loader2, Building2, TrendingUp, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Navbar from '@/components/Navbar';
import SecondNavbar from '@/components/SecondNavbar';
import Footer from '@/components/Footer';
import { employerService } from '@/services/employerService';

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

  return (
    <>
      <Navbar />
      <SecondNavbar />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> /{' '}
            <span className="text-gray-800 font-medium">Find Employers</span>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Employers
            </h1>
            <p className="text-gray-600">
              Discover top companies and explore their job opportunities
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company name..."
                  className="w-full text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                <MapPin size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full text-sm outline-none"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition md:w-auto"
              >
                <Filter size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Industry Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry Type
                    </label>
                    <select
                      value={filters.industryType}
                      onChange={(e) => handleFilterChange('industryType', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Industries</option>
                      {employerService.getIndustryTypes().map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
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
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="companyInfo.companyName">Company Name</option>
                      <option value="stats.openJobs">Open Positions</option>
                      <option value="completionPercentage">Profile Completeness</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show featured only</span>
                  </label>

                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {pagination.totalEmployers > 0 ? (
                <>Showing {((pagination.currentPage - 1) * filters.limit) + 1}-
                {Math.min(pagination.currentPage * filters.limit, pagination.totalEmployers)} of {pagination.totalEmployers} employers</>
              ) : (
                <>No employers found</>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Results per page:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading employers...</span>
            </div>
          ) : (
            <>
              {/* Employers Grid */}
              {employers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employers.map((employer) => (
                    <EmployerCard key={employer._id} employer={employer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No employers found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
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
      </div>

      <Footer />
    </>
  );
}

// Employer Card Component
function EmployerCard({ employer }) {
  const logo = employerService.getCompanyLogo(employer);
  const location = employerService.formatLocation(employer);
  const isComplete = employerService.isProfileComplete(employer);
  
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Link href={`/find-employers/${employer.user?._id || employer._id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-blue-300 h-full flex flex-col">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-16 h-16 flex-shrink-0">
            {logo ? (
              <img 
                src={logo} 
                alt={employer.companyInfo?.companyName || 'Company'} 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className={`w-full h-full rounded-lg flex items-center justify-center text-white text-xl font-bold ${
                employer.companyInfo?.companyName ? 
                  `bg-gradient-to-br from-${employer.companyInfo.companyName[0].toLowerCase()}-500 to-${employer.companyInfo.companyName[0].toLowerCase()}-600` 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {getInitials(employer.companyInfo?.companyName || employer.user?.name)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800 text-lg truncate">
                {employer.companyInfo?.companyName || employer.user?.name || 'Company Name'}
              </h3>
              {employer.isFeatured && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                  Featured
                </span>
              )}
            </div>
            
            {employer.companyInfo?.aboutUs && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {employer.companyInfo.aboutUs}
              </p>
            )}
            
            {location && (
              <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                <MapPin size={14} />
                <span className="truncate">{location}</span>
              </p>
            )}

            {employer.foundingInfo?.industryType && (
              <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {employer.foundingInfo.industryType}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {employer.stats?.openJobs || 0}
              </p>
              <p className="text-xs text-gray-500">Open Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">
                {employer.stats?.totalJobs || 0}
              </p>
              <p className="text-xs text-gray-500">Total Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {employer.completionPercentage || 0}%
              </p>
              <p className="text-xs text-gray-500">Profile</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button className="w-full bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition">
            View Profile & Open Jobs
          </button>
        </div>
      </div>
    </Link>
  );
}