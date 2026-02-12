import api from "@/utils/api";
import toast from "react-hot-toast";

export const candidateService = {
  // ============================================
  // PUBLIC CANDIDATE SEARCH
  // ============================================

  // Get all candidates with filters
  async getAllCandidates(filters = {}) {
    try {
      console.log("👥 [CANDIDATE SERVICE] Fetching candidates with filters:", filters);

      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/candidate-profile/all?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Candidates fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch candidates");
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Get candidates error:", error);
      throw error;
    }
  },

  // Get candidate by ID with full details
  async getCandidateById(candidateId) {
    try {
      console.log("👤 [CANDIDATE SERVICE] Fetching candidate:", candidateId);

      const response = await api.get(`/candidate-profile/${candidateId}/details`);

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Candidate fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch candidate");
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Get candidate error:", error);
      
      if (error.response?.status === 404) {
        throw new Error('Candidate not found');
      }
      if (error.response?.status === 403) {
        throw new Error('This profile is private');
      }
      
      throw error;
    }
  },

  // Get candidate filter options
  async getCandidateFilters() {
    try {
      console.log("🔍 [CANDIDATE SERVICE] Fetching filter options");

      const response = await api.get('/candidate-profile/filters');

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Filters fetched successfully");
        return response.data.filters;
      } else {
        return this.getDefaultFilters();
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Get filters error:", error);
      return this.getDefaultFilters();
    }
  },

  // Default filters for fallback
  getDefaultFilters() {
    return {
      experienceLevels: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
      educationLevels: ['High School', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'],
      genders: ['Male', 'Female', 'Other', 'Prefer not to say'],
      completionRanges: [
        { label: 'All Profiles', value: 0 },
        { label: '50%+ Complete', value: 50 },
        { label: '80%+ Complete', value: 80 },
        { label: '100% Complete', value: 100 }
      ]
    };
  },

  // ============================================
  // SAVE/UNSAVE CANDIDATES (Employer only)
  // ============================================

  // Save candidate
  async saveCandidate(candidateId) {
    try {
      console.log("💾 [CANDIDATE SERVICE] Saving candidate:", candidateId);

      const response = await api.post(`/candidate-profile/${candidateId}/save`);

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Candidate saved successfully");
        toast.success("Candidate saved successfully!");
        return response.data.savedCandidate;
      } else {
        throw new Error(response.data.message || "Failed to save candidate");
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Save candidate error:", error);
      
      if (error.response?.status === 400) {
        toast.error("Candidate already saved");
      } else {
        toast.error("Failed to save candidate");
      }
      
      throw error;
    }
  },

  // Unsave candidate
  async unsaveCandidate(candidateId) {
    try {
      console.log("🗑️ [CANDIDATE SERVICE] Unsaving candidate:", candidateId);

      const response = await api.delete(`/candidate-profile/${candidateId}/save`);

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Candidate unsaved successfully");
        toast.success("Candidate removed from saved list");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to unsave candidate");
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Unsave candidate error:", error);
      toast.error("Failed to unsave candidate");
      throw error;
    }
  },

  // Check if candidate is saved
  async checkSavedCandidate(candidateId) {
    try {
      const response = await api.get(`/candidate-profile/${candidateId}/check-saved`);

      if (response.data.success) {
        return response.data.isSaved;
      }
      return false;
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Check saved error:", error);
      return false;
    }
  },

  // Get saved candidates for employer
  async getSavedCandidates(filters = {}) {
    try {
      console.log("📋 [CANDIDATE SERVICE] Fetching saved candidates");

      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/candidate-profile/saved/employer?${queryParams.toString()}`);

      if (response.data.success) {
        console.log("✅ [CANDIDATE SERVICE] Saved candidates fetched successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch saved candidates");
      }
    } catch (error) {
      console.error("❌ [CANDIDATE SERVICE] Get saved candidates error:", error);
      throw error;
    }
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Format experience for display
  formatExperience(experience) {
    if (!experience || experience === '') return 'Not specified';
    return experience;
  },

  // Format education for display
  formatEducation(education) {
    if (!education || education === '') return 'Not specified';
    return education;
  },

  // Format location for display
  formatLocation(profile) {
    if (profile.accountSettings?.contact?.location) {
      return profile.accountSettings.contact.location;
    }
    return 'Location not specified';
  },

  // Get profile image or default
  getProfileImage(profile) {
    if (profile.personalInfo?.profileImage) {
      return profile.personalInfo.profileImage;
    }
    if (profile.user?.avatar) {
      return profile.user.avatar;
    }
    return null;
  },

  // Calculate age from date of birth
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  },

  // Format date of birth
  formatDateOfBirth(dateOfBirth) {
    if (!dateOfBirth) return 'Not specified';
    return new Date(dateOfBirth).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Get profile completion color
  getCompletionColor(percentage) {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Get profile completion bg color
  getCompletionBgColor(percentage) {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  },

  // Get initials from name
  getInitials(name) {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  },

  // Generate random color for avatar
  getAvatarColor(name) {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  }
};