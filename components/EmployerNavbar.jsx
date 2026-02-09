"use client";

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiPhone, FiChevronDown } from "react-icons/fi";
import Link from "next/link";

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
  const langRef = useRef(null);
  const menuRef = useRef(null);

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

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Find Candidate", href: "/candidates" },
    { label: "Dashboard", href: "/home" },
    { label: "My Jobs", href: "/my_jobs" },
    { label: "About Us", href: "/about_us" },
    { label: "Contact", href: "/Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm md:h-14">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* LEFT SECTION */}
        <div className="flex h-full items-center gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-blue-600 sm:text-xl hover:text-blue-700">
            JobPortal
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <ul className="hidden h-full md:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`relative flex h-full items-center px-3 text-sm cursor-pointer transition-colors duration-200
                    ${
                      item.label === "Home"
                        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-600"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="hidden items-center gap-4 md:flex md:gap-6">
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
            {/* Mobile Navigation Items */}
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 text-base font-medium ${
                      item.label === "Home"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
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