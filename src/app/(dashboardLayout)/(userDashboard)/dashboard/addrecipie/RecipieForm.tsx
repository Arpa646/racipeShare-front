"use client";

import React, { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill
import { useAddRecipeMutation } from "@/GlobalRedux/api/api";
import { useUser } from "@/services";

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RecipieForm = () => {
  // States for recipe details
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeContent, setRecipeContent] = useState("");
  const [recipeTime, setRecipeTime] = useState("");
  const [recipeImage, setRecipeImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hook to trigger the mutation for adding a recipe
  const [addRecipe, { isLoading: isAddingRecipe }] = useAddRecipeMutation();

  // Get current user ID from the service
  const { userId } = useUser();

  // Handle form submission for adding a new recipe
  const handleRecipeSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Show loading state

    // Construct the recipe data object
    const recipeData = {
      title: recipeTitle,
      recipe: recipeContent,
      time: recipeTime,
      image: recipeImage,
      user: userId, // Include the user ID
    };

    try {
      // Call the mutation to add the recipe
      const response = await addRecipe(recipeData).unwrap();
      console.log("Recipe added successfully:", response);
      alert("Recipe submitted successfully!");

      // Reset form fields after submission
      setRecipeTitle("");
      setRecipeContent("");
      setRecipeTime("");
      setRecipeImage("");
    } catch (error) {
      console.error("Error submitting recipe:", error);

      // Handle API error with a message
      const apiError = error as { data?: { message?: string } };
      alert(
        "Failed to submit the recipe. " +
          (apiError.data?.message || "Please try again later.")
      );
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Create a Recipe
        </h1>
        <form onSubmit={handleRecipeSubmit}>
          {/* Recipe Title Input */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Recipe Title
            </label>
            <input
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter recipe title"
              required
            />
          </div>

          {/* Time Required Input */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Time Required
            </label>
            <input
              type="text"
              value={recipeTime}
              onChange={(e) => setRecipeTime(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter time required (e.g., 30 mins)"
              required
            />
          </div>

          {/* Image URL Input */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Image URL</label>
            <input
              type="text"
              value={recipeImage}
              onChange={(e) => setRecipeImage(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter image URL"
            />
          </div>

          {/* Recipe Content (Quill Editor) */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Recipe Content
            </label>
            <ReactQuill
              theme="snow"
              value={recipeContent}
              onChange={setRecipeContent}
              placeholder="Write your recipe instructions or description here..."
              className="h-64"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
            disabled={isLoading || isAddingRecipe}
          >
            {isLoading || isAddingRecipe ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipieForm;
