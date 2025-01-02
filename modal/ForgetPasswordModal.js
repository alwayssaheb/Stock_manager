import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { authUser } = useAuth();

    // Prevent further action if user is not logged in
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

    // Check if user is logged in, this will prevent rerenders on initial render
    useEffect(() => {
        if (!authUser) {
            setIsUserLoggedIn(false);
            setError("You are not logged in. Please log in to change your password.");
        } else {
            setIsUserLoggedIn(true);
            setError(""); // Reset error message
        }
    }, [authUser]);

    const email = authUser?.email;

    // Handle form submission
    const handleChangePassword = async () => {
        if (!newPassword) {
            setError("Password is required.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/forgetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    newPassword, // Only send new password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password updated successfully!");
                setNewPassword(""); // Clear password field after success
            } else {
                setError(data.error || "An error occurred.");
            }
        } catch (error) {
            setError("An error occurred while updating the password.");
        } finally {
            setLoading(false);
        }
    };

    // Return null if user is not logged in and error is present
    if (!isUserLoggedIn || !isOpen) {
        return null;
    }

    return (
        <>
            {isOpen && authUser && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full md:w-96 transform transition-all duration-300 ease-in-out scale-95 md:scale-100">
                        <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>

                        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                        {message && <div className="text-green-600 mb-4 text-center">{message}</div>}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={onClose}
                                className="text-gray-600 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={loading}
                                className={`${
                                    loading ? "bg-gray-400" : "bg-blue-500"
                                } text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none`}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
