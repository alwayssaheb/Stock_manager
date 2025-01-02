"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation"; // Include path-based routing
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/signup", "/auth/signin"];

  useEffect(() => {
    // Only redirect unauthorized users if they access a protected route
    if (!loading && !isLoggedIn && !publicRoutes.includes(pathname)) {
      console.log("This is isLoggedIn: ", isLoggedIn);
      router.push("/auth/signin");
      console.log("Redirecting to sign-in page");
    }
  }, [isLoggedIn, loading, pathname, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    console.log("Unauthorized access to a protected route:", pathname);
    return null; // Prevent rendering protected content during redirect
  }

  console.log("Access granted to:", pathname);
  return children;
};

export default ProtectedRoute;
