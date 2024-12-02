// ProtectedRoute.js
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth(); // Get loading state from context
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) { // Only check login state after loading is done
      console.log("This is IsLoggedIn: ", isLoggedIn);
      router.push("/auth/signin");
      console.log("This is protectedRoute");
    }
  }, [isLoggedIn, loading, router]); // Dependency array ensures the effect runs when loading or isLoggedIn changes

  if (loading) {
    // You can return a loading spinner or placeholder here
    return <div>Loading...</div>; // Show loading spinner or placeholder
  }

  // Only render children if the user is logged in
  if (!isLoggedIn) {
    console.log("this is ProtectedRoute", isLoggedIn); // Optionally, you could return null or show a loading spinner until authentication completes
  }
  console.log("yes:", isLoggedIn);
  return children; // Render protected content
};

export default ProtectedRoute;
