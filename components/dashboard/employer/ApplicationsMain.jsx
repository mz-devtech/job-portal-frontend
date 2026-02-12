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
import EmployerSidebar from "@/components/dashboard/employer/EmployerSideBar";
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
  
  // Column scroll state
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHoveringColumns, setIsHoveringColumns] = useState(false);

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
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
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
      // If it's an object with address/city/country
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
    // Return a skeleton loader with fixed className strings to avoid hydration mismatch
    return (
      <div className="flex pt-28">
        <EmployerSidebar />
        <main className="w-full min-h-screen bg-gray-50 px-6 py-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-3 text-gray-600">Loading applications...</p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex pt-28">
        <EmployerSidebar />
        <main className="w-full min-h-screen bg-gray-50 px-6 py-6 md:ml-[260px] md:w-[calc(100%-260px)] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-3 text-gray-600">Loading applications...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex pt-28">
      <EmployerSidebar />
      
      <main className="w-full min-h-screen bg-gray-50 px-6 py-6 md:ml-[260px] md:w-[calc(100%-260px)]">
        {/* Breadcrumb - Matching screenshot */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/employer/my-jobs" className="hover:text-blue-600">
            My Jobs
          </Link>
          <span>/</span>
          <span className="text-gray-700">{job?.title || "Aliqua Enim cumque"}</span>
          <span>/</span>
          <span className="text-blue-600 font-medium">Applications</span>
        </div>

        {/* Header - Redesigned to match screenshot */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {job?.title || "Aliqua Enim cumque"}
            </h1>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              Applications
            </span>
                <div className="flex items-center gap-3">
            {/* Status Management Button - MATCHING SCREENSHOT */}
            <button
              onClick={() => setShowStatusManagement(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
            >
              <FiSettings className="w-4 h-4" />
              Manage statuses
            </button>

            {/* Sort Dropdown - MATCHING SCREENSHOT */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
              >
                <span>Sort column</span>
                <FiChevronDown className="w-4 h-4" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-11 w-48 rounded-lg border bg-white shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      sortBy === "newest" ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      sortBy === "oldest" ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("name");
                      setSortOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      sortBy === "name" ? "text-blue-600 font-medium bg-blue-50" : "text-gray-700"
                    }`}
                  >
                    Name A-Z
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
          
      
        </div>

        {/* Job Info - Matching screenshot */}
        <div className="flex items-center gap-6 mb-8 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="w-4 h-4" />
            <span>{job?.location ? formatLocation(job.location) : "Select city, Italy"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiCalendar className="w-4 h-4" />
            <span>{job?.type || "Temporary"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <FiUser className="w-4 h-4" />
            <span>{applications.length} total applications</span>
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
            className="relative group/columns"
            onMouseEnter={() => setIsHoveringColumns(true)}
            onMouseLeave={() => setIsHoveringColumns(false)}
          >
            {/* Navigation Arrows Container - FIXED POSITIONING */}
            <div className="relative">
              {/* Left Navigation Arrow - ALWAYS VISIBLE WHEN SCROLLABLE */}
              {(isHoveringColumns || showLeftArrow) && showLeftArrow && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:border-gray-300 transition-all -ml-5"
                  aria-label="Scroll left"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right Navigation Arrow - ALWAYS VISIBLE WHEN SCROLLABLE */}
              {(isHoveringColumns || showRightArrow) && showRightArrow && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:shadow-xl hover:border-gray-300 transition-all -mr-5"
                  aria-label="Scroll right"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Scrollable Columns */}
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
                style={{ 
                  minHeight: "calc(100vh - 280px)",
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
                onScroll={checkScrollPosition}
              >
                <div className="flex gap-6" style={{ minWidth: "max-content" }}>
                  {statuses.map((status) => {
                    const columnApps = sortApplications(getApplicationsByStatus(status.key));
                    const statusCount = getStatusCount(status.key);
                    
                    return (
                      <DroppableColumn
                        key={status.key}
                        id={status.key}
                        status={status}
                        statusCount={statusCount}
                      >
                        <SortableContext
                          items={columnApps.map(app => app._id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
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
                                />
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-32 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                  <FiUser className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">No applications</p>
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
              <ApplicantCardOverlay
                application={applications.find(app => app._id === activeId)}
                getStatusColor={getStatusColor}
                getStatusName={getStatusName}
                formatDate={formatDate}
                formatLocation={formatLocation}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

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
        />
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

/* ================= Droppable Column Component ================= */
function DroppableColumn({ id, status, statusCount, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-[340px] rounded-lg bg-white border shadow-sm flex flex-col h-[calc(100vh-280px)] transition-all ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/10' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
            {status.name}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {statusCount}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
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
  formatLocation
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
      className={`rounded-lg border p-4 transition-all bg-white relative group ${
        isDragging 
          ? 'shadow-lg ring-2 ring-blue-400 rotate-1 scale-105 z-50' 
          : 'hover:shadow-md hover:border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name || candidate.username || "Scarlett Peterson"} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {candidate.name || candidate.username || "Scarlett Peterson"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {displayEmail}
            </p>
          </div>
        </div>
        
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusBadge}`}>
          {statusName}
        </span>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-600">
        {candidate.phone && (
          <p className="flex items-center gap-1">
            <span>📞</span> {candidate.phone}
          </p>
        )}
        {location && (
          <p className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3 flex-shrink-0" /> 
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-1">
          <FiCalendar className="w-3 h-3 flex-shrink-0" /> 
          <span>Applied: {formatDate(application.appliedAt)}</span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadResume();
          }}
          className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <FiDownload className="w-3 h-3" />
          Resume
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
        >
          <FiMoreVertical className="w-3 h-3" />
          Status
        </button>
      </div>

      {/* Status Update Dropdown */}
      {showActions && (
        <div className="absolute right-4 top-16 z-30 w-48 rounded-lg border bg-white shadow-lg py-1 max-h-64 overflow-y-auto">
          {statuses.map((status) => (
            <button
              key={status._id || status.key}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(status.key);
                setShowActions(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                application.status === status.key ? 'bg-gray-50' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`} />
              <span className={application.status === status.key ? 'font-medium' : ''}>
                {status.name}
              </span>
              {application.status === status.key && (
                <span className="ml-auto text-xs text-gray-400">Current</span>
              )}
            </button>
          ))}
        </div>
      )}
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
  
  return (
    <div className="w-[320px] rounded-lg border-2 border-blue-400 bg-white p-4 shadow-xl rotate-2 scale-105">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name || candidate.username || "Scarlett Peterson"} />
          <div>
            <p className="font-medium text-gray-900">
              {candidate.name || candidate.username || "Scarlett Peterson"}
            </p>
            <p className="text-xs text-gray-500">
              {candidate.email || "roboged218@deposin.com"}
            </p>
            {location && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                {location}
              </p>
            )}
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusBadge}`}>
          {statusName}
        </span>
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
  getStatusName 
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const candidateData = candidate.candidate || {};
  const statusBadge = getStatusColor(candidate.status);
  const statusName = getStatusName(candidate.status);
  const location = candidateData.location ? formatLocation(candidateData.location) : null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-[1100px] max-w-[95%] h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100 z-10 bg-white"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* LEFT - Candidate Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl font-semibold text-white">
              {candidateData.name?.charAt(0) || candidateData.username?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {candidateData.name || candidateData.username || "Scarlett Peterson"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {candidateData.email || "roboged218@deposin.com"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
                  {statusName}
                </span>
                <span className="text-xs text-gray-500">
                  Applied {formatDate(candidate.appliedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <Section title="Contact Information">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <InfoItem label="Phone" value={candidateData.phone} />
              <InfoItem label="Location" value={location} />
              <InfoItem label="Email" value={candidateData.email} />
            </div>
          </Section>

          {/* Cover Letter */}
          <Section title="Cover Letter">
            <div 
              className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: candidate.coverLetter || "<p class='text-gray-400'>No cover letter provided.</p>" 
              }}
            />
          </Section>

          {/* Skills */}
          {candidateData.skills?.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-2">
                {candidateData.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT - Actions */}
        <div className="w-[360px] border-l bg-gray-50 p-6 overflow-y-auto">
          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => window.location.href = `mailto:${candidateData.email}`}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <FiMail /> Send Email
            </button>
            
            <button
              onClick={() => onDownloadResume(candidate._id)}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <FiDownload /> Download Resume
            </button>

            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                disabled={isUpdating}
                className="w-full rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiMoreVertical /> Update Status
                  </>
                )}
              </button>

              {showStatusMenu && (
                <div className="absolute top-12 left-0 w-full rounded-lg border bg-white shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                  {statuses.map((status) => (
                    <button
                      key={status._id || status.key}
                      onClick={() => handleStatusUpdate(status.key)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        candidate.status === status.key ? 'bg-gray-50' : ''
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`} />
                      <span className={candidate.status === status.key ? 'font-medium' : ''}>
                        {status.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resume Info */}
          {candidate.resume && (
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Resume</p>
              <p className="text-sm font-medium text-gray-900">
                {candidate.resume.originalName || "Resume"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {candidate.resume.size ? `${(candidate.resume.size / 1024).toFixed(0)} KB` : "Size not available"}
              </p>
            </div>
          )}

          {/* Timeline */}
          <Section title="Application Timeline">
            {candidate.statusHistory?.length > 0 ? (
              candidate.statusHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3 mb-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Status changed to {getStatusName(history.status)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(history.updatedAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No status history</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */
function Avatar({ name }) {
  const initial = name?.charAt(0) || "S";
  return (
    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
      {initial}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-1 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
}