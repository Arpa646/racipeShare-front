"use client";

import React from "react";
import { useUpdateRecipeStatusMutation, useGetAllRecipeQuery } from "@/GlobalRedux/api/api"; // Adjust the path as necessary

const AllRecipe = () => {
  const { data: recipes, isLoading, error } = useGetAllRecipeQuery(undefined);
  const [updateRecipeStatus] = useUpdateRecipeStatusMutation();
  interface ObjectId {
    _id: string;
  }



  interface Comment {
    userId: ObjectId;
    comment: string;
    _id: ObjectId;
  }

  interface Rating {
    userId: ObjectId;
    rating: number;
    _id: ObjectId;
  }

  interface Recipe {
    _id: string;
    title: string;
    time: string; // or number, depending on how you want to handle time
    image: string;
    recipe: string; // Assuming it's HTML content
    user: ObjectId;
    isDeleted: boolean;
    isPublished: boolean;
    comments: Comment[];
    createdAt: Date; // or string, depending on how you want to handle date
    updatedAt: Date; // or string, depending on how you want to handle date
    __v: number;
    rating: number; // Assuming it's a number
    ratings: Rating[];
    dislikedBy:  string[]; // Assuming an array of ObjectId for users who disliked
    likedBy: string[]; // Assuming an array of ObjectId for users who liked
  }

  // Handle the publish toggle action
  const handlePublishToggle = async (id: string) => {
    try {
      await updateRecipeStatus( {id});
      alert("Recipe publish status updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  console.log(recipes)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recipes</div>;

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Title</th>
          <th className="py-2">Time</th>
          <th className="py-2">Rating</th>
          <th className="py-2">Published</th>
          <th className="py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {recipes?.data?.map((recipe:Recipe) => (
          <tr key={String(recipe._id)}>
            <td className="border px-4 py-2">{recipe.title}</td>
            <td className="border px-4 py-2">{recipe.time}</td>
            <td className="border px-4 py-2">{recipe.rating}</td>
            <td className="border px-4 py-2">{recipe.isPublished ? "Yes" : "No"}</td>
            <td className="border px-4 py-2">
              <button
                className={`px-4 py-2 ${recipe.isPublished ? "bg-red-500" : "bg-green-500"} text-white rounded`}
                onClick={() => handlePublishToggle(recipe._id)}
              >
                {recipe.isPublished ? "Unpublish" : "Publish"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AllRecipe;
