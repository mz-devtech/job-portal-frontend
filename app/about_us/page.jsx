"use client";

import DynamicNavbar from "@/components/DynamicNavbar";
import Footer from "@/components/Footer";
import SecondNavbar from "@/components/SecondNavbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { homeService } from "@/services/homeService";

export default function AboutPage() {
  const [stats, setStats] = useState({
    liveJobs: '0',
    companies: '0',
    candidates: '0',
    newJobs: '0'
  });
  const [loading, setLoading] = useState(true);
  const [animatedCounts, setAnimatedCounts] = useState({
    jobs: 0,
    companies: 0,
    candidates: 0
  });

  // Fetch real stats from API
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await homeService.getHomeStats();
      setStats(data);
      
      // Start animation with real values
      animateCounts({
        jobs: parseInt(data.liveJobs.replace(/,/g, '')),
        companies: parseInt(data.companies.replace(/,/g, '')),
        candidates: parseInt(data.candidates.replace(/,/g, ''))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to default values if API fails
      const fallbackData = {
        jobs: 175324,
        companies: 97354,
        candidates: 3847154
      };
      animateCounts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Animated counter effect
  const animateCounts = (targets) => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      setAnimatedCounts({
        jobs: Math.min(Math.floor((targets.jobs / steps) * step), targets.jobs),
        companies: Math.min(Math.floor((targets.companies / steps) * step), targets.companies),
        candidates: Math.min(Math.floor((targets.candidates / steps) * step), targets.candidates)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 0.6, scale: 1 },
    whileHover: { 
      opacity: 1, 
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <DynamicNavbar />
      <SecondNavbar />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-pink-100/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="w-full bg-gradient-to-b from-white via-blue-50/20 to-white">
        {/* Breadcrumb with animation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 pt-6"
        >
          <div className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">Home</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">About us</span>
          </div>
        </motion.div>

      {/* Top Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium mb-3 inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            ✦ Who we are
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              We're highly skilled and
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              professionals team.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 max-w-lg leading-relaxed"
          >
            Praesent non sem facilisis, hendrerit nisi vitae, volutpat
            quam. Aliquam metus mauris, semper eu eros vitae, blandit
            tristique metus. Vestibulum maximus nec justo sed maximus.
          </motion.p>

          {/* Decorative line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="h-0.5 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 mt-8 rounded-full"
          />
        </motion.div>

        {/* Right Stats with enhanced animations */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {[
            { 
              icon: "💼", 
              label: "Live Job", 
              value: animatedCounts.jobs, 
              color: "from-blue-500 to-cyan-500", 
              delay: 0.2,
              formattedValue: stats.liveJobs
            },
            { 
              icon: "🏢", 
              label: "Companies", 
              value: animatedCounts.companies, 
              color: "from-purple-500 to-pink-500", 
              delay: 0.3,
              formattedValue: stats.companies
            },
            { 
              icon: "👥", 
              label: "Candidates", 
              value: animatedCounts.candidates, 
              color: "from-amber-500 to-orange-500", 
              delay: 0.4,
              formattedValue: stats.candidates
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 }
              }}
              transition={{ delay: stat.delay }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              <div className="relative flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-500">
                {/* Animated icon container */}
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center text-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </span>
                </motion.div>
                
                <div>
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-6 w-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <motion.h3 
                        key={stat.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3, delay: stat.delay + 0.5 }}
                        className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                      >
                        {stat.value.toLocaleString()}
                      </motion.h3>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                        {stat.label}
                      </p>
                    </>
                  )}
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Company Logos with enhanced animations */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 rounded-3xl blur-2xl" />
          
          <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "amazon", color: "from-yellow-400 to-yellow-600" },
              { name: "Google", color: "from-blue-400 to-green-400" },
              { name: "ENSIGMA", color: "from-purple-400 to-pink-400" },
              { name: "NIO", color: "from-green-400 to-teal-400" },
              { name: "AIEE", color: "from-red-400 to-orange-400" },
              { name: "WIDE", color: "from-indigo-400 to-blue-400" }
            ].map((logo, index) => (
              <motion.div
                key={index}
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${logo.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 blur-md`} />
                
                <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 group-hover:border-transparent shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <span className={`text-sm font-semibold bg-gradient-to-r ${logo.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 block text-center`}>
                    {logo.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Image Grid with enhanced animations */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[1, 2, 3].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 50, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              
              {/* Image container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={`/images/about-${item}.jpg`}
                  alt={`Team image ${item}`}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000" />
              </div>
              
              {/* Caption that appears on hover */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              >
                <p className="text-xs font-medium">Our Team</p>
                <p className="text-sm">Professional excellence</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}