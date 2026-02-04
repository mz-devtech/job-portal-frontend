"use client";

import Link from "next/link";
import {
  FiGrid,
  FiBriefcase,
  FiHeart,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function CandidateSidebar() {
  return (
    <aside
      className="
        fixed left-0 top-28
        hidden md:flex
        h-[calc(100vh-7rem)]
        w-[260px]
        flex-col
        border-r border-gray-200
        bg-white
        px-5 py-6
      "
    >
      {/* Section label */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Candidate Dashboard
      </p>

      {/* Menu */}
      <nav className="flex flex-col gap-1 text-[15px]">
        <Link
          href="/candidate/overview"
          className="flex items-center gap-3 rounded-md bg-blue-50 px-4 py-2.5 font-medium text-blue-600"
        >
          <FiGrid size={18} />
          Overview
        </Link>

        <SidebarItem
          href="/applied_jobs"
          icon={<FiBriefcase />}
          label="Applied Jobs"
        />
        <SidebarItem
          href="/favourite_jobs"
          icon={<FiHeart />}
          label="Favorite Jobs"
        />
        <SidebarItem
          href="/candidate/job-alerts"
          icon={<FiBell />}
          label="Job Alerts"
        />
        <SidebarItem
          href="/settings"
          icon={<FiSettings />}
          label="Settings"
        />
      </nav>

      {/* Logout */}
      <button className="mt-auto flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-500">
        <FiLogOut size={18} />
        Log out
      </button>
    </aside>
  );
}

function SidebarItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-md px-4 py-2.5 text-gray-700 hover:bg-gray-100"
    >
      {icon}
      {label}
    </Link>
  );
}
