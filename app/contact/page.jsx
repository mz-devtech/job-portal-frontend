"use client";

import DynamicNavbar from "@/components/DynamicNavbar";
import Footer from "@/components/Footer";
import SecondNavbar from "@/components/SecondNavbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you for reaching out! We'll get back to you soon."
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          success: false,
          message: ""
        });
      }, 5000);
    }, 1500);
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

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: "support@jobportal.com",
      subDetails: "careers@jobportal.com",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      subDetails: "Mon-Fri, 9am-6pm",
      color: "from-purple-500 to-pink-500",
      delay: 0.3
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: "123 Business Ave",
      subDetails: "Chicago, IL 60601",
      color: "from-amber-500 to-orange-500",
      delay: 0.4
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Working Hours",
      details: "Monday - Friday",
      subDetails: "9:00 AM - 6:00 PM",
      color: "from-green-500 to-emerald-500",
      delay: 0.5
    }
  ];

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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                Get in Touch
              </motion.span>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
              >
                <span className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">Home</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700 font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Contact</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Top Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-medium mb-3 inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50"
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ✦ Get in Touch
              </span>
            </motion.p>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                We care about
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                customer services
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed"
            >
              Want to chat? We'd love to hear from you! Get in touch
              with our Customer Success Team to inquire about speaking
              events, advertising rates, or just say hello.
            </motion.p>

            {/* Contact Info Cards */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: info.delay }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${info.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${info.color} bg-opacity-10 flex items-center justify-center text-gray-600 group-hover:text-white group-hover:bg-gradient-to-br ${info.color} transition-all duration-300`}>
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-700">{info.title}</h4>
                      <p className="text-xs text-gray-500">{info.details}</p>
                      <p className="text-xs text-gray-400">{info.subDetails}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:shadow-lg overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-2">
                Email Support
                <Send className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl blur-2xl transform rotate-3" />
            
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100">
              {/* Success/Error Message */}
              {formStatus.submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    formStatus.success 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
                  }`}
                >
                  {formStatus.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${
                    formStatus.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {formStatus.message}
                  </p>
                </motion.div>
              )}

              <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group"
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="group"
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="group"
                >
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 bg-white/50 backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="group"
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="4"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 bg-white/50 backdrop-blur-sm resize-none"
                  ></textarea>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:shadow-lg overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* Map Section with animation */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full h-[450px] relative"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* Map container with shadow */}
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              title="Google Map - Chicago"
              src="https://www.google.com/maps?q=Chicago&output=embed"
              className="w-full h-full border-0 transform hover:scale-105 transition-transform duration-1000"
              loading="lazy"
              allowFullScreen
            ></iframe>
            
            {/* Map overlay with location info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Our Headquarters</h4>
                  <p className="text-xs text-gray-500">123 Business Ave, Chicago, IL 60601</p>
                  <p className="text-xs text-blue-600 mt-1">Get Directions →</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </>
  );
}