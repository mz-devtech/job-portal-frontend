'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { homeService } from '@/services/homeService'
import { Building2, MapPin, Award, ArrowRight, Sparkles } from 'lucide-react'

export default function TopCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const data = await homeService.getTopCompanies(6)
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-gray-50/30 py-12 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3 mb-8 animate-slideInLeft">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg animate-pulse"></div>
            <div className="h-7 w-40 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-6 h-10 w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50/30 py-12 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <div className="relative flex items-center gap-3 mb-8 animate-slideInLeft">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="absolute -inset-1 bg-blue-400 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
          </div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Top Companies
          </h2>
          
          {/* Decorative line */}
          <div className="absolute -bottom-2 left-12 w-20 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, index) => (
            <Link href={`/companies/${company.userId || company.id}`} key={index}>
              <div
                className="group relative rounded-xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-1 hover:scale-[1.02] animate-slideInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Header */}
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="relative">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${company.bgColor || 'bg-gradient-to-r from-blue-500 to-indigo-500'} text-white text-lg font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        company.icon || <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                    
                    {/* Featured badge for top companies */}
                    {index < 2 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                        <Award size={12} />
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {company.name}
                      </h3>

                      {company.featured && (
                        <span className="rounded-full bg-gradient-to-r from-pink-100 to-rose-100 px-2 py-0.5 text-xs font-medium text-pink-600 animate-pulse">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 flex items-center gap-1 group-hover:text-gray-600 transition-colors duration-300">
                      <MapPin size={12} className="group-hover:text-blue-500 transition-colors duration-300" />
                      {company.location}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="relative mt-6 overflow-hidden rounded-lg">
                  <button className="relative w-full rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 py-3 text-sm font-medium text-blue-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-lg overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Open Position ({company.positions})
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    
                    {/* Shine effect on button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
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