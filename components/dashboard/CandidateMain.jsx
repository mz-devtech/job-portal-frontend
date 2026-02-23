"use client";

import { FiBookmark, FiBell } from "react-icons/fi";
import ProfileAlert from "../../components/dashboard/ProfileAlert";
import { useSelector } from "react-redux";
import { selectUser, selectRole, selectIsAuthenticated } from "../../redux/slices/userSlice";
import { useState, useEffect } from "react";
import { applicationService } from "@/services/applicationService";
import { savedJobService } from "@/services/savedJobService";
import Link from "next/link";
import { Briefcase, Bookmark, Bell, Calendar, MapPin, Loader2, Sparkles, TrendingUp, Award, ArrowRight, CheckCircle, Clock } from "lucide-react";

export default function CandidateMain() {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [stats, setStats] = useState({
    appliedJobs: 0,
    favoriteJobs: 0,
    jobAlerts: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (isAuthenticated && userRole === "candidate") {
      fetchDashboardData();
    }
  }, [isAuthenticated, userRole]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch applications
      const appsResponse = await applicationService.getMyApplications({ 
        limit: 5,
        sortBy: "appliedAt",
        sortOrder: "desc"
      });
      
      setRecentApplications(appsResponse.applications || []);
      setStats(prev => ({
        ...prev,
        appliedJobs: appsResponse.pagination?.totalApplications || 0,
      }));

      // Fetch saved jobs count using the dedicated API endpoint
      try {
        const savedJobsCount = await savedJobService.getSavedJobsCount();
        setStats(prev => ({ 
          ...prev, 
          favoriteJobs: savedJobsCount || 0 
        }));
        console.log("✅ Saved jobs count fetched:", savedJobsCount);
      } catch (error) {
        console.error("Failed to fetch saved jobs count:", error);
        setStats(prev => ({ ...prev, favoriteJobs: 0 }));
      }

      // Job alerts count (you can implement this later)
      // For now, we'll keep it as 0 or fetch from another service
      setStats(prev => ({ ...prev, jobAlerts: 0 }));

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    window.location.href = "/candidate/settings";
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200",
      reviewed: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
      shortlisted: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200",
      interview: "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200",
      hired: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200",
      rejected: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200",
      withdrawn: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200",
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'hired': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'interview': return <Calendar className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main
      className="
        mt-4
        w-full
        min-h-screen
        bg-gradient-to-br from-gray-50 via-white to-gray-50
        px-4 py-4
        sm:px-6 sm:py-6
        md:ml-[260px]
        md:w-[calc(100%-260px)]
        md:h-[calc(100vh-7rem)]
        md:overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
      "
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-yellow-100/30 to-orange-100/30 rounded-full blur-3xl -z-10"></div>

      {/* Heading with Animation - REDUCED FONT SIZES */}
      <div className="relative animate-slideDown">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
          <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome back!
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {greeting}, {user?.name || user?.username || "Candidate"}! 👋
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
          <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></span>
          Here's your daily overview and job recommendations
        </p>
      </div>

      {/* Stats Cards with Hover Effects - REDUCED FONT SIZES */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Applied Jobs" 
          value={stats.appliedJobs} 
          bg="bg-gradient-to-br from-blue-50 to-blue-100/50"
          icon={Briefcase}
          color="text-blue-600"
          link="/candidate/applied-jobs"
          delay="0.1s"
        />
        <StatCard 
          title="Saved Jobs" 
          value={stats.favoriteJobs} 
          bg="bg-gradient-to-br from-yellow-50 to-yellow-100/50"
          icon={Bookmark}
          color="text-yellow-600"
          link="/candidate/saved-jobs"
          delay="0.2s"
        />
        <StatCard 
          title="Job Alerts" 
          value={stats.jobAlerts} 
          bg="bg-gradient-to-br from-green-50 to-green-100/50"
          icon={Bell}
          color="text-green-600"
          link="/candidate/job-alerts"
          delay="0.3s"
        />
      </div>

      {/* Profile Alert - Shows only when profile is incomplete */}
      {isAuthenticated && userRole === "candidate" && (
        <div className="mt-6 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <ProfileAlert 
            onClick={handleEditProfile}
            title="✨ Complete Your Profile to Stand Out!"
            description="Finish setting up your profile to increase your chances of getting hired. Add your skills, experience, and portfolio."
          />
        </div>
      )}

      {/* Recent Applications with Enhanced Design - REDUCED FONT SIZES */}
      <div className="mt-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 animate-slideUp border border-gray-100" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                Recent Applications
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Your latest job applications
              </p>
            </div>
          </div>
          <Link 
            href="/candidate/applied-jobs" 
            className="group flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent animate-shimmer"></div>
            </div>
            <p className="mt-3 text-xs text-gray-500 animate-pulse">Loading your applications...</p>
          </div>
        ) : recentApplications.length > 0 ? (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
            <table className="min-w-[600px] w-full text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Position</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentApplications.map((app, index) => (
                  <tr 
                    key={app._id} 
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-xs sm:text-sm text-gray-800 group-hover:text-blue-600 transition-colors">
                            {app.job?.jobTitle || 'Unknown Job'}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {app.job?.company || 'Company name'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatDate(app.appliedAt)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status === "pending" ? "Active" : app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/jobs/${app.job?._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 group/btn"
                      >
                        View
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-gray-400" />
              </div>
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">No applications yet</h4>
            <p className="text-xs text-gray-500 mb-4">Start your journey by exploring available jobs</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group"
            >
              Browse Jobs
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions with Enhanced Cards - REDUCED FONT SIZES */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slideUp" style={{ animationDelay: "0.4s" }}>
        <QuickActionCard
          title="Browse Jobs"
          description="Find your next opportunity"
          icon={Briefcase}
          href="/"
          gradient="from-blue-600 to-blue-700"
          delay="0.5s"
        />
        <QuickActionCard
          title="Saved Jobs"
          description={`You have ${stats.favoriteJobs} saved job${stats.favoriteJobs !== 1 ? 's' : ''}`}
          icon={Bookmark}
          href="/candidate/saved-jobs"
          gradient="from-yellow-600 to-orange-600"
          delay="0.6s"
        />
      </div>

      {/* Motivation Card - REDUCED FONT SIZES */}
      <div className="mt-5 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white animate-slideUp shadow-lg" style={{ animationDelay: "0.7s" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Your journey matters</h4>
              <p className="text-white/80 text-xs mt-0.5">Every application brings you closer to your dream job. Keep going! 💪</p>
            </div>
          </div>
          <Award className="w-5 h-5 text-white/60 animate-bounce" />
        </div>
      </div>
    </main>
  );
}

/* ---------- Enhanced Stat Card Component - REDUCED FONT SIZES ---------- */
function StatCard({ title, value, bg, icon: Icon, color, link, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={link} 
      className={`group relative ${bg} rounded-xl p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-slideUp overflow-hidden`}
      style={{ animationDelay: delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-white/50 to-transparent transform ${isHovered ? 'translate-x-full' : '-translate-x-full'} transition-transform duration-1000 ease-in-out`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">{title}</p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value !== undefined ? value.toLocaleString() : '0'}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center ${color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${color.replace('text', 'from')} to-transparent rounded-full transition-all duration-500`}
              style={{ width: isHovered ? '100%' : '60%' }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">View all →</span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Enhanced Quick Action Card Component - REDUCED FONT SIZES ---------- */
function QuickActionCard({ title, description, icon: Icon, href, gradient, delay }) {
  return (
    <Link href={href}>
      <div 
        className={`group relative bg-gradient-to-r ${gradient} rounded-xl p-5 text-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden animate-slideUp`}
        style={{ animationDelay: delay }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 -right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Icon className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-2 group-hover:text-white transition-all duration-300" />
          </div>
          <h4 className="font-semibold text-sm mb-0.5 group-hover:translate-x-1 transition-transform">{title}</h4>
          <p className="text-xs text-white/80 group-hover:translate-x-1 transition-transform delay-75">{description}</p>
          
          {/* Hover effect line */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>
    </Link>
  );
}

/* Add these styles to your global CSS file */
const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-slideDown {
    animation: slideDown 0.6s ease-out forwards;
  }

  .animate-slideUp {
    opacity: 0;
    animation: slideUp 0.6s ease-out forwards;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Add the styles to your component or global CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}