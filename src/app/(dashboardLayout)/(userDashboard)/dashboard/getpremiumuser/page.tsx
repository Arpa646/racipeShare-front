"use client";

import React from "react";
import { getUser } from "@/services";
import { jwtDecode } from "jwt-decode"; // Correct import for jwtDecode
import { useSelector } from "react-redux";

import { useMakePremiumMutation } from "@/GlobalRedux/api/api";
interface CustomJwtPayload {
  role?: string;
  userId?: string;
  useremail?: string;
}

const RecipeSubscription = () => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Access Recipes, Free and Premium!
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Explore delicious recipes. Upgrade to Premium for exclusive recipes!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Free User</h2>
            <p className="text-2xl font-semibold text-gray-800">Free</p>
            <p className="text-gray-500 mb-6">Access to regular recipes</p>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md w-full cursor-not-allowed opacity-50">
              Already Active
            </button>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>✔ Unlimited access to regular recipes</li>
              <li>✔ Access to recipe uploads</li>
              <li>✔ Access community ratings</li>
            </ul>
          </div>

          {/* Gold Premium Plan */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Gold Member
            </h2>
            <p className="text-3xl font-semibold text-gray-800">
              $12.99<span className="text-sm text-gray-500">/month</span>
            </p>
            <p className="text-gray-500 mb-6">
              Exclusive access to premium recipes
            </p>
         


            <button
        onClick={handlePurchasePremium}
        className="bg-yellow-500 text-white py-2 px-4 rounded-md w-full"
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Processing..." : "Purchase Premium"}
      </button>



            <ul className="mt-6 space-y-2 text-gray-700">
              <li>✔ Everything in Free, plus:</li>
              <li>✔ Access to premium recipes</li>
              <li>✔ Early access to new uploads</li>
              <li>✔ Exclusive cooking tips and guides</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSubscription;
