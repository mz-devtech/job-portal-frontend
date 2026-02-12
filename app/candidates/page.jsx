"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Search, MapPin, Loader2, Filter, X, 
  Briefcase, GraduationCap, Award, Bookmark,
  BookmarkCheck, ChevronDown, SlidersHorizontal
} from "lucide-react";
import DynamicNavbar from "@/components/DynamicNavbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { candidateService } from "@/services/candidateService";
import { useDebounce } from "@/hooks/useDebounce";
import CandidateDetailModal from "@/components/CandidateDetailModal";

export default function FindCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    experienceLevels: [],
    educationLevels: [],
    locations: [],
    genders: [],
    completionRanges: []
  });

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedLocation = useDebounce(locationTerm, 500);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    gender: "",
    experience: "",
    education: "",
    minCompletion: 0,
    page: 1,
    limit: 10,
    sortBy: "completionPercentage",
    sortOrder: "desc"
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCandidates: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
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

  // Fetch candidates when filters change
  useEffect(() => {
    fetchCandidates();
  }, [
    filters.search,
    filters.location,
    filters.gender,
    filters.experience,
    filters.education,
    filters.minCompletion,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder
  ]);

  const loadFilterOptions = async () => {
    try {
      const options = await candidateService.getCandidateFilters();
      setFilterOptions(options);
    } catch (error) {
      console.error("Failed to load filter options:", error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.gender && filters.gender !== 'All') params.gender = filters.gender;
      if (filters.experience && filters.experience !== 'All') params.experience = filters.experience;
      if (filters.education && filters.education !== 'All') params.education = filters.education;
      if (filters.minCompletion > 0) params.minCompletion = filters.minCompletion;
      
      params.page = filters.page;
      params.limit = filters.limit;
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const response = await candidateService.getAllCandidates(params);
      
      setCandidates(response.candidates || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCandidates: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
      
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setFilters({
      search: "",
      location: "",
      gender: "",
      experience: "",
      education: "",
      minCompletion: 0,
      page: 1,
      limit: 10,
      sortBy: "completionPercentage",
      sortOrder: "desc"
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.experience) count++;
    if (filters.education) count++;
    if (filters.minCompletion > 0) count++;
    if (filters.search) count++;
    if (filters.location) count++;
    return count;
  };

  return (
    <>
      <DynamicNavbar />
      <SecondNavbar />

      <main className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find Candidates
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover talented professionals and connect with them for your next hire
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, title, or skills..."
                  className="w-full text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 flex items-center gap-2 border rounded-lg px-4 py-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full text-sm outline-none"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              <button
                onClick={fetchCandidates}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Search
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Advanced Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Experience Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Experience</option>
                      {filterOptions.experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Education Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level
                    </label>
                    <select
                      value={filters.education}
                      onChange={(e) => handleFilterChange('education', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Education</option>
                      {filterOptions.educationLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gender Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Genders</option>
                      {filterOptions.genders?.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  {/* Profile Completion Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Completion
                    </label>
                    <select
                      value={filters.minCompletion}
                      onChange={(e) => handleFilterChange('minCompletion', parseInt(e.target.value))}
                      className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {filterOptions.completionRanges?.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Sort By:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="completionPercentage">Profile Completion</option>
                      <option value="personalInfo.fullName">Name</option>
                      <option value="createdAt">Recently Joined</option>
                      <option value="lastUpdated">Recently Updated</option>
                    </select>
                    
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>

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
        </div>

        {/* Results Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              {pagination.totalCandidates > 0 ? (
                <>Showing {((pagination.currentPage - 1) * filters.limit) + 1}-
                {Math.min(pagination.currentPage * filters.limit, pagination.totalCandidates)} of {pagination.totalCandidates} candidates</>
              ) : (
                <>No candidates found</>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading candidates...</span>
            </div>
          ) : (
            <>
              {candidates.length > 0 ? (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate._id}
                      candidate={candidate}
                      onViewProfile={() => handleViewProfile(candidate)}
                      onSaveToggle={fetchCandidates}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No candidates found
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
      </main>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        candidateId={selectedCandidate?.user?._id || selectedCandidate?.user}
        candidate={selectedCandidate}
      />

      <Footer />
    </>
  );
}

// Candidate Card Component
function CandidateCard({ candidate, onViewProfile, onSaveToggle }) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(candidate.stats?.isSaved || false);
  
  const profile = candidate;
  const user = candidate.user || {};
  const name = profile.personalInfo?.fullName || user.name || 'Anonymous';
  const title = profile.personalInfo?.title || 'Professional';
  const location = candidateService.formatLocation(profile);
  const profileImage = candidateService.getProfileImage(profile);
  const initials = candidateService.getInitials(name);
  const avatarColor = candidateService.getAvatarColor(name);
  const completionPercentage = profile.completionPercentage || 0;
  const completionColor = candidateService.getCompletionColor(completionPercentage);
  const completionBgColor = candidateService.getCompletionBgColor(completionPercentage);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (saving) return;
    
    try {
      setSaving(true);
      if (isSaved) {
        await candidateService.unsaveCandidate(user._id);
        setIsSaved(false);
      } else {
        await candidateService.saveCandidate(user._id);
        setIsSaved(true);
      }
      if (onSaveToggle) onSaveToggle();
    } catch (error) {
      console.error("Failed to toggle save:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onViewProfile}
      className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className={`w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center text-white text-xl font-bold`}>
                {initials}
              </div>
            )}
            {completionPercentage >= 80 && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800 text-lg">
                {name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${completionBgColor} ${completionColor}`}>
                {completionPercentage}% Complete
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{title}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              {location && location !== 'Location not specified' && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </span>
              )}
              
              {profile.personalInfo?.experience && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {profile.personalInfo.experience}
                </span>
              )}
              
              {profile.personalInfo?.education && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {profile.personalInfo.education}
                </span>
              )}
              
              {candidate.age && (
                <span className="flex items-center gap-1">
                  {candidate.age} years old
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:flex-col lg:flex-row">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-2 rounded-lg transition ${
              isSaved
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={isSaved ? "Remove from saved" : "Save candidate"}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck className="w-5 h-5 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onViewProfile}
            className="px-4 py-2 rounded-md text-sm border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium"
          >
            View Profile →
          </button>
        </div>
      </div>
    </div>
  );
}