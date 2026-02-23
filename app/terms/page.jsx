"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Fixed import
import { useState, useEffect } from "react";
import { 
  FileText, Shield, Lock, Eye, ChevronRight, 
  BookOpen, Scale, CheckCircle, AlertCircle,
  ArrowRight, Menu, X, Sparkles, Gem, Award,
  Target, Zap, Globe, Heart, Users, Briefcase
} from "lucide-react";

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("terms");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["terms", "limitations", "security", "privacy"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const sections = [
    { id: "terms", title: "01. Terms & Condition", icon: <FileText className="w-4 h-4" />, color: "from-blue-500 to-indigo-500" },
    { id: "limitations", title: "02. Limitations", icon: <Scale className="w-4 h-4" />, color: "from-amber-500 to-orange-500" },
    { id: "security", title: "03. Security", icon: <Shield className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
    { id: "privacy", title: "04. Privacy Policy", icon: <Eye className="w-4 h-4" />, color: "from-purple-500 to-pink-500" }
  ];

  return (
    <>
      <Navbar />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <div className="bg-transparent min-h-screen">
        {/* Page Header with enhanced design */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <motion.div 
              className="flex items-center gap-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={pulseAnimation}
                animate="animate"
                className="relative"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-30 blur"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <h1 className="text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-1">
                  Terms & Conditions
                  <motion.span
                    variants={floatingAnimation}
                    animate="animate"
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                  </motion.span>
                </h1>
                <p className="text-[8px] sm:text-[9px] text-gray-500">Last updated: March 2024</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[9px] sm:text-[10px] text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-full"
              >
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>{" "}
                <span className="text-gray-300 mx-0.5">/</span>{" "}
                <span className="text-gray-700 font-medium">Terms</span>
              </motion.div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-8"
          >
            {/* 01 */}
            <motion.section 
              id="terms"
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-20 blur" />
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    01. Terms & Condition
                  </h2>
                </div>
                
                <p className="text-[10px] sm:text-xs text-gray-600 mb-4 leading-relaxed">
                  Praesent placerat dictum elementum. Nam pulvinar urna vel lectus
                  maximus, eget faucibus turpis hendrerit. Sed accumsan nisi at
                  curabitur nisi. Quisque molestie velit vitae ligula luctus
                  bibendum. Duis sit amet eros mollis, viverra ipsum sed, convallis
                  sapien. Donec justo erat, pulvinar vitae dui ut, finibus euismod
                  enim. Donec velit tortor, mollis eu tortor euismod, gravida
                  aliquam arcu.
                </p>

                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 rounded-lg border border-blue-100/50">
                  <h3 className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Key Points
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "In ac turpis mi. Donec quis semper neque.",
                      "Curabitur luctus sapien augue, mattis faucibus nisl vehicula nec.",
                      "Aenean vel metus leo. Vivamus nec neque a libero sodales.",
                      "Vestibulum rhoncus sagittis dolor vel finibus.",
                      "Integer feugiat lacus ut efficitur mattis."
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-1.5 text-[9px] sm:text-[10px] text-gray-600"
                      >
                        <div className="w-1 h-1 mt-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.section>

            {/* 02 */}
            <motion.section 
              id="limitations"
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg opacity-20 blur" />
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    02. Limitations
                  </h2>
                </div>
                
                <p className="text-[10px] sm:text-xs text-gray-600 mb-4 leading-relaxed">
                  In pretium est sit amet diam feugiat eleifend. Curabitur
                  consectetur fringilla metus. Morbi hendrerit facilisis tincidunt.
                  Sed condimentum lacinia arcu. Ut ut lacus metus. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit.
                </p>

                <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 rounded-lg border border-amber-100/50">
                  <h3 className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    Important Limitations
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "In ac turpis mi. Donec quis semper neque.",
                      "Curabitur luctus sapien augue.",
                      "Mattis faucibus nisl vehicula nec.",
                      "Vivamus nec neque a libero sodales."
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-1.5 text-[9px] sm:text-[10px] text-gray-600"
                      >
                        <div className="w-1 h-1 mt-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.section>

            {/* 03 */}
            <motion.section 
              id="security"
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg opacity-20 blur" />
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    03. Security
                  </h2>
                </div>
                
                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                  ex neque, elementum eu blandit in, ornare eu purus. Fusce eu
                  rhoncus mi, quis ultrices lacus. Phasellus ut pellentesque nulla.
                  Cras erat nisi, mattis et efficitur et, accumsan in lacus. Fusce
                  gravida augue quis leo facilisis.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { icon: <Lock className="w-3 h-3" />, label: "Data Encryption", color: "from-green-500 to-emerald-500" },
                    { icon: <Eye className="w-3 h-3" />, label: "Privacy First", color: "from-blue-500 to-indigo-500" },
                    { icon: <Shield className="w-3 h-3" />, label: "Secure Payments", color: "from-purple-500 to-pink-500" },
                    { icon: <Globe className="w-3 h-3" />, label: "Global Compliance", color: "from-cyan-500 to-teal-500" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`p-2 bg-gradient-to-br ${item.color} bg-opacity-10 rounded-lg border border-${item.color.split('-')[1]}-200`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-1`}>
                        {item.icon}
                      </div>
                      <p className="text-[8px] font-medium text-gray-700">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.section>

            {/* 04 */}
            <motion.section 
              id="privacy"
              variants={fadeInUp}
              className="scroll-mt-24"
            >
              <motion.div 
                whileHover={{ x: 3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg opacity-20 blur" />
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    04. Privacy Policy
                  </h2>
                </div>
                
                <p className="text-[10px] sm:text-xs text-gray-600 mb-4 leading-relaxed">
                  Praesent non sem facilisis, hendrerit nisl vitae, volutpat quam.
                  Aliquam metus mauris, semper eu eros vitae, blandit tristique
                  metus. Vestibulum maximus nec justo sed maximus.
                </p>

                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-4 rounded-lg border border-purple-100/50 mb-4">
                  <h3 className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-purple-500" />
                    Your Privacy Matters
                  </h3>
                  <ul className="space-y-1.5">
                    {[
                      "In ac turpis mi. Donec quis semper neque.",
                      "Mauris et scelerisque lorem.",
                      "Aenean vel metus leo.",
                      "Vestibulum rhoncus sagittis dolor vel finibus.",
                      "Integer feugiat lacus ut efficitur mattis."
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-1.5 text-[9px] sm:text-[10px] text-gray-600"
                      >
                        <div className="w-1 h-1 mt-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                  Fusce rutrum mauris sit amet justo rutrum ullamcorper. Aliquam
                  vitae lacus urna. Nulla vitae mi vel nisl viverra ullamcorper vel
                  elementum est. Mauris vitae elit nec enim tincidunt aliquet.
                  Donec ultrices nulla a enim pulvinar, quis pulvinar lacus
                  consectetur.
                </p>
              </motion.div>
            </motion.section>
          </motion.div>

          {/* Table of Contents - Desktop */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block lg:col-span-4"
          >
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-xs font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    TABLE OF CONTENTS
                  </h3>
                </div>

                <ul className="space-y-1.5">
                  {sections.map((section) => (
                    <motion.li 
                      key={section.id}
                      whileHover={{ x: 3 }}
                      className="relative"
                    >
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium transition-all duration-300 ${
                          activeSection === section.id
                            ? `bg-gradient-to-r ${section.color} text-white shadow-md`
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
                        }`}
                      >
                        <div className={`p-0.5 rounded ${activeSection === section.id ? 'bg-white/20' : ''}`}>
                          {section.icon}
                        </div>
                        <span className="flex-1 text-left">{section.title}</span>
                        {activeSection === section.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <ChevronRight className="w-3 h-3" />
                          </motion.div>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Quick stats */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <p className="text-[8px] text-gray-500">Last Updated</p>
                      <p className="text-[9px] font-semibold text-gray-700">March 2024</p>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <p className="text-[8px] text-gray-500">Version</p>
                      <p className="text-[9px] font-semibold text-gray-700">2.1.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Mobile Table of Contents */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:hidden fixed inset-x-0 top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-semibold text-gray-800">Quick Navigation</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-medium transition-all duration-300 ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.color} text-white`
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}