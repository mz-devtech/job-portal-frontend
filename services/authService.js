<<<<<<< HEAD
=======
// services/authService.js
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
import api from "@/utils/api";
import toast from "react-hot-toast";

export const authService = {
<<<<<<< HEAD
  // REGISTRATION - FIXED: No auto-login
  async register(userData) {
    try {
      console.log("🔐 [AUTH SERVICE] Registering user WITHOUT auto-login:", userData);

=======
  async register(userData) {
    try {
      console.log("Registering user with data:", userData);

      // Prepare data for backend
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      const registrationData = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
<<<<<<< HEAD
        role: userData.role,
      };

      console.log("📤 [AUTH SERVICE] Sending to backend:", registrationData);
=======
        role: userData.role, // Make sure role is included
      };

      console.log("Sending to backend:", registrationData);
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d

      const response = await api.post("/auth/register", registrationData);

      if (response.data.success) {
<<<<<<< HEAD
        // IMPORTANT: Store ONLY email for verification, NO token
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", response.data.user.email);
          localStorage.setItem("userRole", userData.role);
          // CRITICAL: Remove any existing auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("registerError");
          console.log("📧 [AUTH SERVICE] Only email stored, no token");
=======
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
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        }

        toast.success(
          response.data.message ||
<<<<<<< HEAD
            `Registration successful! Please verify your email.`,
=======
            `Registration successful as ${response.data.user?.role}! Please verify your email.`,
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        );
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("❌ [AUTH SERVICE] Registration error:", error);
=======
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
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
        email: verificationData.email,
      };

      console.log("📤 [AUTH SERVICE] Sending verification:", payload);

      const response = await api.post("/auth/verify-email", payload);

      // Clear stored email after successful verification
      if (typeof window !== "undefined") {
        localStorage.removeItem("userEmail");
<<<<<<< HEAD
        // IMPORTANT: DO NOT store token here
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        console.log("✅ [AUTH SERVICE] Email verified, NO token stored");
      }

      toast.success("Email verified successfully! Please login with your credentials.");
=======
      }

      // REMOVED toast - component will handle
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
      console.log("✅ [AUTH SERVICE] Email verification successful");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Email verification failed";
      throw new Error(message);
    }
  },

<<<<<<< HEAD
  // Resend verification code
=======
  // Resend verification code - UPDATED for 6-digit
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    if (!token) return false;

<<<<<<< HEAD
    // Validate token expiry
=======
    // Optional: Validate token expiry
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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

<<<<<<< HEAD
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    // Only return user if token exists (logged in)
    if (!token || !userStr) return null;
=======
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d

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

<<<<<<< HEAD
  // Check if email is verified
=======
  // Check if email is verified (for protected routes)
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
  isEmailVerified() {
    const user = this.getCurrentUser();
    return user?.isEmailVerified || false;
  },

  async googleAuth(role = "candidate") {
    try {
<<<<<<< HEAD
=======
      // Redirect to backend Google auth endpoint with role
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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
<<<<<<< HEAD
=======
      // Get user info from backend
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
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

<<<<<<< HEAD
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
=======
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
>>>>>>> 440e4443cf6219e9c225a3550a37f5457801a70d
