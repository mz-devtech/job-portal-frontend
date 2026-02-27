'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  Plus,
} from 'lucide-react'
import { homeService } from '@/services/homeService'
import { useRouter } from 'next/navigation'

export default function JobHero() {
  const router = useRouter()
  const [stats, setStats] = useState({
    liveJobs: '1,75,324',
    companies: '97,354',
    candidates: '38,47,154',
    newJobs: '7,532'
  })
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: ''
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await homeService.getHomeStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchParams.keyword || searchParams.location) {
      const params = new URLSearchParams()
      if (searchParams.keyword) params.append('search', searchParams.keyword)
      if (searchParams.location) params.append('location', searchParams.location)
      router.push(`/jobs?${params.toString()}`)
    }
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-indigo-50/30 py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <div className="relative order-2 lg:order-1 animate-slideInLeft">
            {/* Decorative elements - hidden on mobile */}
            <div className="hidden sm:block absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="hidden sm:block absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
              Find a job that suits{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                your interest
              </span>{' '}
              <br className="hidden sm:block" />
              & skills.
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-500 max-w-lg leading-relaxed animate-fadeIn animation-delay-300">
              Aliquam vitae turpis in diam convallis finibus in at risus.
              Nullam in scelerisque leo, eget sollicitudin velit vestibulum.
            </p>

            {/* SEARCH BAR - Responsive */}
            <form onSubmit={handleSearch} className="mt-6 sm:mt-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col md:flex-row items-center overflow-hidden border border-indigo-100">
              
              {/* Job Input */}
              <div className="group flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 gap-2 hover:bg-indigo-50/30 transition-all duration-300 border-b md:border-b-0 border-indigo-100">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                  className="w-full outline-none text-xs sm:text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
                />
              </div>

              <div className="hidden md:block h-8 w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />

              {/* Location Input */}
              <div className="group flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 gap-2 hover:bg-indigo-50/30 transition-all duration-300 border-b md:border-b-0 border-indigo-100">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Your Location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="w-full outline-none text-xs sm:text-sm text-gray-700 bg-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Button */}
              <button 
                type="submit"
                className="relative group w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Find Job
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* SUGGESTIONS - Responsive */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs animate-fadeIn animation-delay-600">
              <span className="text-gray-500 mr-1">Suggestion:</span>
              {['Designer', 'Programming', 'Digital Marketing', 'Video', 'Animation'].map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchParams({ ...searchParams, keyword: suggestion })}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/50 backdrop-blur-sm rounded-full text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border border-indigo-100 transition-all duration-300 transform hover:scale-105 hover:shadow-md text-[10px] sm:text-xs whitespace-nowrap"
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="relative flex justify-center order-1 lg:order-2 animate-slideInRight mb-6 lg:mb-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img
              src="/assets/hero.png"
              alt="Illustration"
              className="max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] md:max-w-md w-full relative z-10 animate-float drop-shadow-2xl"
            />
            
            {/* Floating elements - responsive sizing */}
            <div className="absolute top-5 right-5 sm:top-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl flex items-center justify-center animate-float animation-delay-1000">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-600" />
            </div>
            <div className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl flex items-center justify-center animate-float animation-delay-2000">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* STATS CARDS - Responsive Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <StatCard
            icon={<Briefcase className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            value={stats.liveJobs}
            label="Live Job"
            loading={loading}
            index={0}
          />
          <StatCard
            icon={<Building2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            value={stats.companies}
            label="Companies"
            loading={loading}
            index={1}
          />
          <StatCard
            icon={<Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            value={stats.candidates}
            label="Candidates"
            loading={loading}
            index={2}
          />
          <StatCard
            icon={<Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />}
            value={stats.newJobs}
            label="New Jobs"
            loading={loading}
            index={3}
          />
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        @media (min-width: 640px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -40px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </section>
  )
}

function StatCard({ icon, value, label, loading, index }) {
  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-lg p-3 sm:p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-fadeIn"
      style={{ animationDelay: `${400 + index * 100}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 rounded-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-indigo-200">
            {icon}
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
        </div>
        <div>
          {loading ? (
            <div className="space-y-1 sm:space-y-2">
              <div className="h-4 sm:h-5 md:h-6 w-16 sm:w-20 bg-gradient-to-r from-indigo-200 to-purple-200 rounded animate-pulse"></div>
              <div className="h-3 sm:h-4 w-12 sm:w-14 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                {value}
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 group-hover:text-indigo-600 transition-colors duration-300">
                {label}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Decorative corner - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full transform translate-x-5 -translate-y-5 md:translate-x-7 md:-translate-y-7 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}