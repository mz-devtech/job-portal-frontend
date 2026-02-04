"use client";

import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, Bookmark } from "lucide-react";
import { useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import DynamicNavbar from "@/components/DynamicNavbar";
import SecondNavbar from "@/components/SecondNavbar";

export default function Home() {
  const [openFilter, setOpenFilter] = useState(false);

  const jobs = [
    {
      id: "technical-support-specialist",
      title: "Technical Support Specialist",
      type: "PART-TIME",
      color: "bg-green-100 text-green-600",
      company: "Google Inc.",
      salary: "$20,000 - $25,000",
      location: "Dhaka, Bangladesh",
    },
    {
      id: "senior-ux-designer",
      title: "Senior UX Designer",
      type: "FULL-TIME",
      color: "bg-blue-100 text-blue-600",
      company: "Facebook",
      salary: "$100,000 - $120,000",
      location: "Dhaka, Bangladesh",
    },
    {
      id: "marketing-officer",
      title: "Marketing Officer",
      type: "INTERNSHIP",
      color: "bg-purple-100 text-purple-600",
      company: "Google Inc.",
      salary: "$15,000 - $20,000",
      location: "Dhaka, Bangladesh",
    },
    {
      id: "junior-graphic-designer",
      title: "Junior Graphic Designer",
      type: "INTERNSHIP",
      color: "bg-purple-100 text-purple-600",
      company: "Google Inc.",
      salary: "$15,000 - $20,000",
      location: "Dhaka, Bangladesh",
    },
    {
      id: "interaction-designer",
      title: "Interaction Designer",
      type: "PART-TIME",
      color: "bg-green-100 text-green-600",
      company: "Google Inc.",
      salary: "$20,000 - $25,000",
      location: "Dhaka, Bangladesh",
    },
    {
      id: "project-manager",
      title: "Project Manager",
      type: "FULL-TIME",
      color: "bg-blue-100 text-blue-600",
      company: "Google Inc.",
      salary: "$80,000 - $100,000",
      location: "Dhaka, Bangladesh",
    },
  ];

  return (
    <>
      <DynamicNavbar />
      <SecondNavbar />

      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 flex-1 border rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by: Job title, Position, Keyword..."
                className="w-full text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-1 border rounded-lg px-4 py-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, state or zip code"
                className="w-full text-sm outline-none"
              />
            </div>

            <button
              onClick={() => setOpenFilter(true)}
              className="flex items-center gap-2 border px-5 py-3 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <FilterSidebar
              isOpen={openFilter}
              onClose={() => setOpenFilter(false)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg text-sm font-medium">
              Find Job
            </button>
          </div>

          {/* Popular Searches */}
          <div className="mt-5 text-sm text-gray-500 flex flex-wrap gap-3">
            <span className="font-medium text-gray-600">Popular searches:</span>
            {[
              "Front-end",
              "Back-end",
              "Development",
              "PHP",
              "Laravel",
              "Bootstrap",
              "Developer",
              "Team Lead",
              "Product Testing",
              "Javascript",
            ].map((item) => (
              <span key={item} className="cursor-pointer hover:text-blue-600">
                {item}
              </span>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <Link
                href={`/jobs/${job.id}`}
                key={job.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition block"
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${job.color}`}
                  >
                    {job.type}
                  </span>
                  <Bookmark className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {job.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Salary: {job.salary}
                </p>

                <div className="flex items-center gap-3 mt-5">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">
                    {job.company[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {job.company}
                    </p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}