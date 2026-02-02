// services/authService.js
import api from "@/utils/api";
import toast from "react-hot-toast";

export const authService = {
  async register(userData) {
    try {
      console.log("Registering user with data:", userData);

      // Prepare data for backend
      const registrationData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role, // Make sure role is included
      };

      console.log("Sending to backend:", registrationData);

      const response = await api.post("/auth/register", registrationData);

      if (response.data.success) {
        // Store email for verification
        if (typeof window !== "undefined" && response.data.user?.email) {
          localStorage.setItem("userEmail", response.data.user.email);
          localStorage.setItem("userRole", response.data.user.role); // Store role
          localStorage.removeItem("registerError");

          // Also store token if provided
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }
        }

        toast.success(
          response.data.message ||
            `Registration successful as ${response.data.user?.role}! Please verify your email.`,
        );
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error in service:", error);

      // Store error for debugging
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "registerError",
          JSON.stringify({
            message: error.message,
            data: error.response?.data,
            timestamp: new Date().toISOString(),
          }),
        );
      }

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Registration failed";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, // services/authService.js - register function

 // Update the login function in your existing authService
async login(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    const { token, user } = response.data;

    // Store token and user in localStorage (for backward compatibility)
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Return data for Redux to handle cookies
    toast.success("Login successful!");
    return { token, user };
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";

    // Special handling for email verification required
    if (error.response?.data?.requiresVerification) {
      if (typeof window !== "undefined" && credentials.email) {
        localStorage.setItem("userEmail", credentials.email);
      }
      toast.error("Please verify your email first");
    } else {
      toast.error(message);
    }

    throw error;
  }
},

  async verifyEmail(verificationData) {
    try {
      console.log("🔐 [AUTH SERVICE] Verifying email with:", verificationData);
      toast.success(
        "Email verified successfully! Please login with your credentials.",
      );
      // Send 'code' instead of 'token' to match backend
      const payload = {
        code: verificationData.code, // CRITICAL FIX: Use 'code' not 'token'
        email: verificationData.email,
      };

      console.log("📤 [AUTH SERVICE] Sending verification:", payload);

      const response = await api.post("/auth/verify-email", payload);

      // Clear stored email after successful verification
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
      }

      // REMOVED toast - component will handle
      console.log("✅ [AUTH SERVICE] Email verification successful");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Email verification failed";
      throw new Error(message);
    }
  },

  // Resend verification code - UPDATED for 6-digit
  async resendVerification(emailData) {
    try {
      const response = await api.post("/auth/resend-verification", emailData);
      toast.success("New verification code sent to your email!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to resend verification code";
      toast.error(message);
      throw error;
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, passwords) {
    try {
      const response = await api.put(
        `/auth/reset-password/${token}`,
        passwords,
      );
      toast.success("Password reset successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      throw error;
    }
  },

  // Get current user
  async getMe() {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      // Silently handle auth errors for getMe
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  // Logout
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
    }
    toast.success("Logged out successfully!");
  },

  // Check if user is authenticated
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    if (!token) return false;

    // Optional: Validate token expiry
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  },

  // Get current user from localStorage
  getCurrentUser() {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Get stored email for verification
  getStoredEmail() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userEmail");
  },

  // Get stored token
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // Update user profile
  async updateProfile(userId, data) {
    try {
      const response = await api.put(`/users/${userId}`, data);
      toast.success("Profile updated successfully!");

      // Update stored user data
      if (response.data.user && typeof window !== "undefined") {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      throw error;
    }
  },

  // Change password
  async changePassword(data) {
    try {
      const response = await api.put("/auth/change-password", data);
      toast.success("Password changed successfully!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password change failed";
      toast.error(message);
      throw error;
    }
  },

  // Check if email is verified (for protected routes)
  isEmailVerified() {
    const user = this.getCurrentUser();
    return user?.isEmailVerified || false;
  },

  async googleAuth(role = "candidate") {
    try {
      // Redirect to backend Google auth endpoint with role
      const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google?role=${role}`;
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("Failed to initiate Google sign-in");
    }
  },

  async googleSignup(role = "candidate") {
    try {
      const googleSignupUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/google/signup?role=${role}`;
      window.location.href = googleSignupUrl;
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Failed to initiate Google sign-up");
    }
  },

  async handleGoogleCallback(tokenData) {
    try {
      // Get user info from backend
      const response = await api.get(
        `/auth/google/user?token=${tokenData.token}&userId=${tokenData.userId}`,
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }

        toast.success(`Welcome ${user.name}!`);
        return response.data;
      }
    } catch (error) {
      console.error("Google callback error:", error);
      toast.error("Failed to complete Google authentication");
      throw error;
    }
  },

// Add these methods to your authService

async facebookAuth(role = "candidate") {
  try {
    // Redirect to backend Facebook auth endpoint with role
    const facebookAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/facebook?role=${role}`;
    window.location.href = facebookAuthUrl;
  } catch (error) {
    console.error("Facebook auth error:", error);
    toast.error("Failed to initiate Facebook sign-in");
  }
},

async facebookSignup(role = "candidate") {
  try {
    const facebookSignupUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/facebook/signup?role=${role}`;
    window.location.href = facebookSignupUrl;
  } catch (error) {
    console.error("Facebook signup error:", error);
    toast.error("Failed to initiate Facebook sign-up");
  }
},

async handleFacebookCallback(tokenData) {
  try {
    // Get user info from backend
    const response = await api.get(
      `/auth/facebook/user?token=${tokenData.token}&userId=${tokenData.userId}`,
    );

    if (response.data.success) {
      const { token, user } = response.data;

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success(`Welcome ${user.name}!`);
      return response.data;
    }
  } catch (error) {
    console.error("Facebook callback error:", error);
    toast.error("Failed to complete Facebook authentication");
    throw error;
  }
},


};
