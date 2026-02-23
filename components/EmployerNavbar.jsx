"use client";

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiPhone, FiChevronDown, FiUser, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, refreshUserData } from "@/redux/slices/userSlice";

const languages = [
  { label: "English", flag: "https://flagcdn.com/w20/us.png" },
  { label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
  { label: "French", flag: "https://flagcdn.com/w20/fr.png" },
];

const EmployerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(languages[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [profilePercentage, setProfilePercentage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const langRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const dispatch = useDispatch();
  
  // Get user data from Redux
  const user = useSelector(selectUser);
  
  // Function to refresh user data
  const refreshUserProfile = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("🔄 [EmployerNavbar] Refreshing user data...");
      await dispatch(refreshUserData()).unwrap();
      console.log("✅ [EmployerNavbar] User data refreshed");
    } catch (error) {
      console.error("❌ [EmployerNavbar] Failed to refresh user data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Check profile completion status with auto-refresh
  useEffect(() => {
    const checkProfileStatus = () => {
      if (user) {
        console.log("👤 [EmployerNavbar] User data:", user);
        console.log("📊 [EmployerNavbar] Profile data:", user.profile);
        
        // Use the most reliable source for profile completion
        let isComplete = false;
        let percentage = 0;
        
        // Priority 1: Profile model data
        if (user.profile) {
          isComplete = user.profile.isProfileComplete || false;
          percentage = user.profile.completionPercentage || 0;
          console.log("🎯 [EmployerNavbar] Using Profile model:", { isComplete, percentage });
        } 
        // Priority 2: User model data
        else if (user.isProfileComplete !== undefined) {
          isComplete = user.isProfileComplete;
          percentage = user.isProfileComplete ? 100 : 0;
          console.log("📝 [EmployerNavbar] Using User model:", { isComplete, percentage });
        }
        // Priority 3: Fallback check based on user data completeness
        else {
          // Check if user has basic profile data
          const hasBasicInfo = user.name && user.email;
          isComplete = hasBasicInfo;
          percentage = hasBasicInfo ? 50 : 0;
          console.log("📋 [EmployerNavbar] Fallback check:", { isComplete, percentage });
        }
        
        setProfileComplete(isComplete);
        setProfilePercentage(percentage);
        
        console.log("✅ [EmployerNavbar] Final state:", { 
          profileComplete: isComplete, 
          profilePercentage: percentage 
        });
      } else {
        // No user logged in
        setProfileComplete(false);
        setProfilePercentage(0);
      }
    };
    
    checkProfileStatus();
    
    // Set up interval to periodically check for updates
    const intervalId = setInterval(() => {
      if (user && !user.profile && user.isProfileComplete) {
        console.log("🔄 [EmployerNavbar] Periodic check: Refreshing...");
        refreshUserProfile();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user, dispatch, isRefreshing]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && event.target.id !== "mobile-menu-btn") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation Handler
  const handleNavigation = (path, requiresCompleteProfile = false) => {
    console.log(`🚀 Navigation clicked: ${path}, Profile complete: ${profileComplete}, Requires: ${requiresCompleteProfile}`);
    
    // Always close mobile menu
    setMenuOpen(false);
    
    // Special case: If going to account_setup, always allow
    if (path === "/account_setup") {
      console.log(`✅ Direct navigation to account_setup`);
      router.push(path);
      return;
    }
    
    // If profile is complete OR page doesn't require it, navigate directly
    if (!requiresCompleteProfile || profileComplete) {
      console.log(`✅ Direct navigation to: ${path}`);
      router.push(path);
    } else {
      console.log(`⛔ Profile not complete, redirecting to account_setup`);
      router.push("/account_setup");
    }
  };

  // Function to check if a nav item is active
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Navigation items
  const navItems = [
    { 
      label: "Home", 
      href: "/", 
      requiresCompleteProfile: false
    },
    { 
      label: "Find Candidate", 
      href: "/candidates", 
      requiresCompleteProfile: true
    },
    { 
      label: "Dashboard", 
      href: "/home",
      requiresCompleteProfile: true
    },
    { 
      label: "My Jobs", 
      href: "/my_jobs",
      requiresCompleteProfile: true
    },
    { 
      label: "About Us", 
      href: "/about_us", 
      requiresCompleteProfile: false
    },
    { 
      label: "Contact", 
      href: "/contact", 
      requiresCompleteProfile: false
    },
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-lg shadow-indigo-500/5 md:h-14">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* LEFT SECTION */}
        <div className="flex h-full items-center gap-6 md:gap-10">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation("/", false)}
            className="group relative text-lg font-bold sm:text-xl"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105 inline-block">
              JobPortal
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden h-full md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <li key={item.label} className="relative group">
                  <button
                    onClick={() => handleNavigation(item.href, item.requiresCompleteProfile)}
                    className={`relative flex h-full items-center px-4 text-sm font-medium cursor-pointer transition-all duration-300 w-full text-left ${
                      active
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    title={!profileComplete && item.requiresCompleteProfile ? `Complete profile to access (${profilePercentage}%)` : ""}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {!profileComplete && item.requiresCompleteProfile && (
                      <>
                        <span className="ml-1.5 text-xs text-amber-500 animate-pulse">●</span>
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg scale-90 group-hover:scale-100">
                          <div className="flex items-center gap-1">
                            <span className="animate-pulse">⚠️</span>
                            Complete profile to access ({profilePercentage}%)
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rotate-45"></div>
                        </div>
                      </>
                    )}
                    
                    {/* Animated underline - always show for active */}
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden items-center gap-3 md:flex md:gap-4">
          
          {/* Phone Number - Enhanced */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 cursor-default">
              <FiPhone className="text-indigo-500 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden lg:inline text-sm font-medium text-gray-700">+1-202-555-0178</span>
              <span className="lg:hidden text-sm font-medium text-gray-700">Call</span>
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              24/7 Support Available
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          </div>

          {/* Language Dropdown - Enhanced */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm hover:shadow"
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              <img 
                src={activeLang.flag} 
                alt={`${activeLang.label} flag`} 
                className="h-4 w-5 rounded-sm object-cover shadow-sm"
                loading="lazy"
              />
              <span className="hidden sm:inline font-medium">{activeLang.label}</span>
              <FiChevronDown className={`transition-all duration-300 ${langOpen ? "rotate-180 text-indigo-600" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 z-50 overflow-hidden animate-slideDown">
                {languages.map((lang, index) => (
                  <button
                    key={lang.label}
                    onClick={() => {
                      setActiveLang(lang);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                      activeLang.label === lang.label
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-6"
                    } ${index === 0 ? '' : 'border-t border-indigo-50'}`}
                  >
                    <img 
                      src={lang.flag} 
                      alt={`${lang.label} flag`}
                      className="h-4 w-5 rounded-sm object-cover shadow-sm"
                      loading="lazy"
                    />
                    <span className="flex-1 text-left">{lang.label}</span>
                    {activeLang.label === lang.label && (
                      <FiCheckCircle className="text-indigo-500 animate-bounceIn" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 md:hidden group"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="relative w-6 h-6">
            <FiMenu className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} size={24} />
            <FiX className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} size={24} />
          </div>
        </button>

        {/* MOBILE MENU OVERLAY */}
        {menuOpen && (
          <div 
            className="fixed inset-0 top-16 z-40 bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm animate-fadeIn md:hidden" 
            onClick={() => setMenuOpen(false)} 
          />
        )}

        {/* MOBILE MENU CONTENT */}
        <div
          ref={menuRef}
          className={`fixed left-0 right-0 top-16 z-40 bg-white/95 backdrop-blur-md shadow-2xl shadow-indigo-500/10 transition-all duration-500 ease-out md:hidden ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0 pointer-events-none"
          }`}
        >
          <div className="border-t border-indigo-100 px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            
            {/* Mobile Navigation Items */}
            <ul className="space-y-1">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <li 
                    key={item.label}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`transform transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  >
                    <button
                      onClick={() => handleNavigation(item.href, item.requiresCompleteProfile)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ${
                        active
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-600"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-6"
                      }`}
                      title={!profileComplete && item.requiresCompleteProfile ? "Complete profile to access" : ""}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {!profileComplete && item.requiresCompleteProfile && (
                          <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                        )}
                      </span>
                      {!profileComplete && item.requiresCompleteProfile && (
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full animate-pulse">
                          Locked
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Contact & Language */}
            <div className="mt-6 space-y-4 border-t border-indigo-100 pt-6">
              
              {/* Phone Number */}
              <div className="group flex items-center justify-center gap-2 text-gray-700 py-2 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <FiPhone className="text-indigo-500 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">+1-202-555-0178</span>
                <span className="text-xs text-indigo-500 ml-2">24/7</span>
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <p className="px-4 text-sm font-medium text-gray-500 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                  Select Language
                </p>
                <div className="space-y-1">
                  {languages.map((lang, index) => (
                    <button
                      key={lang.label}
                      onClick={() => {
                        setActiveLang(lang);
                        setMenuOpen(false);
                      }}
                      style={{ animationDelay: `${(navItems.length + index) * 50}ms` }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 transform ${
                        menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                      } ${
                        activeLang.label === lang.label
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-6"
                      }`}
                    >
                      <img 
                        src={lang.flag} 
                        alt={`${lang.label} flag`}
                        className="h-5 w-6 rounded-sm object-cover shadow-sm"
                        loading="lazy"
                      />
                      <span className="flex-1">{lang.label}</span>
                      {activeLang.label === lang.label && (
                        <FiCheckCircle className="text-indigo-500 animate-bounceIn" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </nav>
  );
};

export default EmployerNavbar;