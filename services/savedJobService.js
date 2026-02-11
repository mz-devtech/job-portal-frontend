import api from "@/utils/api";
import toast from "react-hot-toast";

export const savedJobService = {
  // Save a job
  async saveJob(jobId) {
    try {
      console.log("🔖 [SAVED JOB SERVICE] Saving job:", jobId);
      
      const response = await api.post(`/saved-jobs/${jobId}/save`);
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Job saved successfully");
        toast.success(response.data.message || "Job saved successfully!");
        return response.data.savedJob;
      } else {
        throw new Error(response.data.message || "Failed to save job");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Save job error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save job";
      
      // Don't show toast for "already saved" message
      if (!errorMessage.includes('already saved')) {
        toast.error(errorMessage);
      }
      throw new Error(errorMessage);
    }
  },

  // Unsave a job
  async unsaveJob(jobId) {
    try {
      console.log("🗑️ [SAVED JOB SERVICE] Unsaving job:", jobId);
      
      const response = await api.delete(`/saved-jobs/${jobId}/unsave`);
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Job unsaved successfully");
        toast.success(response.data.message || "Job removed from saved list!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to unsave job");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Unsave job error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to unsave job";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Check if job is saved
  async checkJobSaved(jobId) {
    try {
      console.log("🔍 [SAVED JOB SERVICE] Checking if job is saved:", jobId);
      
      const response = await api.get(`/saved-jobs/${jobId}/check`);
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Check completed");
        return response.data.isSaved;
      } else {
        throw new Error(response.data.message || "Failed to check saved status");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Check saved error:", error);
      return false; // Return false if there's an error
    }
  },

  // Get user's saved jobs
  async getSavedJobs(filters = {}) {
    try {
      console.log("📚 [SAVED JOB SERVICE] Fetching saved jobs");
      
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/saved-jobs?${queryParams.toString()}`);
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Saved jobs fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch saved jobs");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Get saved jobs error:", error);
      throw error;
    }
  },

  // Get saved jobs count
  async getSavedJobsCount() {
    try {
      console.log("📊 [SAVED JOB SERVICE] Getting saved jobs count");
      
      const response = await api.get("/saved-jobs/count");
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Saved jobs count fetched");
        return response.data.count;
      } else {
        throw new Error(response.data.message || "Failed to get saved jobs count");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Get count error:", error);
      return 0;
    }
  },

  // Add note to saved job
  async addNoteToSavedJob(jobId, notes) {
    try {
      console.log("📝 [SAVED JOB SERVICE] Adding note to saved job:", jobId);
      
      const response = await api.put(`/saved-jobs/${jobId}/note`, { notes });
      
      if (response.data.success) {
        console.log("✅ [SAVED JOB SERVICE] Note added successfully");
        toast.success(response.data.message || "Note added successfully!");
        return response.data.savedJob;
      } else {
        throw new Error(response.data.message || "Failed to add note");
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Add note error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add note";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Toggle save/unsave job
  async toggleSaveJob(jobId, isCurrentlySaved) {
    try {
      if (isCurrentlySaved) {
        return await this.unsaveJob(jobId);
      } else {
        return await this.saveJob(jobId);
      }
    } catch (error) {
      console.error("❌ [SAVED JOB SERVICE] Toggle save error:", error);
      throw error;
    }
  },
};