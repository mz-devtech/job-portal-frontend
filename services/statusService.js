import api from "@/utils/api";
import toast from "react-hot-toast";

export const statusService = {
  // Get all statuses for employer
  async getStatuses() {
    try {
      console.log("📋 [STATUS SERVICE] Fetching statuses");
      
      const response = await api.get("/statuses");
      
      if (response.data.success) {
        console.log("✅ [STATUS SERVICE] Statuses fetched successfully");
        return response.data.statuses;
      } else {
        throw new Error(response.data.message || "Failed to fetch statuses");
      }
    } catch (error) {
      console.error("❌ [STATUS SERVICE] Get statuses error:", error);
      throw error;
    }
  },

  // Create new status
  async createStatus(statusData) {
    try {
      console.log("➕ [STATUS SERVICE] Creating status:", statusData);
      
      const response = await api.post("/statuses", statusData);
      
      if (response.data.success) {
        console.log("✅ [STATUS SERVICE] Status created successfully");
        toast.success("Status created successfully");
        return response.data.status;
      } else {
        throw new Error(response.data.message || "Failed to create status");
      }
    } catch (error) {
      console.error("❌ [STATUS SERVICE] Create status error:", error);
      toast.error(error.response?.data?.message || "Failed to create status");
      throw error;
    }
  },

  // Update status
  async updateStatus(statusId, statusData) {
    try {
      console.log("✏️ [STATUS SERVICE] Updating status:", statusId);
      
      const response = await api.put(`/statuses/${statusId}`, statusData);
      
      if (response.data.success) {
        console.log("✅ [STATUS SERVICE] Status updated successfully");
        toast.success("Status updated successfully");
        return response.data.status;
      } else {
        throw new Error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ [STATUS SERVICE] Update status error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
      throw error;
    }
  },

  // Delete status
  async deleteStatus(statusId) {
    try {
      console.log("🗑️ [STATUS SERVICE] Deleting status:", statusId);
      
      const response = await api.delete(`/statuses/${statusId}`);
      
      if (response.data.success) {
        console.log("✅ [STATUS SERVICE] Status deleted successfully");
        toast.success("Status deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete status");
      }
    } catch (error) {
      console.error("❌ [STATUS SERVICE] Delete status error:", error);
      toast.error(error.response?.data?.message || "Failed to delete status");
      throw error;
    }
  },

  // Reorder statuses
  async reorderStatuses(statuses) {
    try {
      console.log("🔄 [STATUS SERVICE] Reordering statuses");
      
      const response = await api.put("/statuses/reorder", { statuses });
      
      if (response.data.success) {
        console.log("✅ [STATUS SERVICE] Statuses reordered successfully");
        toast.success("Status order updated");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to reorder statuses");
      }
    } catch (error) {
      console.error("❌ [STATUS SERVICE] Reorder statuses error:", error);
      toast.error(error.response?.data?.message || "Failed to reorder statuses");
      throw error;
    }
  },

  // Default status colors
  statusColors: [
    { name: "Gray", value: "bg-gray-100 text-gray-800" },
    { name: "Blue", value: "bg-blue-100 text-blue-800" },
    { name: "Green", value: "bg-green-100 text-green-800" },
    { name: "Yellow", value: "bg-yellow-100 text-yellow-800" },
    { name: "Red", value: "bg-red-100 text-red-800" },
    { name: "Purple", value: "bg-purple-100 text-purple-800" },
    { name: "Indigo", value: "bg-indigo-100 text-indigo-800" },
    { name: "Pink", value: "bg-pink-100 text-pink-800" },
    { name: "Orange", value: "bg-orange-100 text-orange-800" },
    { name: "Cyan", value: "bg-cyan-100 text-cyan-800" },
  ],

  // Get color class by name
  getColorClass(colorName) {
    const color = this.statusColors.find(c => c.name === colorName);
    return color?.value || "bg-gray-100 text-gray-800";
  },

  // Default statuses
  defaultStatuses: [
    { key: "pending", name: "Pending Review", color: "bg-yellow-100 text-yellow-800", isDefault: true },
    { key: "reviewed", name: "Reviewed", color: "bg-blue-100 text-blue-800", isDefault: true },
    { key: "shortlisted", name: "Shortlisted", color: "bg-purple-100 text-purple-800", isDefault: true },
    { key: "interview", name: "Interview", color: "bg-indigo-100 text-indigo-800", isDefault: true },
    { key: "hired", name: "Hired", color: "bg-green-100 text-green-800", isDefault: true },
    { key: "rejected", name: "Rejected", color: "bg-red-100 text-red-800", isDefault: true },
  ],
};