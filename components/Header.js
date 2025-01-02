"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ForgetPasswordModal from "../modal/ForgetPasswordModal"; // Import the modal

export default function Header() {
  const { isLoggedIn, logout, authUser } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleSignOut = () => {
    logout();
    router.push("/auth/signin");
  };

  const handleForgetPassword = () => {
    setIsModalOpen(true); // Open the modal when "Forget Password" is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleUpdatePassword = (newPassword) => {
    // Your logic for updating the password goes here
    console.log("Password updated to:", newPassword);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
                {/* Welcome Message and Dropdown */}
                <li className="relative px-4 py-2 text-center lg:text-left">
                  <span
                    className="text-gray-800 cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    Welcome, {authUser?.username} ▼
                  </span>
                  {dropdownOpen && (
                    <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded shadow-md">
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={handleForgetPassword} // Open modal on click
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Forget Password
                      </button>
                    </div>
                  )}
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

      {/* Password Reset Modal */}
      <ForgetPasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleUpdatePassword}
      />
    </header>
  );
}
