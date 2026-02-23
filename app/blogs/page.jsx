"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Calendar, MessageCircle, Tag, Filter, X } from "lucide-react";

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["Code & Programming"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    "Graphics & Design",
    "Code & Programming",
    "Digital Marketing",
    "Video & Animation",
    "Music & Audio",
    "Finance & Accounting",
    "Health & Care",
    "Data Science",
  ];

  const popularTags = ["Design", "Programming", "Health & Care", "Photography", "Marketing", "AI", "Web Dev"];

  const recentPosts = [
    { id: 1, title: "Integer volutpat fringilla ipsum.", date: "Nov 12, 2021", comments: 25 },
    { id: 2, title: "Vestibulum maximus nec justo sed.", date: "Nov 10, 2021", comments: 18 },
    { id: 3, title: "Aliquam metus mauris semper eu.", date: "Nov 8, 2021", comments: 32 },
  ];

  const blogPosts = [1, 2, 3, 4, 5];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Navbar />
      <SecondNavbar />
      
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-100/30 to-pink-100/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
        {/* Header with breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                Blog & Articles
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
              >
                <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Blog</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mobile filter button */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            <Filter className="w-4 h-4" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`lg:block space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              {/* Search */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  Search
                </h3>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 pr-10"
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
              </motion.div>

              {/* Category */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Category
                </h3>
                <ul className="space-y-3">
                  {categories.map((cat, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-center gap-3 group"
                    >
                      <button
                        onClick={() => toggleCategory(cat)}
                        className={`relative w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${
                          selectedCategories.includes(cat)
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300 group-hover:border-blue-400'
                        }`}
                      >
                        {selectedCategories.includes(cat) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`text-sm cursor-pointer transition-all duration-300 ${
                          selectedCategories.includes(cat)
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-600 group-hover:text-gray-900'
                        }`}
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Recent Post */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Recent Post
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((post, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src="/blog/thumb.jpg"
                          className="w-16 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium leading-snug group-hover:text-blue-600 transition-colors duration-300">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{post.date}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{post.comments} comments</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Popular Tag */}
              <motion.div 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Popular Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all duration-300 ${
                        tag === "Programming"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:shadow"
                      }`}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.aside>

            {/* Blog List */}
            <motion.section 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-3 space-y-6"
            >
              {blogPosts.map((id, index) => (
                <motion.div
                  key={id}
                  variants={{
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative"
                >
                  <Link
                    href={`/blogs/${id}`}
                    className="block bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="relative flex flex-col md:flex-row gap-6">
                      {/* Image with overlay */}
                      <div className="relative md:w-72 overflow-hidden rounded-xl">
                        <img
                          src="/blog/post.jpg"
                          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Floating date badge */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
                          <span className="text-blue-600">Nov 12, 2021</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
                            <Calendar className="w-3 h-3" />
                            Nov 12, 2021
                          </span>
                          <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
                            <MessageCircle className="w-3 h-3" />
                            25 Comments
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          Integer volutpat fringilla ipsum, nec tempor risus
                          facilisis eget.
                        </h2>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          Integer imperdiet mauris eget nisl ultrices, quis hendrerit
                          est consequat. Vestibulum maximus nec justo sed maximus.
                        </p>

                        {/* Read more with animated arrow */}
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-indigo-600 transition-colors duration-300">
                          Read more
                          <svg 
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Pagination */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center items-center gap-2 mt-8"
              >
                {[1, 2, 3, 4, 5].map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 ${
                      page === 1
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'border border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </motion.div>
            </motion.section>
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