import api from "@/utils/api";
import toast from "react-hot-toast";

export const employerService = {
  // Get all employers with filters
  async getAllEmployers(filters = {}) {
    try {
      console.log("🏢 [EMPLOYER SERVICE] Fetching employers with filters:", filters);

      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/employers?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [EMPLOYER SERVICE] Employers fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch employers");
      }
    } catch (error) {
      console.error("❌ [EMPLOYER SERVICE] Get employers error:", error);
      throw error;
    }
  },

  // Get single employer by ID
  async getEmployerById(employerId) {
    try {
      console.log("🏢 [EMPLOYER SERVICE] Fetching employer:", employerId);

      const response = await api.get(`/employers/${employerId}`);

      if (response.data.success) {
        console.log("✅ [EMPLOYER SERVICE] Employer fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch employer");
      }
    } catch (error) {
      console.error("❌ [EMPLOYER SERVICE] Get employer error:", error);
      
      if (error.response?.status === 404) {
        throw new Error('Employer not found');
      }
      
      throw error;
    }
  },

  // Get featured employers
  async getFeaturedEmployers(limit = 6) {
    try {
      console.log("⭐ [EMPLOYER SERVICE] Fetching featured employers");

      const response = await api.get(`/employers/featured?limit=${limit}`);

      if (response.data.success) {
        console.log("✅ [EMPLOYER SERVICE] Featured employers fetched successfully");
        return response.data.employers;
      } else {
        throw new Error(response.data.message || "Failed to fetch featured employers");
      }
    } catch (error) {
      console.error("❌ [EMPLOYER SERVICE] Get featured employers error:", error);
      return [];
    }
  },

  // Get employer jobs
  async getEmployerJobs(employerId, filters = {}) {
    try {
      console.log("📋 [EMPLOYER SERVICE] Fetching jobs for employer:", employerId);

      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/employers/${employerId}/jobs?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [EMPLOYER SERVICE] Employer jobs fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch employer jobs");
      }
    } catch (error) {
      console.error("❌ [EMPLOYER SERVICE] Get employer jobs error:", error);
      throw error;
    }
  },

  // Update employer profile
  async updateEmployerProfile(employerId, profileData) {
    try {
      console.log("📝 [EMPLOYER SERVICE] Updating employer profile:", employerId);

      const response = await api.put(`/employers/${employerId}`, profileData);

      if (response.data.success) {
        console.log("✅ [EMPLOYER SERVICE] Employer profile updated successfully");
        toast.success(response.data.message || "Profile updated successfully!");
        return response.data.employer;
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ [EMPLOYER SERVICE] Update employer error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },

  // Get industry types for filters
  getIndustryTypes() {
    return [
      "Technology",
      "Finance",
      "Healthcare",
      "Education",
      "Retail",
      "Manufacturing",
      "Real Estate",
      "Hospitality",
      "Transportation",
      "Media",
      "Construction",
      "Energy",
      "Agriculture",
      "Telecommunications",
      "Automotive",
      "Design & Creative",
      "Marketing & Sales",
      "Legal",
      "Consulting",
      "Non-Profit",
      "Government",
      "Other"
    ];
  },

  // Get organization types
  getOrganizationTypes() {
    return [
      "Private Limited",
      "Public Limited",
      "LLC",
      "Non-Profit",
      "Startup",
      "Government",
      "Educational",
      "Sole Proprietorship",
      "Partnership",
      "Corporation"
    ];
  },

  // Get team sizes
  getTeamSizes() {
    return [
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1000+"
    ];
  },

  // Format location display
  formatLocation(employer) {
    if (employer.location) {
      return employer.location;
    }
    if (employer.companyInfo?.address) {
      return employer.companyInfo.address;
    }
    return 'Location not specified';
  },

  // Get company logo or default
  getCompanyLogo(employer) {
    if (employer.companyInfo?.logo) {
      return employer.companyInfo.logo;
    }
    if (employer.profileImage) {
      return employer.profileImage;
    }
    return null;
  },

  // Get company banner or default
  getCompanyBanner(employer) {
    if (employer.companyInfo?.banner) {
      return employer.companyInfo.banner;
    }
    return null;
  },

  // Check if profile is complete
  isProfileComplete(employer) {
    return employer.completionPercentage >= 80;
  }
};