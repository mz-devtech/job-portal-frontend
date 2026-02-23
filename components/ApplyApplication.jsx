"use client";

import { X, Bold, Italic, List, Link, Type, Underline, Upload, Loader2, FileText, Sparkles, CheckCircle, AlertCircle, Globe, Paperclip, Send, Eye, EyeOff, HelpCircle, Zap, Award, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applicationService } from "@/services/applicationService";

export default function ApplyApplication({ open, onClose, jobId, jobTitle, company, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlText, setUrlText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [activeTab, setActiveTab] = useState('write');
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.05
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

  const shimmerAnimation = {
    animate: {
      x: ['-100%', '200%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  useEffect(() => {
    if (editorRef.current && open) {
      editorRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (coverLetter) {
      const text = editorRef.current?.innerText || '';
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setCharCount(text.length);
    }
  }, [coverLetter]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setError("");
    
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setError("Please upload PDF, DOC, DOCX, TXT, or RTF files only");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
    updateFormatState();
    editorRef.current.focus();
  };

  const updateFormatState = () => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    }
  };

  const handleInsertLink = () => {
    setShowUrlModal(true);
  };

  const insertLink = () => {
    if (!urlInput.trim() || !urlText.trim()) {
      setError("Please enter both URL and link text");
      return;
    }
    
    // Add https:// if missing
    let finalUrl = urlInput.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const anchor = document.createElement('a');
      anchor.href = finalUrl;
      anchor.textContent = urlText;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'text-blue-600 hover:text-blue-800 underline decoration-2 decoration-blue-300';
      
      range.deleteContents();
      range.insertNode(anchor);
      
      // Move cursor after the link
      const newRange = document.createRange();
      newRange.setStartAfter(anchor);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    
    setShowUrlModal(false);
    setUrlInput("");
    setUrlText("");
    setError("");
    editorRef.current.focus();
  };

  const handleList = (type) => {
    document.execCommand(type, false, null);
    editorRef.current.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setCoverLetter(editorRef.current.innerHTML);
      const text = editorRef.current.innerText || '';
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!selectedFile) {
      setError("Please upload a resume to continue");
      return;
    }
    
    const plainText = editorRef.current ? 
      editorRef.current.innerText.trim() : 
      coverLetter.replace(/<[^>]*>/g, '').trim();
    
    if (!plainText) {
      setError("Please write a cover letter");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('resume', selectedFile);
      formData.append('coverLetter', coverLetter);
      
      // Submit application
      await applicationService.applyForJob(jobId, formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        resetForm();
        setSuccess(false);
        onClose();
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
      
    } catch (error) {
      console.error("Application submission error:", error);
      setError(error.response?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCoverLetter("");
    setSelectedFile(null);
    setUrlInput("");
    setUrlText("");
    setError("");
    setWordCount(0);
    setCharCount(0);
    setActiveTab('write');
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    { icon: <Bold className="w-3.5 h-3.5" />, command: 'bold', label: 'Bold', shortcut: 'Ctrl+B', active: isBold, color: 'from-blue-500 to-indigo-500' },
    { icon: <Italic className="w-3.5 h-3.5" />, command: 'italic', label: 'Italic', shortcut: 'Ctrl+I', active: isItalic, color: 'from-green-500 to-emerald-500' },
    { icon: <Underline className="w-3.5 h-3.5" />, command: 'underline', label: 'Underline', shortcut: 'Ctrl+U', active: isUnderline, color: 'from-purple-500 to-pink-500' },
    { type: 'divider' },
    { icon: <List className="w-3.5 h-3.5" />, command: 'insertUnorderedList', label: 'Bullet List', active: false, color: 'from-amber-500 to-orange-500' },
    { icon: <Type className="w-3.5 h-3.5" />, command: 'insertOrderedList', label: 'Numbered List', active: false, color: 'from-cyan-500 to-teal-500' },
    { type: 'divider' },
    { icon: <Link className="w-3.5 h-3.5" />, action: handleInsertLink, label: 'Insert Link', shortcut: 'Ctrl+K', active: false, color: 'from-red-500 to-rose-500' },
    { icon: <Globe className="w-3.5 h-3.5" />, action: () => setShowPreview(!showPreview), label: showPreview ? 'Hide Preview' : 'Show Preview', active: showPreview, color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* URL Insert Modal */}
          <AnimatePresence>
            {showUrlModal && (
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-[70] flex items-center justify-center p-4"
              >
                <motion.div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowUrlModal(false)}
                />
                
                <motion.div 
                  variants={modalVariants}
                  className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                      <Link className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800">Insert Link</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">
                        Link Text
                      </label>
                      <input
                        type="text"
                        value={urlText}
                        onChange={(e) => setUrlText(e.target.value)}
                        placeholder="e.g., My Portfolio"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUrlModal(false);
                        setUrlInput("");
                        setUrlText("");
                      }}
                      className="px-3 py-1.5 text-[10px] text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                    >
                      Insert Link
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Application Modal */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Decorative gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-2xl"></div>
              
              {/* Success Overlay */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-center"
                    >
                      <div className="relative inline-block mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <motion.div 
                          className="absolute inset-0 bg-green-500 rounded-full blur-xl"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Application Submitted!</h3>
                      <p className="text-[10px] text-gray-500">Your application has been sent successfully.</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-5 py-3 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
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
                      <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        Apply for Job
                        <Sparkles className="w-3 h-3 text-blue-500" />
                      </h2>
                      <p className="text-[9px] text-gray-500 line-clamp-1">
                        {jobTitle} at {company}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-300"
                    type="button"
                  >
                    <X size={16} className="text-gray-500" />
                  </motion.button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-1 mt-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                        (selectedFile && (step === 1 || step === 2 || step === 3)) ||
                        (coverLetter && step === 2) ||
                        step === 1
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          : 'bg-gray-200'
                      }`} />
                      {step < 3 && <div className="w-1" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-[10px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Field 1: Resume Upload */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-blue-500" />
                    Upload Resume *
                  </label>
                  
                  {!selectedFile ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 overflow-hidden group"
                    >
                      {/* Shine effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={shimmerAnimation}
                      />
                      
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Upload size={28} className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </motion.div>
                        <div className="text-center">
                          <span className="text-[10px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                            Click to upload resume
                          </span>
                          <p className="text-[8px] text-gray-400 mt-0.5">
                            PDF, DOC, DOCX, TXT up to 5MB
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                            <FileText size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-gray-800">
                              {selectedFile.name}
                            </p>
                            <p className="text-[8px] text-gray-500">
                              {formatFileSize(selectedFile.size)}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setError("");
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.div>

                {/* Field 2: Rich Text Editor */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-[10px] font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-500" />
                    Cover Letter *
                  </label>
                  
                  {/* Tabs */}
                  <div className="flex gap-1 mb-2">
                    {['write', 'preview'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-lg text-[8px] font-medium transition-all duration-300 ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tab === 'write' ? 'Write' : 'Preview'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Editor Toolbar - only show when in write mode */}
                  {activeTab === 'write' && (
                    <motion.div 
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-wrap items-center gap-0.5 p-1.5 border border-gray-200 rounded-t-lg bg-gradient-to-r from-gray-50 to-white"
                    >
                      {toolbarButtons.map((btn, index) => {
                        if (btn.type === 'divider') {
                          return <div key={`divider-${index}`} className="w-px h-4 bg-gray-300 mx-0.5" />;
                        }
                        
                        return (
                          <motion.button
                            key={btn.label}
                            variants={fadeInUp}
                            type="button"
                            onClick={() => btn.action ? btn.action() : handleFormat(btn.command)}
                            onMouseEnter={() => setHoveredButton(btn.label)}
                            onMouseLeave={() => setHoveredButton(null)}
                            className={`relative p-1.5 rounded transition-all duration-200 group ${
                              btn.active 
                                ? `bg-gradient-to-r ${btn.color} text-white shadow-sm`
                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600'
                            }`}
                            title={btn.label}
                          >
                            {btn.icon}
                            
                            {/* Tooltip */}
                            {hoveredButton === btn.label && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[6px] px-1.5 py-0.5 rounded whitespace-nowrap z-20"
                              >
                                {btn.label} {btn.shortcut && `(${btn.shortcut})`}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 rotate-45"></div>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                  
                  {/* Editor Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'write' ? (
                      <motion.div
                        key="write"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          ref={editorRef}
                          contentEditable
                          onInput={handleEditorInput}
                          onMouseUp={updateFormatState}
                          onKeyUp={updateFormatState}
                          className="w-full p-3 text-[10px] text-gray-700 min-h-[150px] max-h-[200px] overflow-y-auto border border-t-0 border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 whitespace-pre-wrap bg-white"
                          placeholder="Write your cover letter here..."
                          suppressContentEditableWarning={true}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full p-3 text-[10px] text-gray-700 min-h-[150px] max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white"
                      >
                        {coverLetter ? (
                          <div dangerouslySetInnerHTML={{ __html: coverLetter }} />
                        ) : (
                          <p className="text-gray-400 italic">No content to preview</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-[7px] text-gray-400 flex items-center gap-1">
                      <HelpCircle className="w-2.5 h-2.5" />
                      Use toolbar to format text
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[7px] text-gray-400">
                        <span className="font-medium text-gray-600">{wordCount}</span> words
                      </p>
                      <p className="text-[7px] text-gray-400">
                        <span className={`font-medium ${charCount > 1900 ? 'text-amber-600' : 'text-gray-600'}`}>
                          {charCount}
                        </span>/2000
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Tips Section */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-medium text-gray-700 mb-1">Application Tips:</p>
                      <ul className="space-y-0.5">
                        {[
                          "Tailor your cover letter to the job requirements",
                          "Highlight relevant skills and experience",
                          "Keep it concise and professional"
                        ].map((tip, i) => (
                          <li key={i} className="text-[7px] text-gray-500 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Footer Actions */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-end gap-2 pt-3 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-[10px] text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="relative px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    {/* Shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={shimmerAnimation}
                    />
                    
                    <span className="relative z-10 flex items-center gap-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}