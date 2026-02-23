import api from "@/utils/api";
import toast from "react-hot-toast";

export const categoryService = {
  // Get all categories for job posting (public route)
  async getJobCategories() {
    try {
      console.log("📋 [CATEGORY SERVICE] Fetching job categories");
      
      // Use public endpoint that doesn't require authentication
      const response = await api.get("/categories/public");
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Categories fetched successfully");
        return response.data.categories;
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Get categories error:", error);
      
      // Fallback to mock data if API fails
      console.log("⚠️ [CATEGORY SERVICE] Using fallback mock data");
      return [
        { _id: "1", name: "IT & Software" },
        { _id: "2", name: "Marketing" },
        { _id: "3", name: "Sales" },
        { _id: "4", name: "Design" },
        { _id: "5", name: "Finance" },
        { _id: "6", name: "Healthcare" },
        { _id: "7", name: "Education" },
        { _id: "8", name: "Engineering" },
      ];
    }
  },

  // Get all categories (admin only)
  async getCategories() {
    try {
      console.log("📋 [CATEGORY SERVICE] Fetching all categories");
      
      const response = await api.get("/categories");
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Categories fetched successfully");
        return response.data.categories;
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Get categories error:", error);
      throw error;
    }
  },

  // Get single category by ID
  async getCategoryById(id) {
    try {
      console.log("🔍 [CATEGORY SERVICE] Fetching category:", id);
      
      const response = await api.get(`/categories/${id}`);
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Category fetched successfully");
        return response.data.category;
      } else {
        throw new Error(response.data.message || "Failed to fetch category");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Get category error:", error);
      throw error;
    }
  },

  // Create new category (admin only)
  async createCategory(categoryData) {
    try {
      console.log("➕ [CATEGORY SERVICE] Creating category:", categoryData);
      
      const response = await api.post("/categories", categoryData);
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Category created successfully");
        toast.success("Category created successfully");
        return response.data.category;
      } else {
        throw new Error(response.data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Create category error:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
      throw error;
    }
  },

  // Update category (admin only)
  async updateCategory(categoryId, categoryData) {
    try {
      console.log("✏️ [CATEGORY SERVICE] Updating category:", categoryId);
      
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Category updated successfully");
        toast.success("Category updated successfully");
        return response.data.category;
      } else {
        throw new Error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Update category error:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
      throw error;
    }
  },

  // Delete category (admin only)
  async deleteCategory(categoryId) {
    try {
      console.log("🗑️ [CATEGORY SERVICE] Deleting category:", categoryId);
      
      const response = await api.delete(`/categories/${categoryId}`);
      
      if (response.data.success) {
        console.log("✅ [CATEGORY SERVICE] Category deleted successfully");
        toast.success("Category deleted successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("❌ [CATEGORY SERVICE] Delete category error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
      throw error;
    }
  },

  // Helper: Generate category colors for UI
  categoryColors: [
    { name: "Blue", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
    { name: "Green", bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
    { name: "Purple", bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
    { name: "Red", bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
    { name: "Yellow", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
    { name: "Indigo", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    { name: "Pink", bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200" },
    { name: "Orange", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    { name: "Cyan", bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200" },
    { name: "Gray", bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
  ],

  // Get random color for category
  getRandomColor() {
    const index = Math.floor(Math.random() * this.categoryColors.length);
    return this.categoryColors[index];
  },
};