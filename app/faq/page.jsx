"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { FiHelpCircle, FiBriefcase, FiUser, FiPhone, FiMail, FiMessageCircle } from "react-icons/fi";

const faqsData = [
    {
        section: "Your Account",
        icon: <FiHelpCircle className="w-4 h-4" />,
        color: "from-blue-500 to-cyan-500",
        items: [
            {
                q: "How do I create a new account?",
                a: "Creating an account is free and easy! Click the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. You'll be ready to start your job search in minutes.",
            },
            {
                q: "I forgot my password. What should I do?",
                a: "No worries! Click on 'Forgot Password' on the login page. Enter your registered email, and we'll send you a password reset link. For security, this link expires in 24 hours.",
            },
            {
                q: "Can I delete my account permanently?",
                a: "Yes, you can delete your account from settings. Go to Account Settings > Privacy > Delete Account. Please note this action is irreversible and all your data will be permanently removed within 30 days.",
            },
            {
                q: "How do I update my profile information?",
                a: "Simply go to your Dashboard and click on 'Edit Profile'. You can update your personal information, work preferences, and notification settings there. Don't forget to save your changes!",
            },
        ],
    },
    {
        section: "Employers and Jobs",
        icon: <FiBriefcase className="w-4 h-4" />,
        color: "from-purple-500 to-pink-500",
        items: [
            {
                q: "How do I post a job as an employer?",
                a: "Employers can post jobs by logging into their employer dashboard and clicking 'Post a New Job'. Fill in the job details, requirements, and preferred candidate profile. Your job will be reviewed and posted within 24 hours.",
            },
            {
                q: "What's the cost of posting a job?",
                a: "We offer flexible pricing plans! Basic job posts start at $99 for 30 days. Premium packages with featured listings and AI matching are available from $199. Check our Pricing page for current offers.",
            },
            {
                q: "How do I find the best candidates?",
                a: "Use our advanced search filters to find candidates by skills, experience, location, and more. You can also enable AI-powered matching to get personalized candidate recommendations based on your job requirements.",
            },
            {
                q: "Can I edit a job posting after it's live?",
                a: "Absolutely! Go to 'My Jobs' in your employer dashboard, find the posting you want to edit, and click 'Edit Job'. Minor updates go live immediately, while major changes may require re-approval.",
            },
        ],
    },
    {
        section: "Candidate & Resume",
        icon: <FiUser className="w-4 h-4" />,
        color: "from-amber-500 to-orange-500",
        items: [
            {
                q: "How do I create a standout resume?",
                a: "Start with our professional resume templates! Highlight your achievements with numbers, use action verbs, and tailor your resume to each job. Our AI resume builder provides real-time suggestions to improve your chances.",
            },
            {
                q: "Can I upload multiple resumes?",
                a: "Yes! You can maintain up to 3 different resume versions. This is perfect when you're applying for different types of positions. Simply upload them in PDF or DOC format (max 5MB each).",
            },
            {
                q: "How do I make my profile visible to employers?",
                a: "Toggle your profile visibility to 'Public' in privacy settings. Complete your profile to at least 80% (we'll guide you!) and enable 'Open to Work' to increase your chances of being discovered by recruiters.",
            },
            {
                q: "What are skill endorsements?",
                a: "Skill endorsements allow employers and colleagues to validate your skills. Each endorsement adds credibility to your profile. The more endorsements you have for key skills, the higher you'll appear in search results.",
            },
        ],
    },
    {
        section: "Support & Help",
        icon: <FiMessageCircle className="w-4 h-4" />,
        color: "from-emerald-500 to-teal-500",
        items: [
            {
                q: "How can I contact customer support?",
                a: "We're here 24/7! Live chat with our support team (response within 5 minutes), email us at support@jobportal.com (response within 24 hours), or call our helpline at +1-202-555-0178 for urgent issues.",
            },
            {
                q: "What should I do if I encounter a technical issue?",
                a: "First, try clearing your browser cache and cookies. If the issue persists, use our in-app bug reporter (click the ? icon) or email technical-support@jobportal.com with screenshots and steps to reproduce the issue.",
            },
            {
                q: "Do you offer career counseling?",
                a: "Yes! Premium members get access to professional career counselors. Book 1-on-1 sessions for resume reviews, interview preparation, and career path guidance. Free members can join weekly group webinars.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSection, setActiveSection] = useState("all");
    const [filteredFaqs, setFilteredFaqs] = useState(faqsData);

    const toggle = (id) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    // Filter FAQs based on search and section
    useEffect(() => {
        let filtered = faqsData;
        
        // Filter by section
        if (activeSection !== "all") {
            filtered = filtered.filter((_, index) => 
                index.toString() === activeSection
            );
        }
        
        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.map(section => ({
                ...section,
                items: section.items.filter(item => 
                    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })).filter(section => section.items.length > 0);
        }
        
        setFilteredFaqs(filtered);
    }, [searchTerm, activeSection]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
                {/* Compact Header with Wave Effect */}
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    {/* Animated background shapes */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>
                    
                    {/* Floating orbs */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl animate-float-delayed"></div>
                    
                    <div className="relative max-w-5xl mx-auto px-4 py-12 text-center">
                        {/* Smaller title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fadeInUp">
                            How can we{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">help you?</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300/30 -rotate-1"></span>
                            </span>
                        </h1>
                        
                        <p className="text-base text-indigo-100 mb-6 max-w-xl mx-auto animate-fadeInUp delay-200">
                            Search through our frequently asked questions or browse by category
                        </p>

                        {/* Smaller Search Bar */}
                        <div className="relative max-w-xl mx-auto animate-fadeInUp delay-400">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Ask a question or search keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-3.5 pr-32 text-base bg-white/95 backdrop-blur-sm rounded-xl border-2 border-transparent focus:border-yellow-300 outline-none shadow-lg transition-all duration-300 group-hover:shadow-xl"
                                />
                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                                    <button className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-md hover:scale-105 transition-all duration-300">
                                        Search
                                    </button>
                                </div>
                            </div>
                            
                            {/* Smaller popular searches */}
                            <div className="flex flex-wrap justify-center gap-1.5 mt-3 text-xs">
                                <span className="text-indigo-200">Popular:</span>
                                {["account", "password", "job posting", "resume", "pricing"].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setSearchTerm(term)}
                                        className="px-2 py-0.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-300"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Smaller wave divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" 
                                fill="white" fillOpacity="0.1"/>
                            <path d="M0 80L60 75C120 70 240 60 360 55C480 50 600 50 720 55C840 60 960 70 1080 75C1200 80 1320 80 1380 80L1440 80V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" 
                                fill="white"/>
                        </svg>
                    </div>
                </div>

                {/* Smaller Category Pills */}
                <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setActiveSection("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                activeSection === "all"
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 shadow-sm"
                            }`}
                        >
                            All Questions
                        </button>
                        {faqsData.map((section, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveSection(index.toString())}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1.5 ${
                                    activeSection === index.toString()
                                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                                        : "bg-white text-gray-700 hover:bg-indigo-50 shadow-sm"
                                }`}
                            >
                                <span>{section.icon}</span>
                                {section.section}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Content - Reduced sizes */}
                <div className="max-w-3xl mx-auto px-4 pb-16">
                    {filteredFaqs.length > 0 ? (
                        <div className="space-y-8">
                            {filteredFaqs.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="relative group">
                                    {/* Smaller section header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} text-white shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                                            {section.icon}
                                        </div>
                                        <h2 className="text-base font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                            {section.section}
                                        </h2>
                                        <div className={`flex-1 h-0.5 bg-gradient-to-r ${section.color} rounded-full opacity-50`}></div>
                                    </div>

                                    <div className="space-y-2.5">
                                        {section.items.map((item, itemIndex) => {
                                            const id = `${sectionIndex}-${itemIndex}`;
                                            const isOpen = openIndex === id;

                                            return (
                                                <div
                                                    key={id}
                                                    className="relative transform transition-all duration-500 hover:translate-x-1"
                                                    style={{
                                                        animationDelay: `${itemIndex * 100}ms`,
                                                        animation: 'slideIn 0.5s ease-out forwards'
                                                    }}
                                                >
                                                    {/* Smaller Question Card */}
                                                    <div
                                                        onClick={() => toggle(id)}
                                                        className={`
                                                            relative cursor-pointer rounded-xl p-4
                                                            transition-all duration-500 ease-out
                                                            ${isOpen 
                                                                ? `bg-gradient-to-r ${section.color} text-white shadow-xl`
                                                                : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100 hover:border-indigo-200'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <h3 className={`text-sm font-medium pr-6 transition-colors duration-300 ${
                                                                isOpen ? 'text-white' : 'text-gray-800'
                                                            }`}>
                                                                {item.q}
                                                            </h3>
                                                            <div className={`
                                                                relative flex-shrink-0 w-6 h-6 rounded-full
                                                                transition-all duration-500 transform
                                                                ${isOpen 
                                                                    ? 'rotate-180 bg-white/20' 
                                                                    : 'bg-gradient-to-r from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200'
                                                                }
                                                            `}>
                                                                <svg
                                                                    className={`absolute inset-0 w-6 h-6 p-1 transition-transform duration-500 ${
                                                                        isOpen ? 'rotate-180 text-white' : 'text-indigo-600'
                                                                    }`}
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {/* Smaller Answer section */}
                                                        <div
                                                            className={`
                                                                overflow-hidden transition-all duration-700 ease-in-out
                                                                ${isOpen ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'}
                                                            `}
                                                        >
                                                            <div className={`
                                                                relative p-3 rounded-lg text-sm
                                                                ${isOpen ? 'bg-white/10 backdrop-blur-sm' : ''}
                                                            `}>
                                                                <p className={`leading-relaxed text-xs ${
                                                                    isOpen ? 'text-white/90' : 'text-gray-600'
                                                                }`}>
                                                                    {item.a}
                                                                </p>
                                                                
                                                                {/* Smaller helpful buttons */}
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className={`text-xs ${isOpen ? 'text-white/70' : 'text-gray-500'}`}>
                                                                        Helpful?
                                                                    </span>
                                                                    <button className={`p-1 rounded-md transition-all duration-300 hover:scale-110 text-xs ${
                                                                        isOpen 
                                                                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                                                                            : 'bg-gray-100 hover:bg-indigo-100 text-gray-700'
                                                                    }`}>
                                                                        👍
                                                                    </button>
                                                                    <button className={`p-1 rounded-md transition-all duration-300 hover:scale-110 text-xs ${
                                                                        isOpen 
                                                                            ? 'bg-white/20 hover:bg-white/30 text-white' 
                                                                            : 'bg-gray-100 hover:bg-indigo-100 text-gray-700'
                                                                    }`}>
                                                                        👎
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Smaller no results found
                        <div className="text-center py-12 animate-fadeIn">
                            <div className="text-5xl mb-3">🔍</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No results found</h3>
                            <p className="text-sm text-gray-600 mb-4">Try searching with different keywords</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setActiveSection("all");
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-md hover:scale-105 transition-all duration-300"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Smaller "Still have questions?" section */}
                    <div className="mt-12 text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur-2xl opacity-50"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-100">
                            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Still have questions?
                            </h3>
                            <p className="text-sm text-gray-600 mb-5 max-w-xl mx-auto">
                                Can't find what you're looking for? Our support team is here 24/7.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button className="group px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                                    <FiMessageCircle className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                                    Live Chat
                                </button>
                                <button className="group px-5 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 border border-indigo-200 flex items-center gap-1.5">
                                    <FiMail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                                    Email
                                </button>
                                <button className="group px-5 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5">
                                    <FiPhone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                                    Call
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 2s;
                }
                
                .delay-200 {
                    animation-delay: 200ms;
                }
                
                .delay-400 {
                    animation-delay: 400ms;
                }
            `}</style>
        </>
    );
}