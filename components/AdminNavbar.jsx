"use client";

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiPhone, FiChevronDown, FiUser, FiSettings, FiBarChart2, FiUsers, FiBriefcase, FiShield, FiAlertCircle, FiHome, FiLogOut, FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, refreshUserData } from "@/redux/slices/userSlice";

const languages = [
  { label: "English", flag: "https://flagcdn.com/w20/us.png" },
  { label: "Spanish", flag: "https://flagcdn.com/w20/es.png" },
  { label: "French", flag: "https://flagcdn.com/w20/fr.png" },
];

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(languages[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const langRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get user data from Redux
  const user = useSelector(selectUser);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  const handleNavigation = (path) => {
    setMenuOpen(false);
    setLangOpen(false);
    router.push(path);
  };

  // Navigation items for admin with icons
  const navItems = [
    { 
      label: "Dashboard", 
      href: "/admin_home",
      icon: <FiBarChart2 className="mr-2" size={18} />
    },
    { 
      label: "Users", 
      href: "/all_users",
      icon: <FiUsers className="mr-2" size={18} />
    },
    { 
      label: "Jobs", 
      href: "/alljobs",
      icon: <FiBriefcase className="mr-2" size={18} />
    },
    { 
      label: "Settings", 
      href: "/admin/settings",
      icon: <FiSettings className="mr-2" size={18} />
    },
  ];

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? "bg-gradient-to-r from-indigo-900/95 to-purple-900/95 backdrop-blur-md shadow-lg py-2" 
            : "bg-gradient-to-r from-indigo-900 to-purple-900 py-3"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LEFT SECTION */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex h-full items-center gap-6 lg:gap-10"
          >
            {/* Logo with animated shield */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation("/admin_home")}
              className="flex items-center gap-2 text-lg font-bold text-white hover:text-indigo-200 transition-colors group"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-yellow-400"
              >
                <FiShield size={24} />
              </motion.div>
              <span className="hidden sm:inline bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent font-extrabold">
                AdminPortal
              </span>
              <span className="sm:hidden text-white">Admin</span>
            </motion.button>

            {/* Desktop Navigation with hover effects */}
            <ul className="hidden h-full items-center gap-1 lg:flex">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.href)}
                    className="relative flex items-center px-4 py-2 text-sm font-medium text-gray-200 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-200 group"
                  >
                    <span className="flex items-center">
                      {item.icon}
                      {item.label}
                    </span>
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                    />
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* RIGHT SECTION */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden items-center gap-3 md:flex lg:gap-4"
          >
         
            {/* User Profile with smooth hover */}
            {user && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 rounded-full bg-white/10 pl-1 pr-3 py-1 cursor-pointer hover:bg-white/20 transition-all duration-200"
                onClick={() => handleNavigation("/admin/profile")}
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="h-8 w-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg"
                >
                  <span className="text-indigo-900 font-bold text-sm">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A"}
                  </span>
                </motion.div>
                <div className="hidden lg:block">
                  <p className="text-xs text-gray-300">Welcome back</p>
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                    {user.name || user.email?.split('@')[0] || "Admin"}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Support with subtle animation */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="hidden lg:flex items-center gap-2 text-sm text-gray-200 border-l border-white/20 pl-4"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <FiPhone className="text-yellow-400" />
              </motion.div>
              <span className="hidden xl:inline">24/7 Support</span>
            </motion.div>

            {/* Language Dropdown with smooth animations */}
            <div className="relative" ref={langRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                aria-label="Select language"
                aria-expanded={langOpen}
              >
                <motion.img 
                  animate={{ rotateY: langOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  src={activeLang.flag} 
                  alt={`${activeLang.label} flag`} 
                  className="h-4 w-5 rounded-sm object-cover"
                  loading="lazy"
                />
                <span className="hidden sm:inline">{activeLang.label}</span>
                <motion.div
                  animate={{ rotate: langOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-xl z-50 overflow-hidden"
                  >
                    {languages.map((lang, index) => (
                      <motion.li
                        key={lang.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setActiveLang(lang);
                          setLangOpen(false);
                        }}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-150"
                        whileHover={{ x: 5 }}
                      >
                        <img 
                          src={lang.flag} 
                          alt={`${lang.label} flag`}
                          className="h-4 w-5 rounded-sm object-cover"
                          loading="lazy"
                        />
                        {lang.label}
                        {activeLang.label === lang.label && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-indigo-500"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* MOBILE MENU BUTTON with animation */}
          <motion.button
            id="mobile-menu-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY with fade */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE MENU CONTENT with slide animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 right-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-2xl md:hidden"
          >
            <div className="border-t border-gray-100 px-4 py-6">
              
              {/* User Profile Card for Mobile */}
              {user && (
                <motion.div 
                  variants={itemVariants}
                  className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white font-bold text-xl">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A"}
                      </span>
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name || "Admin User"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mobile Navigation Items */}
              <motion.ul variants={itemVariants} className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <motion.button
                      whileHover={{ x: 10, backgroundColor: "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.href)}
                      className="flex w-full items-center rounded-xl px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      <span className="text-indigo-600 mr-3">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Mobile Contact & Language */}
              <motion.div 
                variants={itemVariants}
                className="mt-8 space-y-4"
              >
                {/* Support Phone */}
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                  className="flex items-center gap-3 rounded-xl p-4 bg-gray-50"
                >
                  <div className="rounded-full bg-indigo-100 p-3">
                    <FiPhone className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Admin Support</p>
                    <p className="font-semibold text-gray-800">+1-202-555-0199</p>
                  </div>
                </motion.div>

                {/* Language Selector */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-3 text-sm font-medium text-gray-500">Select Language</p>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.label}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          setActiveLang(lang);
                          setMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                          activeLang.label === lang.label
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={`${lang.label} flag`}
                          className="h-5 w-6 rounded-sm object-cover"
                          loading="lazy"
                        />
                        <span className="font-medium">{lang.label}</span>
                        {activeLang.label === lang.label && (
                          <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;