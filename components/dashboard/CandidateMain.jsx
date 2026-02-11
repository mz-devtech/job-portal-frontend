"use client";

import { FiBookmark, FiBell } from "react-icons/fi";
import ProfileAlert from "../../components/dashboard/ProfileAlert";
import { useSelector } from "react-redux";
import { selectUser, selectRole, selectIsAuthenticated } from "../../redux/slices/userSlice";
import { useState, useEffect } from "react";
import { applicationService } from "@/services/applicationService";
import { savedJobService } from "@/services/savedJobService";
import Link from "next/link";
import { Briefcase, Bookmark, Bell, Calendar, MapPin, Loader2 } from "lucide-react";

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

      // Fetch saved jobs count
      // You'll need to implement this in savedJobService
      // const savedResponse = await savedJobService.getSavedJobs({ limit: 1 });
      // setStats(prev => ({ ...prev, favoriteJobs: savedResponse.pagination?.totalSaved || 0 }));

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
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      shortlisted: "bg-purple-100 text-purple-800",
      interview: "bg-indigo-100 text-indigo-800",
      hired: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Hello, {user?.name || user?.username || "Esther Howard"} 👋
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Here is your daily activities and job alerts
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard 
          title="Applied Jobs" 
          value={stats.appliedJobs} 
          bg="bg-blue-50"
          icon={Briefcase}
          color="text-blue-600"
          link="/candidate/applied-jobs"
        />
        <StatCard 
          title="Favorite Jobs" 
          value={stats.favoriteJobs || 238} 
          bg="bg-yellow-50"
          icon={Bookmark}
          color="text-yellow-600"
          link="/candidate/saved-jobs"
        />
        <StatCard 
          title="Job Alerts" 
          value={stats.jobAlerts || 12} 
          bg="bg-green-50"
          icon={Bell}
          color="text-green-600"
          link="/candidate/job-alerts"
        />
      </div>

      {/* Profile Alert - Shows only when profile is incomplete */}
      {isAuthenticated && userRole === "candidate" && (
        <ProfileAlert 
          onClick={handleEditProfile}
          title="Complete Your Profile to Stand Out!"
          description="Finish setting up your profile to increase your chances of getting hired. Add your skills, experience, and portfolio."
        />
      )}

      {/* Recent Applications */}
      <div className="mt-8 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
          <h3 className="font-semibold text-gray-800">
            Recently Applied
          </h3>
          <Link 
            href="/candidate/applied-jobs" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : recentApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Job</th>
                  <th className="px-6 py-3 text-left">Date Applied</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {app.job.jobTitle}
                      </p>
                      <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(app.appliedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        {app.status === "pending" ? "Active" : app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/jobs/${app.job._id}`}
                        className="rounded border px-4 py-1 text-blue-600 hover:bg-blue-50"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications yet</p>
            <Link 
              href="/"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
              Browse Jobs →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- Small Components ---------- */

function StatCard({ title, value, bg, icon: Icon, color, link }) {
  return (
    <Link href={link} className={`rounded-lg p-5 ${bg} hover:shadow-md transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Link>
  );
}