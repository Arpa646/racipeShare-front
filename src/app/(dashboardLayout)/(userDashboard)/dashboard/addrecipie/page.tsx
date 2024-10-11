"use client";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill
import { useAddRecipeMutation } from "@/GlobalRedux/api/api";
import { useSelector } from "react-redux";

import { jwtDecode } from "jwt-decode";
const RecipeCreationPage = () => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeContent, setRecipeContent] = useState("");
  const [recipeTime, setRecipeTime] = useState(""); // State for time
  const [recipeImage, setRecipeImage] = useState(""); // State for image URL
  const [isLoading, setIsLoading] = useState(false);
  const [submittedRecipe, setSubmittedRecipe] = useState(null); // State to store submitted recipe

  const [addRecipe, { isLoading: isAddingRecipe }] = useAddRecipeMutation(); // useAddRecipeMutation hook

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
  // Handle form submission
  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const recipeData = {
      title: recipeTitle,
      recipe: recipeContent,
      time: recipeTime,
      image: recipeImage,
      user:id
    };

    try {
      // Send recipeData to the server using useAddRecipeMutation
      const response = await addRecipe(recipeData).unwrap();
      console.log("Recipe added successfully:", response);

      // Save the submitted recipe to display it on the page
      setSubmittedRecipe(response);

      // Reset form after submission
      setRecipeTitle("");
      setRecipeContent("");
      setRecipeTime("");
      setRecipeImage("");
      alert("Recipe submitted successfully!");
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Failed to submit the recipe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Create a Recipe</h1>
        <form onSubmit={handleRecipeSubmit}>
          {/* Recipe Title */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Recipe Title</label>
            <input
              type="text"
              value={recipeTitle}
              onChange={(e) => setRecipeTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter recipe title"
              required
            />
          </div>

          {/* Recipe Time */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Time Required</label>
            <input
              type="text"
              value={recipeTime}
              onChange={(e) => setRecipeTime(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter time required (e.g., 30 mins)"
              required
            />
          </div>

          {/* Recipe Image */}
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

          {/* Recipe Content - Rich Text Editor */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Recipe Content</label>
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

        {/* Display the submitted recipe */}
        {submittedRecipe && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Submitted Recipe</h2>
            <h3 className="text-xl font-bold">{submittedRecipe.title}</h3>
            <p className="text-lg font-medium mb-2">Time Required: {submittedRecipe.time}</p>
            {submittedRecipe.image && (
              <img
                src={submittedRecipe.image}
                alt={submittedRecipe.title}
                className="w-full h-auto mb-4 rounded-md"
              />
            )}
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: submittedRecipe.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCreationPage;
