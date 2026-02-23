"use client";

import Link from "next/link";
import { ArrowRight, Users, Building2, Sparkles } from "lucide-react";

export default function BecomeSection() {
  return (
    <section className="py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Become a Candidate */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-1 animate-slideInLeft">
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Become a Candidate
                </h3>
              </div>

              <p className="mt-3 max-w-sm text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Cras cursus a dolor convallis efficitur.
              </p>

              <Link
                href="/register"
                className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-600 shadow-md transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white group/btn overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Register Now
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </Link>

              {/* Decorative corner */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            {/* Image */}
            <img
              src="/assets/candidate.png"
              alt="Laptop"
              className="absolute right-4 top-4 hidden w-40 rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:-translate-y-2 md:block"
            />
          </div>

          {/* Become an Employers */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 animate-slideInRight">
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl border border-white/30">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="absolute -inset-1 bg-white rounded-xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Become an Employers
                </h3>
              </div>

              <p className="mt-3 max-w-sm text-sm text-blue-100 group-hover:text-white transition-colors duration-300">
                Cras in massa pellentesque, mollis ligula non,
                luctus dui. Morbi sed efficitur dolor.
              </p>

              <Link
                href="/register"
                className="relative mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-blue-600 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-blue-50 group/btn overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Register Now
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              </Link>

              {/* Decorative corner */}
              <div className="absolute top-3 right-3">
                <Sparkles className="w-4 h-4 text-white/60 animate-pulse" />
              </div>
            </div>

            {/* Image */}
            <img
              src="/assets/employer.png"
              alt="Employer"
              className="absolute bottom-0 right-0 hidden h-48 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:-translate-x-2 md:block"
            />
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}