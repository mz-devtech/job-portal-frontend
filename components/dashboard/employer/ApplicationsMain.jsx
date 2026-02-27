"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiMoreVertical,
  FiDownload,
  FiPlus,
  FiX,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiSettings,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiBriefcase,
  FiStar,
  FiEye,
  FiCheck
} from "react-icons/fi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/applicationService";
import { statusService } from "@/services/statusService";
import toast from "react-hot-toast";
import StatusManagementModal from "@/components/dashboard/employer/StatusManagementModal";

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId;
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showStatusManagement, setShowStatusManagement] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [stats, setStats] = useState({});
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Column scroll state
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHoveringColumns, setIsHoveringColumns] = useState(false);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (jobId && mounted) {
      fetchAllData();
    }
  }, [jobId, sortBy, mounted]);

  // Check scroll position for arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && mounted) {
      checkScrollPosition();
      
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [statuses, applications, mounted]);

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch job details
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);
      
      // Fetch applications for this job
      const response = await jobService.getJobApplications(jobId, {
        limit: 100,
        sortBy: sortBy === "newest" ? "appliedAt" : sortBy === "oldest" ? "appliedAt" : "candidate.name",
        sortOrder: sortBy === "newest" ? "desc" : sortBy === "oldest" ? "asc" : "asc",
      });
      
      setApplications(response.applications || []);
      setStats(response.stats || {});
      
      // Fetch custom statuses
      const statusesData = await statusService.getStatuses();
      
      // Merge default and custom statuses
      const defaultStatuses = [
        { 
          _id: "pending", 
          key: "pending", 
          name: "Pending", 
          color: "bg-yellow-100 text-yellow-800",
          isDefault: true,
          order: 1 
        },
        { 
          _id: "reviewed", 
          key: "reviewed", 
          name: "Reviewed", 
          color: "bg-blue-100 text-blue-800",
          isDefault: true,
          order: 2 
        },
        { 
          _id: "shortlisted", 
          key: "shortlisted", 
          name: "Shortlisted", 
          color: "bg-purple-100 text-purple-800",
          isDefault: true,
          order: 3 
        },
        { 
          _id: "interview", 
          key: "interview", 
          name: "Interview", 
          color: "bg-indigo-100 text-indigo-800",
          isDefault: true,
          order: 4 
        },
        { 
          _id: "hired", 
          key: "hired", 
          name: "Hired", 
          color: "bg-green-100 text-green-800",
          isDefault: true,
          order: 5 
        },
        { 
          _id: "rejected", 
          key: "rejected", 
          name: "Rejected", 
          color: "bg-red-100 text-red-800",
          isDefault: true,
          order: 6 
        },
      ];

      // Combine default and custom statuses, remove duplicates
      const allStatuses = [...defaultStatuses];
      
      statusesData.forEach(customStatus => {
        if (!allStatuses.find(s => s.key === customStatus.key)) {
          allStatuses.push(customStatus);
        }
      });

      // Sort by order
      allStatuses.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      setStatuses(allStatuses);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const applicationId = active.id;
    
    // Get the destination status ID from the droppable container
    const destinationStatusId = over.id;
    
    // Find the application and destination status
    const application = applications.find(app => app._id === applicationId);
    const destinationStatus = statuses.find(s => s.key === destinationStatusId || s._id === destinationStatusId);

    if (!application || !destinationStatus) {
      console.error("Application or destination status not found", { application, destinationStatus });
      return;
    }

    // If dropped in the same status, do nothing
    if (application.status === destinationStatus.key) return;

    // Optimistic update
    const updatedApplications = applications.map(app => {
      if (app._id === applicationId) {
        return { 
          ...app, 
          status: destinationStatus.key,
        };
      }
      return app;
    });

    setApplications(updatedApplications);

    // Update stats optimistically
    const newStats = { ...stats };
    if (stats[application.status] > 0) newStats[application.status]--;
    newStats[destinationStatus.key] = (newStats[destinationStatus.key] || 0) + 1;
    setStats(newStats);

    const toastId = toast.loading("Updating application status...");

    try {
      await applicationService.updateApplicationStatus(applicationId, destinationStatus.key);
      toast.dismiss(toastId);
      toast.success(`Application moved to ${destinationStatus.name}`);
    } catch (error) {
      // Revert on error
      fetchAllData();
      toast.dismiss(toastId);
      toast.error("Failed to update status");
    }
  };

  const handleUpdateStatus = async (applicationId, statusKey) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, statusKey);
      fetchAllData();
      setSelectedCandidate(null);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDownloadResume = async (applicationId) => {
    try {
      await applicationService.downloadResume(applicationId);
    } catch (error) {
      toast.error("Failed to download resume");
    }
  };

  const getApplicationsByStatus = (statusKey) => {
    return applications.filter(app => app.status === statusKey);
  };

  const sortApplications = (apps) => {
    if (sortBy === "newest") {
      return [...apps].sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    } else if (sortBy === "oldest") {
      return [...apps].sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
    } else if (sortBy === "name") {
      return [...apps].sort((a, b) => 
        (a.candidate?.name || "").localeCompare(b.candidate?.name || "")
      );
    }
    return apps;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (statusKey) => {
    const status = statuses.find(s => s.key === statusKey);
    return status?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusName = (statusKey) => {
    const status = statuses.find(s => s.key === statusKey);
    return status?.name || statusKey || "Unknown";
  };

  const getStatusCount = (statusKey) => {
    if (statusKey === "pending") return stats.pending || 0;
    if (statusKey === "reviewed") return stats.reviewed || 0;
    if (statusKey === "shortlisted") return stats.shortlisted || 0;
    if (statusKey === "interview") return stats.interview || 0;
    if (statusKey === "hired") return stats.hired || 0;
    if (statusKey === "rejected") return stats.rejected || 0;
    
    // For custom statuses, count from applications
    return applications.filter(app => app.status === statusKey).length;
  };

  // Helper function to format location safely
  const formatLocation = (location) => {
    if (!location) return "Not specified";
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      const parts = [];
      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.country) parts.push(location.country);
      if (parts.length > 0) return parts.join(', ');
      if (location.isRemote) return "Remote";
    }
    return "Not specified";
  };

  if (!mounted) {
    return (
      <main className="w-full min-h-screen bg-gray-50 px-3 sm:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-3 sm:border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">Loading applications...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gray-50 px-3 sm:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-3 sm:border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">Loading applications...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:ml-[260px] md:w-[calc(100%-260px)]">
      {/* Breadcrumb - Hidden on mobile */}
      <div className="hidden sm:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        <Link href="/employer/my-jobs" className="hover:text-blue-600 transition">
          My Jobs
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-medium truncate max-w-[150px] sm:max-w-[200px]">
          {job?.title || "Job Title"}
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-blue-600 font-medium">Applications</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Left side - Job Title and Status Badge */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {job?.title || "Aliqua Enim cumque"}
          </h1>
          <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[8px] sm:text-xs font-medium whitespace-nowrap">
            {job?.status || "Active"}
          </span>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Status Management Button */}
          <button
            onClick={() => setShowStatusManagement(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <FiSettings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Manage statuses</span>
            <span className="sm:hidden">Status</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <span className="hidden sm:inline">
                Sort by: <span className="font-medium text-gray-900">
                  {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Name"}
                </span>
              </span>
              <span className="sm:hidden">
                {sortBy === "newest" ? "New" : sortBy === "oldest" ? "Old" : "A-Z"}
              </span>
              <FiChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-8 sm:top-10 w-32 sm:w-48 rounded-lg border bg-white shadow-lg z-40 py-1">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setSortOpen(false);
                    }}
                    className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-left text-[10px] sm:text-sm hover:bg-gray-50 flex items-center justify-between ${
                      sortBy === "newest" ? "text-blue-600 bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    <span>Newest First</span>
                    {sortBy === "newest" && <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setSortOpen(false);
                    }}
                    className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-left text-[10px] sm:text-sm hover:bg-gray-50 flex items-center justify-between ${
                      sortBy === "oldest" ? "text-blue-600 bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    <span>Oldest First</span>
                    {sortBy === "oldest" && <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("name");
                      setSortOpen(false);
                    }}
                    className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-left text-[10px] sm:text-sm hover:bg-gray-50 flex items-center justify-between ${
                      sortBy === "name" ? "text-blue-600 bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    <span>Name A-Z</span>
                    {sortBy === "name" && <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Job Info Bar - Responsive */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-[10px] sm:text-xs bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
          <div className="p-1 sm:p-1.5 bg-blue-50 rounded-lg">
            <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <span className="truncate max-w-[100px] sm:max-w-[150px]">
            {job?.location ? formatLocation(job.location) : "Select city, Italy"}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600">
          <div className="p-1 sm:p-1.5 bg-purple-50 rounded-lg">
            <FiBriefcase className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
          </div>
          <span>{job?.type || "Temporary"}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900 font-medium">
          <div className="p-1 sm:p-1.5 bg-green-50 rounded-lg">
            <FiUser className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
          </div>
          <span>{applications.length} total</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-600 ml-auto">
          <div className="flex -space-x-1 sm:-space-x-2">
            {[1,2,3].map((i) => (
              <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-gray-200 border border-white" />
            ))}
          </div>
          <span className="text-[8px] sm:text-xs text-gray-500">12 new</span>
        </div>
      </div>

      {/* Columns Container with Drag & Drop and Navigation Arrows */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="relative group/columns mt-3 sm:mt-4"
          onMouseEnter={() => setIsHoveringColumns(true)}
          onMouseLeave={() => setIsHoveringColumns(false)}
        >
          <div className="relative">
            {/* Left Navigation Arrow */}
            {(isHoveringColumns || showLeftArrow) && showLeftArrow && screenSize !== 'mobile' && (
              <button
                onClick={scrollLeft}
                className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:border-gray-300 transition-all hover:scale-110"
                aria-label="Scroll left"
              >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {(isHoveringColumns || showRightArrow) && showRightArrow && screenSize !== 'mobile' && (
              <button
                onClick={scrollRight}
                className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:border-gray-300 transition-all hover:scale-110"
                aria-label="Scroll right"
              >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Scrollable Columns */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
              style={{ 
                minHeight: screenSize === 'mobile' ? "auto" : "calc(100vh - 380px)",
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onScroll={checkScrollPosition}
            >
              <div className="flex gap-3 sm:gap-4 md:gap-5" style={{ minWidth: screenSize === 'mobile' ? "max-content" : "max-content" }}>
                {statuses.map((status) => {
                  const columnApps = sortApplications(getApplicationsByStatus(status.key));
                  const statusCount = getStatusCount(status.key);
                  
                  return (
                    <DroppableColumn
                      key={status.key}
                      id={status.key}
                      status={status}
                      statusCount={statusCount}
                      screenSize={screenSize}
                    >
                      <SortableContext
                        items={columnApps.map(app => app._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="flex-1 p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto max-h-[calc(100vh-420px)]">
                          {columnApps.length > 0 ? (
                            columnApps.map((app) => (
                              <SortableApplicantCard
                                key={app._id}
                                id={app._id}
                                application={app}
                                statuses={statuses}
                                onClick={() => setSelectedCandidate(app)}
                                onDownloadResume={() => handleDownloadResume(app._id)}
                                onUpdateStatus={(newStatus) => handleUpdateStatus(app._id, newStatus)}
                                getStatusColor={getStatusColor}
                                getStatusName={getStatusName}
                                formatDate={formatDate}
                                formatLocation={formatLocation}
                                screenSize={screenSize}
                              />
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 p-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                                <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              </div>
                              <p className="text-[8px] sm:text-xs text-gray-500">No applications</p>
                              {screenSize !== 'mobile' && (
                                <p className="text-[7px] sm:text-[10px] text-gray-400 mt-1">Drag to move</p>
                              )}
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </DroppableColumn>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <div className="w-[280px] sm:w-[300px] md:w-[320px] transform rotate-2 scale-105 transition-all">
              <ApplicantCardOverlay
                application={applications.find(app => app._id === activeId)}
                getStatusColor={getStatusColor}
                getStatusName={getStatusName}
                formatDate={formatDate}
                formatLocation={formatLocation}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Status Management Modal */}
      <StatusManagementModal
        isOpen={showStatusManagement}
        onClose={() => setShowStatusManagement(false)}
        onStatusesChange={fetchAllData}
      />

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          statuses={statuses}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStatus={handleUpdateStatus}
          onDownloadResume={handleDownloadResume}
          formatDate={formatDate}
          formatLocation={formatLocation}
          getStatusColor={getStatusColor}
          getStatusName={getStatusName}
          screenSize={screenSize}
        />
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </main>
  );
}

/* ================= Droppable Column Component ================= */
function DroppableColumn({ id, status, statusCount, children, screenSize }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // Get color class for the column header
  const getHeaderColor = (statusKey) => {
    const colors = {
      pending: 'bg-yellow-50 border-yellow-200',
      reviewed: 'bg-blue-50 border-blue-200',
      shortlisted: 'bg-purple-50 border-purple-200',
      interview: 'bg-indigo-50 border-indigo-200',
      hired: 'bg-green-50 border-green-200',
      rejected: 'bg-red-50 border-red-200',
    };
    return colors[statusKey] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] rounded-lg sm:rounded-xl bg-white border shadow-sm flex flex-col transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-50 shadow-lg scale-[1.01] sm:scale-[1.02]' : ''
      }`}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-b rounded-t-lg sm:rounded-t-xl ${getHeaderColor(status.key)}`}>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${status.color.split(' ')[0]}`} />
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {screenSize === 'mobile' ? status.name.slice(0, 3) : status.name}
          </span>
          <span className="px-1 sm:px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-[8px] sm:text-xs font-medium text-gray-600">
            {statusCount}
          </span>
        </div>
        <button className="p-1 hover:bg-white/50 rounded-lg transition text-gray-500 hover:text-gray-700">
          <FiMoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ================= Sortable Applicant Card Component ================= */
function SortableApplicantCard({ 
  id,
  application, 
  statuses,
  onClick, 
  onDownloadResume,
  onUpdateStatus,
  getStatusColor,
  getStatusName,
  formatDate,
  formatLocation,
  screenSize
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: id,
    data: {
      type: 'application',
      application: application
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const [showActions, setShowActions] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const candidate = application.candidate || {};
  const statusBadge = getStatusColor(application.status);
  const statusName = getStatusName(application.status);
  
  // Format location safely
  const location = candidate.location ? formatLocation(candidate.location) : null;
  
  // Match email from screenshot
  const displayEmail = candidate.email || "roboged218@deposin.com";
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`rounded-lg sm:rounded-xl border p-2 sm:p-3 md:p-4 transition-all bg-white relative group ${
        isDragging 
          ? 'shadow-xl ring-2 ring-blue-400 rotate-1 scale-105 z-50' 
          : 'hover:shadow-lg hover:border-blue-200 hover:scale-[1.01] sm:hover:scale-[1.02]'
      }`}
    >
      {/* Drag Handle Indicator */}
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition">
        <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400" />
        </div>
      </div>

      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar name={candidate.name || candidate.username || "Scarlett Peterson"} size={screenSize} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-xs sm:text-sm">
              {candidate.name || candidate.username || "Scarlett Peterson"}
            </p>
            <p className="text-[8px] sm:text-xs text-gray-500 truncate flex items-center gap-1">
              <FiMail className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
              {screenSize === 'mobile' ? displayEmail.slice(0, 10) + '...' : displayEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 sm:space-y-2 text-[8px] sm:text-xs text-gray-600">
        {candidate.phone && (
          <p className="flex items-center gap-1">
            <span className="text-gray-400">📞</span> 
            <span>{candidate.phone}</span>
          </p>
        )}
        {location && (
          <p className="flex items-center gap-1">
            <FiMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3.5 text-gray-400" /> 
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-1">
          <FiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3.5 text-gray-400" /> 
          <span>Applied {formatDate(application.appliedAt)}</span>
        </p>
      </div>

      {/* Status Badge */}
      <div className="mt-2 sm:mt-3 flex items-center justify-between">
        <span className={`text-[7px] sm:text-[9px] md:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${statusBadge}`}>
          {screenSize === 'mobile' ? statusName.slice(0, 3) : statusName}
        </span>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownloadResume();
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-blue-600"
            title="Download Resume"
          >
            <FiDownload className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700"
              title="Change Status"
            >
              <FiMoreVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3.5" />
            </button>

            {/* Status Update Dropdown */}
            {showStatusMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowStatusMenu(false)} />
                <div className="absolute right-0 top-6 sm:top-8 z-40 w-36 sm:w-44 md:w-48 rounded-lg border bg-white shadow-lg py-1 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto">
                  {statuses.map((status) => (
                    <button
                      key={status._id || status.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(status.key);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left text-[8px] sm:text-xs hover:bg-gray-50 flex items-center gap-1 sm:gap-2 ${
                        application.status === status.key ? 'bg-gray-50' : ''
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${status.color.split(' ')[0]}`} />
                      <span className={application.status === status.key ? 'font-medium' : ''}>
                        {status.name}
                      </span>
                      {application.status === status.key && (
                        <span className="ml-auto text-[7px] sm:text-[9px] text-gray-400">Current</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Drag Overlay Card ================= */
function ApplicantCardOverlay({ application, getStatusColor, getStatusName, formatDate, formatLocation }) {
  if (!application) return null;
  
  const candidate = application.candidate || {};
  const statusBadge = getStatusColor(application.status);
  const statusName = getStatusName(application.status);
  const location = candidate.location ? formatLocation(candidate.location) : null;
  const displayEmail = candidate.email || "roboged218@deposin.com";
  
  return (
    <div className="rounded-xl border-2 border-blue-400 bg-white p-3 sm:p-4 shadow-2xl">
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar name={candidate.name || candidate.username || "Scarlett Peterson"} size="desktop" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            {candidate.name || candidate.username || "Scarlett Peterson"}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 flex items-center gap-1">
            <FiMail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {displayEmail}
          </p>
          {location && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
              <FiMapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {location}
            </p>
          )}
          <div className="mt-2">
            <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${statusBadge}`}>
              {statusName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Candidate Detail Modal ================= */
function CandidateDetailModal({ 
  candidate, 
  statuses,
  onClose, 
  onUpdateStatus,
  onDownloadResume,
  formatDate,
  formatLocation,
  getStatusColor,
  getStatusName,
  screenSize
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const candidateData = candidate.candidate || {};
  const statusBadge = getStatusColor(candidate.status);
  const statusName = getStatusName(candidate.status);
  const location = candidateData.location ? formatLocation(candidateData.location) : null;
  const displayEmail = candidateData.email || "roboged218@deposin.com";
  const displayName = candidateData.name || candidateData.username || "Scarlett Peterson";

  const handleStatusUpdate = async (statusKey) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(candidate._id, statusKey);
      setShowStatusMenu(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-[95%] sm:max-w-[90%] md:max-w-[1100px] h-[90vh] bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 sm:right-4 sm:top-4 h-6 w-6 sm:h-8 sm:w-8 rounded-full border flex items-center justify-center hover:bg-gray-100 z-10 bg-white shadow-md hover:shadow-lg transition-all"
        >
          <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* LEFT - Candidate Details */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 md:mb-8">
            <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white shadow-lg">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                {displayName}
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-1 flex items-center gap-1">
                <FiMail className="w-3 h-3 sm:w-4 sm:h-4" />
                {displayEmail}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium ${statusBadge}`}>
                  {statusName}
                </span>
                <span className="text-[8px] sm:text-xs text-gray-500 flex items-center gap-1">
                  <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Applied {formatDate(candidate.appliedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <Section title="Contact Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl">
              <InfoItem label="Phone" value={candidateData.phone} screenSize={screenSize} />
              <InfoItem label="Location" value={location} screenSize={screenSize} />
              <InfoItem label="Email" value={displayEmail} screenSize={screenSize} />
              {candidateData.portfolio && (
                <InfoItem label="Portfolio" value={candidateData.portfolio} isLink screenSize={screenSize} />
              )}
            </div>
          </Section>

          {/* Cover Letter */}
          <Section title="Cover Letter">
            <div 
              className="text-[10px] sm:text-xs md:text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: candidate.coverLetter || "<p class='text-gray-400 italic'>No cover letter provided.</p>" 
              }}
            />
          </Section>

          {/* Skills */}
          {candidateData.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {candidateData.skills.map((skill, i) => (
                  <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 text-blue-700 rounded-lg text-[8px] sm:text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {candidateData.experience?.length > 0 && (
            <Section title="Work Experience">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {candidateData.experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{exp.title}</h4>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1">{exp.company}</p>
                    <p className="text-[8px] sm:text-xs text-gray-500 mt-1">{exp.duration}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT - Actions */}
        <div className="w-full sm:w-[280px] md:w-[320px] lg:w-[360px] border-t sm:border-t-0 sm:border-l bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto">
          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <button
              onClick={() => window.location.href = `mailto:${displayEmail}`}
              className="w-full rounded-lg sm:rounded-xl border bg-white px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow"
            >
              <FiMail className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Send Email</span>
            </button>
            
            <button
              onClick={() => onDownloadResume(candidate._id)}
              className="w-full rounded-lg sm:rounded-xl border bg-white px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:bg-gray-50 transition-all shadow-sm hover:shadow"
            >
              <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Download Resume</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isUpdating}
                className="w-full rounded-lg sm:rounded-xl bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiMoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Update Status</span>
                  </>
                )}
              </button>

              {showStatusMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowStatusMenu(false)} />
                  <div className="absolute bottom-12 left-0 w-full rounded-lg sm:rounded-xl border bg-white shadow-xl z-40 py-1 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto">
                    {statuses.map((status) => (
                      <button
                        key={status._id || status.key}
                        onClick={() => handleStatusUpdate(status.key)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-[8px] sm:text-xs hover:bg-gray-50 flex items-center gap-1 sm:gap-2 ${
                          candidate.status === status.key ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${status.color.split(' ')[0]}`} />
                        <span className={candidate.status === status.key ? 'font-medium text-blue-600' : ''}>
                          {status.name}
                        </span>
                        {candidate.status === status.key && (
                          <span className="ml-auto text-[7px] sm:text-xs text-gray-400">Current</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resume Info */}
          {candidate.resume && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-5 bg-white rounded-lg sm:rounded-xl border shadow-sm">
              <p className="text-[8px] sm:text-xs text-gray-500 mb-1 sm:mb-2">Resume</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg">
                  <FiDownload className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-sm font-medium text-gray-900 truncate">
                    {candidate.resume.originalName || "Resume.pdf"}
                  </p>
                  <p className="text-[8px] sm:text-xs text-gray-500">
                    {candidate.resume.size ? `${(candidate.resume.size / 1024).toFixed(0)} KB` : "Size not available"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <Section title="Application Timeline">
            {candidate.statusHistory?.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {candidate.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1 sm:mt-1.5 rounded-full ${getStatusColor(history.status).split(' ')[0]}`} />
                    <div className="flex-1">
                      <p className="text-[8px] sm:text-xs font-medium text-gray-900">
                        Status changed to {getStatusName(history.status)}
                      </p>
                      <p className="text-[7px] sm:text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <FiClock className="w-2 h-2 sm:w-3 sm:h-3" />
                        {formatDate(history.updatedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[8px] sm:text-xs text-gray-500 italic">No status history</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */
function Avatar({ name, size = 'desktop' }) {
  const initial = name?.charAt(0) || "S";
  
  const sizeClasses = {
    mobile: 'h-8 w-8 text-xs',
    tablet: 'h-9 w-9 text-sm',
    desktop: 'h-10 w-10 text-sm'
  };
  
  // Generate consistent color based on name
  const getColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600',
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.desktop} rounded-lg sm:rounded-xl bg-gradient-to-br ${getColor(name)} flex items-center justify-center font-semibold text-white flex-shrink-0 shadow-sm`}>
      {initial}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <h3 className="text-[8px] sm:text-xs font-semibold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value, isLink, screenSize }) {
  if (!value) return null;
  
  const textSize = screenSize === 'mobile' ? 'text-[10px]' : 'text-xs sm:text-sm';
  
  return (
    <div>
      <p className="text-[8px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className={`${textSize} font-medium text-blue-600 hover:underline break-words`}>
          {value}
        </a>
      ) : (
        <p className={`${textSize} font-medium text-gray-900 break-words`}>
          {value}
        </p>
      )}
    </div>
  );
}