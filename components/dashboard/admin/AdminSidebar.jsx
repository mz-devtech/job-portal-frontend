"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiHome,
  FiLayers,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiShield,
  FiAlertCircle,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { logoutUser } from "../../../redux/slices/userSlice";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width >= 640 && width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { href: "/admin_home", icon: <FiGrid size={screenSize === 'mobile' ? 16 : 18} />, label: "Overview" },
    { href: "/alljobs", icon: <FiBriefcase size={screenSize === 'mobile' ? 16 : 18} />, label: "Manage Jobs" },
    { href: "/all_users", icon: <FiUsers size={screenSize === 'mobile' ? 16 : 18} />, label: "Manage Users" },
    { href: "/all_companies", icon: <FiHome size={screenSize === 'mobile' ? 16 : 18} />, label: "Manage Companies" },
    { href: "/categories", icon: <FiLayers size={screenSize === 'mobile' ? 16 : 18} />, label: "Manage Categories" },
    { href: "/plans", icon: <FiCreditCard size={screenSize === 'mobile' ? 16 : 18} />, label: "Subscription Plans" },
    { href: "/admin_settings", icon: <FiSettings size={screenSize === 'mobile' ? 16 : 18} />, label: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      
      router.push("/login");
      
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-5 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900">Logout Confirmation</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>
              
              <p className="text-[10px] sm:text-xs text-gray-600 mb-4 sm:mb-5 md:mb-6">
                You will be redirected to the login page. Any unsaved changes will be lost.
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-[10px] sm:text-xs text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-[10px] sm:text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="hidden sm:inline">Logging out...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <FiLogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop/Tablet Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`
          fixed left-0 top-0
          ${screenSize === 'mobile' ? 'hidden' : 'flex'}
          h-screen
          w-[220px] md:w-[250px] lg:w-[280px]
          flex-col
          border-r border-gray-200
          bg-gradient-to-b from-white to-gray-50/50
          px-3 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8
          shadow-lg
          backdrop-blur-sm
          z-40
        `}
      >
        {/* Section label */}
        <div className="mb-3 sm:mb-4 px-2 sm:px-3 md:px-4 mt-2 sm:mt-3 md:mt-4">
          <p className="text-[8px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider text-gray-400">
            Dashboard
          </p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 text-[12px] sm:text-sm px-1 sm:px-2 flex-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
              screenSize={screenSize}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutModal(true)}
          className="mx-2 sm:mx-3 md:mx-4 mt-auto flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all group"
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
            <FiLogOut size={screenSize === 'mobile' ? 14 : 16} className="group-hover:text-red-500 transition-colors" />
          </div>
          <span className="font-medium">Log out</span>
        </motion.button>

        {/* Footer */}
        <div className="mt-3 sm:mt-4 px-2 sm:px-3 md:px-4 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-[8px] sm:text-[10px] text-gray-400 text-center">
            Version 2.0.0
          </p>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      {screenSize === 'mobile' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center px-1 py-1">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex flex-col items-center justify-center
                    py-1 px-1 rounded-lg
                    transition-all duration-300
                    flex-1 max-w-[70px]
                    ${isActive 
                      ? 'text-blue-600 scale-105' 
                      : 'text-gray-500 hover:text-blue-500'
                    }
                  `}
                >
                  <span className="relative">
                    {item.icon}
                    {item.label === "Manage Jobs" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 text-white text-[6px] flex items-center justify-center rounded-full">
                        12
                      </span>
                    )}
                  </span>
                  <span className="text-[6px] mt-0.5 font-medium truncate w-full text-center">
                    {item.label === "Manage Jobs" ? "Jobs" : 
                     item.label === "Manage Users" ? "Users" :
                     item.label === "Manage Companies" ? "Companies" :
                     item.label === "Manage Categories" ? "Cats" :
                     item.label === "Subscription Plans" ? "Plans" :
                     item.label === "Settings" ? "Settings" :
                     item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex flex-col items-center justify-center py-1 px-1 text-gray-500 hover:text-red-500 transition-all duration-300 flex-1 max-w-[70px]"
            >
              <FiLogOut size={16} />
              <span className="text-[6px] mt-0.5 font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable Sidebar Item with Active State */
function SidebarItem({ href, icon, label, isActive, screenSize }) {
  const [showBadge, setShowBadge] = useState(label === "Manage Jobs");

  return (
    <Link href={href} className="relative">
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5
          transition-all duration-200 cursor-pointer
          ${isActive 
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-1 h-5 sm:h-6 md:h-7 lg:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Icon with background on active */}
        <div className={`
          p-1 sm:p-1.5 rounded-lg transition-all
          ${isActive 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 group-hover:text-gray-700'
          }
        `}>
          {icon}
        </div>
        
        <span className={`font-medium text-[10px] sm:text-xs ${isActive ? 'text-blue-600' : ''}`}>
          {label}
        </span>

        {/* Badge for Manage Jobs */}
        {showBadge && (
          <span className="ml-auto px-1 sm:px-1.5 md:px-2 py-0.5 text-[6px] sm:text-[8px] md:text-xs bg-blue-100 text-blue-600 rounded-full">
            12
          </span>
        )}
      </motion.div>
    </Link>
  );
}