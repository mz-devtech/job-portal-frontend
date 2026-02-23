import api from "@/utils/api";
import toast from "react-hot-toast";

let statusCache = null;
let cacheTime = null;
const CACHE_DURATION = 5000; // 5 seconds cache

export const subscriptionService = {
  // Check if user has active subscription (with caching)
  async checkStatus(forceRefresh = false) {
    try {
      // Return cached data if available and not expired
      if (!forceRefresh && statusCache && cacheTime && (Date.now() - cacheTime) < CACHE_DURATION) {
        console.log("🔍 [SUBSCRIPTION SERVICE] Returning cached status");
        return statusCache;
      }

      console.log("🔍 [SUBSCRIPTION SERVICE] Checking subscription status");
      
      const response = await api.get("/subscriptions/status");
      
      if (response.data.success) {
        console.log("✅ [SUBSCRIPTION SERVICE] Status checked:", response.data);
        
        const result = {
          hasActiveSubscription: response.data.hasActiveSubscription,
          subscription: response.data.subscription
        };
        
        // Update cache
        statusCache = result;
        cacheTime = Date.now();
        
        return result;
      } else {
        throw new Error(response.data.message || "Failed to check subscription");
      }
    } catch (error) {
      console.error("❌ [SUBSCRIPTION SERVICE] Check status error:", error);
      
      // Return default values on error
      return {
        hasActiveSubscription: false,
        subscription: null
      };
    }
  },

  // Clear cache (useful after subscription changes)
  clearCache() {
    statusCache = null;
    cacheTime = null;
  },

  // Get user subscriptions
  async getSubscriptions() {
    try {
      console.log("📋 [SUBSCRIPTION SERVICE] Fetching subscriptions");
      
      const response = await api.get("/subscriptions");
      
      if (response.data.success) {
        console.log("✅ [SUBSCRIPTION SERVICE] Subscriptions fetched");
        return response.data.subscriptions;
      } else {
        throw new Error(response.data.message || "Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("❌ [SUBSCRIPTION SERVICE] Get subscriptions error:", error);
      throw error;
    }
  },

  // Get single subscription
  async getSubscriptionById(id) {
    try {
      console.log("🔍 [SUBSCRIPTION SERVICE] Fetching subscription:", id);
      
      const response = await api.get(`/subscriptions/${id}`);
      
      if (response.data.success) {
        console.log("✅ [SUBSCRIPTION SERVICE] Subscription fetched");
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || "Failed to fetch subscription");
      }
    } catch (error) {
      console.error("❌ [SUBSCRIPTION SERVICE] Get subscription error:", error);
      throw error;
    }
  },

  // Create subscription after payment
  async createSubscription(data) {
    try {
      console.log("➕ [SUBSCRIPTION SERVICE] Creating subscription");
      
      const response = await api.post("/subscriptions", data);
      
      if (response.data.success) {
        console.log("✅ [SUBSCRIPTION SERVICE] Subscription created");
        toast.success(response.data.message || "Subscription created successfully!");
        
        // Clear cache after new subscription
        this.clearCache();
        
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || "Failed to create subscription");
      }
    } catch (error) {
      console.error("❌ [SUBSCRIPTION SERVICE] Create subscription error:", error);
      toast.error(error.response?.data?.message || "Failed to create subscription");
      throw error;
    }
  },

  // Cancel subscription
  async cancelSubscription(id) {
    try {
      console.log("🛑 [SUBSCRIPTION SERVICE] Canceling subscription:", id);
      
      const response = await api.put(`/subscriptions/${id}/cancel`);
      
      if (response.data.success) {
        console.log("✅ [SUBSCRIPTION SERVICE] Subscription canceled");
        toast.success(response.data.message || "Subscription cancelled successfully!");
        
        // Clear cache after cancellation
        this.clearCache();
        
        return response.data.subscription;
      } else {
        throw new Error(response.data.message || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("❌ [SUBSCRIPTION SERVICE] Cancel subscription error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel subscription");
      throw error;
    }
  },
};