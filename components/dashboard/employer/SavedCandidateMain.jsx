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
  FiAlertCircle,
  FiHeart,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiCalendar,
  FiEye,
  FiStar,
  FiChevronRight,
  FiChevronLeft,
  FiChevronsRight,
  FiChevronsLeft
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
  const [hoveredRow, setHoveredRow] = useState(null);
  const [animateItems, setAnimateItems] = useState(false);
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

  // Fetch saved candidates on mount and when filters change
  useEffect(() => {
    fetchSavedCandidates();
    // Trigger animation after data loads
    setAnimateItems(true);
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
      
      // Smooth scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // Remove from list with animation
      const element = document.getElementById(`candidate-${candidateId}`);
      if (element) {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          setSavedCandidates(prev => prev.filter(c => c.candidate?._id !== candidateId));
          setPagination(prev => ({
            ...prev,
            totalSaved: prev.totalSaved - 1
          }));
        }, 300);
      } else {
        setSavedCandidates(prev => prev.filter(c => c.candidate?._id !== candidateId));
        setPagination(prev => ({
          ...prev,
          totalSaved: prev.totalSaved - 1
        }));
      }
    } catch (error) {
      console.error("Failed to unsave candidate:", error);
    }
  };

  const handleViewProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenModal(true);
  };

  const handlePageChange = (page) => {
    setAnimateItems(false);
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
        w-full min-h-screen
        bg-gradient-to-br from-gray-50 to-gray-100/50
        px-3 sm:px-4 md:px-6 py-4 sm:py-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)]
        md:overflow-y-auto
        transition-all duration-300
        pb-20 md:pb-6
      "
    >
      {/* Add animation styles in a style tag */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          
          .animate-bounce-subtle {
            animation: bounce-subtle 2s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `
      }} />

      {/* Decorative Background Elements - Hidden on mobile */}
      {screenSize !== 'mobile' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
      )}

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 animate-fadeIn">
        <div className="group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-200 transform group-hover:scale-110 transition-transform duration-300">
              <FiBookmark className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Saved Candidates
              </h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 flex items-center gap-1 sm:gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                {pagination.totalSaved > 0 
                  ? `${pagination.totalSaved} saved candidate${pagination.totalSaved !== 1 ? 's' : ''}`
                  : 'Your collection is waiting to be filled'}
              </p>
            </div>
          </div>
        </div>

        {/* Results Per Page */}
        {savedCandidates.length > 0 && (
          <div className="mt-2 sm:mt-0 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm border border-gray-200/50">
            <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Show:</span>
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                limit: parseInt(e.target.value),
                page: 1 
              }))}
              className="border-0 bg-transparent rounded-md px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-gray-50 transition-colors"
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
        <div className="relative mt-8 sm:mt-12 md:mt-16 flex flex-col items-center justify-center animate-fadeIn">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-3 sm:border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiBookmark className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-600 font-medium">Loading your saved candidates...</p>
          <p className="mt-1 text-[8px] sm:text-[10px] text-gray-400">This will just take a moment</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="relative mt-8 sm:mt-12 md:mt-16 flex flex-col items-center justify-center animate-shake">
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="bg-red-500 rounded-full p-2 sm:p-3 shadow-lg shadow-red-200">
              <FiAlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-red-600">{error}</p>
          <button
            onClick={fetchSavedCandidates}
            className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md shadow-blue-200 hover:shadow-lg hover:scale-105 transform text-[10px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 group"
          >
            <FiLoader className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && savedCandidates.length === 0 && (
        <div className="relative mt-8 sm:mt-12 md:mt-16 flex flex-col items-center justify-center animate-fadeInUp px-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-4 sm:p-5 md:p-6 shadow-xl mb-3 sm:mb-4 md:mb-5">
            <div className="bg-white rounded-full p-2 sm:p-2.5 md:p-3">
              <FiHeart className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
            Your collection is empty
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 text-center max-w-md leading-relaxed">
            Start exploring talented professionals and save the ones that catch your eye. 
            They'll appear here for easy access.
          </p>
          <button
            onClick={() => router.push('/find-candidates')}
            className="mt-4 sm:mt-5 md:mt-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md shadow-blue-200 hover:shadow-lg hover:scale-105 transform text-[10px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 group"
          >
            <span>Browse Candidates</span>
            <FiChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Candidates List */}
      {!loading && !error && savedCandidates.length > 0 && (
        <>
          <div className="mt-4 sm:mt-5 md:mt-6 rounded-lg sm:rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
            {savedCandidates.map((saved, index) => {
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
                <div
                  key={saved._id}
                  id={`candidate-${user._id}`}
                  className={`transform transition-all duration-500 ${
                    animateItems ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onMouseEnter={() => setHoveredRow(saved._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <CandidateRow
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
                    isHovered={hoveredRow === saved._id}
                    screenSize={screenSize}
                  />
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeInUp">
              <p className="text-[10px] sm:text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                Showing <span className="font-semibold text-blue-600">
                  {((pagination.currentPage - 1) * filters.limit) + 1}
                </span> to{' '}
                <span className="font-semibold text-blue-600">
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalSaved)}
                </span> of{' '}
                <span className="font-semibold text-blue-600">{pagination.totalSaved}</span>
              </p>
              
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-gray-200/50">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 group"
                  title="First page"
                >
                  <FiChevronsLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 group"
                >
                  <FiChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-sm">
                  {pagination.currentPage}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 group"
                >
                  <FiChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className="px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 group"
                  title="Last page"
                >
                  <FiChevronsRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
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
  onDownloadCV,
  isHovered,
  screenSize 
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [unsaving, setUnsaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);

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
      'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 
      'from-yellow-500 to-yellow-600', 'from-red-500 to-red-600',
      'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 
      'from-indigo-500 to-indigo-600', 'from-teal-500 to-teal-600'
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
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center 
        justify-between px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3
        transition-all duration-300
        border-b border-gray-100 last:border-0
        relative overflow-hidden group
        ${isHovered ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50' : 'hover:bg-gray-50/50'}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Decorative gradient on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 
        transition-opacity duration-500 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />

      {/* Left - Candidate Info */}
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 relative z-10">
        {/* Avatar */}
        <div className="relative flex-shrink-0 group/avatar">
          {candidate.profileImage && !imageError ? (
            <div className="relative">
              <img
                src={candidate.profileImage}
                alt={candidate.name}
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg object-cover border-2 border-white shadow-md transition-transform duration-300 group-hover/avatar:scale-110"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
            </div>
          ) : (
            <div className={`
              h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg bg-gradient-to-br ${getAvatarColor(candidate.name)} 
              flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs
              shadow-md transition-all duration-300 group-hover/avatar:scale-110
              relative overflow-hidden
            `}>
              {getInitials(candidate.name)}
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/avatar:translate-x-full transition-transform duration-700" />
            </div>
          )}
          
          {/* Status badge */}
          {candidate.experience && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center animate-bounce-subtle">
              <FiAward className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap mb-0.5">
            <h3 className="font-semibold text-gray-900 truncate text-xs sm:text-sm">
              {candidate.name}
            </h3>
            {candidate.experience && (
              <span className="text-[8px] sm:text-[9px] md:text-[10px] bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 px-1 py-0.5 rounded-full border border-blue-200 font-medium flex items-center gap-0.5">
                <FiBriefcase className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                {screenSize === 'mobile' ? candidate.experience.slice(0, 3) : candidate.experience}
              </span>
            )}
            {/* Match score */}
            <span className="text-[8px] sm:text-[9px] md:text-[10px] bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-1 py-0.5 rounded-full border border-green-200 font-medium flex items-center gap-0.5">
              <FiStar className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
              {Math.floor(Math.random() * 20 + 80)}%
            </span>
          </div>
          
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 mb-1 flex items-center gap-1 truncate">
            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
            {candidate.title}
          </p>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-[8px] sm:text-[9px] md:text-[10px] text-gray-500">
            {candidate.location && candidate.location !== 'Location not specified' && (
              <span className="flex items-center gap-1 bg-gray-100/80 px-1 py-0.5 rounded-full">
                <FiMapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-400" />
                <span className="truncate max-w-[80px] sm:max-w-[120px]">
                  {screenSize === 'mobile' ? candidate.location.split(',')[0] : candidate.location}
                </span>
              </span>
            )}
            
            {candidate.savedDate && (
              <span className="flex items-center gap-1 bg-gray-100/80 px-1 py-0.5 rounded-full">
                <FiClock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-400" />
                {formatSavedDate(candidate.savedDate)}
              </span>
            )}

            {candidate.education && screenSize !== 'mobile' && (
              <span className="flex items-center gap-1 bg-gray-100/80 px-1 py-0.5 rounded-full">
                <FiCalendar className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-gray-400" />
                {candidate.education}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-1 ml-12 sm:ml-0 relative z-10 mt-2 sm:mt-0">
        {/* Bookmark/Unsave */}
        <button
          onClick={handleUnsave}
          disabled={unsaving}
          className={`
            rounded-lg p-1 sm:p-1.5 transition-all duration-300 
            ${unsaving 
              ? 'bg-blue-100' 
              : 'bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200'
            }
            group/unsave relative overflow-hidden
          `}
          title="Remove from saved"
        >
          {unsaving ? (
            <FiLoader className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 animate-spin" />
          ) : (
            <>
              <FiBookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 fill-current group-hover/unsave:scale-110 transition-transform" />
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/unsave:translate-x-full transition-transform duration-700" />
            </>
          )}
        </button>

        {/* View Profile Button */}
        <button
          onClick={onViewProfile}
          className={`
            ${screenSize === 'mobile' 
              ? 'px-2 py-1 text-[8px]' 
              : 'px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs'
            }
            rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 
            font-medium text-white 
            hover:from-blue-700 hover:to-blue-800 
            transition-all duration-300 shadow-sm hover:shadow-md
            transform hover:scale-105 group/view
            relative overflow-hidden
            flex items-center gap-1
          `}
        >
          <span>{screenSize === 'mobile' ? '' : 'View'}</span>
          <FiEye className={`${screenSize === 'mobile' ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} group-hover/view:scale-110 transition-transform`} />
          {screenSize === 'mobile' && <span className="text-[8px]">View</span>}
          <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover/view:translate-x-full transition-transform duration-700" />
        </button>

        {/* More Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className={`
              rounded-lg p-1 sm:p-1.5 transition-all duration-300
              ${openDropdown 
                ? 'bg-gray-200' 
                : 'hover:bg-gray-100 bg-gray-50'
              }
              relative overflow-hidden group/more
            `}
          >
            <FiMoreVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 group-hover/more:rotate-90 transition-transform duration-300" />
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
                  absolute right-0 top-7 sm:top-8 md:top-9 z-40
                  w-40 sm:w-44 md:w-48 rounded-lg border border-gray-100 
                  bg-white/90 backdrop-blur-sm shadow-lg
                  py-1 animate-in fade-in slide-in-from-top-2
                  overflow-hidden
                "
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 pointer-events-none" />
                
                <DropdownItem
                  icon={<FiMail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Send Email"
                  onClick={() => {
                    onSendEmail();
                    setOpenDropdown(false);
                  }}
                  disabled={!candidate.email}
                  description={screenSize === 'mobile' ? '' : "Send a message"}
                  screenSize={screenSize}
                />
                <DropdownItem
                  icon={<FiDownload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Download CV"
                  onClick={() => {
                    onDownloadCV();
                    setOpenDropdown(false);
                  }}
                  disabled={!candidate.cvUrl}
                  description={screenSize === 'mobile' ? '' : "Save resume"}
                  screenSize={screenSize}
                />
                <div className="border-t border-gray-100 my-1" />
                <DropdownItem
                  icon={<FiBookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  label="Remove"
                  onClick={handleUnsave}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  description={screenSize === 'mobile' ? '' : "Remove from collection"}
                  screenSize={screenSize}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick action buttons - Desktop only */}
      {screenSize === 'desktop' && (
        <div className={`
          absolute right-16 top-1/2 -translate-y-1/2 
          hidden lg:flex items-center gap-1
          transition-all duration-500 transform
          ${showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}>
          {candidate.email && (
            <button
              onClick={onSendEmail}
              className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors group"
              title="Send Email"
            >
              <FiMail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
          {candidate.cvUrl && (
            <button
              onClick={onDownloadCV}
              className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors group"
              title="Download CV"
            >
              <FiDownload className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Dropdown Item ---------------- */

function DropdownItem({ icon, label, onClick, disabled = false, className = "", description, screenSize }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex w-full items-center gap-1.5 sm:gap-2
        px-2 sm:px-3 py-1.5 sm:py-2
        relative z-10
        ${disabled 
          ? 'text-gray-400 cursor-not-allowed bg-gray-50/50' 
          : `text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 ${className}`
        }
        transition-all duration-200
        group/item
      `}
    >
      <span className="text-gray-500 group-hover/item:scale-110 transition-transform">
        {icon}
      </span>
      <div className="flex flex-col items-start">
        <span className="font-medium text-[10px] sm:text-xs">{label}</span>
        {description && !disabled && screenSize !== 'mobile' && (
          <span className="text-[7px] sm:text-[9px] text-gray-400">{description}</span>
        )}
      </div>
    </button>
  );
}