"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, Briefcase, Search, Menu, X, User, Globe, LogOut, Settings, Bell, FileText, Building, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser, selectRole } from "@/redux/slices/userSlice";
import Image from "next/image";

export default function SecondNavbar() {
  const [country, setCountry] = useState({ code: "IN", name: "India" });
  const [countryOpen, setCountryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const countryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isAuthenticated = !!user;

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
    { label: "Company Profile", href: "/employer/company-profile", icon: <Building className="h-4 w-4" /> },
    { label: "Post Job", href: "/employer/post-job", icon: <FileText className="h-4 w-4" /> },
    { label: "My Jobs", href: "/employer/jobs", icon: <Briefcase className="h-4 w-4" /> },
    { label: "Billing", href: "/employer/billing", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Settings", href: "/employer/settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const profileItems = role === "employer" ? employerProfileItems : candidateProfileItems;

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Row */}
        <div className="flex h-14 sm:h-16 items-center justify-between">
          
          {/* LEFT: Logo, Country & Mobile Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Briefcase className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                <span className="text-base sm:text-lg">Jobpilot</span>
              </div>
            </Link>

            {/* Country Dropdown - ALWAYS VISIBLE */}
            <div ref={countryDropdownRef} className="relative hidden sm:block">
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    boxShadow: "0 0 1px rgba(0,0,0,0.2)"
                  }}
                />
                <span className="hidden lg:inline">{country.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    countryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {countryOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="p-2 max-h-80 overflow-y-auto">
                    <div className="sticky top-0 bg-white px-2 pb-2 mb-2 border-b">
                      <div className="text-xs font-medium text-gray-500 py-1">
                        Select Country
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search countries..."
                          className="w-full rounded-md border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-gray-50 ${
                          country.code === c.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
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
                        <span className="flex-1 text-left">{c.name}</span>
                        {country.code === c.code && (
                          <ChevronDown className="h-4 w-4 rotate-180 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center rounded-lg border border-gray-300 bg-white shadow-sm overflow-visible flex-1 max-w-2xl">
              {/* Search Input */}
              <div className="flex flex-1 items-center px-4">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keyword, or company"
                  className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-gray-500"
                  aria-label="Search jobs"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="rounded-r-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select country"
              >
                <Globe size={20} />
              </button>

              {/* Mobile Country Dropdown */}
              {countryOpen && (
                <div className="absolute right-4 top-14 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    <div className="mb-2 text-xs font-medium text-gray-500 px-2">
                      Select Country
                    </div>
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountry(c);
                          setCountryOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                          country.code === c.code ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <ReactCountryFlag
                          svg
                          countryCode={c.code}
                          style={{ width: "1.2em", height: "1.2em" }}
                        />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-label={showMobileSearch ? "Close search" : "Open search"}
            >
              <Search size={20} />
            </button>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-4">
              {/* If user is authenticated, show profile dropdown */}
              {isAuthenticated ? (
                <div ref={profileDropdownRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* Profile Image/Icon */}
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 capitalize">{role || "User"}</p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
                      {/* User Info */}
                      <div className="p-4 border-b">
                        <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                          {role === "employer" ? "Employer Account" : "Candidate Account"}
                        </p>
                      </div>
                      
                      {/* Profile Links */}
                      <div className="p-2">
                        {profileItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setProfileOpen(false)}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
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
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </button>

                  {/* Post A Job button */}
                  <button
                    onClick={() => router.push("/register")}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  aria-label="Search jobs"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}

        {/* Desktop Country Label (for smaller screens) */}
        <div className="hidden sm:flex lg:hidden items-center gap-2 pb-2 px-2 text-sm text-gray-600">
          <Globe className="h-3.5 w-3.5" />
          <span>Jobs in: </span>
          <button
            onClick={() => setCountryOpen(true)}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            {country.name}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {(mobileMenuOpen || countryOpen) && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/20 sm:hidden"
          onClick={() => {
            setMobileMenuOpen(false);
            setCountryOpen(false);
          }}
        />
      )}

      {/* Desktop Country Overlay */}
      {countryOpen && (
        <div
          className="fixed inset-0 top-16 z-30 hidden sm:block"
          onClick={() => setCountryOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-40 bg-white shadow-xl sm:hidden animate-slideDown">
          <div className="border-t border-gray-200 px-4 py-3">
            {/* User Info if authenticated */}
            {isAuthenticated && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                      {role === "employer" ? "Employer Account" : "Candidate Account"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Profile Links if authenticated */}
            {isAuthenticated && (
              <div className="mb-4">
                <p className="px-2 text-sm font-medium text-gray-500 mb-2">My Account</p>
                {profileItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Actions */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-lg border-2 border-blue-600 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Post A Job
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}