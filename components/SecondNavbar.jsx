"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, Briefcase, Search, Menu, X, User, Globe, LogOut, Settings, Bell, FileText, Building, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser, selectRole, selectIsAuthenticated, loadUserFromStorage } from "@/redux/slices/userSlice";

export default function SecondNavbar() {
  const [country, setCountry] = useState({ code: "IN", name: "India" });
  const [countryOpen, setCountryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  
  const countryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Load user from storage when component mounts
  useEffect(() => {
    setMounted(true);
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Handle responsive behavior with detailed tablet detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width >= 640 && width < 768) {
        setScreenSize('tablet-small');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet-large');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const countries = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "AE", name: "UAE" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "SG", name: "Singapore" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery, "in", country.name);
      // Implement search logic here
    }
    if (showMobileSearch) {
      setShowMobileSearch(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setProfileOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Define role-based profile items
  const candidateProfileItems = [
    { label: "My Profile", href: "/candidate/profile", icon: <User className="h-4 w-4" /> },
    { label: "My Resume", href: "/candidate/resume", icon: <FileText className="h-4 w-4" /> },
    { label: "Notifications", href: "/candidate/notifications", icon: <Bell className="h-4 w-4" /> },
    { label: "Settings", href: "/candidate/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const employerProfileItems = [
    { label: "Company Profile", href: "/employer_settings", icon: <Building className="h-4 w-4" /> },
    { label: "Post Job", href: "/post_job", icon: <FileText className="h-4 w-4" /> },
    { label: "My Jobs", href: "/my_jobs", icon: <Briefcase className="h-4 w-4" /> },
    { label: "Billing", href: "/plans_billing", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Settings", href: "/employer_settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const profileItems = role === "employer" ? employerProfileItems : candidateProfileItems;

  // Don't render until mounted
  if (!mounted) {
    return (
      <nav className="w-full border-b border-indigo-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 animate-pulse"></div>
              <div className="h-6 w-24 bg-gradient-to-r from-indigo-200 to-purple-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-indigo-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm shadow-indigo-500/5">
      <div className="mx-auto max-w-7xl px-3 xs:px-4 sm:px-5 md:px-6">
        {/* Main Row */}
        <div className="flex h-14 sm:h-16 items-center justify-between">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
            {/* Menu Button - Visible on mobile and tablet */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative rounded-lg p-1.5 sm:p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 lg:hidden group"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                <Menu className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} size={screenSize === 'mobile' ? 18 : 20} />
                <X className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} size={screenSize === 'mobile' ? 18 : 20} />
              </div>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
              <div className="flex items-center gap-1 sm:gap-2 font-bold text-gray-900">
                <div className="relative">
                  <Briefcase className={`${screenSize === 'mobile' ? 'h-4 w-4' : screenSize === 'tablet-small' ? 'h-5 w-5' : 'h-6 w-6'} text-indigo-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`} />
                  <span className="absolute -inset-1 bg-indigo-200 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-purple-700">
                  {screenSize === 'mobile' ? 'JP' : screenSize === 'tablet-small' ? 'Job' : 'Jobpilot'}
                </span>
              </div>
            </Link>

            {/* Country Dropdown - Optimized for tablet */}
            {screenSize !== 'mobile' && (
              <div ref={countryDropdownRef} className="relative">
                <button
                  onClick={() => setCountryOpen(!countryOpen)}
                  className={`flex items-center gap-1 sm:gap-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm hover:shadow
                    ${screenSize === 'tablet-small' ? 'px-2 py-1' : 'px-3 py-1.5'}`}
                  aria-label="Select country"
                  aria-expanded={countryOpen}
                >
                  <ReactCountryFlag
                    svg
                    countryCode={country.code}
                    style={{ 
                      width: screenSize === 'tablet-small' ? '1em' : '1.2em', 
                      height: screenSize === 'tablet-small' ? '1em' : '1.2em', 
                      borderRadius: "2px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  />
                  <span className={`font-medium ${screenSize === 'tablet-small' ? 'hidden md:inline' : 'hidden lg:inline'}`}>
                    {country.name}
                  </span>
                  <span className={`font-medium ${screenSize === 'tablet-small' ? 'md:hidden' : 'lg:hidden'}`}>
                    {country.code}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                      countryOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {countryOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 sm:w-64 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown">
                    <div className="p-2 sm:p-3 max-h-80 overflow-y-auto">
                      <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-2 pb-2 sm:pb-3 mb-2 border-b border-indigo-100">
                        <div className="text-[10px] sm:text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 py-1">
                          Select Country
                        </div>
                        <div className="relative mt-2">
                          <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 -translate-y-1/2 text-indigo-400" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            className="w-full rounded-lg border border-indigo-200 bg-indigo-50/50 pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-[10px] sm:text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              setCountry(c);
                              setCountryOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-300 hover:pl-3 sm:hover:pl-4 ${
                              country.code === c.code 
                                ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                                : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50"
                            }`}
                          >
                            <ReactCountryFlag
                              svg
                              countryCode={c.code}
                              style={{ width: "1em", height: "1em", borderRadius: "2px" }}
                            />
                            <span className="flex-1 text-left font-medium">{c.name}</span>
                            {country.code === c.code && (
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 rotate-180 text-indigo-600 animate-bounceIn" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CENTER SECTION - Search Bar - Optimized for tablet */}
          {screenSize !== 'mobile' && (
            <form onSubmit={handleSearch} className={`flex-1 max-w-md lg:max-w-xl mx-2 sm:mx-3 md:mx-4`}>
              <div className="flex items-center rounded-full border border-indigo-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
                <div className="flex flex-1 items-center px-2 sm:px-3">
                  <Search className={`${screenSize === 'tablet-small' ? 'h-3 w-3' : 'h-4 w-4'} text-indigo-400`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={screenSize === 'tablet-small' ? "Search..." : "Job title, keyword, or company"}
                    className="w-full px-2 py-2 sm:py-2.5 text-xs sm:text-sm outline-none placeholder:text-gray-400 bg-transparent"
                    aria-label="Search jobs"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg mr-1 whitespace-nowrap"
                >
                  {screenSize === 'tablet-small' ? 'Go' : 'Search'}
                </button>
              </div>
            </form>
          )}

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
            {/* Mobile Country Toggle - Only on mobile */}
            {screenSize === 'mobile' && (
              <div className="relative">
                <button
                  onClick={() => setCountryOpen(!countryOpen)}
                  className="rounded-lg p-1.5 sm:p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 relative group"
                  aria-label="Select country"
                >
                  <Globe size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                </button>

                {countryOpen && (
                  <div className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown">
                    <div className="p-2 max-h-64 overflow-y-auto">
                      <div className="mb-2 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 px-2 py-1">
                        Select Country
                      </div>
                      {countries.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCountry(c);
                            setCountryOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs transition-all duration-300 ${
                            country.code === c.code 
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700" 
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-3"
                          }`}
                        >
                          <ReactCountryFlag
                            svg
                            countryCode={c.code}
                            style={{ width: "1em", height: "1em" }}
                          />
                          <span className="flex-1 text-left font-medium">{c.name}</span>
                          {country.code === c.code && (
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile/Tablet Search Toggle */}
            {(screenSize === 'mobile' || screenSize === 'tablet-small' || screenSize === 'tablet-large') && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="rounded-lg p-1.5 sm:p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 lg:hidden relative group"
                aria-label={showMobileSearch ? "Close search" : "Open search"}
              >
                <Search size={screenSize === 'mobile' ? 18 : 20} className="group-hover:scale-110 transition-transform duration-300" />
                {!showMobileSearch && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                )}
              </button>
            )}

            {/* Desktop Actions - Visible on tablet-large and desktop */}
            {screenSize !== 'mobile' && screenSize !== 'tablet-small' && (
              <div className="flex items-center gap-2 sm:gap-3">
                {isAuthenticated ? (
                  <div ref={profileDropdownRef} className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center gap-1 sm:gap-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm hover:shadow
                        ${screenSize === 'tablet-large' ? 'px-2 py-1' : 'px-3 py-1.5'}`}
                    >
                      <div className={`rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden ring-1 sm:ring-2 ring-indigo-200 group-hover:ring-indigo-300 transition-all duration-300
                        ${screenSize === 'tablet-large' ? 'h-6 w-6' : 'h-7 w-7 md:h-8 md:w-8'}`}>
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name || "User"} className="h-full w-full object-cover" />
                        ) : (
                          <User className={`${screenSize === 'tablet-large' ? 'h-3 w-3' : 'h-4 w-4'} text-indigo-600`} />
                        )}
                      </div>
                      <div className="hidden lg:block text-left">
                        <p className="text-xs md:text-sm font-semibold text-gray-900">{user?.name?.split(' ')[0] || "User"}</p>
                        <p className="text-[10px] md:text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 capitalize">{role || "User"}</p>
                      </div>
                      <ChevronDown
                        className={`h-3 w-3 transition-all duration-300 ${
                          profileOpen ? "rotate-180 text-indigo-600" : "text-gray-400"
                        }`}
                      />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full z-50 mt-2 w-64 sm:w-72 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown overflow-hidden">
                        <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                          <p className="font-semibold text-sm sm:text-base text-gray-900">{user?.name || "User"}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email || "user@example.com"}</p>
                          <div className="inline-block mt-2 px-2 sm:px-3 py-1 bg-white rounded-full text-[10px] sm:text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm">
                            {role === "employer" ? "👔 Employer" : "🎯 Candidate"}
                          </div>
                        </div>
                        
                        <div className="p-2">
                          {profileItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-300 hover:pl-3 sm:hover:pl-4 group"
                              onClick={() => setProfileOpen(false)}
                            >
                              <span className="text-indigo-500 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-indigo-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 sm:gap-3 w-full rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition-all duration-300 hover:pl-3 sm:hover:pl-4 group"
                          >
                            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 group-hover:rotate-12 transition-transform duration-300" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => router.push("/login")}
                      className={`flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group
                        ${screenSize === 'tablet-large' ? '' : 'border border-indigo-200'}`}
                    >
                      <User className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300" />
                      <span className="hidden lg:inline group-hover:text-indigo-600 transition-colors duration-300">Sign In</span>
                    </button>

                    <button
                      onClick={() => router.push("/register")}
                      className={`rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-indigo-500/25 whitespace-nowrap
                        ${screenSize === 'tablet-large' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                    >
                      {screenSize === 'tablet-large' ? 'Post' : 'Post Job'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Search Bar */}
        {showMobileSearch && (screenSize === 'mobile' || screenSize === 'tablet-small' || screenSize === 'tablet-large') && (
          <form onSubmit={handleSearch} className="py-2 sm:py-3 lg:hidden animate-slideDown">
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={screenSize === 'mobile' ? "Search jobs..." : "Job title, keyword, or company"}
                  className="w-full rounded-full border border-indigo-200 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  aria-label="Search jobs"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-5 py-2 sm:py-2.5 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="Search"
              >
                <Search size={screenSize === 'mobile' ? 16 : 18} />
              </button>
            </div>
          </form>
        )}

        {/* Tablet Country Indicator */}
        {screenSize === 'tablet-small' && (
          <div className="flex items-center gap-2 pb-2 px-2 text-xs text-gray-600 animate-fadeIn border-t border-indigo-50 pt-2 mt-1">
            <Globe className="h-3 w-3 text-indigo-500" />
            <span>Jobs in: </span>
            <button
              onClick={() => setCountryOpen(true)}
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              {country.name}
            </button>
          </div>
        )}
      </div>

      {/* Mobile/Tablet Menu Overlay */}
      {(mobileMenuOpen || countryOpen) && screenSize === 'mobile' && (
        <div
          className="fixed inset-0 top-14 z-30 bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setMobileMenuOpen(false);
            setCountryOpen(false);
          }}
        />
      )}

      {/* Desktop Country Overlay */}
      {countryOpen && screenSize !== 'mobile' && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/5 backdrop-blur-[2px] animate-fadeIn"
          onClick={() => setCountryOpen(false)}
        />
      )}

      {/* Mobile/Tablet Menu Content */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 sm:top-16 z-40 bg-white/95 backdrop-blur-md shadow-2xl shadow-indigo-500/10 lg:hidden animate-slideDown">
          <div className="border-t border-indigo-100 px-3 xs:px-4 py-3 xs:py-4 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* User Info if authenticated */}
            {isAuthenticated && (
              <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl animate-slideIn">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden ring-2 ring-indigo-200">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{user?.name || "User"}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email || "user@example.com"}</p>
                    <p className="text-[10px] sm:text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium mt-1 capitalize">
                      {role === "employer" ? "Employer Account" : "Candidate Account"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Links if authenticated */}
            {isAuthenticated && (
              <div className="mb-4">
                <p className="px-2 text-xs sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-3 sm:h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></span>
                  My Account
                </p>
                {profileItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] hover:pl-4 sm:hover:pl-5 animate-slideIn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-indigo-500">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className={`space-y-2 sm:space-y-3 ${isAuthenticated ? 'border-t border-indigo-100 pt-3 sm:pt-4' : ''}`}>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg shadow-indigo-500/25"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl border-2 border-indigo-600 px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Post A Job
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-rose-600 hover:bg-rose-50 transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </nav>
  );
}