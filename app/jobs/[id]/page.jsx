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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { jobService } from "@/services/jobService";
import { savedJobService } from "@/services/savedJobService";

export default function JobDetail() {
    const [openApply, setOpenApply] = useState(false);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [similarJobs, setSimilarJobs] = useState([]);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch job details
            const jobData = await jobService.getJobById(id);
            setJob(jobData);
            
            // Check if job is saved using API
            try {
                const isSaved = await savedJobService.checkJobSaved(id);
                setSaved(isSaved);
            } catch (saveError) {
                console.log("Could not check saved status:", saveError);
                setSaved(false);
            }
            
            // Fetch similar jobs
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
                <main className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading job details...</p>
                        <p className="text-sm text-gray-500 mt-2">Job ID: {id}</p>
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
                <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="text-center max-w-md">
                        <div className="mb-6">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            {error === 'Job not found' ? 'Job Not Found' : 'Error Loading Job'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {error === 'Job not found' 
                                ? "The job you're looking for doesn't exist or has been removed."
                                : error || "An unexpected error occurred."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleGoBack}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                ← Back to Jobs
                            </button>
                            <button
                                onClick={handleRetry}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                            <p className="text-sm text-gray-600 mb-2">Debug Information:</p>
                            <p className="text-xs text-gray-500">Job ID: {id}</p>
                            <p className="text-xs text-gray-500">Error: {error}</p>
                        </div>
                    </div>
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
                              job.salaryRange.currency;
        
        return `${currencySymbol}${job.salaryRange.min.toLocaleString()} - ${currencySymbol}${job.salaryRange.max.toLocaleString()}`;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Get job type color
    const getJobTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'full-time':
                return 'bg-blue-100 text-blue-600';
            case 'part-time':
                return 'bg-green-100 text-green-600';
            case 'internship':
                return 'bg-purple-100 text-purple-600';
            case 'contract':
                return 'bg-yellow-100 text-yellow-600';
            case 'temporary':
                return 'bg-orange-100 text-orange-600';
            case 'remote':
                return 'bg-indigo-100 text-indigo-600';
            case 'freelance':
                return 'bg-pink-100 text-pink-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <>
            <Navbar />
            <SecondNavbar />

            <main className="bg-gray-50 min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500">
                        <button onClick={() => router.push('/')} className="hover:text-blue-600">
                            Home
                        </button>
                        {" / "}
                        <button onClick={() => router.push('/')} className="hover:text-blue-600">
                            Find Job
                        </button>
                        {" / "}
                        <span className="text-gray-900 font-medium">{job.jobTitle}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                                        {job.employer?.companyName?.[0] || job.employer?.name?.[0] || 'C'}
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-semibold text-gray-900">{job.jobTitle}</h1>
                                        <p className="text-sm text-gray-500 mt-1">
                                            at {job.employer?.companyName || job.employer?.name || 'Unknown Company'}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className={`text-xs px-3 py-1 rounded-full ${getJobTypeColor(job.jobType)}`}>
                                                {job.jobType}
                                            </span>
                                            {job.isFeatured && (
                                                <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                            {job.isHighlighted && (
                                                <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                                                    Highlighted
                                                </span>
                                            )}
                                            {job.location?.isRemote && (
                                                <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                                    Remote
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setOpenApply(true)}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium w-full sm:w-auto"
                                    >
                                        Apply Now →
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveJob}
                                            disabled={saving}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
                                                saved
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {saving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : saved ? (
                                                <BookmarkCheck size={18} className="fill-current" />
                                            ) : (
                                                <Bookmark size={18} />
                                            )}
                                            <span className="text-sm">
                                                {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <Share2 size={18} />
                                            <span className="text-sm">Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
                            <div className="text-gray-600 whitespace-pre-line">
                                {job.jobDescription}
                            </div>
                        </div>

                        {/* Requirements & Skills */}
                        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Requirements & Skills</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3">Experience Level</h3>
                                    <p className="text-gray-600">{job.experienceLevel}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-3">Education Required</h3>
                                    <p className="text-gray-600">{job.educationLevel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Benefits & Perks</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {job.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Job Tags */}
                        {job.tags && job.tags.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills & Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">
                        {/* Salary */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <DollarSign className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Salary</p>
                                    <p className="font-bold text-green-600 text-lg">{formatSalary()}</p>
                                </div>
                            </div>
                            {job.salaryRange?.isNegotiable && (
                                <p className="text-sm text-blue-600">Salary is negotiable</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MapPin className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-800">
                                        {job.location?.city || 'Not specified'}, {job.location?.country || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                            {job.location?.address && (
                                <p className="text-sm text-gray-600 mt-2">{job.location.address}</p>
                            )}
                        </div>

                        {/* Job Overview */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4 text-gray-800">Job Overview</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Posted Date</p>
                                        <p className="font-medium">{formatDate(job.postedDate)}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="text-red-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Expiration Date</p>
                                        <p className="font-medium">{formatDate(job.expirationDate)}</p>
                                        {job.daysRemaining > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Expires in {job.daysRemaining} day{job.daysRemaining !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Layers className="text-purple-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Experience Level</p>
                                        <p className="font-medium">{job.experienceLevel}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="text-orange-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Job Type</p>
                                        <p className="font-medium">{job.jobType}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="text-green-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Education Level</p>
                                        <p className="font-medium">{job.educationLevel}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="text-indigo-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Vacancies</p>
                                        <p className="font-medium">{job.vacancies} position{job.vacancies !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Method */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-3 text-gray-800">How to Apply</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {job.applicationMethod === 'Platform' 
                                    ? 'Apply directly through our platform'
                                    : job.applicationMethod === 'Email'
                                    ? `Send your application to: ${job.applicationEmail}`
                                    : job.applicationMethod === 'External'
                                    ? `Apply through external link: ${job.applicationUrl}`
                                    : 'Please check job description for application details'
                                }
                            </p>
                            <button
                                onClick={() => setOpenApply(true)}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Apply Now
                            </button>
                        </div>

                        {/* Similar Jobs */}
                        {similarJobs.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="font-semibold mb-4 text-gray-800">Similar Jobs</h3>
                                <div className="space-y-4">
                                    {similarJobs.map((similarJob) => (
                                        <div
                                            key={similarJob._id}
                                            onClick={() => {
                                                router.push(`/jobs/${similarJob._id}`);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-800 line-clamp-1">{similarJob.jobTitle}</h4>
                                                <span className="text-xs text-gray-500">
                                                    {similarJob.daysRemaining}d left
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {similarJob.employer?.companyName || similarJob.employer?.name}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                    {similarJob.jobType}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {similarJob.location?.city}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
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
        </>
    );
}