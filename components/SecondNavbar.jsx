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
              {/* Loading placeholder */}
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Row */}
        <div className="flex h-14 sm:h-16 items-center justify-between">
          
          {/* LEFT: Logo, Country & Mobile Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 sm:hidden group"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} size={20} />
                <X className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} size={20} />
              </div>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <div className="relative">
                  <Briefcase className="h-5 w-5 text-indigo-600 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <span className="absolute -inset-1 bg-indigo-200 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-base sm:text-lg transition-all duration-300 group-hover:from-indigo-700 group-hover:to-purple-700">
                  Jobpilot
                </span>
              </div>
            </Link>

            {/* Country Dropdown - ALWAYS VISIBLE */}
            <div ref={countryDropdownRef} className="relative hidden sm:block">
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm hover:shadow"
                aria-label="Select country"
                aria-expanded={countryOpen}
              >
                <ReactCountryFlag
                  svg
                  countryCode={country.code}
                  style={{ 
                    width: "1.2em", 
                    height: "1.2em", 
                    borderRadius: "2px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                />
                <span className="hidden lg:inline font-medium">{country.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-300 ${
                    countryOpen ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </button>

              {countryOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown">
                  <div className="p-3 max-h-80 overflow-y-auto">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-2 pb-3 mb-2 border-b border-indigo-100">
                      <div className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 py-1">
                        Select Country
                      </div>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-indigo-400" />
                        <input
                          type="text"
                          placeholder="Search countries..."
                          className="w-full rounded-lg border border-indigo-200 bg-indigo-50/50 pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
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
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 hover:pl-4 ${
                            country.code === c.code 
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50"
                          }`}
                        >
                          <ReactCountryFlag
                            svg
                            countryCode={c.code}
                            style={{ 
                              width: "1.2em", 
                              height: "1.2em", 
                              borderRadius: "2px" 
                            }}
                          />
                          <span className="flex-1 text-left font-medium">{c.name}</span>
                          {country.code === c.code && (
                            <ChevronDown className="h-4 w-4 rotate-180 text-indigo-600 animate-bounceIn" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center rounded-full border border-indigo-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-visible flex-1 max-w-2xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
              {/* Search Input */}
              <div className="flex flex-1 items-center px-4">
                <Search className="h-4 w-4 text-indigo-400 transition-transform duration-300 group-hover:scale-110" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keyword, or company"
                  className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 bg-transparent"
                  aria-label="Search jobs"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg mr-1"
              >
                Search
              </button>
            </form>
          </div>

          {/* RIGHT: Actions & Mobile Country */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Country Toggle */}
            <div className="sm:hidden">
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 relative group"
                aria-label="Select country"
              >
                <Globe size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              </button>

              {/* Mobile Country Dropdown */}
              {countryOpen && (
                <div className="absolute right-4 top-14 z-50 w-56 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown">
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
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-300 ${
                          country.code === c.code 
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700" 
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-4"
                        }`}
                      >
                        <ReactCountryFlag
                          svg
                          countryCode={c.code}
                          style={{ width: "1.2em", height: "1.2em" }}
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

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 md:hidden relative group"
              aria-label={showMobileSearch ? "Close search" : "Open search"}
            >
              <Search size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {!showMobileSearch && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-4">
              {/* If user is authenticated, show profile dropdown */}
              {isAuthenticated ? (
                <div ref={profileDropdownRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    {/* Profile Image/Icon */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden ring-2 ring-indigo-200 group-hover:ring-indigo-300 transition-all duration-300">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || "User"} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-indigo-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                      <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 capitalize">{role || "User"}</p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-300 ${
                        profileOpen ? "rotate-180 text-indigo-600" : "text-gray-400"
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-indigo-100 bg-white shadow-xl shadow-indigo-500/10 animate-slideDown overflow-hidden">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                        <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-600">{user?.email || "user@example.com"}</p>
                        <div className="inline-block mt-2 px-3 py-1 bg-white rounded-full text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm">
                          {role === "employer" ? "👔 Employer Account" : "🎯 Candidate Account"}
                        </div>
                      </div>
                      
                      {/* Profile Links */}
                      <div className="p-2">
                        {profileItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-300 hover:pl-4 group"
                            onClick={() => setProfileOpen(false)}
                          >
                            <span className="text-indigo-500 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-indigo-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-all duration-300 hover:pl-4 group"
                        >
                          <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* If user is not authenticated, show Sign In and Post Job buttons */
                <>
                  {/* Sign In button */}
                  <button
                    onClick={() => router.push("/login")}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group"
                  >
                    <User className="h-4 w-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300" />
                    <span className="group-hover:text-indigo-600 transition-colors duration-300">Sign In</span>
                  </button>

                  {/* Post A Job button */}
                  <button
                    onClick={() => router.push("/register")}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-indigo-500/25"
                  >
                    Post A Job
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <form onSubmit={handleSearch} className="py-3 md:hidden animate-slideDown">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full rounded-full border border-indigo-200 px-5 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  aria-label="Search jobs"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}

        {/* Desktop Country Label (for smaller screens) */}
        <div className="hidden sm:flex lg:hidden items-center gap-2 pb-2 px-2 text-sm text-gray-600 animate-fadeIn">
          <Globe className="h-3.5 w-3.5 text-indigo-500" />
          <span>Jobs in: </span>
          <button
            onClick={() => setCountryOpen(true)}
            className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
          >
            {country.name}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {(mobileMenuOpen || countryOpen) && (
        <div
          className="fixed inset-0 top-14 z-30 bg-gradient-to-b from-black/20 to-black/10 backdrop-blur-sm animate-fadeIn sm:hidden"
          onClick={() => {
            setMobileMenuOpen(false);
            setCountryOpen(false);
          }}
        />
      )}

      {/* Desktop Country Overlay */}
      {countryOpen && (
        <div
          className="fixed inset-0 top-16 z-30 hidden sm:block bg-black/5 backdrop-blur-[2px] animate-fadeIn"
          onClick={() => setCountryOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 bg-white/95 backdrop-blur-md shadow-2xl shadow-indigo-500/10 sm:hidden animate-slideDown">
          <div className="border-t border-indigo-100 px-4 py-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* User Info if authenticated */}
            {isAuthenticated && (
              <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl animate-slideIn">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden ring-2 ring-indigo-200">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || "User"} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-7 w-7 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-600">{user?.email || "user@example.com"}</p>
                    <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium mt-1 capitalize">
                      {role === "employer" ? "Employer Account" : "Candidate Account"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Profile Links if authenticated */}
            {isAuthenticated && (
              <div className="mb-4">
                <p className="px-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></span>
                  My Account
                </p>
                {profileItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] hover:pl-5 animate-slideIn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-indigo-500">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Actions */}
            <div className={`space-y-3 ${isAuthenticated ? 'border-t border-indigo-100 pt-4' : ''}`}>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg shadow-indigo-500/25"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-xl border-2 border-indigo-600 px-4 py-3.5 text-sm font-medium text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Post A Job
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all duration-300 transform hover:scale-[1.02] group"
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