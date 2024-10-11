"use client";

import Link from "next/link";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useDeleteRecipeMutation } from "@/GlobalRedux/api/api"; // Adjust the import path based on your setup

export const RecipeCard = ({ Recipe }) => {
  console.log("Rendering RecipeCard", Recipe._id);

  const [deleteRecipe] = useDeleteRecipeMutation();

  // Limit recipe description to 100 characters

  // Function to handle delete action
  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the recipe "${Recipe.title}"?`
      )
    ) {
      try {
        await deleteRecipe(Recipe._id); // Call mutation with recipe ID
        console.log("Recipe deleted successfully!");
      } catch (error) {
        console.error("Failed to delete the recipe:", error);
      }
    }
  };


  const getRecipePreview = (html, maxLength) => {
    let currentLength = 0;
    let result = "";

    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Iterate through child nodes to build the result
    const traverseNodes = (node) => {
      if (currentLength >= maxLength) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        const remainingLength = maxLength - currentLength;

        if (text.length > remainingLength) {
          result += text.slice(0, remainingLength) + "..."; // Append ellipsis if text is cut off
          currentLength = maxLength;
        } else {
          result += text;
          currentLength += text.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Preserve HTML structure for nested elements
        result += `<${node.nodeName.toLowerCase()}>`;
        Array.from(node.childNodes).forEach(traverseNodes);
        result += `</${node.nodeName.toLowerCase()}>`;
      }
    };

    Array.from(tempDiv.childNodes).forEach(traverseNodes);
    return result;
  };


  const recipePreview = getRecipePreview(Recipe.recipe, 100);



  return (
    <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="Recipe-image w-full md:w-1/4">
        <img
          src={Recipe?.image}
          alt={Recipe.title}
          className="w-full p-5 h-48 md:h-48 object-cover rounded-l-lg md:rounded-none"
        />
      </div>

      {/* Content */}
      <div className="p-4 w-full md:w-1/2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {Recipe.title}
        </h3>

        {/* Recipe details (limited to 100 characters) */}
        <div
          className="text-gray-600 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: recipePreview }} // Render limited HTML content
        ></div>
        {/* Meta information */}
        <div className="mb-2">
          <span className="font-bold text-gray-700">Location:</span>{" "}
          {Recipe.location}
        </div>
      </div>

      {/* Actions */}
      <div className="h-full border-t md:border-t-0 md:border-l p-4 w-full md:w-1/3 flex flex-col justify-between items-center">
        <div className="mb-4 text-center">
          <span className="font-semibold text-gray-700 text-lg">
            {Recipe.time} Min
          </span>
          <br />
          <span className="text-sm text-gray-500">For Cooking</span>
        </div>

        <div className="space-x-2">
          <Link href={`/recipe/${Recipe._id}`} className="w-full">
            <button className="border relative px-3 py-2 border-[#A18549]">
              <AiOutlineEye />
              <span className="-top-5 text-black left-1 absolute opacity-0 hover:opacity-100 transition-opacity duration-300">
                Details
              </span>
            </button>
          </Link>

          {/* Update Button */}
          <Link href={`/dashboard/${Recipe._id}`} className="w-full">
            <button className="border relative px-3 py-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white transition-colors duration-300">
              <AiOutlineEdit />
              <span className="sr-only">Update</span>
            </button>
          </Link>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="border px-3 py-2 border-red-600 hover:bg-red-600 text-red-600 hover:text-white transition-colors duration-300"
          >
            <AiOutlineDelete />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
