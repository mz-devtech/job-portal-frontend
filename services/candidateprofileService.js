import api from "@/utils/api";
import toast from "react-hot-toast";

export const profileService = {
  // Get candidate profile
  async getMyProfile() {
    try {
      console.log("👤 [PROFILE SERVICE] Fetching candidate profile...");
      
      const response = await api.get("/candidate-profile/me");
      
      if (response.data.success) {
        console.log("✅ [PROFILE SERVICE] Profile fetched successfully");
        
        // Store profile completion in localStorage
        if (typeof window !== "undefined") {
          if (response.data.profile) {
            localStorage.setItem(
              "candidateProfile",
              JSON.stringify(response.data.profile)
            );
            localStorage.setItem(
              "isProfileComplete",
              response.data.profile.isProfileComplete.toString()
            );
            
            // Update user data with profile info
            const userStr = localStorage.getItem("user");
            if (userStr) {
              try {
                const user = JSON.parse(userStr);
                const updatedUser = {
                  ...user,
                  profile: response.data.profile,
                  isProfileComplete: response.data.profile.isProfileComplete,
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
              } catch (parseError) {
                console.error("Error parsing user data:", parseError);
              }
            }
          }
        }
        
        return response.data.profile;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Get profile error:", error);
      
      // If no profile exists, return null
      if (error.response?.status === 404 || error.response?.data?.success === true) {
        return null;
      }
      
      throw error;
    }
  },

  // Create or update candidate profile
  async createOrUpdateCandidateProfile(formData) {
    try {
      console.log("📝 [PROFILE SERVICE] Saving candidate profile...");
      console.log("📦 Form data:", formData);
      
      // Create FormData object for file uploads
      const dataToSend = new FormData();
      
      // Add JSON data
      const jsonData = {
        personalInfo: formData.personalInfo || {},
        profileDetails: formData.profileDetails || {},
        socialLinks: formData.socialLinks || [],
        accountSettings: formData.accountSettings || {},
      };
      
      dataToSend.append("data", JSON.stringify(jsonData));
      
      // Add files if they exist
      if (formData.files?.profileImage) {
        dataToSend.append("profileImage", formData.files.profileImage);
      }
      if (formData.files?.cv) {
        dataToSend.append("cv", formData.files.cv);
      }
      
      console.log("📤 [PROFILE SERVICE] Sending to backend...");
      
      const response = await api.post("/candidate-profile/", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.data.success) {
        const { profile } = response.data;
        
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("candidateProfile", JSON.stringify(profile));
          localStorage.setItem("isProfileComplete", profile.isProfileComplete.toString());
          
          // Update user data
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              const updatedUser = {
                ...user,
                profile: profile,
                isProfileComplete: profile.isProfileComplete,
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (parseError) {
              console.error("Error parsing user data:", parseError);
            }
          }
        }
        
        console.log("✅ [PROFILE SERVICE] Profile saved successfully");
        console.log("📊 Completion:", profile.completionPercentage + "%");
        console.log("✅ Complete:", profile.isProfileComplete);
        
        toast.success(response.data.message || "Profile saved successfully!");
        return profile;
      } else {
        throw new Error(response.data.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Save profile error:", error);
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save profile";
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Delete profile
  async deleteProfile() {
    try {
      console.log("🗑️ [PROFILE SERVICE] Deleting profile...");
      
      const response = await api.delete("/candidate-profile/");
      
      if (response.data.success) {
        // Clear profile data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("candidateProfile");
          localStorage.removeItem("isProfileComplete");
          
          // Update user data
          const userStr = localStorage.getItem("user");
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              const updatedUser = {
                ...user,
                profile: null,
                isProfileComplete: false,
              };
              localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (parseError) {
              console.error("Error parsing user data:", parseError);
            }
          }
        }
        
        console.log("✅ [PROFILE SERVICE] Profile deleted successfully");
        toast.success("Profile deleted successfully!");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Delete profile error:", error);
      toast.error("Failed to delete profile");
      throw error;
    }
  },

  // Get public profile by user ID
  async getPublicProfile(userId) {
    try {
      const response = await api.get(`/candidate-profile/${userId}`);
      
      if (response.data.success) {
        return response.data.profile;
      } else {
        throw new Error(response.data.message || "Failed to get profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Get public profile error:", error);
      throw error;
    }
  },

  // Check if user has profile
  hasProfile() {
    if (typeof window === "undefined") return false;
    
    const profile = localStorage.getItem("candidateProfile");
    return !!profile;
  },

  // Get cached profile
  getCachedProfile() {
    if (typeof window === "undefined") return null;
    
    try {
      const profileStr = localStorage.getItem("candidateProfile");
      return profileStr ? JSON.parse(profileStr) : null;
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Error parsing cached profile:", error);
      return null;
    }
  },

  // Check if profile is complete
  isProfileComplete() {
    if (typeof window === "undefined") return false;
    
    const isComplete = localStorage.getItem("isProfileComplete");
    return isComplete === "true";
  },

  // Get completion percentage
  getCompletionPercentage() {
    const profile = this.getCachedProfile();
    return profile?.completionPercentage || 0;
  },
};