// components/BecomeSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase } from 'lucide-react';

const BecomeSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="min-h-[60vh] flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          
          {/* Candidate Card */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-white p-8 md:p-10 shadow-2xl border border-blue-100"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20" />
            
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Become a Candidate
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus a dolor convuls efficitur.
              </p>
              
              <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105">
                <span className="relative z-10 flex items-center">
                  Register Now
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>
          
          {/* Employer Card */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-white p-8 md:p-10 shadow-2xl border border-green-100"
          >
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-200 rounded-full opacity-20" />
            
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Become an Employer
              </h3>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Cras in massa pellentesque, nostrud exerci tation, lectus dui, blandit sed efficitur dolore. Piquea augue risus, aliqu.
              </p>
              
              <button className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105">
                <span className="relative z-10 flex items-center">
                  Register Now
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default BecomeSection;