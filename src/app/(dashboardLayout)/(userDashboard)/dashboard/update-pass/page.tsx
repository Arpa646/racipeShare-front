"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useChangePassMutation } from "@/GlobalRedux/api/api";
import { jwtDecode } from "jwt-decode";
import Link from "next/link"; // Import the Next.js Link component
const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  interface CustomJwtPayload {
    role?: string;
    userId?: string;
    useremail?: string;
  }
  // Fetching token from Redux store
  const token = useSelector((state) => state.auth.token);
  const user = token ? jwtDecode<CustomJwtPayload>(token) : null;
  //const role: string = user?.role || "Guest";
  const id: string = user?.useremail as string;
  console.log(id);
  // Using the mutation hook
  const [changePassword, { isLoading }] = useChangePassMutation();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Assuming you already have `userId` from the Redux store or passed in props
      const response = await changePassword({ id, newPassword }).unwrap();

      alert("Password updated successfully!");
    } catch (error) {
      console.error("Password update failed:", error);
      alert("Error updating password.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* SVG Link */}
      <Link href="/dashboard/myprofile">
        <p className="absolute top-44 left-40">
          {" "}
          {/* Adjust position as needed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-black" // Adjust size and color
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </p>
      </Link>

      {/* Form Container */}
      <div className="w-1/2 h-auto p-5 border bg-white">
        <h1 className="text-2xl">Update Password</h1>
        <form onSubmit={handlePasswordChange}>
          <div className="mt-4">
            <label className="block">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-2 py-1"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-2 py-1"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
