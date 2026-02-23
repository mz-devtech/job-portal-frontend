import api from "@/utils/api";
import toast from "react-hot-toast";

export const adminService = {
  // Get admin dashboard statistics
  async getAdminStats() {
    try {
      console.log("📊 [ADMIN SERVICE] Fetching dashboard statistics");
      
      const response = await api.get("/admin/stats");
      
      if (response.data.success) {
        console.log("✅ [ADMIN SERVICE] Stats fetched successfully");
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("❌ [ADMIN SERVICE] Get stats error:", error);
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
      throw error;
    }
  },

  // Get recent activities
  async getRecentActivities() {
    try {
      const response = await api.get("/admin/recent-activities");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      throw error;
    }
  },

  // Get all jobs (admin)
  async getAllJobs(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/jobs?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all jobs:", error);
      throw error;
    }
  },

  // Get all users (admin)
  async getAllUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/users?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // Get all companies (admin)
  async getAllCompanies(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`/admin/companies?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all companies:", error);
      throw error;
    }
  },

  // Get all categories (admin)
  async getAllCategories() {
    try {
      const response = await api.get("/admin/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  },

  // Delete user (admin)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
      }
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
      throw error;
    }
  },

  // Update user role (admin)
  async updateUserRole(userId, role) {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      if (response.data.success) {
        toast.success("User role updated successfully");
      }
      return response.data;
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(error.response?.data?.message || "Failed to update user role");
      throw error;
    }
  },

// Get single company details
async getCompanyDetails(companyId) {
  try {
    const response = await api.get(`/admin/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    toast.error(error.response?.data?.message || "Failed to fetch company details");
    throw error;
  }
},

// Verify company
async verifyCompany(companyId) {
  try {
    const response = await api.patch(`/admin/companies/${companyId}/verify`);
    if (response.data.success) {
      toast.success("Company verified successfully");
    }
    return response.data;
  } catch (error) {
    console.error("Error verifying company:", error);
    toast.error(error.response?.data?.message || "Failed to verify company");
    throw error;
  }
},

// Delete company
async deleteCompany(companyId) {
  try {
    const response = await api.delete(`/admin/companies/${companyId}`);
    if (response.data.success) {
      toast.success("Company deleted successfully");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    toast.error(error.response?.data?.message || "Failed to delete company");
    throw error;
  }
},

// Update company
async updateCompany(companyId, data) {
  try {
    const response = await api.put(`/admin/companies/${companyId}`, data);
    if (response.data.success) {
      toast.success("Company updated successfully");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    toast.error(error.response?.data?.message || "Failed to update company");
    throw error;
  }
},


// Add to your adminService object:

// Get all companies with filters
async getAllCompanies(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const response = await api.get(`/admin/companies?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    toast.error(error.response?.data?.message || "Failed to fetch companies");
    throw error;
  }
},




};





