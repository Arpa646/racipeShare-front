"use client";
import React, { useState } from "react";
import {
  useGetRecipeByEmailQuery,
  useGetAllUserQuery,
  useGetAllRecipeQuery,
  useFollowRequestMutation,
  useUnfollowRequestMutation, // Import the unfollow mutation
} from "@/GlobalRedux/api/api"; // Adjust the import path if necessary
import { useUser } from "@/services";

const UserProfilePage = ({ params }) => {
  const email = params.userId;
  const { userId } = useUser();
  const { data: recipe, isLoading: recipeLoading } =
    useGetRecipeByEmailQuery(email);
  const { data: allUsersData } = useGetAllUserQuery();
  const { data: allRecipesData } = useGetAllRecipeQuery(undefined);

  const RecipeOwner = recipe?.data?.slice(0, 1)[0]?.user; // Extract the first user from the recipe array
  const userRecipe = recipe?.data; // All recipes by the specific user
  const allRecipes = allRecipesData?.data; // All recipes in the database
  const allUsers = allUsersData?.data; // All users in the database
  const [followRequest] = useFollowRequestMutation();
  const [unFollowRequest] = useUnfollowRequestMutation(); // Declare the unfollow request mutation

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  if (recipeLoading) return <p>Loading...</p>;

  const handleFollow = async () => {
    try {
      await followRequest({
        currentUserId: userId,
        targetUserId: RecipeOwner._id,
      });
      console.log("Follow request successful");
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  // Check if the current user is already following the RecipeOwner
  const isFollowing = RecipeOwner?.followers?.includes(userId);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleUnfollow = async () => {
    try {
      await unFollowRequest({
        currentUserId: userId,
        targetUserId: RecipeOwner._id,
      });
      console.log("Unfollow request successful");
      // Optionally update the local state or UI here
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
    // Close the dropdown after unfollowing
    setIsDropdownOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-8">
      {/* Left section: User Info and Recipes by Email */}
      <div className="col-span-1 md:col-span-3 grid grid-rows-2 gap-4">
        {/* User Info */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            <div className="mb-4">
              <img
                className="rounded-full w-32 h-32 md:w-44 md:h-44"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="Profile Picture"
              />
            </div>
            <div className="text-center font-bold space-y-3">
              <h2 className="text-lg font-semibold">
                {RecipeOwner?.name || "Unknown User"}
              </h2>
              <div className="flex gap-3 md:gap-5">
                <div>
                  <p>{userRecipe?.length || 0}</p>
                  <p>Posts</p>
                </div>
                <div>
                  <p>{RecipeOwner?.followers?.length || 0}</p>
                  <p>Followers</p>
                </div>
                <div>
                  <p>{RecipeOwner?.following?.length || 0}</p>
                  <p>Following</p>
                </div>
              </div>
              {isFollowing ? (
                <div className="relative inline-block">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Following
                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                      <button
                        onClick={handleUnfollow}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Unfollow
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleFollow}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Recipes by Email */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">
            Recipes by {RecipeOwner?.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {userRecipe?.map((recipeItem) => (
              <div
                key={recipeItem._id}
                className="bg-gray-200 p-2 rounded-lg shadow-md"
              >
                <img
                  src={recipeItem?.image}
                  alt={recipeItem.name}
                  className="mb-2 w-full h-24 object-cover"
                />
                <p className="text-sm">{recipeItem.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right section: All Users */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">All Users</h3>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {allUsers?.map((user) => (
            <div
              key={user.id}
              className="bg-gray-200 p-2 flex items-center justify-between rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <p>{user.name}</p>
              </div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                Follow
              </button>
            </div>
          ))}
        </div>

        <h1 className="m-4 font-semibold">Best Rated Recipe</h1>
        {/* All Recipes below All Users */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {allRecipes?.map((recipeItem) => (
            <div
              key={recipeItem.id}
              className="bg-gray-200 p-2 flex items-center justify-between rounded-lg shadow-md"
            >
              <div className="flex items-center">
                <img
                  src={recipeItem?.image}
                  alt={recipeItem.name}
                  className="w-16 h-16 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm">{recipeItem.title}</p>
                </div>
              </div>
              <button className="border border-black text-black px-2 py-1 rounded">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
