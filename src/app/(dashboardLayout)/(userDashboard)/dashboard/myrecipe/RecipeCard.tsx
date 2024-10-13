"use client";
import Image from "next/image";

import Link from "next/link";
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useDeleteRecipeMutation } from "@/GlobalRedux/api/api"; // Adjust the import path based on your setup








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
  _id: ObjectId;
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
  likedBy: string[];// Assuming an array of ObjectId for users who liked
}















interface RecipeCardProps {
  Recipe: Recipe; // Use the interface here
}













export const RecipeCard : React.FC<RecipeCardProps> = ({ Recipe }) => {
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

  const getRecipePreview = (html: string, maxLength: number): string => {
    let currentLength = 0; // Tracks the current length of the preview
    let result = ""; // Stores the resulting truncated HTML

    // Create a temporary div element to hold the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Recursive function to traverse through the HTML nodes
    const traverseNodes = (node: Node): void => {
      if (currentLength >= maxLength) return; // Stop traversing if the max length is reached

      // If the node is a text node, append its content
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || ""; // Ensure textContent is not null
        const remainingLength = maxLength - currentLength; // Calculate the remaining allowed length

        if (textContent.length > remainingLength) {
          result += textContent.slice(0, remainingLength) + "..."; // Truncate text and append "..."
          currentLength = maxLength;
        } else {
          result += textContent; // Append the full text if it's within the limit
          currentLength += textContent.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        result += `<${(node as Element).nodeName.toLowerCase()}>`; // Append opening HTML tag
        Array.from(node.childNodes).forEach(traverseNodes); // Recursively traverse through child nodes
        result += `</${(node as Element).nodeName.toLowerCase()}>`; // Append closing HTML tag
      }
    };

    // Start traversing the nodes of the tempDiv
    Array.from(tempDiv.childNodes).forEach(traverseNodes);
    return result; // Return the resulting truncated HTML
  };

  const recipePreview = getRecipePreview(Recipe.recipe, 100);









  return (
    <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="Recipe-image w-full md:w-1/4">
        <Image
          src={Recipe?.image}
          alt={Recipe.title}
          width={400} // Use a representative width based on your design
          height={300} // Use a representative height based on your design
          layout="responsive" // This makes the image responsive
          className="p-5 h-48 object-cover rounded-l-lg md:rounded-none"
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
