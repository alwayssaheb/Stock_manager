"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { isLoggedIn, logout, authUser } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push("/auth/signin");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* App Name */}
        <h1
          onClick={() => router.push("/")}
          className="text-lg font-bold text-gray-800 cursor-pointer"
        >
          Stock Manager
        </h1>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="text-gray-600 lg:hidden focus:outline-none"
          aria-expanded={menuOpen ? "true" : "false"}
          aria-controls="menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <nav
          id="menu"
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-white z-50 shadow-md lg:flex lg:static lg:w-auto lg:items-center`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6 lg:items-center">
            {isLoggedIn ? (
              <>
                {/* Welcome Message */}
                <li className="px-4 py-2 text-center lg:text-left">
                  <span className="text-gray-800">
                    Welcome, {authUser?.email || "User"}!
                  </span>
                </li>
                <li className="px-4 py-2">
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 lg:inline lg:w-auto"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="px-4 py-2">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="block w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 lg:inline lg:w-auto"
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu: Ensure Welcome Message and Menu Dropdown don't overlap */}
      {menuOpen && isLoggedIn && (
        <div className="lg:hidden p-4 bg-gray-100 z-40 shadow-lg">
          <span className="text-gray-800 text-center block mb-2">
            Welcome, {authUser?.email || "User"}!
          </span>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
