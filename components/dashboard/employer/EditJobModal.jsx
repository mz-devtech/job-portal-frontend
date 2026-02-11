"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { jobService } from "@/services/jobService";
import toast from "react-hot-toast";

export default function EditJobModal({ isOpen, onClose, jobId, onJobUpdated }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    currency: "USD",
    isNegotiable: false,
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    isRemote: false,
    experienceLevel: "",
    educationLevel: "",
    vacancies: 1,
    jobCategory: "",
    tags: [],
    benefits: [],
    applicationMethod: "Platform",
    applicationEmail: "",
    applicationUrl: "",
    expirationDate: "",
    status: "Active",
  });

  const [tagInput, setTagInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  // Load job data when modal opens
  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobData();
    }
  }, [isOpen, jobId]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const job = await jobService.getJobById(jobId);
      
      setFormData({
        jobTitle: job.jobTitle || "",
        jobDescription: job.jobDescription || "",
        jobType: job.jobType || "",
        minSalary: job.salaryRange?.min || "",
        maxSalary: job.salaryRange?.max || "",
        currency: job.salaryRange?.currency || "USD",
        isNegotiable: job.salaryRange?.isNegotiable || false,
        country: job.location?.country || "",
        city: job.location?.city || "",
        state: job.location?.state || "",
        zipCode: job.location?.zipCode || "",
        address: job.location?.address || "",
        isRemote: job.location?.isRemote || false,
        experienceLevel: job.experienceLevel || "",
        educationLevel: job.educationLevel || "",
        vacancies: job.vacancies || 1,
        jobCategory: job.jobCategory || "",
        tags: job.tags || [],
        benefits: job.benefits || [],
        applicationMethod: job.applicationMethod || "Platform",
        applicationEmail: job.applicationEmail || "",
        applicationUrl: job.applicationUrl || "",
        expirationDate: job.expirationDate?.split('T')[0] || "",
        status: job.status || "Active",
      });
      
      setTagInput("");
      setBenefitInput("");
    } catch (error) {
      console.error("Failed to fetch job:", error);
      toast.error("Failed to load job data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.jobTitle || !formData.jobDescription || !formData.jobType || !formData.country || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.expirationDate) <= new Date()) {
      toast.error("Expiration date must be in the future");
      return;
    }

    setSubmitting(true);
    
    try {
      const updateData = {
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        jobType: formData.jobType,
        minSalary: formData.minSalary || 0,
        maxSalary: formData.maxSalary || 0,
        currency: formData.currency,
        isNegotiable: formData.isNegotiable,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        address: formData.address,
        isRemote: formData.isRemote,
        experienceLevel: formData.experienceLevel,
        educationLevel: formData.educationLevel,
        vacancies: formData.vacancies,
        jobCategory: formData.jobCategory,
        tags: formData.tags,
        benefits: formData.benefits,
        applicationMethod: formData.applicationMethod,
        applicationEmail: formData.applicationEmail,
        applicationUrl: formData.applicationUrl,
        expirationDate: formData.expirationDate,
        status: formData.status,
      };

      await jobService.updateJob(jobId, updateData);
      
      toast.success("Job updated successfully!");
      onJobUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error(error.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Job</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the job responsibilities, requirements, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    {jobService.getJobTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Category
                  </label>
                  <select
                    name="jobCategory"
                    value={formData.jobCategory}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {jobService.getJobCategories().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. United States"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. New York"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 10001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address, suite, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isRemote"
                      checked={formData.isRemote}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">This is a remote position</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Compensation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {jobService.getCurrencies().map(curr => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80000"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNegotiable"
                      checked={formData.isNegotiable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Salary is negotiable</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select level</option>
                    {jobService.getExperienceLevels().map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education Level
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select level</option>
                    {jobService.getEducationLevels().map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Tags */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Tags</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Skill/Tag
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. React, Node.js, Python"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-sm text-gray-500">No tags added yet</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Benefit
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                    className="flex-1 border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Health Insurance, 401k"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.benefits.map(benefit => (
                  <span
                    key={benefit}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(benefit)}
                      className="hover:text-green-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-sm text-gray-500">No benefits added yet</p>
                )}
              </div>
            </div>

            {/* Application Settings */}
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Method
                  </label>
                  <select
                    name="applicationMethod"
                    value={formData.applicationMethod}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Platform">Apply via Platform</option>
                    <option value="Email">Email Applications</option>
                    <option value="External">External URL</option>
                  </select>
                </div>

                {formData.applicationMethod === 'Email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Email
                    </label>
                    <input
                      type="email"
                      name="applicationEmail"
                      value={formData.applicationEmail}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="hr@company.com"
                    />
                  </div>
                )}

                {formData.applicationMethod === 'External' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application URL
                    </label>
                    <input
                      type="url"
                      name="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://company.com/careers"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Job'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}