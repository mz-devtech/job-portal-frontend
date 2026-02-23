'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from 'next/link'
import { homeService } from '@/services/homeService'
import { Briefcase, MapPin, Bookmark, Sparkles } from 'lucide-react'

const typeColor = {
  "FULL_TIME": "bg-blue-100 text-blue-700",
  "PART_TIME": "bg-green-100 text-green-700",
  "CONTRACT": "bg-purple-100 text-purple-700",
  "INTERNSHIP": "bg-yellow-100 text-yellow-700",
  "REMOTE": "bg-teal-100 text-teal-700",
  "FREELANCE": "bg-orange-100 text-orange-700",
  "FULL-TIME": "bg-blue-100 text-blue-700",
  "PART-TIME": "bg-green-100 text-green-700",
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await homeService.getFeaturedJobs(12)
      setJobs(data)
    } catch (error) {
      console.error('Error fetching featured jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10 overflow-hidden">
        <div className="flex items-center justify-between mb-6 animate-slideInLeft">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg animate-pulse"></div>
            <div className="h-6 w-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-16 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-5 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 w-3/4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse mb-4"></div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200 animate-pulse"></div>
                <div>
                  <div className="h-3 w-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse mb-1"></div>
                  <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 overflow-hidden">
      {/* Header */}
      <div className="relative flex items-center justify-between mb-8 animate-slideInLeft">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="absolute -inset-1 bg-blue-400 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Featured Jobs
          </h2>
        </div>
        <Link 
          href="/jobs" 
          className="group relative px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            View All
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
        </Link>
        
        {/* Decorative line */}
        <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <Link href={`/jobs/${job.id}`} key={index}>
            <div
              className="group relative rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-5 transition-all duration-500 hover:bg-gradient-to-br hover:from-[#FFF7E6] hover:to-[#FFFDF8] hover:border-[#F5D58A] hover:shadow-2xl hover:shadow-amber-500/10 transform hover:-translate-y-1 hover:scale-[1.02] animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Bookmark with animation */}
              <div className="absolute top-5 right-5 text-gray-300 group-hover:text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Bookmark size={18} />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-amber-900 transition-colors duration-300">
                {job.title}
              </h3>

              {/* Job type + salary */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[job.type] || 'bg-gray-100 text-gray-700'} transition-all duration-300 group-hover:scale-105`}
                >
                  {job.type.replace('_', '-')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {job.salary}
                </span>
              </div>

              {/* Company */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                    {job.logo && job.logo !== '/google.png' ? (
                      <Image
                        src={job.logo}
                        alt={job.company}
                        width={22}
                        height={22}
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg">
                        {job.company.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-amber-400 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-amber-700 transition-colors duration-300">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    <MapPin size={12} className="group-hover:text-amber-500 transition-colors duration-300" />
                    {job.location}
                  </div>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
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
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}