import api from "@/utils/api";
import toast from "react-hot-toast";

export const searchHistoryService = {
  // Save a search query - only called on actual search submission
  async saveSearch(searchData) {
    try {
      if (!searchData.searchQuery || searchData.searchQuery.trim().length < 2) {
        return null; // Don't save incomplete searches
      }
      
      console.log("💾 [SEARCH HISTORY SERVICE] Saving search:", searchData.searchQuery);
      
      const response = await api.post("/search-history", searchData);
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Search saved successfully");
        return response.data.search;
      } else {
        throw new Error(response.data.message || "Failed to save search");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Save search error:", error);
      // Don't show toast - it's a background operation
      return null;
    }
  },

  // Get user's recent searches (top 10)
  async getUserSearchHistory() {
    try {
      console.log("📜 [SEARCH HISTORY SERVICE] Fetching user search history");
      
      const response = await api.get("/search-history/history");
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Search history fetched successfully");
        return response.data.searchHistory;
      } else {
        throw new Error(response.data.message || "Failed to fetch search history");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Get search history error:", error);
      return [];
    }
  },

  // Get popular searches (top 10 only)
  async getPopularSearches() {
    try {
      console.log("🔥 [SEARCH HISTORY SERVICE] Fetching popular searches");
      
      const response = await api.get("/search-history/popular?limit=10");
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Popular searches fetched successfully");
        return response.data.popularSearches;
      } else {
        throw new Error(response.data.message || "Failed to fetch popular searches");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Get popular searches error:", error);
      return this.getDefaultPopularSearches();
    }
  },

  // Get trending searches (top 10 only)
  async getTrendingSearches() {
    try {
      console.log("📈 [SEARCH HISTORY SERVICE] Fetching trending searches");
      
      const response = await api.get("/search-history/trending?limit=10");
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Trending searches fetched successfully");
        return response.data.trendingSearches;
      } else {
        throw new Error(response.data.message || "Failed to fetch trending searches");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Get trending searches error:", error);
      return [];
    }
  },

  // Get search suggestions
  async getSearchSuggestions(query, limit = 5) {
    try {
      if (!query || query.trim().length < 2) return [];
      
      console.log("💡 [SEARCH HISTORY SERVICE] Fetching search suggestions for:", query);
      
      const response = await api.get(
        `/search-history/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`
      );
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Search suggestions fetched successfully");
        return response.data.suggestions;
      } else {
        throw new Error(response.data.message || "Failed to fetch search suggestions");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Get suggestions error:", error);
      return [];
    }
  },

  // Clear user's search history
  async clearSearchHistory() {
    try {
      console.log("🗑️ [SEARCH HISTORY SERVICE] Clearing search history");
      
      const response = await api.delete("/search-history/history");
      
      if (response.data.success) {
        console.log("✅ [SEARCH HISTORY SERVICE] Search history cleared successfully");
        toast.success(response.data.message || "Search history cleared!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to clear search history");
      }
    } catch (error) {
      console.error("❌ [SEARCH HISTORY SERVICE] Clear history error:", error);
      toast.error("Failed to clear search history");
      throw error;
    }
  },

  // Get default popular searches (fallback)
  getDefaultPopularSearches() {
    return [
      { searchQuery: "frontend developer", totalSearches: 150 },
      { searchQuery: "react js", totalSearches: 130 },
      { searchQuery: "full stack developer", totalSearches: 120 },
      { searchQuery: "remote jobs", totalSearches: 115 },
      { searchQuery: "software engineer", totalSearches: 110 },
      { searchQuery: "javascript developer", totalSearches: 105 },
      { searchQuery: "node.js", totalSearches: 100 },
      { searchQuery: "python developer", totalSearches: 95 },
      { searchQuery: "ui ux designer", totalSearches: 90 },
      { searchQuery: "project manager", totalSearches: 85 },
    ];
  },

  // Format search data
  formatSearchData(searchTerm, locationTerm, filters = {}) {
    let searchQuery = '';
    let searchType = 'keyword';
    
    if (searchTerm && locationTerm) {
      searchQuery = `${searchTerm} in ${locationTerm}`;
      searchType = 'combined';
    } else if (searchTerm) {
      searchQuery = searchTerm;
      searchType = 'keyword';
    } else if (locationTerm) {
      searchQuery = locationTerm;
      searchType = 'location';
    }
    
    // Only save if search is meaningful
    if (!searchQuery || searchQuery.trim().length < 2) {
      return null;
    }
    
    return {
      searchQuery,
      searchType,
      filters: {
        jobType: filters.jobType || undefined,
        jobCategory: filters.jobCategory || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        minSalary: filters.minSalary || undefined,
        maxSalary: filters.maxSalary || undefined,
        isRemote: filters.isRemote || undefined,
        country: filters.country || undefined,
      },
    };
  },

  // Validate if we should save the search
  shouldSaveSearch(searchTerm, locationTerm) {
    const query = searchTerm || locationTerm;
    return query && query.trim().length >= 2;
  },
};