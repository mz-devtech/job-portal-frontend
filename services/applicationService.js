import api from "@/utils/api";
import toast from "react-hot-toast";

export const applicationService = {
  // Apply for a job
  async applyForJob(jobId, formData) {
    try {
      console.log("📝 [APPLICATION SERVICE] Applying for job:", jobId);
      
      const response = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Application submitted successfully");
        toast.success("Application submitted successfully!");
        return response.data.application;
      } else {
        throw new Error(response.data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Apply error:", error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "You have already applied for this job");
      } else {
        toast.error(error.response?.data?.message || "Failed to submit application");
      }
      
      throw error;
    }
  },

  // Get candidate's applications
  async getMyApplications(filters = {}) {
    try {
      console.log("📋 [APPLICATION SERVICE] Fetching my applications");
      
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/applications/candidate?${queryParams.toString()}`);
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Applications fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Get applications error:", error);
      throw error;
    }
  },

  // Get employer's received applications
  async getEmployerApplications(filters = {}) {
    try {
      console.log("📋 [APPLICATION SERVICE] Fetching employer applications");
      
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/applications/employer?${queryParams.toString()}`);
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Employer applications fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Get employer applications error:", error);
      throw error;
    }
  },

  // Get single application by ID
  async getApplicationById(applicationId) {
    try {
      console.log("🔍 [APPLICATION SERVICE] Fetching application:", applicationId);
      
      const response = await api.get(`/applications/${applicationId}`);
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Application fetched successfully");
        return response.data.application;
      } else {
        throw new Error(response.data.message || "Failed to fetch application");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Get application error:", error);
      
      if (error.response?.status === 404) {
        throw new Error("Application not found");
      }
      
      throw error;
    }
  },

  // Update application status (Employer only)
  async updateApplicationStatus(applicationId, status, note = "") {
    try {
      console.log("🔄 [APPLICATION SERVICE] Updating application status:", applicationId, status);
      
      const response = await api.put(`/applications/${applicationId}/status`, {
        status,
        note,
      });
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Application status updated successfully");
        toast.success(`Application status updated to ${status}`);
        return response.data.application;
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  },

  // Withdraw application (Candidate only)
  async withdrawApplication(applicationId, reason = "") {
    try {
      console.log("🗑️ [APPLICATION SERVICE] Withdrawing application:", applicationId);
      
      const response = await api.put(`/applications/${applicationId}/withdraw`, {
        reason,
      });
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Application withdrawn successfully");
        toast.success("Application withdrawn successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to withdraw application");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Withdraw error:", error);
      toast.error(error.response?.data?.message || "Failed to withdraw application");
      throw error;
    }
  },

  // Schedule interview (Employer only)
  async scheduleInterview(applicationId, interviewData) {
    try {
      console.log("📅 [APPLICATION SERVICE] Scheduling interview:", applicationId);
      
      const response = await api.post(`/applications/${applicationId}/interview`, interviewData);
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Interview scheduled successfully");
        toast.success("Interview scheduled successfully");
        return response.data.application;
      } else {
        throw new Error(response.data.message || "Failed to schedule interview");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Schedule interview error:", error);
      toast.error(error.response?.data?.message || "Failed to schedule interview");
      throw error;
    }
  },

  // Add note to application (Employer only)
  async addApplicationNote(applicationId, note) {
    try {
      console.log("📝 [APPLICATION SERVICE] Adding note to application:", applicationId);
      
      const response = await api.post(`/applications/${applicationId}/notes`, {
        text: note,
      });
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Note added successfully");
        toast.success("Note added successfully");
        return response.data.notes;
      } else {
        throw new Error(response.data.message || "Failed to add note");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Add note error:", error);
      toast.error(error.response?.data?.message || "Failed to add note");
      throw error;
    }
  },

  // Download resume (Employer only)
  async downloadResume(applicationId) {
    try {
      console.log("📄 [APPLICATION SERVICE] Downloading resume:", applicationId);
      
      const response = await api.get(`/applications/${applicationId}/resume`, {
        responseType: "blob",
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "resume.pdf";
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      console.log("✅ [APPLICATION SERVICE] Resume downloaded successfully");
      toast.success("Resume downloaded successfully");
      
      return true;
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Download resume error:", error);
      toast.error(error.response?.data?.message || "Failed to download resume");
      throw error;
    }
  },

  // Get application statistics
  async getApplicationStats() {
    try {
      console.log("📊 [APPLICATION SERVICE] Fetching application stats");
      
      const response = await api.get("/applications/stats");
      
      if (response.data.success) {
        console.log("✅ [APPLICATION SERVICE] Stats fetched successfully");
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Get stats error:", error);
      throw error;
    }
  },

  // Check if user has applied for a job
  async checkIfApplied(jobId) {
    try {
      console.log("🔍 [APPLICATION SERVICE] Checking if applied to job:", jobId);
      
      const response = await this.getMyApplications({ limit: 100 });
      
      if (response.success) {
        const hasApplied = response.applications.some(
          app => app.job._id === jobId
        );
        
        console.log("✅ [APPLICATION SERVICE] Applied status:", hasApplied);
        return hasApplied;
      }
      
      return false;
    } catch (error) {
      console.error("❌ [APPLICATION SERVICE] Check applied error:", error);
      return false;
    }
  },

  // Get status badge styling
  getStatusBadge(status) {
    const badges = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      reviewed: { color: "bg-blue-100 text-blue-800", label: "Reviewed" },
      shortlisted: { color: "bg-purple-100 text-purple-800", label: "Shortlisted" },
      interview: { color: "bg-indigo-100 text-indigo-800", label: "Interview" },
      hired: { color: "bg-green-100 text-green-800", label: "Hired" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      withdrawn: { color: "bg-gray-100 text-gray-800", label: "Withdrawn" },
    };
    return badges[status] || badges.pending;
  },

  // Format date
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
};