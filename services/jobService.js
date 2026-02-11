import api from "@/utils/api";
import toast from "react-hot-toast";

export const jobService = {
  // Create a new job
  async createJob(jobData) {
    try {
      console.log("📝 [JOB SERVICE] Creating job:", jobData);

      const response = await api.post("/jobs", jobData);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Job created successfully");
        toast.success(response.data.message || "Job posted successfully!");
        return response.data.job;
      } else {
        throw new Error(response.data.message || "Failed to create job");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Create job error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create job";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get all jobs (with filters)
  async getJobs(filters = {}) {
    try {
      console.log("👤 [JOB SERVICE] Fetching jobs with filters:", filters);

      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Jobs fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Get jobs error:", error);
      throw error;
    }
  },

  // Get single job by ID
  async getJobById(jobId) {
    try {
      console.log("👤 [JOB SERVICE] Fetching job:", jobId);

      const response = await api.get(`/jobs/${jobId}`);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Job fetched successfully");
        return response.data.job;
      } else {
        throw new Error(response.data.message || "Failed to fetch job");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Get job error:", error);

      // Check if it's a 404 error
      if (error.response?.status === 404) {
        throw new Error('Job not found');
      }

      throw error;
    }
  },

  // Check if job is saved (for current user)
  async checkIfJobSaved(jobId) {
    try {
      console.log("🔍 [JOB SERVICE] Checking if job is saved:", jobId);

      const response = await api.get(`/saved-jobs/${jobId}/check`);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Saved status checked");
        return response.data.isSaved;
      } else {
        throw new Error(response.data.message || "Failed to check saved status");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Check saved error:", error);
      return false;
    }
  },

 // Add these methods to your existing jobService.js:

// Get employer's jobs with application counts
async getEmployerJobs(filters = {}) {
  try {
    console.log("👤 [JOB SERVICE] Fetching employer jobs");
    
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/jobs/employer/my-jobs?${queryParams.toString()}`);
    
    if (response.data.success) {
      console.log("✅ [JOB SERVICE] Employer jobs fetched successfully");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch employer jobs");
    }
  } catch (error) {
    console.error("❌ [JOB SERVICE] Get employer jobs error:", error);
    throw error;
  }
},

// Mark job as expired
async expireJob(jobId) {
  try {
    console.log("⏰ [JOB SERVICE] Expiring job:", jobId);
    
    const response = await api.patch(`/jobs/${jobId}/expire`);
    
    if (response.data.success) {
      console.log("✅ [JOB SERVICE] Job expired successfully");
      toast.success(response.data.message || "Job marked as expired");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to expire job");
    }
  } catch (error) {
    console.error("❌ [JOB SERVICE] Expire job error:", error);
    toast.error(error.response?.data?.message || "Failed to expire job");
    throw error;
  }
},

// Get job applications for employer
async getJobApplications(jobId, filters = {}) {
  try {
    console.log("📋 [JOB SERVICE] Fetching applications for job:", jobId);
    
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/jobs/${jobId}/applications?${queryParams.toString()}`);
    
    if (response.data.success) {
      console.log("✅ [JOB SERVICE] Job applications fetched successfully");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch applications");
    }
  } catch (error) {
    console.error("❌ [JOB SERVICE] Get job applications error:", error);
    throw error;
  }
},

  // Update job
  async updateJob(jobId, jobData) {
    try {
      console.log("📝 [JOB SERVICE] Updating job:", jobId);

      const response = await api.put(`/jobs/${jobId}`, jobData);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Job updated successfully");
        toast.success(response.data.message || "Job updated successfully!");
        return response.data.job;
      } else {
        throw new Error(response.data.message || "Failed to update job");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Update job error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update job";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Delete job
  async deleteJob(jobId) {
    try {
      console.log("🗑️ [JOB SERVICE] Deleting job:", jobId);

      const response = await api.delete(`/jobs/${jobId}`);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Job deleted successfully");
        toast.success(response.data.message || "Job deleted successfully!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Delete job error:", error);
      toast.error("Failed to delete job");
      throw error;
    }
  },

  // Promote job (feature/highlight)
  async promoteJob(jobId, action, value) {
    try {
      console.log(`✨ [JOB SERVICE] Promoting job (${action}: ${value}):`, jobId);

      const response = await api.patch(`/jobs/${jobId}/promote`, {
        action,
        value,
      });

      if (response.data.success) {
        console.log(`✅ [JOB SERVICE] Job ${action}d successfully`);
        toast.success(response.data.message || `Job ${action}d successfully!`);
        return response.data.job;
      } else {
        throw new Error(response.data.message || `Failed to ${action} job`);
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Promote job error:", error);
      toast.error(`Failed to ${action} job`);
      throw error;
    }
  },

  // Get job statistics
  async getJobStats() {
    try {
      console.log("📊 [JOB SERVICE] Fetching job statistics");

      const response = await api.get("/jobs/employer/stats");

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Job stats fetched successfully");
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch job statistics");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Get job stats error:", error);
      throw error;
    }
  },

  // Get job categories
  getJobCategories() {
    return [
      "IT & Software",
      "Design & Creative",
      "Sales & Marketing",
      "Finance & Accounting",
      "Human Resources",
      "Customer Service",
      "Healthcare",
      "Education",
      "Engineering",
      "Other",
    ];
  },

  // Get job types
  getJobTypes() {
    return [
      "Full-time",
      "Part-time",
      "Contract",
      "Temporary",
      "Internship",
      "Remote",
      "Freelance",
    ];
  },

  // Get experience levels
  getExperienceLevels() {
    return [
      "Entry Level",
      "Mid Level",
      "Senior Level",
      "Executive",
      "Fresher",
      "0-1 years",
      "1-3 years",
      "3-5 years",
      "5-10 years",
      "10+ years",
    ];
  },

  // Get education levels
  getEducationLevels() {
    return [
      "High School",
      "Diploma",
      "Associate Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "PhD",
      "No Education Required",
      "Any",
    ];
  },

  // Get job benefits
  getJobBenefits() {
    return [
      "401k Salary",
      "Flexible Time",
      "Vision Insurance",
      "Dental Insurance",
      "Medical Insurance",
      "Unlimited Vacation",
      "Stock Share",
      "Paid Maternity",
      "Company Retreats",
      "Learning Budget",
      "Free Gym Membership",
      "Work from Home",
      "Remote Work",
      "Performance Bonus",
      "Health Insurance",
      "Paid Time Off",
      "Professional Development",
      "Stock Options",
      "Parental Leave",
      "Wellness Program",
      "Tuition Reimbursement",
      "Commuter Benefits",
      "Free Lunch",
      "Flexible Spending Account",
      "Life Insurance",
      "Disability Insurance",
      "Pet Insurance",
      "Childcare Assistance",
      "Employee Discounts",
      "Referral Bonuses",
    ];
  },

  // Get countries (sample list - you can expand this)
  getCountries() {
    return [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "India",
      "Bangladesh",
      "Singapore",
      "United Arab Emirates",
      "South Africa",
      "Brazil",
      "Mexico",
      "Spain",
      "Italy",
      "Netherlands",
      "Sweden",
      "Norway",
      "Denmark",
      "Finland",
      "Switzerland",
      "Austria",
      "Belgium",
      "Portugal",
      "Ireland",
      "New Zealand",
      "Malaysia",
      "Thailand",
      "Vietnam",
      "Philippines",
      "Indonesia",
      "Pakistan",
      "Sri Lanka",
      "Nepal",
      "China",
      "South Korea",
      "Russia",
      "Turkey",
      "Egypt",
      "Saudi Arabia",
      "Qatar",
      "Kuwait",
      "Oman",
      "Bahrain",
    ];
  },

  // Get cities by country (sample - you can implement a more complete list)
  getCitiesByCountry(country) {
    const citiesByCountry = {
      "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"],
      "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow", "Edinburgh"],
      "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
      "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra"],
      "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal"],
      "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata"],
    };

    return citiesByCountry[country] || ["Select city"];
  },

  // Get currencies
  getCurrencies() {
    return [
      { value: "USD", label: "US Dollar ($)" },
      { value: "EUR", label: "Euro (€)" },
      { value: "GBP", label: "British Pound (£)" },
      { value: "BDT", label: "Bangladeshi Taka (৳)" },
      { value: "INR", label: "Indian Rupee (₹)" },
      { value: "CAD", label: "Canadian Dollar (C$)" },
      { value: "AUD", label: "Australian Dollar (A$)" },
    ];
  },


// Add/Update these methods in your jobService.js file:

// Search jobs with advanced filters
async searchJobs(filters = {}) {
  try {
    console.log("🔍 [JOB SERVICE] Searching jobs with filters:", filters);
    
    const queryParams = new URLSearchParams();
    
    // Add all filters to query params (only non-empty values)
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        // Handle boolean values
        if (typeof value === 'boolean') {
          queryParams.append(key, value.toString());
        } else {
          queryParams.append(key, value);
        }
      }
    });
    
    const response = await api.get(`/jobs/search?${queryParams.toString()}`);
    
    if (response.data.success) {
      console.log("✅ [JOB SERVICE] Jobs searched successfully");
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to search jobs");
    }
  } catch (error) {
    console.error("❌ [JOB SERVICE] Search jobs error:", error);
    throw error;
  }
},

// Get available job filters
async getJobFilters() {
  try {
    console.log("🔍 [JOB SERVICE] Getting job filters");
    
    const response = await api.get('/jobs/filters');
    
    if (response.data.success) {
      console.log("✅ [JOB SERVICE] Job filters fetched successfully");
      return response.data.filters;
    } else {
      // Return default filters if API fails
      return {
        jobCategories: this.getJobCategories(),
        jobTypes: this.getJobTypes(),
        experienceLevels: this.getExperienceLevels(),
        countries: this.getCountries(),
        cities: [],
        states: this.getUSStates()
      };
    }
  } catch (error) {
    console.error("❌ [JOB SERVICE] Get job filters error:", error);
    // Return default filters on error
    return {
      jobCategories: this.getJobCategories(),
      jobTypes: this.getJobTypes(),
      experienceLevels: this.getExperienceLevels(),
      countries: this.getCountries(),
      cities: [],
      states: this.getUSStates()
    };
  }
},

// Get US States (add this method)
getUSStates() {
  return [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ];
},


  // Search jobs with tracking
  async searchJobsWithTracking(filters = {}) {
    try {
      console.log("🔍 [JOB SERVICE] Searching jobs with tracking:", filters);

      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs/search?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [JOB SERVICE] Jobs searched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to search jobs");
      }
    } catch (error) {
      console.error("❌ [JOB SERVICE] Search jobs error:", error);
      throw error;
    }
  },


};