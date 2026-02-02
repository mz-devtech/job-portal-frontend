"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, Briefcase, Search, Menu, X, User, Globe } from "lucide-react";

export default function SecondNavbar() {
  const [country, setCountry] = useState({ code: "IN", name: "India" });
  const [countryOpen, setCountryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const countryDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

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

  // Handle Sign In click - goes to register page
  const handleSignIn = () => {
    router.push("/login");
  };

  // Handle Post A Job click - goes to register page
  const handlePostJob = () => {
    router.push("/register");
  };

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
              {/* Sign In button - goes to register page */}
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                Sign In
              </button>

              {/* Post A Job button - goes to register page */}
              <button
                onClick={handlePostJob}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Post A Job
              </button>
            </div>

            {/* Mobile Actions (when menu is open) */}
            {mobileMenuOpen && (
              <div className="absolute right-4 top-14 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg sm:hidden">
                {/* Sign In button - goes to register page */}
                <button
                  onClick={() => {
                    handleSignIn();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
                
                {/* Post A Job button - goes to register page */}
                <button
                  onClick={() => {
                    handlePostJob();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Post A Job
                </button>
              </div>
            )}
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
    </nav>
  );
}