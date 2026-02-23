"use client";
import { useState, useEffect } from "react";
import { jobService } from "@/services/jobService";
import { categoryService } from "@/services/categoryService";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectRole, selectIsLoading } from "@/redux/slices/userSlice";
import { loadUserFromStorage } from "@/redux/slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, MapPin, DollarSign, Calendar, Tag, Users, 
  GraduationCap, Award, Globe, Mail, Link, CheckCircle,
  AlertCircle, Sparkles, Zap, Clock, X, ChevronRight,
  FileText, Building, Heart, Coffee, Gift, Star, Shield,
  Rocket, Target, TrendingUp, BookOpen, Layers
} from "lucide-react";

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

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div 
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl overflow-hidden"
        >
          {/* Decorative gradient line - removed green */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <motion.div 
                  className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-30"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  🎉 Job Posted Successfully!
                </h3>
                <p className="text-xs text-gray-500">
                  You can manage your job in the dashboard
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-gray-700 mb-1">Job Details:</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium">{job.jobTitle}</span>
                <span className="text-gray-300">•</span>
                <span>{job.jobType}</span>
                <span className="text-gray-300">•</span>
                <span>{job.location?.city || 'Remote'}</span>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Promote Your Job for Better Visibility
            </p>

            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <motion.label 
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  promotionType === "feature" 
                    ? "border-blue-600 bg-blue-50 shadow-md" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input 
                    type="radio" 
                    name="promote" 
                    checked={promotionType === "feature"}
                    onChange={() => setPromotionType("feature")}
                    className="mt-0.5 w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <p className="text-xs font-semibold">Featured Job</p>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      Stand out with a featured badge in search results
                    </p>
                  </div>
                </div>
              </motion.label>

              <motion.label 
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                  promotionType === "highlight" 
                    ? "border-orange-500 bg-orange-50 shadow-md" 
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  <input 
                    type="radio" 
                    name="promote" 
                    checked={promotionType === "highlight"}
                    onChange={() => setPromotionType("highlight")}
                    className="mt-0.5 w-4 h-4 text-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <p className="text-xs font-semibold">Highlight Job</p>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      Colorful background for maximum visibility
                    </p>
                  </div>
                </div>
              </motion.label>
            </div>

            <div className="flex items-center justify-between">
              <button 
                onClick={onClose} 
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePromote}
                className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-1">
                  Promote Job
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---------- Field Component ---------- */
function Field({ label, children, error, required, icon }) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-600">
        {icon && <span className="text-blue-500">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
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
  const [activeSection, setActiveSection] = useState('basic');
  
  // Add state for dynamic categories
  const [jobCategories, setJobCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

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
    jobCategory: "",
    tags: "",
    benefits: [],
    applicationMethod: "Platform",
    applicationEmail: "",
    applicationUrl: "",
    expirationDate: "",
  });

  const [cities, setCities] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState(new Set());

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

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

  // Fetch job categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isClient) return;
      
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        
        console.log("📥 Fetching job categories from database...");
        const categories = await categoryService.getJobCategories();
        
        console.log("✅ Categories fetched successfully:", categories);
        setJobCategories(categories);
        
        // Set default category if categories exist
        if (categories.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            jobCategory: categories[0]._id || categories[0].name 
          }));
        }
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
        setCategoriesError("Failed to load categories");
        
        // Fallback to mock data if API fails
        const mockCategories = [
          { _id: "1", name: "IT & Software" },
          { _id: "2", name: "Marketing" },
          { _id: "3", name: "Sales" },
          { _id: "4", name: "Design" },
          { _id: "5", name: "Finance" },
          { _id: "6", name: "Healthcare" },
          { _id: "7", name: "Education" },
          { _id: "8", name: "Engineering" },
        ];
        setJobCategories(mockCategories);
        setFormData(prev => ({ ...prev, jobCategory: mockCategories[0]._id }));
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [isClient]);

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
    if (!formData.jobCategory) newErrors.jobCategory = "Job category is required";
    
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
      
      // Find the selected category name from ID
      let categoryName = formData.jobCategory;
      if (jobCategories.length > 0) {
        const selectedCategory = jobCategories.find(cat => 
          cat._id === formData.jobCategory || cat.name === formData.jobCategory
        );
        if (selectedCategory) {
          categoryName = selectedCategory.name;
        }
      }
      
      // Prepare data for API
      const jobData = {
        ...formData,
        jobCategory: categoryName,
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : 0,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : 0,
        vacancies: parseInt(formData.vacancies) || 1,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [],
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

  // Form sections for navigation
  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
    { id: 'details', label: 'Job Details', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'benefits', label: 'Benefits', icon: <Gift className="w-4 h-4" /> },
    { id: 'application', label: 'Application', icon: <Mail className="w-4 h-4" /> },
  ];

  // Show loading state while checking authentication, loading user, or loading categories
  if (!isClient || isLoading || !authChecked || categoriesLoading) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <motion.div 
              className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {categoriesLoading ? "Loading categories..." : "Loading..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white px-4 py-6 sm:px-6 md:ml-[260px] md:w-[calc(100%-260px)] md:overflow-y-auto">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/30 to-purple-50/30" />
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="max-w-5xl rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg opacity-30 blur"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div>
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-1">
                Post a New Job
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </h2>
              <p className="text-xs text-gray-500">
                Fill in the details below to create your job listing
              </p>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="mb-5 flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.icon}
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Basic Information */}
          <AnimatePresence mode="wait">
            {activeSection === 'basic' && (
              <motion.div
                key="basic"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-3">
                  <Field 
                    label="Job Title" 
                    required 
                    error={errors.jobTitle}
                    icon={<Briefcase className="w-4 h-4" />}
                  >
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="e.g., Senior React Developer, Marketing Manager"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>

                  <Field 
                    label="Job Description" 
                    required 
                    error={errors.jobDescription}
                    icon={<FileText className="w-4 h-4" />}
                  >
                    <textarea
                      rows={5}
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                      placeholder="Describe the job responsibilities, requirements, and expectations..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 resize-none"
                    />
                  </Field>
                </div>
              </motion.div>
            )}

            {/* Job Details */}
            {activeSection === 'details' && (
              <motion.div
                key="details"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Job Details
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Job Type" required icon={<Briefcase className="w-4 h-4" />}>
                    <select
                      value={formData.jobType}
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Experience Level" required icon={<TrendingUp className="w-4 h-4" />}>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Education Level" required icon={<GraduationCap className="w-4 h-4" />}>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) => handleInputChange("educationLevel", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </Field>

                  <Field 
                    label="Job Category" 
                    required 
                    error={errors.jobCategory}
                    icon={<Layers className="w-4 h-4" />}
                  >
                    <select
                      value={formData.jobCategory}
                      onChange={(e) => handleInputChange("jobCategory", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categoriesError && (
                      <p className="mt-1 text-[9px] text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Using offline categories
                      </p>
                    )}
                  </Field>

                  <Field 
                    label="Vacancies" 
                    required 
                    icon={<Users className="w-4 h-4" />}
                  >
                    <input
                      type="number"
                      min="1"
                      value={formData.vacancies}
                      onChange={(e) => handleInputChange("vacancies", e.target.value)}
                      placeholder="Number of openings"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>

                  <Field label="Tags" icon={<Tag className="w-4 h-4" />}>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="react, javascript, remote, startup"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                    <p className="mt-1 text-[9px] text-gray-400">Separate tags with commas</p>
                  </Field>
                </div>
              </motion.div>
            )}

            {/* Salary Information */}
            {activeSection === 'salary' && (
              <motion.div
                key="salary"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Salary Information
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Min Salary" icon={<DollarSign className="w-4 h-4" />}>
                    <input
                      type="number"
                      min="0"
                      value={formData.minSalary}
                      onChange={(e) => handleInputChange("minSalary", e.target.value)}
                      placeholder="Minimum"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>

                  <Field label="Max Salary" error={errors.maxSalary} icon={<DollarSign className="w-4 h-4" />}>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxSalary}
                      onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                      placeholder="Maximum"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>

                  <Field label="Currency" icon={<DollarSign className="w-4 h-4" />}>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      {currencies.map(currency => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isNegotiable}
                        onChange={(e) => handleInputChange("isNegotiable", e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                        Negotiable
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Location Information */}
            {activeSection === 'location' && (
              <motion.div
                key="location"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Location Information
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field 
                    label="Country" 
                    required 
                    error={errors.country}
                    icon={<Globe className="w-4 h-4" />}
                  >
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    >
                      <option value="">Select a country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </Field>

                  <Field 
                    label="City" 
                    required 
                    error={errors.city}
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!formData.country}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Address" icon={<MapPin className="w-4 h-4" />}>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Street address, building, etc."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 sm:col-span-2"
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={(e) => handleInputChange("isRemote", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                      Fully Remote Position – Worldwide
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Job Benefits */}
            {activeSection === 'benefits' && (
              <motion.div
                key="benefits"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Gift className="w-4 h-4 text-blue-600" />
                  Job Benefits
                </h3>
                
                <p className="text-xs text-gray-500 mb-2">Select benefits offered with this job</p>
                
                <div className="flex flex-wrap gap-1.5">
                  {jobBenefits.map(benefit => {
                    const icons = {
                      "Health Insurance": <Shield className="w-3.5 h-3.5" />,
                      "Paid Time Off": <Calendar className="w-3.5 h-3.5" />,
                      "Remote Work": <Globe className="w-3.5 h-3.5" />,
                      "Flexible Hours": <Clock className="w-3.5 h-3.5" />,
                      "401k Matching": <DollarSign className="w-3.5 h-3.5" />,
                      "Gym Membership": <Zap className="w-3.5 h-3.5" />,
                      "Stock Options": <TrendingUp className="w-3.5 h-3.5" />,
                      "Learning Budget": <BookOpen className="w-3.5 h-3.5" />,
                    };
                    return (
                      <motion.button
                        key={benefit}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBenefitToggle(benefit)}
                        className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition-all duration-300 ${
                          selectedBenefits.has(benefit)
                            ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600"
                        }`}
                      >
                        {icons[benefit] || <Heart className="w-3.5 h-3.5" />}
                        {benefit}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Application Information */}
            {activeSection === 'application' && (
              <motion.div
                key="application"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Application Information
                </h3>
                
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    How should candidates apply?
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { value: "Platform", label: "On Platform", icon: <Building className="w-3.5 h-3.5" /> },
                      { value: "External", label: "External Link", icon: <Link className="w-3.5 h-3.5" /> },
                      { value: "Email", label: "Via Email", icon: <Mail className="w-3.5 h-3.5" /> },
                    ].map(method => (
                      <motion.label
                        key={method.value}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-1.5 rounded-lg border p-2.5 cursor-pointer transition-all duration-300 ${
                          formData.applicationMethod === method.value
                            ? "border-blue-600 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="applicationMethod"
                          value={method.value}
                          checked={formData.applicationMethod === method.value}
                          onChange={(e) => handleInputChange("applicationMethod", e.target.value)}
                          className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                        />
                        {method.icon}
                        <span className="text-xs">{method.label}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {formData.applicationMethod === "Email" && (
                  <Field 
                    label="Application Email" 
                    required 
                    error={errors.applicationEmail}
                    icon={<Mail className="w-4 h-4" />}
                  >
                    <input
                      type="email"
                      value={formData.applicationEmail}
                      onChange={(e) => handleInputChange("applicationEmail", e.target.value)}
                      placeholder="careers@company.com"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>
                )}

                {formData.applicationMethod === "External" && (
                  <Field 
                    label="Application URL" 
                    required 
                    error={errors.applicationUrl}
                    icon={<Link className="w-4 h-4" />}
                  >
                    <input
                      type="url"
                      value={formData.applicationUrl}
                      onChange={(e) => handleInputChange("applicationUrl", e.target.value)}
                      placeholder="https://company.com/careers/apply"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                    />
                  </Field>
                )}

                <Field 
                  label="Expiration Date" 
                  required 
                  error={errors.expirationDate}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  <input
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                  />
                  <p className="mt-1 text-[9px] text-gray-400">
                    Job will automatically expire on this date
                  </p>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || (isClient && userRole !== "employer") || categoriesLoading}
              className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></span>
                  <span className="relative z-10">Posting Job...</span>
                </>
              ) : (
                <span className="relative z-10 flex items-center gap-1">
                  Post Job
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              )}
            </motion.button>
          </div>
        </motion.form>
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