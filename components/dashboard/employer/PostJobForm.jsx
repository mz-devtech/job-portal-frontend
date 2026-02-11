"use client";
import { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectRole, selectIsLoading } from "@/redux/slices/userSlice";
import { loadUserFromStorage } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/* ---------- Success Modal ---------- */
function JobSuccessModal({ job, onClose, onPromote }) {
  const [promotionType, setPromotionType] = useState("feature");

  const handlePromote = async () => {
    try {
      await onPromote(job._id, promotionType, true);
      toast.success(`Job ${promotionType}d successfully!`);
      onClose();
    } catch (error) {
      console.error("Promotion error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold text-gray-900">
          🎉 Congratulations, Your Job is successfully posted!
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You can manage your job in the my-jobs section of your dashboard
        </p>

        <button
          onClick={() => window.location.href = "/employer/jobs"}
          className="mt-3 rounded-md border px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          View Jobs →
        </button>

        <p className="mt-6 mb-3 text-sm font-medium text-gray-900">
          Promote Job: {job.jobTitle}
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <label 
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              promotionType === "feature" 
                ? "border-blue-600 bg-blue-50" 
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <div className="flex gap-3">
              <input 
                type="radio" 
                name="promote" 
                checked={promotionType === "feature"}
                onChange={() => setPromotionType("feature")}
              />
              <div>
                <p className="text-sm font-semibold">Featured Your Job</p>
                <p className="text-xs text-gray-500">
                  Make your job stand out in search results with a featured badge.
                </p>
              </div>
            </div>
          </label>

          <label 
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              promotionType === "highlight" 
                ? "border-orange-500 bg-orange-50" 
                : "border-gray-300 hover:border-orange-400"
            }`}
          >
            <div className="flex gap-3">
              <input 
                type="radio" 
                name="promote" 
                checked={promotionType === "highlight"}
                onChange={() => setPromotionType("highlight")}
              />
              <div>
                <p className="text-sm font-semibold">Highlight Your Job</p>
                <p className="text-xs text-gray-500">
                  Highlight your job listing with a colored background for more visibility.
                </p>
              </div>
            </div>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-gray-500">
            Skip Now
          </button>
          <button 
            onClick={handlePromote}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Promote Job →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Field Component ---------- */
function Field({ label, children, error, required }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function PostJobForm() {
  const user = useSelector(selectUser);
  const userRole = useSelector(selectRole);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: "Full-time",
    minSalary: "",
    maxSalary: "",
    currency: "USD",
    isNegotiable: false,
    country: "",
    city: "",
    address: "",
    isRemote: false,
    experienceLevel: "Entry Level",
    educationLevel: "Bachelor's Degree",
    vacancies: "1",
    jobCategory: "IT & Software",
    tags: "",
    benefits: [],
    applicationMethod: "Platform",
    applicationEmail: "",
    applicationUrl: "",
    expirationDate: "",
  });

  const [cities, setCities] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState(new Set());

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load user from storage on component mount (client-side only)
  useEffect(() => {
    if (isClient) {
      console.log("🔍 Component mounted, loading user from storage...");
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, isClient]);

  // Set application email when user data is available
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ 
        ...prev, 
        applicationEmail: user.email 
      }));
    }
  }, [user]);

  // Initialize cities when country changes
  useEffect(() => {
    if (formData.country) {
      const citiesList = jobService.getCitiesByCountry(formData.country);
      setCities(citiesList);
      if (!citiesList.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: citiesList[0] || "" }));
      }
    }
  }, [formData.country]);

  // Authentication check - Client-side only
  useEffect(() => {
    if (!isClient) return;

    console.log("🔐 Auth check - Current state:", {
      isLoading,
      userRole,
      user,
      authChecked,
    });

    // If still loading from Redux, wait
    if (isLoading) {
      console.log("⏳ Still loading user data...");
      return;
    }

    // If we've already checked auth, don't check again
    if (authChecked) {
      console.log("✅ Auth already checked, skipping...");
      return;
    }

    console.log("✅ Redux loading complete, checking auth...");
    setAuthChecked(true);

    // Check if user exists in Redux store
    if (user && userRole === "employer") {
      console.log("✅ User is employer (from Redux), allowing access");
      return;
    }

    // If Redux doesn't have user data, check localStorage directly
    console.log("🔍 Checking localStorage for auth data...");
    
    // Check multiple possible storage locations
    const checkAuth = () => {
      // Check localStorage
      const storedUserStr = localStorage.getItem("user");
      const storedRole = localStorage.getItem("userRole");
      const storedToken = localStorage.getItem("token");
      
      // Check cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      const cookieUser = getCookie("user");
      const cookieRole = getCookie("userRole");
      const cookieToken = getCookie("token");
      
      return {
        localStorage: {
          user: storedUserStr ? JSON.parse(storedUserStr) : null,
          role: storedRole,
          token: storedToken
        },
        cookies: {
          user: cookieUser ? JSON.parse(cookieUser) : null,
          role: cookieRole,
          token: cookieToken
        }
      };
    };

    const authData = checkAuth();
    console.log("📊 Auth data found:", authData);

    // Check if any storage has employer data
    const isEmployer = 
      (authData.localStorage.user?.role === "employer") ||
      (authData.cookies.user?.role === "employer") ||
      (authData.localStorage.role === "employer") ||
      (authData.cookies.role === "employer");

    if (isEmployer) {
      console.log("✅ Employer found in storage, but Redux not updated yet");
      
      // Force Redux to update by reloading the page once
      if (!user && !userRole) {
        console.log("🔄 Forcing Redux update by reloading page...");
        // Give Redux a moment to update, then reload if still not updated
        setTimeout(() => {
          if (!user || !userRole) {
            console.log("🔄 Still no Redux data, reloading page...");
            window.location.reload();
          }
        }, 500);
      }
      return;
    }

    // If no employer found anywhere, redirect to login
    console.log("❌ No employer auth data found anywhere, redirecting to login...");
    toast.error("Please login as an employer to post jobs");
    router.push("/login");
  }, [isLoading, user, userRole, authChecked, router, isClient]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBenefitToggle = (benefit) => {
    const newSelectedBenefits = new Set(selectedBenefits);
    if (newSelectedBenefits.has(benefit)) {
      newSelectedBenefits.delete(benefit);
    } else {
      newSelectedBenefits.add(benefit);
    }
    setSelectedBenefits(newSelectedBenefits);
    handleInputChange("benefits", Array.from(newSelectedBenefits));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required";
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Job description is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.expirationDate) newErrors.expirationDate = "Expiration date is required";
    
    // Salary validation
    if (formData.minSalary && formData.maxSalary) {
      const min = parseFloat(formData.minSalary);
      const max = parseFloat(formData.maxSalary);
      if (min > max) newErrors.maxSalary = "Maximum salary must be greater than minimum salary";
    }
    
    // Application method validation
    if (formData.applicationMethod === "Email" && !formData.applicationEmail) {
      newErrors.applicationEmail = "Email is required for email applications";
    }
    if (formData.applicationMethod === "External" && !formData.applicationUrl) {
      newErrors.applicationUrl = "URL is required for external applications";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final role check before submitting
    if (userRole !== "employer") {
      // Double check localStorage as fallback
      if (isClient) {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole !== "employer") {
          toast.error("Only employers can post jobs");
          return;
        }
      } else {
        toast.error("Only employers can post jobs");
        return;
      }
    }
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("📤 Submitting job data:", formData);
      
      // Prepare data for API
      const jobData = {
        ...formData,
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : 0,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : 0,
        vacancies: parseInt(formData.vacancies) || 1,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        benefits: Array.from(selectedBenefits),
        expirationDate: new Date(formData.expirationDate).toISOString(),
      };
      
      const job = await jobService.createJob(jobData);
      setCreatedJob(job);
      setShowSuccess(true);
      
    } catch (error) {
      console.error("Job submission error:", error);
      toast.error(error.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteJob = async (jobId, action, value) => {
    try {
      await jobService.promoteJob(jobId, action, value);
    } catch (error) {
      console.error("Promotion error:", error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const jobBenefits = jobService.getJobBenefits();
  const countries = jobService.getCountries();
  const currencies = jobService.getCurrencies();
  const jobTypes = jobService.getJobTypes();
  const experienceLevels = jobService.getExperienceLevels();
  const educationLevels = jobService.getEducationLevels();
  const jobCategories = jobService.getJobCategories();

  // Show loading state while checking authentication or loading user
  // Server will render loading state, client will continue
  if (!isClient || isLoading || !authChecked) {
    return (
      <div className="w-full min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show unauthorized message here - let useEffect handle redirect
  // If we reach this point, user should be authorized

  return (
    <>
      <main className="w-full min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl rounded-lg bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Post a Job
          </h2>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <Field label="Job Title" required error={errors.jobTitle}>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="e.g., Senior React Developer, Marketing Manager"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>

              <Field label="Job Description" required error={errors.jobDescription}>
                <textarea
                  rows={6}
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  placeholder="Describe the job responsibilities, requirements, and expectations..."
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>
            </div>
          </div>

          {/* Job Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Job Details</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Job Type" required>
                <select
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Experience Level" required>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </Field>

              <Field label="Education Level" required>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </Field>

              <Field label="Job Category" required>
                <select
                  value={formData.jobCategory}
                  onChange={(e) => handleInputChange("jobCategory", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  {jobCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </Field>

              <Field label="Vacancies" required>
                <input
                  type="number"
                  min="1"
                  value={formData.vacancies}
                  onChange={(e) => handleInputChange("vacancies", e.target.value)}
                  placeholder="Number of openings"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>

              <Field label="Tags">
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="react, javascript, remote, startup"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
                <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
              </Field>
            </div>
          </div>

          {/* Salary Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Salary Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Min Salary">
                <input
                  type="number"
                  min="0"
                  value={formData.minSalary}
                  onChange={(e) => handleInputChange("minSalary", e.target.value)}
                  placeholder="Minimum salary"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>

              <Field label="Max Salary" error={errors.maxSalary}>
                <input
                  type="number"
                  min="0"
                  value={formData.maxSalary}
                  onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                  placeholder="Maximum salary"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>

              <Field label="Currency">
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNegotiable}
                    onChange={(e) => handleInputChange("isNegotiable", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Salary is negotiable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-6 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Location Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Country" required error={errors.country}>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </Field>

              <Field label="City" required error={errors.city}>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!formData.country}
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </Field>

              <Field label="Address">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address, building, etc."
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) => handleInputChange("isRemote", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Fully Remote Position – Worldwide</span>
              </label>
            </div>
          </div>

          {/* Job Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Job Benefits</h3>
            <p className="mb-3 text-sm text-gray-600">Select benefits offered with this job</p>
            
            <div className="flex flex-wrap gap-2">
              {jobBenefits.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => handleBenefitToggle(benefit)}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-all ${
                    selectedBenefits.has(benefit)
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          {/* Application Information */}
          <div className="mb-6 rounded-md bg-gray-50 p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Application Information</h3>
            
            <div className="mb-4">
              <p className="mb-3 text-sm font-medium text-gray-700">
                How should candidates apply?
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <label className={`flex items-center gap-2 rounded-md border bg-white p-3 text-sm cursor-pointer transition-all ${
                  formData.applicationMethod === "Platform" ? "border-blue-600" : ""
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="Platform"
                    checked={formData.applicationMethod === "Platform"}
                    onChange={(e) => handleInputChange("applicationMethod", e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  On Jobpilot Platform
                </label>
                
                <label className={`flex items-center gap-2 rounded-md border bg-white p-3 text-sm cursor-pointer transition-all ${
                  formData.applicationMethod === "External" ? "border-blue-600" : ""
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="External"
                    checked={formData.applicationMethod === "External"}
                    onChange={(e) => handleInputChange("applicationMethod", e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  External Platform/Website
                </label>
                
                <label className={`flex items-center gap-2 rounded-md border bg-white p-3 text-sm cursor-pointer transition-all ${
                  formData.applicationMethod === "Email" ? "border-blue-600" : ""
                }`}>
                  <input
                    type="radio"
                    name="applicationMethod"
                    value="Email"
                    checked={formData.applicationMethod === "Email"}
                    onChange={(e) => handleInputChange("applicationMethod", e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Via Email
                </label>
              </div>
            </div>

            {formData.applicationMethod === "Email" && (
              <Field label="Application Email" required error={errors.applicationEmail}>
                <input
                  type="email"
                  value={formData.applicationEmail}
                  onChange={(e) => handleInputChange("applicationEmail", e.target.value)}
                  placeholder="careers@company.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>
            )}

            {formData.applicationMethod === "External" && (
              <Field label="Application URL" required error={errors.applicationUrl}>
                <input
                  type="url"
                  value={formData.applicationUrl}
                  onChange={(e) => handleInputChange("applicationUrl", e.target.value)}
                  placeholder="https://company.com/careers/apply"
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </Field>
            )}
          </div>

          {/* Expiration Date */}
          <div className="mb-6">
            <Field label="Expiration Date" required error={errors.expirationDate}>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">
                The job will automatically expire on this date
              </p>
            </Field>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (isClient && userRole !== "employer")}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                Posting Job...
              </>
            ) : (
              "Post Job →"
            )}
          </button>
        </form>
      </main>

      {showSuccess && createdJob && (
        <JobSuccessModal
          job={createdJob}
          onClose={handleCloseSuccess}
          onPromote={handlePromoteJob}
        />
      )}
    </>
  );
}