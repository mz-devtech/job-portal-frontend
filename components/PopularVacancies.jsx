'use client'

import { useState, useEffect } from 'react'
import { homeService } from '@/services/homeService'
import { Briefcase, TrendingUp, Star, Award } from 'lucide-react'

export default function PopularVacancies() {
  const [vacancies, setVacancies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVacancies()
  }, [])

  const fetchVacancies = async () => {
    try {
      setLoading(true)
      const data = await homeService.getPopularVacancies()
      setVacancies(data)
    } catch (error) {
      console.error('Error fetching vacancies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-indigo-50/30 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10 animate-fadeIn">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg animate-pulse"></div>
            <div className="h-7 w-56 bg-gradient-to-r from-indigo-200 to-purple-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="animate-slideIn"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-4 w-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-indigo-50/30 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title with decorative elements */}
        <div className="relative mb-10 animate-slideInLeft">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Most Popular Vacancies
            </h2>
          </div>
          
          {/* Decorative line */}
          <div className="absolute -bottom-2 left-11 w-24 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
          
          {/* Floating badges */}
          <div className="absolute -right-20 top-0 opacity-10 md:opacity-20">
            <TrendingUp className="w-16 h-16 text-indigo-600" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
          {vacancies.map((vacancy, index) => (
            <Vacancy
              key={index}
              title={vacancy.title}
              positions={vacancy.positions}
              highlight={vacancy.title === "Data Scientist"}
              index={index}
            />
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 text-center animate-fadeIn animation-delay-600">
          <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-indigo-100 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
            <span className="text-sm font-medium">View All Vacancies</span>
            <TrendingUp className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          </button>
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </section>
  )
}

function Vacancy({ title, positions, highlight, index }) {
  // Get icon based on title for visual variety
  const getIcon = () => {
    if (title.includes("Data")) return <TrendingUp className="w-4 h-4" />;
    if (title.includes("Developer") || title.includes("Engineer")) return <Briefcase className="w-4 h-4" />;
    if (title.includes("Manager")) return <Award className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  }

  return (
    <div 
      className="group relative animate-slideIn"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card with hover effect */}
      <div className="relative p-4 rounded-xl hover:bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative flex items-start gap-3">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
              highlight 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200' 
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 group-hover:from-indigo-100 group-hover:to-purple-100'
            }`}>
              {getIcon()}
            </div>
            
            {/* Decorative dot for highlighted items */}
            {highlight && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            )}
          </div>
          
          {/* Text content */}
          <div>
            <h3
              className={`text-sm font-medium transition-all duration-300 ${
                highlight 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:from-indigo-700 group-hover:to-purple-700' 
                  : 'text-gray-900 group-hover:text-indigo-600'
              }`}
            >
              {title}
            </h3>
            <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors duration-300"></span>
              {positions}
            </p>
          </div>
        </div>

        {/* Decorative corner line */}
        <div className="absolute bottom-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}