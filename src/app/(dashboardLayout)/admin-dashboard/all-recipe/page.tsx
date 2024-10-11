"use client";

import React from "react";
import { useUpdateRecipeStatusMutation, useGetAllRecipeQuery } from "@/GlobalRedux/api/api"; // Adjust the path as necessary

const AllRecipe = () => {
  const { data: recipes, isLoading, error } = useGetAllRecipeQuery();
  const [updateRecipeStatus] = useUpdateRecipeStatusMutation();

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
        {recipes?.data?.map((recipe) => (
          <tr key={recipe._id.$oid}>
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
