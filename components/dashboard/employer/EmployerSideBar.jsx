"use client";

import Link from "next/link";
import {
  FiLayers,
  FiUser,
  FiPlusCircle,
  FiBriefcase,
  FiBookmark,
  FiFileText,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function EmployerSidebar() {
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
        Employers Dashboard
      </p>

      {/* Menu */}
      <nav className="flex flex-col gap-1 text-[15px]">
        <Link
          href="/home"
          className="flex items-center gap-3 rounded-md bg-blue-50 px-4 py-2.5 font-medium text-blue-600"
        >
          <FiLayers size={18} />
          Overview
        </Link>

        <SidebarItem
          href="/employer_profile"
          icon={<FiUser size={18} />}
          label="Employer Profile"
        />

        <SidebarItem
          href="/post_job"
          icon={<FiPlusCircle size={18} />}
          label="Post a Job"
        />

        <SidebarItem
          href="/my_jobs"
          icon={<FiBriefcase size={18} />}
          label="My Jobs"
        />

        <SidebarItem
          href="/saved_candidates"
          icon={<FiBookmark size={18} />}
          label="Saved Candidate"
        />

        <SidebarItem
          href="/plans_billing"
          icon={<FiFileText size={18} />}
          label="Plans & Billing"
        />

        <SidebarItem
          href="/all_companies"
          icon={<FiUsers size={18} />}
          label="All Companies"
        />

        <SidebarItem
          href="/employer_settings"
          icon={<FiSettings size={18} />}
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
