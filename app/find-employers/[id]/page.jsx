"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Globe, Phone, Mail, 
  Facebook, Twitter, Linkedin, 
  Briefcase, Calendar, Users, 
  Building2, Award, TrendingUp,
  Loader2, AlertCircle, Share2,
  Bookmark, CheckCircle, Clock,
  DollarSign, GraduationCap, Star,
  ChevronRight, Heart, ExternalLink,
  Sparkles, Zap, Shield, Target,
  Rocket, Gem, Crown, Coffee,
  Gift, ThumbsUp, Smile, Sun
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { employerService } from "@/services/employerService";
import { jobService } from "@/services/jobService";

export default function SingleEmployer() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState({ active: [], closed: [] });
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [jobFilters, setJobFilters] = useState({
    status: 'active',
    page: 1,
    limit: 6
  });

  useEffect(() => {
    if (id) {
      fetchEmployerDetails();
    }
  }, [id]);

  const fetchEmployerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await employerService.getEmployerById(id);
      
      setEmployer(response.employer);
      setJobs(response.jobs || { active: [], closed: [] });
      setStats(response.stats);
      setRecentApplications(response.recentApplications || []);
      setFollowing(response.employer.isFollowing || false);
      
    } catch (err) {
      console.error('Failed to fetch employer:', err);
      setError(err.message || 'Failed to load employer details');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    setFollowing(!following);
    // Add API call here
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employer?.companyInfo?.companyName || employer?.user?.name}`,
          text: `Check out ${employer?.companyInfo?.companyName || employer?.user?.name} on our job portal`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleJobFilterChange = (status) => {
    setJobFilters(prev => ({ ...prev, status, page: 1 }));
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
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

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <SecondNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-white">
          <div className="text-center">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              </motion.div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
              </motion.div>
            </div>
            <motion.p 
              className="text-xs text-gray-600 mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading employer profile...
            </motion.p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !employer) {
    return (
      <>
        <Navbar />
        <SecondNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-white px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200"
          >
            <motion.div 
              className="relative inline-block mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <motion.div 
                className="absolute inset-0 bg-red-100 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {error === 'Employer not found' ? 'Employer Not Found' : 'Error Loading Profile'}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {error === 'Employer not found' 
                ? "The employer you're looking for doesn't exist or has been removed."
                : error || "An unexpected error occurred."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/find-employers')}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-xs hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-1">
                  ← Back to Employers
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchEmployerDetails}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-xs hover:bg-gray-50 transition-all duration-300"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  const companyName = employer.companyInfo?.companyName || employer.user?.name || 'Company Name';
  const logo = employerService.getCompanyLogo(employer);
  const banner = employerService.getCompanyBanner(employer);
  const location = employerService.formatLocation(employer);
  const isComplete = employerService.isProfileComplete(employer);

  // Decorative elements for creativity
  const decorativeIcons = [
    { icon: <Sparkles className="w-4 h-4" />, color: "from-yellow-400 to-orange-400", delay: 0 },
    { icon: <Zap className="w-4 h-4" />, color: "from-blue-400 to-cyan-400", delay: 0.5 },
    { icon: <Gem className="w-4 h-4" />, color: "from-purple-400 to-pink-400", delay: 1 },
    { icon: <Crown className="w-4 h-4" />, color: "from-amber-400 to-yellow-400", delay: 1.5 },
  ];

  return (
    <>
      <Navbar />
      <SecondNavbar />
      
      {/* Animated background with floating particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/40 to-pink-200/40 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative bg-gradient-to-b from-transparent via-white/50 to-white min-h-screen">
        {/* Decorative floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {decorativeIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute bg-gradient-to-r ${item.color} text-white p-2 rounded-xl shadow-lg`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
              }}
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: item.delay }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center space-x-1.5 text-[10px] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
          >
            <Link href="/" className="text-gray-400 hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-300">•</span>
            <Link href="/find-employers" className="text-gray-400 hover:text-blue-600 transition-colors">Employers</Link>
            <span className="text-gray-300">•</span>
            <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent max-w-[150px] truncate text-[10px]">
              {companyName}
            </span>
          </motion.div>
        </div>

        {/* Cover Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <motion.div 
            variants={fadeInScale}
            initial="initial"
            animate="animate"
            className="relative h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl group"
          >
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {banner ? (
              <>
                <img 
                  src={banner} 
                  alt={companyName}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Building2 className="w-20 h-20 text-white/20" />
                </motion.div>
              </div>
            )}
            
            {/* Profile Image Overlay */}
            <div className="absolute -bottom-10 left-6 flex items-end gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-xl border-4 border-white bg-white shadow-2xl overflow-hidden transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                  {logo ? (
                    <img 
                      src={logo} 
                      alt={companyName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {companyName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-50 blur-md"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Verified badge if complete */}
                {isComplete && (
                  <motion.div 
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="relative">
                      <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-50" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-1"
              >
                <h1 className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                  {companyName}
                  {employer.isFeatured && (
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </motion.span>
                  )}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  {location && (
                    <span className="flex items-center gap-1 text-[10px]">
                      <MapPin size={12} />
                      {location}
                    </span>
                  )}
                  {employer.foundingInfo?.industryType && (
                    <>
                      <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                      <span className="text-[10px]">{employer.foundingInfo.industryType}</span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-3 right-6 flex gap-1.5">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-300 ${
                  saved
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                <span className="text-[10px]">{saved ? 'Saved' : 'Save'}</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-300 ${
                  following
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                <Users size={14} />
                <span className="text-[10px]">{following ? 'Following' : 'Follow'}</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-1.5"
              >
                <Share2 size={14} />
                <span className="text-[10px]">Share</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats Bar */}
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-4 gap-3"
              >
                {[
                  { icon: <Briefcase className="w-4 h-4" />, label: "Open Jobs", value: stats?.activeJobs || 0, color: "from-blue-500 to-cyan-500" },
                  { icon: <Users className="w-4 h-4" />, label: "Total Apps", value: stats?.totalApplications || 0, color: "from-purple-500 to-pink-500" },
                  { icon: <TrendingUp className="w-4 h-4" />, label: "Hired", value: stats?.applicationStatus?.hired || 0, color: "from-green-500 to-emerald-500" },
                  { icon: <Clock className="w-4 h-4" />, label: "Since", value: new Date(employer.createdAt).getFullYear(), color: "from-amber-500 to-orange-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      animate: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className={`bg-gradient-to-br ${stat.color} bg-opacity-10 p-3 rounded-xl border border-gray-200/50 backdrop-blur-sm`}
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20 flex items-center justify-center mb-2`}>
                      <div className={`text-${stat.color.split('-')[1]}-600`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-sm font-bold text-gray-800">{stat.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Navigation Tabs */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden"
              >
                <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-white/50">
                  {[
                    { id: 'about', icon: <Building2 className="w-4 h-4" />, label: 'About' },
                    { id: 'jobs', icon: <Briefcase className="w-4 h-4" />, label: 'Jobs' },
                    { id: 'insights', icon: <TrendingUp className="w-4 h-4" />, label: 'Insights' },
                    { id: 'culture', icon: <Users className="w-4 h-4" />, label: 'Culture' },
                  ].map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium capitalize transition-all duration-300 relative ${
                        activeTab === tab.id
                          ? 'text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    {activeTab === 'about' && (
                      <motion.div
                        key="about"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        {/* About Us */}
                        {employer.companyInfo?.aboutUs && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-blue-600" />
                              About Us
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 rounded-lg border border-gray-100">
                              {employer.companyInfo.aboutUs}
                            </p>
                          </div>
                        )}

                        {/* Company Benefits with Icons */}
                        {employer.companyInfo?.benefits && employer.companyInfo.benefits.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                              <Gift className="w-4 h-4 text-blue-600" />
                              Benefits & Perks
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {employer.companyInfo.benefits.map((benefit, index) => {
                                const icons = [<Coffee className="w-4 h-4" />, <Gem className="w-4 h-4" />, <Zap className="w-4 h-4" />, <Smile className="w-4 h-4" />, <Sun className="w-4 h-4" />, <ThumbsUp className="w-4 h-4" />];
                                return (
                                  <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 3 }}
                                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-all duration-300"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                      {icons[index % icons.length]}
                                    </div>
                                    <span className="text-xs text-gray-700">{benefit}</span>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Company Vision with Icon */}
                        {employer.foundingInfo?.companyVision && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                              <Target className="w-4 h-4 text-blue-600" />
                              Our Vision
                            </h3>
                            <div className="relative">
                              <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                              <p className="text-xs text-gray-600 leading-relaxed pl-4 italic">
                                "{employer.foundingInfo.companyVision}"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Company Values (if available) */}
                        {employer.companyInfo?.values && employer.companyInfo.values.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                              <Rocket className="w-4 h-4 text-blue-600" />
                              Core Values
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {employer.companyInfo.values.map((value, index) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.1 }}
                                  className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-[10px] font-medium"
                                >
                                  {value}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'jobs' && (
                      <motion.div
                        key="jobs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Open Positions
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                              {stats?.activeJobs || 0}
                            </span>
                          </h3>
                          <div className="flex gap-1">
                            {['active', 'closed'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleJobFilterChange(status)}
                                className={`px-3 py-1 text-[10px] rounded-lg transition-all duration-300 ${
                                  jobFilters.status === status
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {jobs.active.length > 0 ? (
                          <motion.div 
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-3"
                          >
                            {jobs.active.slice(0, jobFilters.limit).map((job, index) => (
                              <motion.div
                                key={job._id}
                                variants={{
                                  initial: { opacity: 0, y: 20 },
                                  animate: { opacity: 1, y: 0 }
                                }}
                                transition={{ delay: index * 0.08 }}
                              >
                                <JobCard job={job} employerName={companyName} />
                              </motion.div>
                            ))}
                            
                            {jobs.active.length > jobFilters.limit && (
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={() => router.push(`/jobs?employer=${employer.user._id}`)}
                                className="w-full py-2 text-center text-[10px] text-blue-600 hover:text-blue-800 font-medium group"
                              >
                                <span className="flex items-center justify-center gap-1">
                                  View all {stats?.activeJobs} jobs
                                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </motion.button>
                            )}
                          </motion.div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50/50 rounded-lg">
                            <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No open positions at the moment</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'insights' && (
                      <motion.div
                        key="insights"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Company Insights
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: "Total Jobs", value: stats?.totalJobs || 0, icon: <Briefcase className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
                            { label: "Active Jobs", value: stats?.activeJobs || 0, icon: <Zap className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
                            { label: "Applications", value: stats?.totalApplications || 0, icon: <Users className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
                            { label: "Hired", value: stats?.applicationStatus?.hired || 0, icon: <Award className="w-4 h-4" />, color: "from-amber-500 to-orange-500" },
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className={`bg-gradient-to-br ${item.color} bg-opacity-10 p-3 rounded-xl border border-gray-200`}
                            >
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-20 flex items-center justify-center mb-1`}>
                                <div className={`text-${item.color.split('-')[1]}-600`}>
                                  {item.icon}
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-500">{item.label}</p>
                              <p className="text-xs font-bold text-gray-800">{item.value.toLocaleString()}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Application Status Distribution */}
                        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4">
                          <h4 className="text-xs font-medium text-gray-700 mb-3 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            Application Status
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(stats?.applicationStatus || {}).map(([status, count], index) => (
                              count > 0 && (
                                <motion.div 
                                  key={status}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.08 }}
                                  className="flex items-center gap-2"
                                >
                                  <span className="w-16 text-[10px] capitalize text-gray-600">{status}:</span>
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(count / (stats?.totalApplications || 1)) * 100}%` }}
                                      transition={{ duration: 1, delay: 0.3 }}
                                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                    />
                                  </div>
                                  <span className="text-[10px] font-medium text-gray-700">{count}</span>
                                </motion.div>
                              )
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'culture' && (
                      <motion.div
                        key="culture"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Work Culture */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-blue-600" />
                            Work Culture
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { icon: <Coffee className="w-4 h-4" />, label: "Flexible Hours", color: "from-amber-400 to-orange-400" },
                              { icon: <Users className="w-4 h-4" />, label: "Team Building", color: "from-blue-400 to-cyan-400" },
                              { icon: <Rocket className="w-4 h-4" />, label: "Fast Growth", color: "from-purple-400 to-pink-400" },
                              { icon: <Heart className="w-4 h-4" />, label: "Work-Life Balance", color: "from-red-400 to-rose-400" },
                            ].map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className={`flex items-center gap-2 p-2 bg-gradient-to-r ${item.color} bg-opacity-10 rounded-lg border border-${item.color.split('-')[1]}-200`}
                              >
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white`}>
                                  {item.icon}
                                </div>
                                <span className="text-[10px] font-medium text-gray-700">{item.label}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Employee Testimonials (placeholder) */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                            <Smile className="w-4 h-4 text-blue-600" />
                            What Employees Say
                          </h3>
                          <div className="space-y-2">
                            {[1, 2].map((_, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 rounded-lg border border-gray-100"
                              >
                                <p className="text-[10px] text-gray-600 italic">
                                  "Great place to work with amazing culture and growth opportunities!"
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                  <div>
                                    <p className="text-[10px] font-medium text-gray-700">Employee Name</p>
                                    <p className="text-[8px] text-gray-400">Software Engineer</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-4">
              {/* Company Info Card */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Company Details
                </h3>
                
                <div className="space-y-2.5">
                  {employer.foundingInfo?.yearOfEstablishment && (
                    <div className="flex items-start gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Calendar className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Founded</p>
                        <p className="text-xs font-medium text-gray-800">
                          {new Date(employer.foundingInfo.yearOfEstablishment).getFullYear()}
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.organizationType && (
                    <div className="flex items-start gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Building2 className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Organization Type</p>
                        <p className="text-xs font-medium text-gray-800">
                          {employer.foundingInfo.organizationType}
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.teamSize && (
                    <div className="flex items-start gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Team Size</p>
                        <p className="text-xs font-medium text-gray-800">
                          {employer.foundingInfo.teamSize} employees
                        </p>
                      </div>
                    </div>
                  )}

                  {employer.foundingInfo?.companyWebsite && (
                    <div className="flex items-start gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Globe className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Website</p>
                        <a 
                          href={`https://${employer.foundingInfo.companyWebsite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs font-medium flex items-center gap-1"
                        >
                          {employer.foundingInfo.companyWebsite}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.25 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Contact Info
                </h3>
                
                <div className="space-y-2.5">
                  {employer.phone && (
                    <div className="flex items-center gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Phone</p>
                        <a href={`tel:${employer.phone}`} className="text-xs font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
                          {employer.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {employer.email && (
                    <div className="flex items-center gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Email</p>
                        <a href={`mailto:${employer.email}`} className="text-xs font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300">
                          {employer.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-2 group hover:bg-blue-50/50 p-1.5 rounded-lg transition-all duration-300">
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      <div>
                        <p className="text-[10px] text-gray-500">Address</p>
                        <p className="text-xs font-medium text-gray-800">{location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Social Links */}
              {employer.socialLinks && employer.socialLinks.length > 0 && (
                <motion.div 
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-blue-600" />
                    Connect With Us
                  </h3>
                  
                  <div className="flex gap-2">
                    {employer.socialLinks.slice(0, 3).map((link, index) => {
                      const getIcon = (platform) => {
                        switch(platform?.toLowerCase()) {
                          case 'facebook': return <Facebook className="w-4 h-4" />;
                          case 'twitter': return <Twitter className="w-4 h-4" />;
                          case 'linkedin': return <Linkedin className="w-4 h-4" />;
                          default: return <Globe className="w-4 h-4" />;
                        }
                      };

                      const getColor = (platform) => {
                        switch(platform?.toLowerCase()) {
                          case 'facebook': return 'from-blue-600 to-blue-700';
                          case 'twitter': return 'from-sky-500 to-sky-600';
                          case 'linkedin': return 'from-blue-700 to-blue-800';
                          default: return 'from-gray-600 to-gray-700';
                        }
                      };

                      return (
                        <motion.a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 text-white rounded-lg bg-gradient-to-r ${getColor(link.platform)} hover:shadow-lg transition-all duration-300 text-[10px]`}
                        >
                          {getIcon(link.platform)}
                          <span className="capitalize">{link.platform}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Profile Completion */}
              {employer.isOwner && (
                <motion.div 
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.35 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xs font-semibold text-gray-800 mb-3">Profile Strength</h3>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-600">{employer.completionPercentage || 0}% Complete</span>
                      {isComplete && (
                        <span className="text-[8px] bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${employer.completionPercentage || 0}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      />
                    </div>
                  </div>

                  {!isComplete && (
                    <Link
                      href={`/profile/employer/${employer.user._id}/edit`}
                      className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 text-[10px] font-medium"
                    >
                      Complete Profile
                    </Link>
                  )}
                </motion.div>
              )}

              {/* Company Achievements (if available) */}
              {employer.achievements && employer.achievements.length > 0 && (
                <motion.div 
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    Achievements
                  </h3>
                  
                  <div className="space-y-2">
                    {employer.achievements.slice(0, 3).map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100"
                      >
                        <Award className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-gray-700">{achievement.title}</p>
                          <p className="text-[8px] text-gray-500">{achievement.year}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
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
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </>
  );
}

// Job Card Component for employer profile
function JobCard({ job, employerName }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const formatSalary = (salaryRange) => {
    if (!salaryRange || !salaryRange.min || salaryRange.min === 0) return 'Negotiable';
    const currencySymbol = salaryRange.currency === 'USD' ? '$' : 
                          salaryRange.currency === 'EUR' ? '€' : 
                          salaryRange.currency === 'GBP' ? '£' : 
                          salaryRange.currency || '$';
    return `${currencySymbol}${salaryRange.min.toLocaleString()} - ${currencySymbol}${salaryRange.max.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'part-time': return 'bg-green-100 text-green-700 border-green-200';
      case 'internship': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'contract': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'remote': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div 
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={() => router.push(`/jobs/${job._id}`)}
      className="block bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
    >
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={isHovered ? { x: ['-100%', '200%'] } : {}}
        transition={{ duration: 1 }}
      />
      
      {/* Gradient overlay on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-0.5 group-hover:text-blue-600 transition-colors duration-300">
              {job.jobTitle}
            </h4>
            <p className="text-[10px] text-gray-500">{employerName}</p>
          </div>
          <motion.span 
            animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`text-[8px] px-2 py-0.5 rounded-full border ${getJobTypeColor(job.jobType)}`}
          >
            {job.jobType}
          </motion.span>
        </div>

        <div className="flex flex-wrap gap-3 text-[10px] text-gray-600">
          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
            <MapPin size={12} />
            {job.location?.city || 'Remote'}
          </span>
          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
            <DollarSign size={12} />
            {formatSalary(job.salaryRange)}
          </span>
          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
            <Clock size={12} />
            {job.daysRemaining > 0 
              ? `${job.daysRemaining}d left`
              : 'Expired'}
          </span>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {job.tags.slice(0, 3).map((tag, i) => (
              <motion.span 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 transition-all duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Quick apply indicator */}
        <motion.div 
          className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isHovered ? { x: [20, 0] } : {}}
        >
          <span className="text-[8px] text-blue-600 flex items-center gap-0.5">
            Quick view
            <ChevronRight className="w-3 h-3" />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}