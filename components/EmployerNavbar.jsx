"use client";

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiPhone, FiChevronDown, FiUser, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  // Add a manual refresh button for testing (remove in production)
  const ManualRefreshButton = () => (
    <button
      onClick={refreshUserProfile}
      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
      title="Refresh user data"
      disabled={isRefreshing}
    >
      {isRefreshing ? "Refreshing..." : "🔄 Refresh"}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm md:h-14">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* LEFT SECTION */}
        <div className="flex h-full items-center gap-6 md:gap-10">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation("/", false)}
            className="text-lg font-bold text-blue-600 sm:text-xl hover:text-blue-700"
          >
            JobPortal
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden h-full md:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.href, item.requiresCompleteProfile)}
                  className={`relative flex h-full items-center px-3 text-sm cursor-pointer transition-colors duration-200 w-full text-left group ${
                    item.label === "Home"
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                      : "text-gray-700 hover:text-blue-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-600"
                  }`}
                  title={!profileComplete && item.requiresCompleteProfile ? `Complete profile to access (${profilePercentage}%)` : ""}
                >
                  {item.label}
                  {!profileComplete && item.requiresCompleteProfile && (
                    <span className="ml-1.5 text-xs text-amber-500 animate-pulse group-hover:animate-none">*</span>
                  )}
                  {!profileComplete && item.requiresCompleteProfile && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Complete profile to access ({profilePercentage}%)
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden items-center gap-4 md:flex md:gap-6">
          {/* DEBUG: Manual refresh button (remove in production) */}
          {process.env.NODE_ENV === 'development' && <ManualRefreshButton />}
          
          {/* Profile Completion Status */}
          {!profileComplete ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigation("/account_setup", false)}
                className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <FiUser className="text-amber-600" />
                <span>Complete Profile ({profilePercentage}%)</span>
                {isRefreshing && <span className="ml-2 animate-spin">⟳</span>}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
              <FiCheckCircle />
              <span>Profile Complete ({profilePercentage}%)</span>
              {isRefreshing && <span className="ml-2 animate-spin">⟳</span>}
            </div>
          )}

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-gray-500">Welcome back</p>
                <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {user.name || user.email?.split('@')[0] || "Employer"}
                  {user.isProfileComplete && !user.profile && " ⚠️"}
                </p>
              </div>
            </div>
          )}

          {/* Phone Number */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FiPhone className="text-blue-500" />
            <span className="hidden lg:inline">+1-202-555-0178</span>
            <span className="lg:hidden">Call Us</span>
          </div>

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              <img 
                src={activeLang.flag} 
                alt={`${activeLang.label} flag`} 
                className="h-4 w-5 rounded-sm object-cover"
                loading="lazy"
              />
              <span className="hidden sm:inline">{activeLang.label}</span>
              <FiChevronDown className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <ul className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                {languages.map((lang) => (
                  <li
                    key={lang.label}
                    onClick={() => {
                      setActiveLang(lang);
                      setLangOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <img 
                      src={lang.flag} 
                      alt={`${lang.label} flag`}
                      className="h-4 w-5 rounded-sm object-cover"
                      loading="lazy"
                    />
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* MOBILE MENU OVERLAY */}
        {menuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-black/20 md:hidden" onClick={() => setMenuOpen(false)} />
        )}

        {/* MOBILE MENU CONTENT */}
        <div
          ref={menuRef}
          className={`fixed left-0 right-0 top-16 z-40 bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="border-t border-gray-200 px-4 py-3">
            {/* DEBUG: Mobile refresh button */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4">
                <button
                  onClick={refreshUserProfile}
                  className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Refreshing..." : "🔄 Refresh User Data"}
                </button>
              </div>
            )}
            
            {/* User Info for Mobile */}
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || user.email?.split('@')[0] || "Employer"}
                    {user.isProfileComplete && !user.profile && " ⚠️"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    Profile: {user.profile ? "Loaded" : "Not loaded"}
                  </p>
                </div>
              </div>
            )}

            {/* Profile Completion Alert for Mobile */}
            {!profileComplete ? (
              <div className="mb-4 rounded-lg bg-amber-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-amber-700">
                        Complete your profile
                      </p>
                      <p className="text-xs text-amber-600">
                        {profilePercentage}% completed
                        {isRefreshing && " (refreshing...)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigation("/account_setup", false)}
                    className="rounded-md bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-800 hover:bg-amber-200"
                  >
                    Setup
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-lg bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-600">
                  <FiCheckCircle />
                  <span className="text-sm font-medium">Profile Complete ({profilePercentage}%)</span>
                  {isRefreshing && <span className="animate-spin">⟳</span>}
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleNavigation(item.href, item.requiresCompleteProfile)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium ${
                      item.label === "Home"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    title={!profileComplete && item.requiresCompleteProfile ? "Complete profile to access" : ""}
                  >
                    <span>
                      {item.label}
                      {!profileComplete && item.requiresCompleteProfile && (
                        <span className="ml-2 text-xs text-amber-500">*</span>
                      )}
                    </span>
                    {!profileComplete && item.requiresCompleteProfile && (
                      <span className="text-xs text-gray-400">Locked</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile Contact & Language */}
            <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
              {/* Phone Number */}
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <FiPhone className="text-blue-500" />
                <span className="font-medium">+1-202-555-0178</span>
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <p className="px-4 text-sm font-medium text-gray-500">Language</p>
                <div className="space-y-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.label}
                      onClick={() => {
                        setActiveLang(lang);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left ${
                        activeLang.label === lang.label
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <img 
                        src={lang.flag} 
                        alt={`${lang.label} flag`}
                        className="h-5 w-6 rounded-sm object-cover"
                        loading="lazy"
                      />
                      {lang.label}
                      {activeLang.label === lang.label && (
                        <span className="ml-auto text-blue-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployerNavbar;