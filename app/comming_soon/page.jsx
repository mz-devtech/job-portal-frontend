"use client";

import Link from "next/link";
import {
  Briefcase,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Cpu,
  Wrench,
  Sparkles,
  Clock,
  Bell,
  Zap,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 8,
    minutes: 24,
    seconds: 36
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col justify-between relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-pink-200/20 to-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-xl opacity-20 animate-float"></div>
      <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-20 animate-float-delayed"></div>

      {/* Header */}
      <header className="relative px-6 sm:px-10 py-4 sm:py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group"
        >
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
            <Briefcase className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-24 gap-12 lg:gap-20 py-8 lg:py-0">
        
        {/* Left Section */}
        <div className="max-w-xl w-full">
          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 mb-6 border border-indigo-100">
            <Clock size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Launching soon</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Something amazing
            </span>
            <br />
            <span className="text-gray-900">is coming your way</span>
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
            We're working hard to bring you an incredible job search experience. 
            Get ready to discover your dream career!
          </p>

          {/* Countdown Timer Display */}
          <div className="flex gap-3 sm:gap-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <div key={unit} className="text-center">
                <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px] border border-indigo-100 shadow-sm">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-gray-500 capitalize mt-1 block">
                  {unit}
                </span>
              </div>
            ))}
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubscribe} className="max-w-md">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Bell size={16} className="text-indigo-600" />
              <span>Get notified when we launch</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="group px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1"
              >
                Notify Me
                <Zap size={14} className="group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </form>

          {/* Success message */}
          {subscribed && (
            <div className="mt-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2 animate-fadeIn">
              ✓ Thanks! We'll notify you when we launch.
            </div>
          )}

          {/* Progress indicator */}
          <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
            <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-progress"></div>
            </div>
            <span className="font-medium text-indigo-600">75% ready</span>
          </div>
        </div>

        {/* Right Illustration - Enhanced */}
        <div className="relative w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] flex items-center justify-center">
          {/* Animated background circles */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          
          {/* Rotating ring */}
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 border-2 border-indigo-200 rounded-full animate-spin-slow"></div>
          <div className="absolute w-36 h-36 sm:w-40 sm:h-40 border-2 border-purple-200 rounded-full animate-spin-slow-reverse"></div>
          
          {/* Main icons with enhanced animations */}
          <div className="relative w-full h-full">
            <div className="absolute top-6 left-8 p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 animate-bounce-slow">
              <Cpu size={32} className="text-white" />
            </div>
            
            <div className="absolute bottom-10 right-8 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/30 animate-float">
              <Sparkles size={28} className="text-white" />
            </div>
            
            <div className="absolute top-12 right-12 p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg shadow-amber-500/30 animate-bounce-slow delay-300">
              <Zap size={24} className="text-white" />
            </div>
            
            <div className="absolute bottom-16 left-12 p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30 animate-float-delayed">
              <Wrench size={24} className="text-white" />
            </div>

            {/* Center icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/50 animate-pulse-scale">
                <Briefcase size={48} className="text-white" />
              </div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative px-6 sm:px-10 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 border-t border-indigo-100 mt-8 lg:mt-0">
        <div className="flex items-center gap-4 mb-3 sm:mb-0">
          <span className="text-gray-400">Follow our journey</span>
          <div className="flex gap-2">
            {[
              { icon: Facebook, color: "hover:text-blue-600" },
              { icon: Twitter, color: "hover:text-blue-400" },
              { icon: Instagram, color: "hover:text-pink-500" },
              { icon: Youtube, color: "hover:text-red-500" },
            ].map(({ icon: Icon, color }, idx) => (
              <a
                key={idx}
                href="#"
                className={`p-1.5 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 ${color}`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-indigo-600 transition-colors">
            Terms
          </Link>
          <span>© 2024 JobPortal. All rights reserved</span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes progress {
          from { width: 0%; }
          to { width: 75%; }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}