"use client";

import { useState, useEffect } from "react";
import {
  Paintbrush,
  Code2,
  Megaphone,
  Video,
  Music,
  BarChart3,
  HeartPulse,
  Database,
  Briefcase,
  Building2,
  GraduationCap,
  ShoppingCart,
  Users,
  Truck,
  Hammer,
  Shield,
  Coffee,
  Globe,
  Cpu,
  Smartphone,
  Camera,
  PenTool,
  FileText,
  TrendingUp,
  Wrench,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { jobService } from "@/services/jobService";
import Link from "next/link";

// Icon mapping for categories
const iconMap = {
  "Graphics & Design": Paintbrush,
  "Design": Paintbrush,
  "UI/UX Design": PenTool,
  "Code & Programming": Code2,
  "Development": Code2,
  "IT & Software": Cpu,
  "Software Development": Code2,
  "Web Development": Code2,
  "Digital Marketing": Megaphone,
  "Marketing": Megaphone,
  "Video & Animation": Video,
  "Music & Audio": Music,
  "Account & Finance": BarChart3,
  "Finance": BarChart3,
  "Accounting": FileText,
  "Health & Care": HeartPulse,
  "Healthcare": HeartPulse,
  "Data & Science": Database,
  "Data Science": Database,
  "Engineering": Wrench,
  "Sales": TrendingUp,
  "Business": Briefcase,
  "Human Resources": Users,
  "Education": GraduationCap,
  "Teaching": GraduationCap,
  "Logistics": Truck,
  "Construction": Hammer,
  "Security": Shield,
  "Customer Service": Coffee,
  "Hospitality": Coffee,
  "Administrative": FileText,
  "Legal": Shield,
  "Consulting": Briefcase,
  "Real Estate": Building2,
  "Retail": ShoppingCart,
  "E-commerce": ShoppingCart,
  "Mobile Development": Smartphone,
  "DevOps": Cpu,
  "Cloud Computing": Globe,
  "Photography": Camera,
  "Content Writing": FileText,
  "Copywriting": PenTool,
  "Translation": Globe,
};

// Fallback icon
const FallbackIcon = Briefcase;

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobCounts, setJobCounts] = useState({});

  useEffect(() => {
    fetchCategoriesAndJobs();
  }, []);

  const fetchCategoriesAndJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch all active categories from database
      const categoriesData = await categoryService.getJobCategories();
      console.log("📊 Categories fetched:", categoriesData);
      
      // Fetch all jobs to count per category
      const jobsResponse = await jobService.getJobs();
      console.log("📊 Jobs response:", jobsResponse);
      
      // Handle different response structures
      let jobsArray = [];
      if (Array.isArray(jobsResponse)) {
        jobsArray = jobsResponse;
      } else if (jobsResponse?.jobs && Array.isArray(jobsResponse.jobs)) {
        jobsArray = jobsResponse.jobs;
      } else if (jobsResponse?.data && Array.isArray(jobsResponse.data)) {
        jobsArray = jobsResponse.data;
      } else if (jobsResponse?.results && Array.isArray(jobsResponse.results)) {
        jobsArray = jobsResponse.results;
      }
      
      console.log("📊 Jobs array:", jobsArray);
      
      // Calculate job counts per category
      const counts = {};
      jobsArray.forEach(job => {
        const categoryName = job.jobCategory || job.category || job.categoryName;
        if (categoryName) {
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        }
      });
      
      console.log("📊 Job counts:", counts);
      
      // Update job counts for categories
      const updatedCategories = categoriesData.map(category => ({
        ...category,
        jobs: counts[category.name] || 0,
        // Ensure we have a valid icon
        icon: iconMap[category.name] || FallbackIcon
      }));
      
      // Sort by job count (most popular first)
      updatedCategories.sort((a, b) => b.jobs - a.jobs);
      
      setCategories(updatedCategories);
      setJobCounts(counts);
      
    } catch (error) {
      console.error("❌ Failed to fetch categories:", error);
      setError("Failed to load categories");
      
      // Fallback to mock data if API fails
      const mockCategories = [
        { _id: "1", name: "IT & Software", jobs: 312, icon: Code2 },
        { _id: "2", name: "Marketing", jobs: 297, icon: Megaphone },
        { _id: "3", name: "Design", jobs: 357, icon: Paintbrush },
        { _id: "4", name: "Sales", jobs: 187, icon: TrendingUp },
        { _id: "5", name: "Finance", jobs: 157, icon: BarChart3 },
        { _id: "6", name: "Healthcare", jobs: 125, icon: HeartPulse },
        { _id: "7", name: "Education", jobs: 98, icon: GraduationCap },
        { _id: "8", name: "Engineering", jobs: 87, icon: Wrench },
      ];
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    return iconMap[categoryName] || FallbackIcon;
  };

  // Format job count text
  const formatJobCount = (count) => {
    if (count === 0) return "No open positions";
    if (count === 1) return "1 open position";
    return `${count} open positions`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12 overflow-hidden">
        <div className="flex items-center justify-between mb-8 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 w-48 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 w-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 w-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 animate-scaleIn">
          <div className="relative inline-block">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Briefcase className="h-8 w-8 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-red-600 mb-3 font-medium">⚠️ Failed to load categories</p>
          <button 
            onClick={fetchCategoriesAndJobs}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try again
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 overflow-hidden">
      {/* Header with animation */}
      <div className="relative mb-10 animate-slideInLeft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div className="absolute -inset-1 bg-blue-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Popular Categories
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                {categories.reduce((total, cat) => total + (cat.jobs || 0), 0)} total jobs available
              </p>
            </div>
          </div>
          
          <Link 
            href="/jobs"
            className="group relative px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              View All Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
          </Link>
        </div>
        
        {/* Decorative line */}
        <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100 animate-fadeIn">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-500 mb-4">No categories available</p>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category, index) => {
            const Icon = category.icon || getCategoryIcon(category.name);
            const jobCount = category.jobs || 0;
            
            return (
              <Link
                key={category._id}
                href={`/jobs?category=${encodeURIComponent(category.name)}`}
                className="group relative animate-slideInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative flex items-center gap-4 rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-5 cursor-pointer transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1 hover:scale-[1.02]">
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Icon with enhanced animation */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all duration-500 group-hover:scale-150"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 transition-all duration-500 group-hover:bg-white/20 group-hover:text-white group-hover:rotate-3 group-hover:scale-110 shadow-md group-hover:shadow-xl">
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                    </div>
                    
                    {/* Floating badge for new/hot categories */}
                    {jobCount > 100 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                        🔥
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 transition-all duration-300 group-hover:text-blue-100 group-hover:translate-x-0.5">
                      {formatJobCount(jobCount)}
                    </p>
                    {jobCount > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:bg-white animate-pulse"></div>
                        <p className="text-xs text-blue-600 group-hover:text-white/90 transition-colors duration-300">
                          {jobCount} new this week
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Arrow indicator with animation */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:rotate-12">
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                    
                    {/* Pulsing dot for categories with jobs */}
                    {jobCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* View More Link */}
      {categories.length > 8 && (
        <div className="text-center mt-12 animate-fadeIn animation-delay-800">
          <Link
            href="/categories"
            className="group relative inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-sm font-medium text-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span>View all {categories.length} categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Sparkle effect */}
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </section>
  );
}