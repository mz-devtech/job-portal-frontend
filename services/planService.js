import api from "@/utils/api";
import toast from "react-hot-toast";

export const planService = {
  // Get all plans for admin
  async getPlans() {
    try {
      console.log("📋 [PLAN SERVICE] Fetching all plans");
      
      const response = await api.get("/plans");
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plans fetched successfully");
        return response.data.plans;
      } else {
        throw new Error(response.data.message || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Get plans error:", error);
      throw error;
    }
  },

  // Get public plans (for pricing page)
  async getPublicPlans() {
    try {
      console.log("📋 [PLAN SERVICE] Fetching public plans");
      
      const response = await api.get("/plans/public");
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Public plans fetched successfully");
        return response.data.plans;
      } else {
        throw new Error(response.data.message || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Get public plans error:", error);
      // Return mock data for development
      return [
        {
          _id: "1",
          name: "Basic",
          price: 29,
          jobLimit: 3,
          candidateLimit: 10,
          resumeVisibility: 15,
          urgentFeatured: false,
          highlightJob: false,
          support24: false,
          recommended: false,
          features: [
            "Post 3 active jobs",
            "Access to 10 candidate profiles",
            "Resume visibility for 15 days",
            "Email support"
          ]
        },
        {
          _id: "2",
          name: "Professional",
          price: 49,
          jobLimit: 10,
          candidateLimit: 50,
          resumeVisibility: 30,
          urgentFeatured: true,
          highlightJob: true,
          support24: false,
          recommended: true,
          features: [
            "Post 10 active jobs",
            "Access to 50 candidate profiles",
            "Resume visibility for 30 days",
            "Urgent & featured job posts",
            "Highlight jobs with colors"
          ]
        },
        {
          _id: "3",
          name: "Enterprise",
          price: 99,
          jobLimit: 999,
          candidateLimit: 999,
          resumeVisibility: 60,
          urgentFeatured: true,
          highlightJob: true,
          support24: true,
          recommended: false,
          features: [
            "Unlimited active jobs",
            "Unlimited candidate profile access",
            "Resume visibility for 60 days",
            "Urgent & featured job posts",
            "Highlight jobs with colors",
            "24/7 priority support"
          ]
        }
      ];
    }
  },

  // Get single plan by ID
  async getPlanById(id) {
    try {
      console.log("🔍 [PLAN SERVICE] Fetching plan:", id);
      
      const response = await api.get(`/plans/${id}`);
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan fetched successfully");
        return response.data.plan;
      } else {
        throw new Error(response.data.message || "Failed to fetch plan");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Get plan error:", error);
      throw error;
    }
  },

  // Create new plan
  async createPlan(planData) {
    try {
      console.log("➕ [PLAN SERVICE] Creating plan:", planData);
      
      const response = await api.post("/plans", planData);
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan created successfully");
        toast.success("Plan created successfully");
        return response.data.plan;
      } else {
        throw new Error(response.data.message || "Failed to create plan");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Create plan error:", error);
      toast.error(error.response?.data?.message || "Failed to create plan");
      throw error;
    }
  },

  // Update plan
  async updatePlan(planId, planData) {
    try {
      console.log("✏️ [PLAN SERVICE] Updating plan:", planId);
      
      const response = await api.put(`/plans/${planId}`, planData);
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan updated successfully");
        toast.success("Plan updated successfully");
        return response.data.plan;
      } else {
        throw new Error(response.data.message || "Failed to update plan");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Update plan error:", error);
      toast.error(error.response?.data?.message || "Failed to update plan");
      throw error;
    }
  },

  // Delete plan (soft delete)
  async deletePlan(planId) {
    try {
      console.log("🗑️ [PLAN SERVICE] Deleting plan:", planId);
      
      const response = await api.delete(`/plans/${planId}`);
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan deleted successfully");
        toast.success("Plan deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Delete plan error:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan");
      throw error;
    }
  },

  // Toggle plan status
  async togglePlanStatus(planId) {
    try {
      console.log("🔄 [PLAN SERVICE] Toggling plan status:", planId);
      
      const response = await api.put(`/plans/${planId}/toggle`);
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan status toggled successfully");
        toast.success(response.data.message);
        return response.data.plan;
      } else {
        throw new Error(response.data.message || "Failed to toggle plan status");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Toggle plan status error:", error);
      toast.error(error.response?.data?.message || "Failed to toggle plan status");
      throw error;
    }
  },

  // Get plan statistics
  async getPlanStats() {
    try {
      console.log("📊 [PLAN SERVICE] Fetching plan statistics");
      
      const response = await api.get("/plans/stats");
      
      if (response.data.success) {
        console.log("✅ [PLAN SERVICE] Plan stats fetched successfully");
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("❌ [PLAN SERVICE] Get plan stats error:", error);
      throw error;
    }
  },
};