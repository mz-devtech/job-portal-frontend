"use client";

import { X, Bold, Italic, List, Link, Type, Underline, Upload, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ApplyApplication({ open, onClose, jobTitle, company }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlText, setUrlText] = useState("");
  const [resumeOptions, setResumeOptions] = useState([
    { id: 1, name: "Select a resume...", value: "" },
    { id: 2, name: "Resume_2024.pdf", value: "resume_2024.pdf" },
    { id: 3, name: "Resume_Designer.pdf", value: "resume_designer.pdf" },
    { id: 4, name: "Resume_Developer.pdf", value: "resume_developer.pdf" },
  ]);
  
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
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
        return;
      }
      
      // Check file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert("Please upload PDF, DOC, or DOCX files only");
        return;
      }
      
      setSelectedFile(file);
      
      // Add new option to dropdown
      const newResume = {
        id: Date.now(),
        name: file.name,
        value: `uploaded_${file.name}`
      };
      
      setResumeOptions(prev => [newResume, ...prev]);
      setSelectedResume(newResume.value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedResume) {
      alert("Please select or upload a resume to continue");
      return;
    }
    
    const plainText = editorRef.current ? 
      editorRef.current.innerText.trim() : 
      coverLetter.replace(/<[^>]*>/g, '').trim();
    
    if (!plainText) {
      alert("Please write a cover letter");
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare form data for upload
    const formData = new FormData();
    if (selectedFile) {
      formData.append('resume', selectedFile);
    }
    formData.append('coverLetter', coverLetter);
    formData.append('jobTitle', jobTitle);
    formData.append('company', company);
    formData.append('selectedResume', selectedResume);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Application submitted:', {
        jobTitle,
        company,
        resume: selectedResume,
        file: selectedFile?.name,
        coverLetter
      });
      
      setIsSubmitting(false);
      onClose();
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setCoverLetter("");
    setSelectedResume("");
    setSelectedFile(null);
    setUrlInput("");
    setUrlText("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
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
          onClick={onClose}
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
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Field 1: Resume Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Resume *
              </label>
              
              <div className="space-y-4">
                {/* Dropdown for existing resumes */}
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {resumeOptions.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
                
                {/* Upload section */}
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">or</div>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition flex flex-col items-center justify-center gap-2"
                  >
                    <Upload size={20} className="text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Upload from device
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                    </div>
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                            <Upload size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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

            {/* Editor Instructions */}
            <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-1">How to use the editor:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Select text</strong> and click buttons to format</li>
                <li>Click <strong>List button</strong> to create bullet points</li>
                <li>Click <strong>Link button</strong> to insert clickable URLs</li>
                <li>Use <strong>keyboard shortcuts</strong>: Ctrl+B, Ctrl+I, Ctrl+U</li>
              </ul>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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