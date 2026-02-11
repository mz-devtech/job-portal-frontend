"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectUser, selectRole, selectIsAuthenticated } from "@/redux/slices/userSlice";
import { profileService } from "@/services/candidateprofileService";

export default function ProfileAlert({
  title = "Complete Your Profile to Stand Out!",
  description = "Finish setting up your profile to increase your chances of getting hired.",
  buttonText = "Complete Profile →",
  onClick,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated && userRole === "candidate") {
      checkProfileCompletion();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userRole]);

  const checkProfileCompletion = async () => {
    try {
      setLoading(true);
      
      // Try to get the profile from the service
      const profileData = await profileService.getMyProfile();
      setProfile(profileData);
      
      // Show alert if:
      // 1. No profile exists OR
      // 2. Profile exists but is not complete (less than 80%)
      const shouldShow = !profileData || 
                        (profileData && 
                         profileData.completionPercentage < 80);
      
      setShowAlert(shouldShow);
      
      console.log("📊 Profile Alert Check:", {
        hasProfile: !!profileData,
        completion: profileData?.completionPercentage || 0,
        isComplete: profileData?.isProfileComplete || false,
        showAlert: shouldShow
      });
      
    } catch (error) {
      console.log("ℹ️ No profile found or error checking profile:", error.message);
      // If we can't get profile, show alert to encourage creating one
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = "/candidate/settings";
    }
  };

  if (loading) return null;
  
  // Don't show alert if profile is complete
  if (!showAlert) return null;

  // If profile exists but is not complete enough, show improvement alert
  if (profile && profile.completionPercentage > 0 && profile.completionPercentage < 80) {
    return (
      <div className="mt-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
        <div className="flex items-start">
          <FiAlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Improve Your Profile ({profile.completionPercentage}% Complete)
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Your profile is {profile.completionPercentage}% complete. 
                Complete all sections to increase your visibility to employers.
              </p>
              <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profile.completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={handleClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no profile or 0% complete, show creation alert
  return (
    <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
      <div className="flex items-start">
        <FiAlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>{description}</p>
          </div>
          <div className="mt-3">
            <button
              onClick={handleClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}