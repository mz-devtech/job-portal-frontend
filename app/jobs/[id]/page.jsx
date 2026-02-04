"use client";

import { useState, useEffect } from "react";
import ApplyApplication from "@/components/ApplyApplication";
import { useParams } from "next/navigation";

import {
    Bookmark,
    MapPin,
    DollarSign,
    Briefcase,
    GraduationCap,
    Share2,
    Clock,
    Layers,
} from "lucide-react";

export default function JobDetail() {
    const [openApply, setOpenApply] = useState(false);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const params = useParams();
    const id = params?.id;

    const jobs = [
        {
            id: "senior-ux-designer",
            title: "Senior UX Designer",
            company: "Facebook",
            type: "FULL-TIME",
            featured: true,
            location: "Dhaka, Bangladesh",
            salary: "$100,000 - $120,000",
            experience: "$50K-80K/month",
            level: "Entry Level",
            education: "Graduation",
            posted: "14 Jun, 2021",
            expire: "14 Aug, 2021",
            description: [
                "Velstar is a Shopify Plus agency, and we partner with brands to help them grow. We also do the same with our people!",
                "Here at Velstar, we don't just make websites, we create exceptional digital experiences that consumers love.",
                "Our team of designers, developers, strategists, and creators work together to push brands to the next level.",
            ],
            requirements: [
                "3+ years experience in back-end development",
                "Experience with HTML, JavaScript, CSS, PHP, Symfony or Laravel",
                "Working knowledge of APIs and Web Services (REST, GraphQL, SOAP, etc)",
                "Familiarity with version control systems (Git)",
                "Ambitious and hungry to grow your career",
            ],
            desirable: [
                "Working knowledge of eCommerce platforms like Shopify",
                "Experience with payment gateways",
                "API platform experience / Building RESTful APIs",
            ],
            benefits: [
                "40% Salary",
                "Async",
                "Learning budget",
                "Vision Insurance",
                "4 day workweek",
                "Profit Sharing",
                "Equity Compensation",
            ],
            tags: ["Back-end", "PHP", "Laravel", "Development", "Front-end"],
        },
        {
            id: "technical-support-specialist",
            title: "Technical Support Specialist",
            company: "Google Inc.",
            type: "PART-TIME",
            featured: false,
            location: "San Francisco, USA",
            salary: "$60,000 - $80,000",
            experience: "$30K-50K/month",
            level: "Mid Level",
            education: "Bachelor's Degree",
            posted: "15 Jun, 2021",
            expire: "15 Sep, 2021",
            description: [
                "Provide technical support for Google's suite of products.",
                "Troubleshoot and resolve customer issues efficiently.",
                "Collaborate with engineering teams to improve product quality.",
            ],
            requirements: [
                "2+ years experience in technical support",
                "Strong problem-solving skills",
                "Excellent communication abilities",
            ],
            desirable: [
                "Experience with cloud platforms",
                "Knowledge of networking protocols",
            ],
            benefits: [
                "Health Insurance",
                "Remote Work Options",
                "Stock Options",
                "Gym Membership",
            ],
            tags: ["Support", "Technical", "Customer Service", "Cloud"],
        },
        {
            id: "marketing-officer",
            title: "Marketing Officer",
            company: "Google Inc.",
            type: "INTERNSHIP",
            featured: false,
            location: "New York, USA",
            salary: "$40,000 - $50,000",
            experience: "$20K-30K/month",
            level: "Entry Level",
            education: "Bachelor's Degree",
            posted: "16 Jun, 2021",
            expire: "16 Oct, 2021",
            description: [
                "Develop and execute marketing campaigns.",
                "Analyze market trends and consumer behavior.",
                "Collaborate with cross-functional teams.",
            ],
            requirements: [
                "1+ years experience in marketing",
                "Knowledge of digital marketing tools",
                "Creative thinking and analytical skills",
            ],
            benefits: ["Flexible Hours", "Mentorship", "Networking Opportunities"],
            tags: ["Marketing", "Digital", "SEO", "Social Media"],
        },
        {
            id: "junior-graphic-designer",
            title: "Junior Graphic Designer",
            company: "Google Inc.",
            type: "INTERNSHIP",
            featured: false,
            location: "Austin, USA",
            salary: "$45,000 - $55,000",
            experience: "$25K-35K/month",
            level: "Entry Level",
            education: "Bachelor's Degree",
            posted: "17 Jun, 2021",
            expire: "17 Nov, 2021",
            description: [
                "Create visual concepts for various projects.",
                "Design marketing materials and digital assets.",
                "Work with the creative team on brand consistency.",
            ],
            requirements: [
                "Proficiency in Adobe Creative Suite",
                "Strong portfolio showcasing design skills",
                "Understanding of design principles",
            ],
            benefits: ["Creative Freedom", "Skill Development", "Team Collaboration"],
            tags: ["Design", "Adobe", "Creative", "UI/UX"],
        },
        {
            id: "interaction-designer",
            title: "Interaction Designer",
            company: "Google Inc.",
            type: "PART-TIME",
            featured: false,
            location: "Seattle, USA",
            salary: "$70,000 - $90,000",
            experience: "$35K-60K/month",
            level: "Mid Level",
            education: "Bachelor's Degree",
            posted: "18 Jun, 2021",
            expire: "18 Dec, 2021",
            description: [
                "Design user interactions for digital products.",
                "Create wireframes, prototypes, and user flows.",
                "Conduct user research and usability testing.",
            ],
            requirements: [
                "3+ years experience in interaction design",
                "Proficiency in Figma or Sketch",
                "Understanding of user-centered design",
            ],
            benefits: ["Remote Work", "Design Tools Budget", "Conference Allowance"],
            tags: ["Interaction", "Figma", "UX", "Prototyping"],
        },
        {
            id: "project-manager",
            title: "Project Manager",
            company: "Google Inc.",
            type: "FULL-TIME",
            featured: true,
            location: "London, UK",
            salary: "$90,000 - $110,000",
            experience: "$45K-70K/month",
            level: "Senior Level",
            education: "Master's Degree",
            posted: "19 Jun, 2021",
            expire: "19 Jan, 2022",
            description: [
                "Lead cross-functional project teams.",
                "Manage project timelines, budgets, and resources.",
                "Ensure successful project delivery and client satisfaction.",
            ],
            requirements: [
                "5+ years experience in project management",
                "PMP certification preferred",
                "Strong leadership and communication skills",
            ],
            benefits: ["Bonus", "Health Benefits", "Retirement Plan", "Stock Options"],
            tags: ["Management", "PMP", "Agile", "Leadership"],
        },
    ];

    useEffect(() => {
        if (id) {
            const foundJob = jobs.find((job) => job.id === id);
            setJob(foundJob);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading job details...</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Job not found</h2>
                    <p className="text-gray-500">The job you're looking for doesn't exist or has been removed.</p>
                    <a 
                        href="/"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        ← Back to Jobs
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* ================= BREADCRUMB ================= */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500">
                    Home / Find Job / Graphics & Design /{" "}
                    <span className="text-gray-900 font-medium">Job Details</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ================= LEFT CONTENT ================= */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                                    {job.company[0]}
                                </div>

                                <div>
                                    <h1 className="text-2xl font-semibold">{job.title}</h1>
                                    <p className="text-sm text-gray-500">at {job.company}</p>

                                    <div className="flex gap-2 mt-3">
                                        <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                            {job.type}
                                        </span>
                                        {job.featured && (
                                            <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpenApply(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Apply Now →
                            </button>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
                        <div className="space-y-4 text-gray-600">
                            {job.description.map((item, i) => (
                                <p key={i} className="leading-relaxed">{item}</p>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Requirements</h2>
                        <ul className="space-y-3">
                            {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-blue-500 mr-2 mt-1">•</span>
                                    <span className="text-gray-600">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Desirable */}
                    {job.desirable && job.desirable.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Desirable Skills</h2>
                            <ul className="space-y-3">
                                {job.desirable.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-1">•</span>
                                        <span className="text-gray-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Benefits */}
                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Benefits & Perks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {job.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SIDEBAR ================= */}
                <aside className="space-y-6">
                    {/* Salary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="text-green-600" size={20} />
                        </div>
                        <p className="text-sm text-gray-500">Salary (USD)</p>
                        <p className="font-bold text-green-600 text-xl">{job.salary}</p>
                        <p className="text-xs text-gray-400 mt-1">Yearly salary</p>
                    </div>

                    {/* Location */}
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MapPin className="text-blue-600" size={20} />
                        </div>
                        <p className="text-sm text-gray-500">Job Location</p>
                        <p className="font-medium text-gray-800">{job.location}</p>
                    </div>

                    {/* Job Overview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4 text-gray-800">Job Overview</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Clock className="text-blue-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Job Posted</p>
                                    <p className="font-medium">{job.posted}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                    <Clock className="text-red-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Job Expire</p>
                                    <p className="font-medium">{job.expire}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Layers className="text-purple-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Job Level</p>
                                    <p className="font-medium">{job.level}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                    <Briefcase className="text-orange-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Experience</p>
                                    <p className="font-medium">{job.experience}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="text-green-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Education</p>
                                    <p className="font-medium">{job.education}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Benefits */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4 text-gray-800">Job Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.benefits.slice(0, 5).map((benefit, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium"
                                >
                                    {benefit}
                                </span>
                            ))}
                            {job.benefits.length > 5 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    +{job.benefits.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-3 text-gray-800">Job Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Share & Save */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4 text-gray-800">Share this job</h3>
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                                <Share2 size={18} />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition">
                                <Bookmark size={18} />
                                <span className="text-sm font-medium">Save</span>
                            </button>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4 text-gray-800">About {job.company}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {job.company} is a leading company in its industry, offering innovative solutions and career growth opportunities.
                        </p>
                        <button className="w-full text-blue-600 font-medium hover:text-blue-800 text-sm">
                            View Company Profile →
                        </button>
                    </div>
                </aside>
            </div>

            {/* Apply Modal */}
            <ApplyApplication
                open={openApply}
                onClose={() => setOpenApply(false)}
                jobTitle={job.title}
                company={job.company}
            />
        </main>
    );
}