"use client";

import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import AuthStats from "@/components/AuthStats";

export default function AuthLayout({ children }) {
  return (
    <div className="h-[700px] flex flex-col lg:flex-row overflow-hidden border border-gray-200 rounded-lg shadow-lg bg-white no-scrollbar">
      {/* LEFT - Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Logo */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50">
              <BriefcaseBusiness className="text-blue-600" size={20} />
            </div>
            <span className="text-base font-bold ml-2 text-gray-900">Jobpilot</span>
          </Link>
        </div>

        {/* Form Container - Fixed height with hidden scroll */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>

      {/* RIGHT - Image Section (Desktop only) */}
      <div className="hidden lg:flex w-1/2 relative no-scrollbar">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f2a44]/90 via-[#0f2a44]/70 to-[#0f2a44]/50" />

        {/* Background Image */}
        <img
          src="/assets/registration.jpg"
          alt="Job recruitment"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Stats Content - Centered */}
        <div className="relative z-20 w-full flex items-center p-8">
          <div className="w-full">
            <AuthStats />
          </div>
        </div>
      </div>
    </div>
  );
}