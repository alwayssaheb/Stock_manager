// AuthContext.js
"use client";
import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    console.log("I ran first");
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        console.log("im in");
        const decoded = jwtDecode(token);
        setAuthUser(decoded);
        setRole(decoded.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
    setLoading(false); 
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    role,
    setRole,
    logout,
    loading, 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
