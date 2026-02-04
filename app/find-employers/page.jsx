"use client";

import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';

export default function FindEmployers() {
  const employers = [
    { id: 1, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 2, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 3, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 4, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 5, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 6, name: "Dribbble", featured: true, location: "Dhaka, Bangladesh", openPositions: 3 },
    { id: 7, name: "Google", featured: false, location: "Mountain View, USA", openPositions: 8 },
    { id: 8, name: "Facebook", featured: false, location: "Menlo Park, USA", openPositions: 5 },
    { id: 9, name: "Twitter", featured: false, location: "San Francisco, USA", openPositions: 4 },
  ];

  const popularSearches = [
    "Front-end", "Back-end", "Development", "PHP", "Laravel", 
    "Bootstrap", "Developer", "Team Lead", "Product Testing", "Javascript"
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Home / <span className="text-gray-800 font-medium">Find Employers</span>
        </div>

        {/* Search Bar - Simplified Design */}
        <div className="bg-white rounded-lg border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 border rounded px-4 py-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by: Job title, Position, Keyword..."
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center gap-2 border rounded px-4 py-3">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="City, state or zip code"
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Search Button */}
            <button className="bg-blue-600 text-white px-8 py-3 rounded font-medium hover:bg-blue-700 transition">
              Find Job
            </button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mb-10">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular searches:</h3>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((item, index) => (
              <span
                key={index}
                className="text-gray-600 hover:text-blue-600 cursor-pointer text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Employers Grid - 3x3 Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employers.map((employer, index) => (
              <Link 
                href={`/find-employers/${employer.id}`}
                key={index}
                className="block"
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-14 h-14 bg-pink-500 rounded flex items-center justify-center text-white font-bold text-lg">
                      {employer.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {employer.name}
                        </h3>
                        {employer.featured && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin size={14} />
                        {employer.location}
                      </p>
                    </div>
                  </div>

                  {/* Open Positions Button */}
                  <div className="mt-6">
                    <button className="w-full bg-blue-50 text-blue-600 text-sm font-medium py-3 rounded-lg hover:bg-blue-100 transition">
                      Open Position ({employer.openPositions})
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}