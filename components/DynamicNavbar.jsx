"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import CandidateNavbar from "./CandidateNavbar";
import EmployerNavbar from "./EmployerNavbar";
import { selectIsAuthenticated, selectRole, selectIsLoading, loadUserFromStorage } from "@/redux/slices/userSlice";

const DynamicNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);
  const isLoading = useSelector(selectIsLoading);

  // Handle hydration and load user from storage
  useEffect(() => {
    setMounted(true);
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Don't render during SSR or while loading initial auth state
  if (!mounted || isLoading) {
    return <div className="h-16 bg-white"></div>; // Placeholder with same height
  }

  // Render appropriate navbar based on authentication and role
  if (isAuthenticated) {
    if (userRole === "candidate") {
      return <CandidateNavbar />;
    } else if (userRole === "employer") {
      return <EmployerNavbar />;
    } else if (userRole === "admin") {
      // You can create an AdminNavbar component if needed
      return <Navbar />;
    }
  }

  // Default navbar for non-authenticated users
  return <Navbar />;
};

export default DynamicNavbar;