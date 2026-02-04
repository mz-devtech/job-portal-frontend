'use client'

import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  Plus,
} from 'lucide-react'

export default function JobHero() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-snug">
              Find a job that suits <br />
              your interest & skills.
            </h1>

            <p className="mt-4 text-gray-500 max-w-lg text-sm">
              Aliquam vitae turpis in diam convallis finibus in at risus.
              Nullam in scelerisque leo, eget sollicitudin velit vestibulum.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-8 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center overflow-hidden">

              {/* Job Input */}
              <div className="flex items-center w-full px-4 py-3 gap-2">
                <Search size={18} className="text-blue-600" />
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  className="w-full outline-none text-sm text-gray-700"
                />
              </div>

              <div className="hidden md:block h-8 w-px bg-gray-200" />

              {/* Location Input */}
              <div className="flex items-center w-full px-4 py-3 gap-2">
                <MapPin size={18} className="text-blue-600" />
                <input
                  type="text"
                  placeholder="Your Location"
                  className="w-full outline-none text-sm text-gray-700"
                />
              </div>

              {/* Button */}
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-sm font-medium">
                Find Job
              </button>
            </div>

            {/* SUGGESTIONS */}
            <p className="mt-4 text-xs text-gray-500">
              Suggestion:{' '}
              <span className="text-blue-600">
                Designer, Programming, Digital Marketing, Video, Animation
              </span>
            </p>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="flex justify-center">
            <img
              src="/assets/hero.png"
              alt="Illustration"
              className="max-w-md w-full"
            />
          </div>
        </div>

        {/* STATS */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Briefcase />}
            value="1,75,324"
            label="Live Job"
          />
          <StatCard
            icon={<Building2 />}
            value="97,354"
            label="Companies"
          />
          <StatCard
            icon={<Users />}
            value="38,47,154"
            label="Candidates"
          />
          <StatCard
            icon={<Plus />}
            value="7,532"
            label="New Jobs"
          />
        </div>

      </div>
    </section>
  )
}

function StatCard({ icon, value, label }) {
  return (
    <div className="flex items-center gap-4 bg-white border rounded-lg p-6 shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-md">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}
