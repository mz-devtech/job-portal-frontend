"use client";

import { useState, useEffect } from "react";
import {
  FiMoreVertical,
  FiBookmark,
  FiMail,
  FiDownload,
  FiLoader,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiAlertCircle
} from "react-icons/fi";
import { candidateService } from "@/services/candidateService";
import { useRouter } from "next/navigation";
import CandidateDetailModal from "@/components/CandidateDetailModal";

export default function SavedCandidateMain() {
  const router = useRouter();
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSaved: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10
  });

  // Fetch saved candidates on mount and when filters change
  useEffect(() => {
    fetchSavedCandidates();
  }, [filters.page, filters.limit]);

  const fetchSavedCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await candidateService.getSavedCandidates({
        page: filters.page,
        limit: filters.limit
      });
      
      setSavedCandidates(response.savedCandidates || []);
      setPagination(response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalSaved: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (error) {
      console.error("Failed to fetch saved candidates:", error);
      setError("Failed to load saved candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (candidateId) => {
    try {
      await candidateService.unsaveCandidate(candidateId);
      // Remove from list
      setSavedCandidates(prev => prev.filter(c => c.candidate?._id !== candidateId));
      setPagination(prev => ({
        ...prev,
        totalSaved: prev.totalSaved - 1
      }));
    } catch (error) {
      console.error("Failed to unsave candidate:", error);
    }
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSendEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const handleDownloadCV = (cvUrl) => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <main
      className="
        mt-28
        w-full
        min-h-screen
        bg-gray-50
        px-4 py-4
        sm:px-6 sm:py-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)]
        md:overflow-y-auto
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Saved Candidates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.totalSaved > 0 
              ? `You have ${pagination.totalSaved} saved candidate${pagination.totalSaved !== 1 ? 's' : ''}`
              : 'No saved candidates yet'}
          </p>
        </div>

        {/* Results Per Page */}
        {savedCandidates.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show:</span>
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                limit: parseInt(e.target.value),
                page: 1 
              }))}
              className="border rounded-md px-2 py-1.5 text-sm bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <FiLoader className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="mt-4 text-sm text-gray-500">Loading saved candidates...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="bg-red-50 rounded-full p-4">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="mt-4 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchSavedCandidates}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && savedCandidates.length === 0 && (
        <div className="mt-20 flex flex-col items-center justify-center">
          <div className="bg-gray-100 rounded-full p-6">
            <FiBookmark className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">
            No saved candidates yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
            When you save candidates from search results, they will appear here.
            Start browsing candidates and save the ones you're interested in.
          </p>
          <button
            onClick={() => router.push('/find-candidates')}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Browse Candidates
          </button>
        </div>
      )}

      {/* Candidates List */}
      {!loading && !error && savedCandidates.length > 0 && (
        <>
          <div className="mt-6 rounded-lg bg-white shadow-sm divide-y border">
            {savedCandidates.map((saved) => {
              const candidate = saved.candidate || {};
              const profile = saved.profile || {};
              const user = candidate;
              const name = profile.personalInfo?.fullName || user.name || 'Anonymous';
              const title = profile.personalInfo?.title || 'Professional';
              const location = profile.accountSettings?.contact?.location || 'Location not specified';
              const profileImage = profile.personalInfo?.profileImage || user.avatar;
              const experience = profile.personalInfo?.experience;
              const education = profile.personalInfo?.education;
              const email = profile.accountSettings?.contact?.email || user.email;
              const cvUrl = profile.personalInfo?.cvUrl;
              const savedDate = saved.savedAt || saved.createdAt;
              
              return (
                <CandidateRow
                  key={saved._id}
                  candidate={{
                    _id: user._id,
                    name,
                    title,
                    location,
                    profileImage,
                    experience,
                    education,
                    email,
                    cvUrl,
                    savedDate,
                    fullProfile: profile,
                    user
                  }}
                  onUnsave={() => handleUnsave(user._id)}
                  onViewProfile={() => handleViewProfile({
                    ...user,
                    ...profile,
                    user
                  })}
                  onSendEmail={() => handleSendEmail(email)}
                  onDownloadCV={() => handleDownloadCV(cvUrl)}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalSaved)} of{' '}
                {pagination.totalSaved} candidates
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md">
                  {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        candidateId={selectedCandidate?._id}
        candidate={selectedCandidate}
      />
    </main>
  );
}

/* ---------------- Candidate Row ---------------- */

function CandidateRow({ 
  candidate, 
  onUnsave, 
  onViewProfile, 
  onSendEmail, 
  onDownloadCV 
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unsaving, setUnsaving] = useState(false);

  const handleUnsave = async (e) => {
    e.stopPropagation();
    setUnsaving(true);
    await onUnsave();
    setUnsaving(false);
    setOpenDropdown(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const formatSavedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center 
        justify-between px-4 sm:px-6 py-4
        hover:bg-gray-50/80 transition-colors
        gap-4 sm:gap-0
      "
    >
      {/* Left - Candidate Info */}
      <div className="flex items-start sm:items-center gap-4 flex-1">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {candidate.profileImage ? (
            <img
              src={candidate.profileImage}
              alt={candidate.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className={`h-12 w-12 rounded-full ${getAvatarColor(candidate.name)} flex items-center justify-center text-white font-medium text-lg`}>
              {getInitials(candidate.name)}
            </div>
          )}
          {candidate.experience && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <FiBriefcase className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 truncate">
              {candidate.name}
            </h3>
            {candidate.experience && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {candidate.experience}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-0.5">
            {candidate.title}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
            {candidate.location && candidate.location !== 'Location not specified' && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{candidate.location}</span>
              </span>
            )}
            
            {candidate.savedDate && (
              <span className="flex items-center gap-1">
                <FiBookmark className="w-3 h-3" />
                Saved {formatSavedDate(candidate.savedDate)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2 sm:gap-3 ml-14 sm:ml-0 relative">
        {/* Bookmark/Unsave */}
        <button
          onClick={handleUnsave}
          disabled={unsaving}
          className="rounded-md p-2 text-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
          title="Remove from saved"
        >
          {unsaving ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <FiBookmark className="w-4 h-4 fill-current" />
          )}
        </button>

        {/* View Profile */}
        <button
          onClick={onViewProfile}
          className="
            hidden sm:flex items-center gap-1 
            rounded-md bg-blue-600 px-4 py-2 
            text-sm font-medium text-white 
            hover:bg-blue-700 transition
          "
        >
          View Profile →
        </button>

        {/* Mobile View Profile */}
        <button
          onClick={onViewProfile}
          className="
            sm:hidden rounded-md bg-blue-600 px-3 py-1.5 
            text-xs font-medium text-white 
            hover:bg-blue-700 transition
          "
        >
          View
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="rounded-md p-2 hover:bg-gray-100 transition"
          >
            <FiMoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {openDropdown && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setOpenDropdown(false)}
              />
              <div
                className="
                  absolute right-0 top-9 z-40
                  w-48 rounded-md border bg-white shadow-lg
                  py-1 animate-in fade-in slide-in-from-top-2
                "
              >
                <DropdownItem
                  icon={<FiMail className="w-4 h-4" />}
                  label="Send Email"
                  onClick={() => {
                    onSendEmail();
                    setOpenDropdown(false);
                  }}
                  disabled={!candidate.email}
                />
                <DropdownItem
                  icon={<FiDownload className="w-4 h-4" />}
                  label="Download CV"
                  onClick={() => {
                    onDownloadCV();
                    setOpenDropdown(false);
                  }}
                  disabled={!candidate.cvUrl}
                />
                <div className="border-t my-1" />
                <DropdownItem
                  icon={<FiBookmark className="w-4 h-4" />}
                  label="Remove from saved"
                  onClick={handleUnsave}
                  className="text-red-600 hover:bg-red-50"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dropdown Item ---------------- */

function DropdownItem({ icon, label, onClick, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full items-center gap-2
        px-4 py-2 text-sm
        ${disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : `text-gray-700 hover:bg-gray-50 ${className}`
        }
        transition
      `}
    >
      {icon}
      {label}
    </button>
  );
}