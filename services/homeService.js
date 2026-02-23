import api from "@/utils/api";
import toast from "react-hot-toast";

export const homeService = {
  // Get home page statistics
  async getHomeStats() {
    try {
      console.log("📊 [HOME SERVICE] Fetching home statistics");
      
      const response = await api.get("/home/stats");
      
      if (response.data.success) {
        console.log("✅ [HOME SERVICE] Stats fetched successfully");
        return response.data.stats;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("❌ [HOME SERVICE] Get stats error:", error);
      // Return default stats on error
      return {
        liveJobs: "1,75,324",
        companies: "97,354",
        candidates: "38,47,154",
        newJobs: "7,532"
      };
    }
  },

  // Get popular vacancies
  async getPopularVacancies() {
    try {
      console.log("📊 [HOME SERVICE] Fetching popular vacancies");
      
      const response = await api.get("/home/popular-vacancies");
      
      if (response.data.success) {
        console.log("✅ [HOME SERVICE] Vacancies fetched successfully");
        return response.data.vacancies;
      } else {
        throw new Error(response.data.message || "Failed to fetch vacancies");
      }
    } catch (error) {
      console.error("❌ [HOME SERVICE] Get vacancies error:", error);
      // Return default vacancies on error
      return [
        { title: "Anesthesiologists", positions: "45,904 Open Positions" },
        { title: "Surgeons", positions: "50,364 Open Positions" },
        { title: "Obstetricians-Gynecologists", positions: "4,339 Open Positions" },
        { title: "Orthodontists", positions: "20,079 Open Positions" },
        { title: "Maxillofacial Surgeons", positions: "74,875 Open Positions" },
        { title: "Software Developer", positions: "4,359 Open Positions" },
        { title: "Psychiatrists", positions: "18,599 Open Positions" },
        { title: "Data Scientist", positions: "28,200 Open Positions" },
        { title: "Financial Manager", positions: "61,391 Open Positions" },
        { title: "Management Analysis", positions: "93,046 Open Positions" },
        { title: "IT Manager", positions: "50,963 Open Positions" },
        { title: "Operations Research Analysis", positions: "16,627 Open Positions" }
      ];
    }
  },

  // Get featured jobs
  async getFeaturedJobs(limit = 12) {
    try {
      console.log("📊 [HOME SERVICE] Fetching featured jobs");
      
      const response = await api.get(`/home/featured-jobs?limit=${limit}`);
      
      if (response.data.success) {
        console.log("✅ [HOME SERVICE] Featured jobs fetched successfully");
        return response.data.jobs;
      } else {
        throw new Error(response.data.message || "Failed to fetch featured jobs");
      }
    } catch (error) {
      console.error("❌ [HOME SERVICE] Get featured jobs error:", error);
      return [];
    }
  },

  // Get top companies
  async getTopCompanies(limit = 6) {
    try {
      console.log("📊 [HOME SERVICE] Fetching top companies");
      
      const response = await api.get(`/home/top-companies?limit=${limit}`);
      
      if (response.data.success) {
        console.log("✅ [HOME SERVICE] Top companies fetched successfully");
        return response.data.companies;
      } else {
        throw new Error(response.data.message || "Failed to fetch top companies");
      }
    } catch (error) {
      console.error("❌ [HOME SERVICE] Get top companies error:", error);
      // Return default companies on error
      return [
        { name: "Dribbble", location: "Dhaka, Bangladesh", positions: 3, featured: true, bgColor: "bg-pink-500", icon: "D" },
        { name: "Google", location: "Mountain View, CA", positions: 12, featured: true, bgColor: "bg-blue-500", icon: "G" },
        { name: "Microsoft", location: "Redmond, WA", positions: 8, featured: true, bgColor: "bg-green-500", icon: "M" },
        { name: "Amazon", location: "Seattle, WA", positions: 15, featured: true, bgColor: "bg-orange-500", icon: "A" },
        { name: "Meta", location: "Menlo Park, CA", positions: 6, featured: true, bgColor: "bg-purple-500", icon: "M" },
        { name: "Apple", location: "Cupertino, CA", positions: 9, featured: true, bgColor: "bg-teal-500", icon: "A" }
      ];
    }
  },

  // Search jobs from home page
  async searchJobs(keyword, location) {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      
      const response = await api.get(`/home/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("❌ [HOME SERVICE] Search jobs error:", error);
      throw error;
    }
  }
};