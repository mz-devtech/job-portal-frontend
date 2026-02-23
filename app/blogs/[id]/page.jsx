"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SecondNavbar from "@/components/SecondNavbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MessageCircle, User, Search, ArrowLeft, Share2, Bookmark, Heart } from "lucide-react";
import { useState } from "react";

export default function BlogDetailPage({ params }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const recentPosts = [
    { id: 1, title: "Integer volutpat fringilla ipsum.", image: "/blog/thumb.jpg" },
    { id: 2, title: "Vestibulum maximus nec justo sed.", image: "/blog/thumb.jpg" },
    { id: 3, title: "Aliquam metus mauris semper eu.", image: "/blog/thumb.jpg" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
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
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <Link
                  href="/blogs"
                  className="group flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to Blogs
                </Link>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Blog Details
                </h1>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
              >
                <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">Home</Link>
                <span className="text-gray-300">/</span>
                <Link href="/blogs" className="text-gray-400 hover:text-gray-600 transition-colors">Blog</Link>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {params.id}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Main Content */}
            <motion.article 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="lg:col-span-3"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    20 cool fonts for web and graphic design
                  </span>
                </h1>

                {/* Author info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:text-blue-600 transition-colors duration-300">Kevin Gilbert</span>
                  </div>
                  <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
                    <Calendar className="w-4 h-4" />
                    Nov 12, 2021
                  </span>
                  <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors duration-300">
                    <MessageCircle className="w-4 h-4" />
                    25 Comments
                  </span>
                </div>

                {/* Featured Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative rounded-2xl overflow-hidden mb-8 group"
                >
                  <img
                    src="/blog/single.jpg"
                    alt=""
                    className="w-full h-[420px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSaved(!saved)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        saved 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/90 text-gray-600 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        liked 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/90 text-gray-600 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-white/90 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    Check out these 20 cool fonts for your next web or graphic design
                    project. Typography plays a critical role in visual identity.
                  </motion.p>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 leading-relaxed"
                  >
                    Fonts influence perception, reinforce brand identity, and guide
                    user attention throughout the layout.
                  </motion.p>

                  <motion.blockquote 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-r-2xl my-8"
                  >
                    <p className="text-gray-700 italic">
                      "Vintage meets vogue is the only way to describe this serif
                      typeface."
                    </p>
                  </motion.blockquote>

                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-xl font-bold text-gray-900 mb-4"
                  >
                    EB Garamond and Relative
                  </motion.h3>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-600 leading-relaxed mb-8"
                  >
                    EB Garamond is elegant, readable, and perfect for long-form
                    editorial content.
                  </motion.p>

                  {/* Image grid */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8"
                  >
                    {[1, 2].map((i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden group">
                        <img 
                          src={`/blog/detail${i}.jpg`} 
                          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700" 
                          alt="" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Tags */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Design", "Typography", "Web Design", "Fonts"].map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <motion.aside 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Search */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  Search
                </h3>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 pr-10"
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
              </motion.div>

              {/* Recent Post */}
              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((post, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={post.image}
                          className="w-16 h-14 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 font-medium leading-snug group-hover:text-blue-600 transition-colors duration-300">
                          {post.title}
                        </p>
                        <span className="text-xs text-gray-400">Nov 12, 2021</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Author Info */}
              <motion.div 
                variants={fadeInUp}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-4">About Author</h3>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Kevin Gilbert</h4>
                  <p className="text-xs text-gray-500 mt-1">Senior UI/UX Designer</p>
                  <p className="text-sm text-gray-600 mt-3">
                    Passionate about typography and modern web design with 8+ years of experience.
                  </p>
                </div>
              </motion.div>
            </motion.aside>
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