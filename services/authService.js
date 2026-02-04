import api from "@/utils/api";
import toast from "react-hot-toast";

export const authService = {
  // REGISTRATION - FIXED: No auto-login
  async register(userData) {
    try {
      console.log("🔐 [AUTH SERVICE] Registering user WITHOUT auto-login:", userData);

      const registrationData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      console.log("📤 [AUTH SERVICE] Sending to backend:", registrationData);

      const response = await api.post("/auth/register", registrationData);

      if (response.data.success) {
        // IMPORTANT: Store ONLY email for verification, NO token
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", response.data.user.email);
          localStorage.setItem("userRole", userData.role);
          // CRITICAL: Remove any existing auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("registerError");
          console.log("📧 [AUTH SERVICE] Only email stored, no token");
        }

        toast.success(
          response.data.message ||
            `Registration successful! Please verify your email.`,
        );
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("❌ [AUTH SERVICE] Registration error:", error);

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
  },

  // LOGIN - Only stores token on explicit login
  async login(credentials) {
    try {
      console.log("🔐 [AUTH SERVICE] User explicitly logging in");
      
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;

      // Only store token when user explicitly logs in
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // Clear verification email if exists
        localStorage.removeItem("userEmail");
        console.log("✅ [AUTH SERVICE] Token stored on explicit login");
      }

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

  // VERIFY EMAIL - FIXED: No auto-login after verification
  async verifyEmail(verificationData) {
    try {
      console.log("🔐 [AUTH SERVICE] Verifying email WITHOUT auto-login:", verificationData);
      
      // Send 'code' instead of 'token' to match backend
      const payload = {
        code: verificationData.code,
        email: verificationData.email,
      };

      console.log("📤 [AUTH SERVICE] Sending verification:", payload);

      const response = await api.post("/auth/verify-email", payload);

      // Clear stored email after successful verification
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
        // IMPORTANT: DO NOT store token here
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("✅ [AUTH SERVICE] Email verified, NO token stored");
      }

      toast.success("Email verified successfully! Please login with your credentials.");
      console.log("✅ [AUTH SERVICE] Email verification successful");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Email verification failed";
      throw new Error(message);
    }
  },

  // Resend verification code
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

  // LOGOUT - Enhanced to clear all auth data
  logout(clearAll = false) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      
      if (clearAll) {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("registerError");
      }
    }
    
    // Clear cookies
    this.clearCookies();
    
    console.log("🚪 [AUTH SERVICE] User logged out, all auth data cleared");
    toast.success("Logged out successfully!");
  },

  // Helper to clear cookies
  clearCookies() {
    if (typeof document !== 'undefined') {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  },

  // Check if user is authenticated (only via token)
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    if (!token) return false;

    // Validate token expiry
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

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    // Only return user if token exists (logged in)
    if (!token || !userStr) return null;

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

  // Check if email is verified
  isEmailVerified() {
    const user = this.getCurrentUser();
    return user?.isEmailVerified || false;
  },

  async googleAuth(role = "candidate") {
    try {
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

  async facebookAuth(role = "candidate") {
    try {
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
      const response = await api.get(
        `/auth/facebook/user?token=${tokenData.token}&userId=${tokenData.userId}`,
      );

      if (response.data.success) {
        const { token, user } = response.data;

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