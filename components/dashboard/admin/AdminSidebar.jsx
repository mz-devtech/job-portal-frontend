"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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

  const menuItems = [
    { href: "/admin_home", icon: <FiGrid size={18} />, label: "Overview" },
    { href: "/alljobs", icon: <FiBriefcase size={18} />, label: "Manage Jobs" },
    { href: "/all_users", icon: <FiUsers size={18} />, label: "Manage Users" },
    { href: "/all_companies", icon: <FiHome size={18} />, label: "Manage Companies" },
    { href: "/categories", icon: <FiLayers size={18} />, label: "Manage Categories" },
    { href: "/plans", icon: <FiCreditCard size={18} />, label: "Subscription Plans" },
    { href: "/admin_settings", icon: <FiSettings size={18} />, label: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logoutUser()).unwrap();
      
      // Navigate to login page
      router.push("/login");
      
      // Optional: Show success message
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to login
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Logout Confirmation</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                You will be redirected to the login page. Any unsaved changes will be lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="
          fixed left-0 top-0
          hidden md:flex
          h-screen
          w-[280px]
          flex-col
          border-r border-gray-200
          bg-gradient-to-b from-white to-gray-50/50
          px-4 py-8
          shadow-lg
          backdrop-blur-sm
        "
      >
     

        {/* Section label */}
        <div className="mb-4 px-4 mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Dashboard
          </p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1.5 text-[15px] px-2 flex-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutModal(true)}
          className="mx-4 mt-auto flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all group"
        >
          <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
            <FiLogOut size={16} className="group-hover:text-red-500 transition-colors" />
          </div>
          <span className="font-medium">Log out</span>
        </motion.button>

        {/* Footer */}
        <div className="mt-4 px-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Version 2.0.0
          </p>
        </div>
      </motion.aside>
    </>
  );
}

/* Reusable Sidebar Item with Active State */
function SidebarItem({ href, icon, label, isActive }) {
  return (
    <Link href={href} className="relative">
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`
          flex items-center gap-3 rounded-xl px-4 py-3
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
            className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        
        {/* Icon with background on active */}
        <div className={`
          p-1.5 rounded-lg transition-all
          ${isActive 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-500 group-hover:text-gray-700'
          }
        `}>
          {icon}
        </div>
        
        <span className={`font-medium ${isActive ? 'text-blue-600' : ''}`}>
          {label}
        </span>

        {/* Optional badge for demo - remove in production */}
        {label === "Manage Jobs" && (
          <span className="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
            12
          </span>
        )}
      </motion.div>
    </Link>
  );
}