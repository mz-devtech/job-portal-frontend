"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ApplyApplication from "@/components/ApplyApplication";
import {
    Bookmark,
    MapPin,
    DollarSign,
    Briefcase,
    GraduationCap,
    Share2,
    Clock,
    Layers,
    Loader2,
    Calendar,
    Users,
    Globe,
    AlertCircle,
    BookmarkCheck,
    ChevronLeft,
    Sparkles,
    Award,
    Heart,
    Target,
    Zap,
    Shield,
    TrendingUp,
    Coffee,
    Gift,
    Smile,
    Star,
    CheckCircle,
    ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { jobService } from "@/services/jobService";
import { savedJobService } from "@/services/savedJobService";
import { motion, AnimatePresence } from "framer-motion";

export default function JobDetail() {
    const [openApply, setOpenApply] = useState(false);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarJobs, setSimilarJobs] = useState([]);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [hoveredSection, setHoveredSection] = useState(null);
    
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

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
                staggerChildren: 0.08
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

    const shimmerAnimation = {
        animate: {
            x: ['-100%', '200%'],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const jobData = await jobService.getJobById(id);
            setJob(jobData);
            
            try {
                const isSaved = await savedJobService.checkJobSaved(id);
                setSaved(isSaved);
            } catch (saveError) {
                console.log("Could not check saved status:", saveError);
                setSaved(false);
            }
            
            await fetchSimilarJobs(jobData);
            
        } catch (err) {
            console.error('Failed to fetch job:', err);
            setError(err.message || 'Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarJobs = async (currentJob) => {
        try {
            if (!currentJob) return;
            
            const response = await jobService.searchJobs({
                jobCategory: currentJob.jobCategory,
                experienceLevel: currentJob.experienceLevel,
                limit: 3,
            });
            
            const filteredJobs = response.jobs?.filter(job => job._id !== currentJob._id) || [];
            setSimilarJobs(filteredJobs.slice(0, 3));
            
        } catch (err) {
            console.error('Failed to fetch similar jobs:', err);
        }
    };

    const handleSaveJob = async () => {
        if (!job || saving) return;
        
        try {
            setSaving(true);
            
            if (saved) {
                await savedJobService.unsaveJob(job._id);
                setSaved(false);
            } else {
                await savedJobService.saveJob(job._id);
                setSaved(true);
            }
        } catch (error) {
            console.error("Failed to toggle save:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleShare = async () => {
        if (!job) return;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job.jobTitle,
                    text: `Check out this job: ${job.jobTitle} at ${job.employer?.companyName || job.employer?.name}`,
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

    const handleGoBack = () => {
        router.push('/');
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        fetchJobDetails();
    };

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <SecondNavbar />
                <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-white">
                    <div className="text-center">
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="w-14 h-14 text-blue-600 mx-auto mb-4" />
                            </motion.div>
                            <motion.div 
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-full blur-md"></div>
                            </motion.div>
                        </div>
                        <motion.p 
                            className="text-xs text-gray-600 mt-4"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            Loading job details...
                        </motion.p>
                        <p className="text-[10px] text-gray-400 mt-2">Job ID: {id}</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    // Error state
    if (error || !job) {
        return (
            <>
                <Navbar />
                <SecondNavbar />
                <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-white px-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200"
                    >
                        <div className="relative inline-block mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                            </motion.div>
                            <motion.div 
                                className="absolute inset-0 bg-red-100 rounded-full blur-xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <h2 className="text-base font-semibold text-gray-700 mb-2">
                            {error === 'Job not found' ? 'Job Not Found' : 'Error Loading Job'}
                        </h2>
                        <p className="text-xs text-gray-500 mb-6">
                            {error === 'Job not found' 
                                ? "The job you're looking for doesn't exist or has been removed."
                                : error || "An unexpected error occurred."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoBack}
                                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative z-10 flex items-center gap-1">
                                    <ChevronLeft className="w-3 h-3" />
                                    Back to Jobs
                                </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRetry}
                                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-300"
                            >
                                Try Again
                            </motion.button>
                        </div>
                    </motion.div>
                </main>
                <Footer />
            </>
        );
    }

    // Format salary display
    const formatSalary = () => {
        if (!job.salaryRange) return 'Not specified';
        if (job.salaryRange.min === 0 && job.salaryRange.max === 0) return 'Negotiable';
        
        const currencySymbol = job.salaryRange.currency === 'USD' ? '$' : 
                              job.salaryRange.currency === 'EUR' ? '€' : 
                              job.salaryRange.currency === 'GBP' ? '£' : 
                              job.salaryRange.currency || '$';
        
        return `${currencySymbol}${job.salaryRange.min.toLocaleString()} - ${currencySymbol}${job.salaryRange.max.toLocaleString()}`;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get job type color
    const getJobTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'full-time':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'part-time':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'internship':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'contract':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'temporary':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'remote':
                return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'freelance':
                return 'bg-pink-100 text-pink-700 border-pink-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const jobOverviewItems = [
        { icon: <Calendar className="w-4 h-4" />, label: "Posted Date", value: formatDate(job.postedDate), color: "from-blue-500 to-indigo-500", bg: "bg-blue-50" },
        { icon: <Clock className="w-4 h-4" />, label: "Expiration", value: formatDate(job.expirationDate), subValue: job.daysRemaining > 0 ? `${job.daysRemaining}d left` : null, color: "from-red-500 to-rose-500", bg: "bg-red-50" },
        { icon: <Layers className="w-4 h-4" />, label: "Experience", value: job.experienceLevel, color: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
        { icon: <Briefcase className="w-4 h-4" />, label: "Job Type", value: job.jobType, color: "from-orange-500 to-amber-500", bg: "bg-orange-50" },
        { icon: <GraduationCap className="w-4 h-4" />, label: "Education", value: job.educationLevel, color: "from-green-500 to-emerald-500", bg: "bg-green-50" },
        { icon: <Users className="w-4 h-4" />, label: "Vacancies", value: `${job.vacancies} position${job.vacancies !== 1 ? 's' : ''}`, color: "from-indigo-500 to-blue-500", bg: "bg-indigo-50" },
    ];

    return (
        <>
            <Navbar />
            <SecondNavbar />

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

            <main className="bg-transparent min-h-screen">
                {/* Breadcrumb */}
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                            <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors">
                                Home
                            </button>
                            <span className="text-gray-300">•</span>
                            <button onClick={() => router.push('/')} className="hover:text-blue-600 transition-colors">
                                Jobs
                            </button>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-700 font-medium truncate max-w-[200px]">{job.jobTitle}</span>
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <motion.div 
                            variants={fadeInScale}
                            initial="hidden"
                            animate="visible"
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        >
                            {/* Shine effect */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={shimmerAnimation}
                            />
                            
                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex gap-3">
                                        <motion.div 
                                            whileHover={{ scale: 1.05, rotate: 3 }}
                                            className="relative"
                                        >
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                                                {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
                                            </div>
                                            <motion.div 
                                                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-30 blur"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </motion.div>

                                        <div>
                                            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                {job.jobTitle}
                                                {job.isFeatured && (
                                                    <motion.span
                                                        animate={{ rotate: [0, 5, -5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    </motion.span>
                                                )}
                                            </h1>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                at {job.employer?.companyName || job.employer?.name || 'Unknown Company'}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                <span className={`text-[8px] px-2 py-0.5 rounded-full border ${getJobTypeColor(job.jobType)}`}>
                                                    {job.jobType}
                                                </span>
                                                {job.isFeatured && (
                                                    <span className="text-[8px] bg-gradient-to-r from-red-100 to-rose-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                                                        Featured
                                                    </span>
                                                )}
                                                {job.location?.isRemote && (
                                                    <span className="text-[8px] bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                                                        Remote
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setOpenApply(true)}
                                            className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden group/btn"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                            <span className="relative z-10 flex items-center justify-center gap-1">
                                                Apply Now
                                                <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </motion.button>
                                        
                                        <div className="flex gap-1.5">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleSaveJob}
                                                disabled={saving}
                                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                                                    saved
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {saving ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : saved ? (
                                                    <BookmarkCheck className="w-3 h-3" />
                                                ) : (
                                                    <Bookmark className="w-3 h-3" />
                                                )}
                                                <span className="text-[9px]">
                                                    {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                                                </span>
                                            </motion.button>
                                            
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleShare}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs"
                                            >
                                                <Share2 className="w-3 h-3" />
                                                <span className="text-[9px]">Share</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tabs Navigation */}
                        <motion.div 
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden"
                        >
                            <div className="flex border-b border-gray-200">
                                {[
                                    { id: 'description', label: 'Description', icon: <Briefcase className="w-4 h-4" /> },
                                    { id: 'requirements', label: 'Requirements', icon: <Target className="w-4 h-4" /> },
                                    { id: 'benefits', label: 'Benefits', icon: <Gift className="w-4 h-4" /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-[10px] sm:text-xs font-medium transition-all duration-300 relative ${
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
                                    </button>
                                ))}
                            </div>

                            <div className="p-5">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div
                                            key="description"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                                Job Description
                                            </h3>
                                            <div className="text-[10px] sm:text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                                                {job.jobDescription}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'requirements' && (
                                        <motion.div
                                            key="requirements"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                                <Target className="w-3.5 h-3.5 text-blue-600" />
                                                Requirements
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-medium text-gray-500 mb-1">Experience Level</p>
                                                    <p className="text-[10px] sm:text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                                                        {job.experienceLevel}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-medium text-gray-500 mb-1">Education Required</p>
                                                    <p className="text-[10px] sm:text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                                                        {job.educationLevel}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'benefits' && (
                                        <motion.div
                                            key="benefits"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                                <Gift className="w-3.5 h-3.5 text-blue-600" />
                                                Benefits & Perks
                                            </h3>
                                            {job.benefits && job.benefits.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {job.benefits.map((benefit, i) => {
                                                        const icons = [<Coffee className="w-3 h-3" />, <Heart className="w-3 h-3" />, <Shield className="w-3 h-3" />, <Zap className="w-3 h-3" />, <Smile className="w-3 h-3" />, <TrendingUp className="w-3 h-3" />];
                                                        return (
                                                            <motion.div 
                                                                key={i}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-100"
                                                            >
                                                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                                                    {icons[i % icons.length]}
                                                                </div>
                                                                <span className="text-[9px] sm:text-[10px] text-gray-700">{benefit}</span>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-gray-500">No benefits information available</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Job Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <motion.div 
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-5 shadow-lg"
                            >
                                <h3 className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                    <Zap className="w-3.5 h-3.5 text-blue-600" />
                                    Skills & Tags
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {job.tags.map((tag, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="text-[8px] sm:text-[9px] bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2 py-1 rounded-full hover:from-blue-100 hover:to-indigo-100 hover:text-blue-700 transition-all duration-300 cursor-default"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <motion.aside 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {/* Salary Card */}
                        <motion.div 
                            variants={fadeInUp}
                            whileHover={{ y: -2, scale: 1.01 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <motion.div 
                                        className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-30 blur"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500">Salary Range</p>
                                    <p className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {formatSalary()}
                                    </p>
                                    {job.salaryRange?.isNegotiable && (
                                        <p className="text-[8px] text-blue-600 mt-0.5 flex items-center gap-0.5">
                                            <CheckCircle className="w-2.5 h-2.5" />
                                            Negotiable
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Location Card */}
                        <motion.div 
                            variants={fadeInUp}
                            whileHover={{ y: -2, scale: 1.01 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <motion.div 
                                        className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 blur"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500">Location</p>
                                    <p className="text-xs font-medium text-gray-800">
                                        {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
                                    </p>
                                    {job.location?.isRemote && (
                                        <p className="text-[8px] text-green-600 mt-0.5 flex items-center gap-0.5">
                                            <Globe className="w-2.5 h-2.5" />
                                            Remote Position
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Job Overview Grid */}
                        <motion.div 
                            variants={fadeInUp}
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg"
                        >
                            <h3 className="text-xs font-semibold mb-3 text-gray-800 flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-blue-600" />
                                Job Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {jobOverviewItems.map((item, index) => (
                                    <motion.div 
                                        key={index}
                                        variants={fadeInUp}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        className={`${item.bg} p-2 rounded-lg border border-${item.color.split('-')[1]}-100`}
                                        onMouseEnter={() => setHoveredSection(`overview-${index}`)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                    >
                                        <div className="flex items-start gap-1.5">
                                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[7px] text-gray-500">{item.label}</p>
                                                <p className="text-[8px] font-medium text-gray-700 line-clamp-1">{item.value}</p>
                                                {item.subValue && (
                                                    <p className="text-[6px] text-gray-400">{item.subValue}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Application Method */}
                        <motion.div 
                            variants={fadeInUp}
                            whileHover={{ y: -2 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg"
                        >
                            <h3 className="text-xs font-semibold mb-2 text-gray-800">How to Apply</h3>
                            <p className="text-[9px] text-gray-600 mb-3">
                                {job.applicationMethod === 'Platform' 
                                    ? 'Apply directly through our platform'
                                    : job.applicationMethod === 'Email'
                                    ? `Send to: ${job.applicationEmail}`
                                    : job.applicationMethod === 'External'
                                    ? `Apply via external link`
                                    : 'Check description for details'
                                }
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setOpenApply(true)}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-[10px] font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                            >
                                Apply Now
                            </motion.button>
                        </motion.div>

                        {/* Similar Jobs */}
                        {similarJobs.length > 0 && (
                            <motion.div 
                                variants={fadeInUp}
                                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg"
                            >
                                <h3 className="text-xs font-semibold mb-3 text-gray-800 flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                                    Similar Jobs
                                </h3>
                                <div className="space-y-2">
                                    {similarJobs.map((similarJob, index) => (
                                        <motion.div
                                            key={similarJob._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.01, x: 2 }}
                                            onClick={() => {
                                                router.push(`/jobs/${similarJob._id}`);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-300 group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-[9px] font-medium text-gray-800 group-hover:text-blue-600 line-clamp-1">
                                                    {similarJob.jobTitle}
                                                </h4>
                                                <span className="text-[6px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded">
                                                    {similarJob.daysRemaining}d
                                                </span>
                                            </div>
                                            <p className="text-[8px] text-gray-500 mb-1.5">
                                                {similarJob.employer?.companyName || similarJob.employer?.name}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[6px] px-1.5 py-0.5 rounded-full border ${getJobTypeColor(similarJob.jobType)}`}>
                                                    {similarJob.jobType}
                                                </span>
                                                <span className="text-[6px] text-gray-400 flex items-center gap-0.5">
                                                    <MapPin className="w-2 h-2" />
                                                    {similarJob.location?.city || 'Remote'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.aside>
                </div>

                {/* Apply Modal */}
                <ApplyApplication
                    open={openApply}
                    onClose={() => setOpenApply(false)}
                    jobId={job._id}
                    jobTitle={job.jobTitle}
                    company={job.employer?.companyName || job.employer?.name}
                />
            </main>
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