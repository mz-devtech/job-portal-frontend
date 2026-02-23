"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion"; // Fixed import
import { useState, useEffect } from "react";
import { 
  Home, 
  ArrowLeft, 
  AlertTriangle, 
  Search, 
  Compass, 
  Map, 
  Ghost, 
  Frown, 
  Meh, 
  Smile,
  Sparkles,
  Zap,
  Globe,
  Coffee,
  Heart,
  Star
} from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [jokeIndex, setJokeIndex] = useState(0);
  const [showJoke, setShowJoke] = useState(false);

  const errorJokes = [
    "Looks like this page went on a coffee break ☕",
    "404: Page not found. It's probably on vacation 🏖️",
    "This page has ghosted you 👻",
    "Even our best robots couldn't find this page 🤖",
    "Page not found. It's playing hide and seek 🕵️",
    "404: The page you're looking for is in another castle 🏰",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % errorJokes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const floatAnimation = {
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

  const rotateAnimation = {
    animate: {
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bounceAnimation = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
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
        
        {/* Floating 404 numbers */}
        <motion.div 
          className="absolute top-1/4 left-1/4 text-[120px] font-bold text-blue-200/20 select-none"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          404
        </motion.div>
        <motion.div 
          className="absolute bottom-1/4 right-1/4 text-[180px] font-bold text-indigo-200/20 select-none"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          404
        </motion.div>
      </div>

      <div 
        className="min-h-screen bg-transparent flex items-center relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-20 left-20 text-blue-500/20"
          animate={bounceAnimation}
        >
          <Ghost size={60} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 right-20 text-purple-500/20"
          animate={rotateAnimation}
        >
          <Compass size={60} />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-40 text-indigo-500/20"
          animate={floatAnimation}
        >
          <Map size={50} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-40 left-40 text-pink-500/20"
          animate={pulseAnimation}
        >
          <Search size={45} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* Animated 404 badge */}
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-100 to-orange-100 px-3 py-1.5 rounded-full mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[10px] font-medium text-red-700">Error 404</span>
              </motion.div>

              {/* Main heading with animated numbers */}
              <motion.h1 
                variants={fadeInUp}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3"
              >
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Opps! Page not found
                </span>
              </motion.h1>

              {/* Animated error message */}
              <motion.div 
                variants={fadeInUp}
                className="relative"
              >
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto lg:mx-0 mb-4">
                  Something went wrong. It's look like the link is broken or
                  the page is removed.
                </p>
                
                {/* Rotating joke */}
                <motion.div 
                  key={jokeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6"
                >
                  <p className="text-[9px] text-blue-600 bg-blue-50 inline-block px-3 py-1.5 rounded-full">
                    {errorJokes[jokeIndex]}
                  </p>
                </motion.div>
              </motion.div>

              {/* Action buttons */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              >
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden shadow-lg w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      <Home className="w-3.5 h-3.5" />
                      Home
                      <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.history.back()}
                  className="group relative border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                    Go Back
                  </span>
                </motion.button>

                {/* Fun surprise button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowJoke(!showJoke)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                  title="Click for a surprise!"
                >
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </motion.button>
              </motion.div>

              {/* Fun surprise message */}
              <AnimatePresence>
                {showJoke && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <p className="text-[9px] text-purple-700 flex items-center gap-1.5">
                      <Heart className="w-3 h-3" />
                      Did you know? The first 404 error was reported in 1992!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick links */}
              <motion.div 
                variants={fadeInUp}
                className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3"
              >
                <p className="text-[8px] text-gray-400">Try these instead:</p>
                {['/jobs', '/candidates', '/about_us', '/contact'].map((path, i) => (
                  <Link key={path} href={path}>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-[8px] text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                      {path.replace('/', '').replace('_', ' ')}
                    </motion.span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              variants={fadeInScale}
              initial="hidden"
              animate="visible"
              className="flex justify-center relative"
            >
              {/* Animated glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Main image with parallax effect */}
              <motion.div
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                }}
                transition={{ type: "spring", stiffness: 50 }}
                className="relative"
              >
                <Image
                  src="/assets/not-found.png"
                  alt="404 Robot Illustration"
                  width={400}
                  height={400}
                  className="max-w-full h-auto relative z-10 drop-shadow-2xl"
                  priority
                />
                
                {/* Floating elements around the robot */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white shadow-xl"
                  animate={floatAnimation}
                >
                  <Frown className="w-6 h-6" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-5 -left-5 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-xl"
                  animate={bounceAnimation}
                >
                  <Meh className="w-5 h-5" />
                </motion.div>
                
                <motion.div 
                  className="absolute top-20 -left-10 w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white shadow-xl"
                  animate={rotateAnimation}
                >
                  <Smile className="w-6 h-6" />
                </motion.div>
                
                {/* Floating 404 text */}
                <motion.div 
                  className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  animate={pulseAnimation}
                >
                  404
                </motion.div>
                
                {/* Zapping effect */}
                <motion.div 
                  className="absolute -right-5 bottom-10"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-[8px] text-gray-400 flex items-center justify-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              Lost in cyberspace? Don't worry, it happens to the best of us.
              <Coffee className="w-2.5 h-2.5 ml-1" />
            </p>
          </motion.div>
        </div>
      </div>

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