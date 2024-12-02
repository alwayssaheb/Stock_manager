
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) { 
      console.log("This is IsLoggedIn: ", isLoggedIn);
      router.push("/auth/signin");
      console.log("This is protectedRoute");
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
   
    return <div>Loading...</div>; 
  }

 
  if (!isLoggedIn) {
    console.log("this is ProtectedRoute", isLoggedIn); 
  }
  console.log("yes:", isLoggedIn);
  return children; 
};

export default ProtectedRoute;
