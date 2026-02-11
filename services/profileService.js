import api from "@/utils/api";
import toast from "react-hot-toast";

export const profileService = {
  // Update user personal info
  async updateUserPersonalInfo(personalData) {
    try {
      console.log("👤 [PROFILE SERVICE] Updating user personal info:", personalData);
      
      const formData = new FormData();
      
      // Append personal data
      if (personalData.phone) {
        formData.append("phone", personalData.phone);
      }
      if (personalData.address) {
        formData.append("address", personalData.address);
      }
      
      // Append profile image if exists
      if (personalData.profileImage && personalData.profileImage instanceof File) {
        formData.append("profileImage", personalData.profileImage);
      }

      const response = await api.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        console.log("✅ [PROFILE SERVICE] User personal info updated");
        
        // Update localStorage if needed
        if (typeof window !== "undefined") {
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...currentUser,
            phone: personalData.phone || currentUser.phone,
            address: personalData.address || currentUser.address,
            profileImage: response.data.user?.profileImage || currentUser.profileImage
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        return response.data;
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Update user personal info error:", error);
      // Don't throw error here, continue with profile update
    }
  },

  // Format employer data for API
  formatEmployerData(formData) {
    return {
      companyInfo: {
        companyName: formData.company?.name || "",
        aboutUs: formData.company?.about || "",
      },
      foundingInfo: {
        organizationType: formData.founding?.organizationType || "",
        industryType: formData.founding?.industryType || "",
        teamSize: formData.founding?.teamSize || "",
        yearOfEstablishment: formData.founding?.year || "",
        companyWebsite: formData.founding?.website || "",
        companyVision: formData.founding?.vision || "",
      },
      socialLinks: (formData.social || []).filter(link => link.platform && link.url).map(link => ({
        platform: link.platform,
        url: link.url,
      })),
      contact: {
        location: formData.contact?.location || "",
        phone: formData.contact?.phone || "",
        email: formData.contact?.email || "",
      },
      files: {
        logo: formData.company?.logo,
        banner: formData.company?.banner,
      }
    };
  },

  // Create or update employer profile
  async createOrUpdateEmployerProfile(formData) {
    try {
      console.log("👔 [PROFILE SERVICE] Updating employer profile");

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append JSON data
      formDataToSend.append("companyInfo", JSON.stringify(formData.companyInfo || {}));
      formDataToSend.append("foundingInfo", JSON.stringify(formData.foundingInfo || {}));
      formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks || []));
      formDataToSend.append("contact", JSON.stringify(formData.contact || {}));

      // Append files if they exist
      if (formData.files?.logo && formData.files.logo instanceof File) {
        formDataToSend.append("logo", formData.files.logo);
      }
      if (formData.files?.banner && formData.files.banner instanceof File) {
        formDataToSend.append("banner", formData.files.banner);
      }

      const response = await api.post("/profile/employer", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ [PROFILE SERVICE] Server response:", response.data);

      if (response.data.success) {
        toast.success("Employer profile updated successfully!");
        return {
          success: true,
          message: "Employer profile updated successfully",
          profile: response.data.profile,
          completionPercentage: response.data.completionPercentage,
          isProfileComplete: response.data.isProfileComplete
        };
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Employer profile error:", error);
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update employer profile";

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get current user's profile
  async getMyProfile() {
    try {
      console.log("👤 [PROFILE SERVICE] Fetching user profile");
      
      const response = await api.get("/profile/me");

      if (response.data.success && response.data.profile) {
        console.log("✅ [PROFILE SERVICE] Profile loaded:", response.data.profile);
        return response.data.profile;
      } else {
        console.log("ℹ️ [PROFILE SERVICE] No profile found");
        return null;
      }
    } catch (error) {
      // Handle 404 specifically (profile not found)
      if (error.response?.status === 404) {
        console.log("ℹ️ [PROFILE SERVICE] Profile not found");
        return null;
      }
      
      // Handle 401 (unauthorized) - clear auth data
      if (error.response?.status === 401) {
        console.log("🔒 [PROFILE SERVICE] Unauthorized, clearing auth data");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        return null;
      }

      console.error("❌ [PROFILE SERVICE] Get profile error:", error);
      
      // Don't throw for network or other errors, just return null
      return null;
    }
  },

  // Check profile completion status
  async checkProfileCompletion() {
    try {
      const response = await api.get("/profile/check-completion");

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to check profile completion");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Check completion error:", error);
      
      // If no profile exists, that's okay
      if (error.response?.status === 404) {
        return {
          hasProfile: false,
          completionPercentage: 0,
          isProfileComplete: false,
        };
      }

      throw error;
    }
  },

  // Delete profile
  async deleteProfile() {
    try {
      const response = await api.delete("/profile");

      if (response.data.success) {
        toast.success("Profile deleted successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Delete profile error:", error);
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete profile";

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get public profile by ID
  async getProfileById(profileId) {
    try {
      const response = await api.get(`/profile/${profileId}`);

      if (response.data.success) {
        return response.data.profile;
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("❌ [PROFILE SERVICE] Get profile by ID error:", error);
      
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile";

      throw new Error(errorMessage);
    }
  },

  // Helper: Get user role from localStorage
  getUserRole() {
    if (typeof window === "undefined") return null;
    
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Helper: Check if user needs to complete profile
  async shouldCompleteProfile() {
    try {
      const role = this.getUserRole();
      
      // If no role or not employer, no employer profile needed
      if (!role || role !== "employer") {
        return { needsCompletion: false };
      }

      const result = await this.checkProfileCompletion();
      
      // If no profile exists, needs completion
      if (!result.hasProfile) {
        return {
          needsCompletion: true,
          completionPercentage: 0,
          message: "Please complete your employer profile",
          role: role,
        };
      }

      // If profile exists but not complete enough
      if (result.completionPercentage < 80) {
        return {
          needsCompletion: true,
          completionPercentage: result.completionPercentage,
          message: "Please complete your employer profile",
          role: role,
        };
      }

      return {
        needsCompletion: false,
        completionPercentage: result.completionPercentage,
        role: role,
      };
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return { needsCompletion: false };
    }
  }
};