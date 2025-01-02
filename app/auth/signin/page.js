"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; 
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function SignIn() {
  const { setAuthUser, setIsLoggedIn, setRole,setusername, username } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  console.log("AUTH_SECRET in production:", process.env.AUTH_SECRET);

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    setError("");
    setSuccess("");

    try {
    
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("(*$!$^!*$&^!$*&!@^$*", data);
      setusername(data.user.username);
      console.log(username);
      

      if (response.ok) {
       
        setSuccess(data.message);

       
        localStorage.setItem("token", data.token);
        
        try {
          const decoded = jwtDecode(data.token);
          console.log("#@#@#@#@#@#@@#@#@@#", decoded);
          console.log("-------------------------------------------------------------------");
          console.log(decoded);
         
          setAuthUser(decoded); 
          setRole(decoded.role); 
          setIsLoggedIn(true); 
        } catch (error) {
          console.error("Failed to decode token:", error);
          setError("Failed to process authentication. Please try again.");
          return;
        }

       
        router.push("/");
      } else {
       console.log("The response in not good, fix it");
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.log("THis is the problem");
      console.error("Signin error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign In to Your Account
        </h2>
        {error && (
          <p className="text-red-500 text-center text-sm font-medium">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-center text-sm font-medium">{success}</p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
