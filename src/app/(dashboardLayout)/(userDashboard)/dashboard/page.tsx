"use client";
import React from "react";
import { useMakePremiumMutation } from "@/GlobalRedux/api/api"; // Import your mutation hook from RTK Query
import {jwtDecode} from "jwt-decode"; // Correct import for jwtDecode
import { useSelector } from "react-redux";

const DashboardPage = () => {
  interface CustomJwtPayload {
    role?: string;
    userId?: string;
    useremail?: string;
  }

  // Get the token from Redux state
  const token = useSelector((state: any) => state.auth.token);
  console.log(token);

  // Decode the token to extract user info
  const user = token ? jwtDecode<CustomJwtPayload>(token) : null;

  console.log(user);

  // Extract role and userId (or email) from the token
  const role: string = user?.role || "Guest";
  const userId: string = user?.useremail || "Guest";
  console.log(userId);
  // Mutation hook
  const [getPremium, { isLoading, isError }] = useMakePremiumMutation();

  // Handle the purchase premium functionality
  const handlePurchasePremium = async () => {
    try {
      // Trigger the mutation
      const response = await getPremium(userId).unwrap();

      // Check for a payment link in the response and redirect the user
      if (response.data) {
        window.location.href = response.data.payment_url;
      } else {
        alert("Error: No payment link received.");
      }
    } catch (error) {
      console.error("Failed to initiate premium purchase:", error);
      alert("Error occurred while purchasing premium.");
    }
  };

  return (
    <div className="p-9">
      <h1>User Dashboard</h1>

      <button
        onClick={handlePurchasePremium}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Processing..." : "Purchase Premium"}
      </button>
      {isError && <p className="text-red-500 mt-2">Failed to initiate purchase. Try again.</p>}
    </div>
  );
};

export default DashboardPage;
