"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiGrid,
  FiBriefcase,
  FiHeart,
  FiBell,
  FiSettings,
  FiLogOut,
  FiUser,
  FiFileText,
  FiStar,
} from "react-icons/fi";

export default function CandidateSidebar() {
  const pathname = usePathname();
  const [screenSize, setScreenSize] = useState('desktop');

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
    {
      section: "Dashboard",
      items: [
        { href: "/overview", icon: <FiGrid size={screenSize === 'mobile' ? 16 : 18} />, label: "Overview", badge: null },
        { href: "/applied_jobs", icon: <FiBriefcase size={screenSize === 'mobile' ? 16 : 18} />, label: "Applied Jobs", badge: "12" },
        { href: "/favourite_jobs", icon: <FiHeart size={screenSize === 'mobile' ? 16 : 18} />, label: "Favorite Jobs", badge: "8" },
      ]
    },
    {
      section: "Settings",
      items: [
        { href: "/settings", icon: <FiSettings size={screenSize === 'mobile' ? 16 : 18} />, label: "Settings", badge: null },
      ]
    }
  ];

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed left-0 top-16
          hidden lg:flex
          h-[calc(100vh-4rem)]
          w-[280px]
          flex-col
          border-r border-indigo-100
          bg-white/95 backdrop-blur-sm
          shadow-lg shadow-indigo-500/5
          px-5 py-6
          transition-all duration-300
          z-40
        `}
      >
        {/* Menu Sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent mt-10">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {/* Section label */}
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                {section.section}
              </p>

              {/* Section items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group relative flex items-center justify-between
                        rounded-xl px-4 py-2.5 text-sm
                        transition-all duration-300
                        ${active 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-4 border-indigo-600 shadow-md' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-6 hover:text-indigo-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${active 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 group-hover:scale-110'
                          }
                          transition-all duration-300
                        `}>
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator dot */}
                      {active && (
                        <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-4 border-t border-indigo-100">
          <button className={`
            group relative w-full
            flex items-center gap-3
            rounded-xl px-4 py-3
            text-sm text-gray-600
            hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50
            hover:text-red-600
            transition-all duration-300
            overflow-hidden
          `}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-rose-500/5 transition-all duration-300"></div>
            <FiLogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110" />
            <span className="font-medium">Log out</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 right-0 w-20 h-20 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
        <div className="absolute top-20 left-0 w-16 h-16 bg-gradient-to-r from-pink-200 to-indigo-200 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
      </aside>

      {/* Tablet Sidebar */}
      <aside
        className={`
          fixed left-0 top-16
          hidden md:flex lg:hidden
          h-[calc(100vh-4rem)]
          w-[220px]
          flex-col
          border-r border-indigo-100
          bg-white/95 backdrop-blur-sm
          shadow-lg shadow-indigo-500/5
          px-4 py-5
          transition-all duration-300
          z-40
        `}
      >
        {/* Menu Sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent mt-8">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-5">
              {/* Section label */}
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <span className="w-1 h-3 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                {section.section}
              </p>

              {/* Section items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        group relative flex items-center justify-between
                        rounded-lg px-3 py-2 text-xs
                        transition-all duration-300
                        ${active 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-3 border-indigo-600' 
                          : 'text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:pl-4 hover:text-indigo-600'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-300 group-hover:scale-110 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={`
                          px-1.5 py-0.5 text-[9px] font-medium rounded-full
                          ${active 
                            ? 'bg-white text-indigo-600' 
                            : 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600'
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-3 border-t border-indigo-100">
          <button className={`
            group relative w-full
            flex items-center gap-2
            rounded-lg px-3 py-2
            text-xs text-gray-600
            hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50
            hover:text-red-600
            transition-all duration-300
          `}>
            <FiLogOut size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-lg shadow-indigo-500/10 z-50">
        <div className="flex justify-around items-center px-1 py-1">
          {menuItems.flatMap(section => section.items).slice(0, 4).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex flex-col items-center justify-center
                  py-1 px-1 rounded-lg
                  transition-all duration-300
                  flex-1 max-w-[70px]
                  ${active 
                    ? 'text-indigo-600 scale-105' 
                    : 'text-gray-500 hover:text-indigo-500'
                  }
                `}
              >
                <span className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[8px] flex items-center justify-center rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[8px] mt-0.5 font-medium truncate w-full text-center">
                  {item.label === "Favorite Jobs" ? "Fav" : item.label}
                </span>
                {active && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
          <button className="flex flex-col items-center justify-center py-1 px-1 text-gray-500 hover:text-red-500 transition-all duration-300 flex-1 max-w-[70px]">
            <FiLogOut size={16} />
            <span className="text-[8px] mt-0.5 font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 20px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #c7d2fe;
        }
      `}</style>
    </>
  );
}