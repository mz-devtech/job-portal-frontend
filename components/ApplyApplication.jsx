"use client";

import { X, Bold, Italic, List, Link, Type, Underline, Upload, Loader2, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { applicationService } from "@/services/applicationService";

export default function ApplyApplication({ open, onClose, jobId, jobTitle, company, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlText, setUrlText] = useState("");
  const [error, setError] = useState("");
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    if (editorRef.current && open) {
      editorRef.current.focus();
    }
  }, [open]);

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
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setError("Please upload PDF, DOC, or DOCX files only");
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
      alert("Please enter both URL and link text");
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
      anchor.className = 'text-blue-600 hover:text-blue-800 underline';
      
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
    editorRef.current.focus();
  };

  const handleList = (type) => {
    document.execCommand(type, false, null);
    editorRef.current.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setCoverLetter(editorRef.current.innerHTML);
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
      
      // Reset form
      resetForm();
      
      // Close modal
      onClose();
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
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
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* URL Insert Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  placeholder="e.g., My Portfolio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowUrlModal(false);
                  setUrlInput("");
                  setUrlText("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Application Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Apply for Job</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {jobTitle} at {company}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Field 1: Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume *
              </label>
              
              {!selectedFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2"
                >
                  <Upload size={32} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload resume
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setError("");
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Field 2: Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cover Letter *
              </label>
              
              {/* Editor Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
                <button
                  type="button"
                  onClick={() => handleFormat('bold')}
                  className={`p-2 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-300' : ''}`}
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleFormat('italic')}
                  className={`p-2 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-300' : ''}`}
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleFormat('underline')}
                  className={`p-2 rounded hover:bg-gray-200 ${isUnderline ? 'bg-gray-300' : ''}`}
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button
                  type="button"
                  onClick={() => handleList('insertUnorderedList')}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Bullet List"
                >
                  <List size={16} />
                </button>
                
                <button
                  type="button"
                  onClick={() => handleList('insertOrderedList')}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Numbered List"
                >
                  <Type size={16} />
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="p-2 rounded hover:bg-gray-200"
                  title="Insert Link"
                >
                  <Link size={16} />
                </button>
              </div>
              
              {/* Editor Content */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onMouseUp={updateFormatState}
                onKeyUp={updateFormatState}
                className="w-full p-4 text-gray-700 min-h-[200px] max-h-[300px] overflow-y-auto border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-pre-wrap"
                placeholder="Write your cover letter here..."
                suppressContentEditableWarning={true}
              />
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Use toolbar to format text
                </p>
                <p className="text-xs text-gray-500">
                  {editorRef.current?.innerText?.length || 0}/2000 characters
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}