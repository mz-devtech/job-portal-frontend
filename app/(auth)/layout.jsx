"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import AuthStats from "@/components/AuthStats";
import { homeService } from "@/services/homeService";

export default function AuthLayout({ children }) {
  const [stats, setStats] = useState({
    liveJobs: '1,75,324',
    companies: '97,354',
    candidates: '38,47,154',
    newJobs: '7,532'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await homeService.getHomeStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl h-[700px] flex flex-col lg:flex-row overflow-hidden rounded-2xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200/50 relative animate-scaleIn">
        
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* LEFT - Form Section */}
        <div className="relative z-10 w-full lg:w-1/2 flex flex-col bg-white/50 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100/80">
            <Link href="/" className="group flex items-center relative">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl">
                  <BriefcaseBusiness className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300" size={20} />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              </div>
              <span className="text-base font-bold ml-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                Jobpilot
              </span>
              
              {/* Floating sparkle */}
              <Sparkles className="absolute -top-2 -right-2 w-3 h-3 text-blue-400 animate-pulse" />
            </Link>
          </div>

          {/* Form Container - Fixed height with hidden scroll */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 scroll-smooth">
            <div className="h-full animate-fadeIn">
              {children}
            </div>
          </div>
          
          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20"></div>
        </div>

        {/* RIGHT - Image Section (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 relative no-scrollbar overflow-hidden group">
          {/* Gradient Overlay with animation */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f2a44]/90 via-[#0f2a44]/70 to-[#0f2a44]/50 group-hover:from-[#0f2a44]/80 group-hover:to-[#0f2a44]/40 transition-all duration-700" />

          {/* Background Image with zoom effect */}
          <img
            src="/assets/registration.jpg"
            alt="Job recruitment"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Animated particles */}
          <div className="absolute inset-0 z-15 pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          </div>

          {/* Stats Content - Centered with slide-up animation */}
          <div className="relative z-20 w-full flex items-center p-8">
            <div className="w-full transform transition-all duration-700 group-hover:translate-y-0 translate-y-4 animate-slideUp">
              <AuthStats stats={stats} loading={loading} />
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute top-6 right-6 z-30">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-xs text-white flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                Trusted by 10k+ companies
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}