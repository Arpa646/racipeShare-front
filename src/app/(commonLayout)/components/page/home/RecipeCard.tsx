"use client"; // Enables the client-side rendering for this component in Next.js

import Link from "next/link"; // Next.js Link component for client-side navigation
import { AiOutlineEye, AiOutlineLike, AiOutlineDislike } from "react-icons/ai"; // Importing icons from the react-icons library for UI elements
// import { FaStar } from "react-icons/fa"; // Import FaStar icon for displaying star ratings
import {
  useLikeRecipeMutation,
  useDislikeRecipeMutation,
} from "@/GlobalRedux/api/api"; // Hooks for handling API requests to delete, like, and dislike recipes
import { useUser } from "@/services"; // Function to retrieve the current user data

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
  dislikedBy: string[]; // Assuming an array of ObjectId for users who disliked
  likedBy: string[]; // Assuming an array of ObjectId for users who liked
}

interface RecipeCardProps {
  Recipe: Recipe; // Use the interface here
}
import Image from "next/image";
export const RecipeCard: React.FC<RecipeCardProps> = ({ Recipe }) => {
  // Destructuring to get the userId from the user data
  const { userId } = useUser();

  // Hooks for deleting, liking, and disliking recipes from the API

  const [likeRecipe] = useLikeRecipeMutation();
  const [dislikeRecipe] = useDislikeRecipeMutation();

  // Check if the user has already liked this recipe
  const hasLiked = Recipe.likedBy.includes(userId);

  // Check if the user has already disliked this recipe
  const hasDisliked = Recipe.dislikedBy.includes(userId);

  // Function to truncate and preview the recipe description while preserving HTML structure
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

  // Function to render star rating based on the recipe's rating
  // const renderStars = (rating: number | null) => {
  //   const totalStars = 5; // Total number of stars (out of 5)
  //   const filledStars = Math.floor(rating as number); // Number of stars to be filled (based on rating)
  //   const stars = [];

  //   // Loop through and create star elements (filled or empty)
  //   for (let i = 1; i <= totalStars; i++) {
  //     stars.push(
  //       <FaStar
  //         key={i}
  //         className={i <= filledStars ? "text-yellow-500" : "text-gray-300"} // Apply different color for filled vs. empty stars
  //         size={20} // Size of the star
  //       />
  //     );
  //   }
  //   return stars;
  // };

  // Get a preview of the recipe description (truncated to 100 characters)
  const recipePreview = getRecipePreview(Recipe.recipe, 100);

  // Function to handle liking the recipe
  const handleLike = async () => {
    const info = { recipeId: Recipe._id, userId }; // Information required for liking the recipe
    try {
      await likeRecipe(info); // API call to like the recipe
      console.log("Recipe liked successfully!");
    } catch (error) {
      console.error("Failed to like the recipe:", error);
    }
  };

  // Function to handle disliking the recipe
  const handleDislike = async () => {
    const info = { recipeId: Recipe._id, userId }; // Information required for disliking the recipe
    try {
      await dislikeRecipe(info); // API call to dislike the recipe
      console.log("Recipe disliked successfully!");
    } catch (error) {
      console.error("Failed to dislike the recipe:", error);
    }
  };

  return (
    <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Recipe Image Section */}
      <div className="Recipe-image w-full md:w-2/4">
        <Image
          src={Recipe?.image || "/path/to/fallback-image.jpg"} // Fallback image when Recipe.image is undefined
          alt={Recipe?.title || "Recipe image"} // Provide alt text or fallback
          className="w-full p-2 h-48 md:h-48 object-cover rounded-l-lg md:rounded-none"
          width={500} // Set the width
          height={300} // Set the height
        />
      </div>

      {/* Recipe Content Section */}
      <div className="p-4 w-full md:w-1/2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {Recipe.title} {/* Display the recipe title */}
        </h3>

        {/* Display the recipe description as HTML (truncated preview) */}
        <div
          className="text-gray-600 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: recipePreview }}
        ></div>

        {/* Meta information: number of comments */}
        <div className="mb-2">
          <span className="font-bold text-gray-700">
            {Recipe?.comments?.length || 0}
          </span>{" "}
          comments
        </div>

        {/* Rating Section */}

        {/* Like and Dislike Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLike} // Handle like action
            className={`${hasLiked ? "text-blue-500" : "text-gray-500"}`} // Change color if the recipe is liked
          >
            <AiOutlineLike size={25} />
          </button>
          <button
            onClick={handleDislike} // Handle dislike action
            className={` ${hasDisliked ? "text-blue-500" : "text-gray-500"}`} // Change color if the recipe is disliked
          >
            <AiOutlineDislike size={25} />
          </button>
        </div>
      </div>

      {/* Recipe Action Buttons (e.g., View, Delete) */}
      <div className="h-full border-t md:border-t-0 md:border-l p-4 w-full md:w-1/3 flex flex-col justify-between items-center">
        <div className="mb-4 text-center">
          <span className="font-semibold text-gray-700 text-lg">
            {Recipe.time} Min {/* Display the recipe time */}
          </span>
          <br />
          <span className="text-sm text-gray-500">For Cooking</span>{" "}
          {/* Label for time */}
        </div>

        <div>
          <Link href={`/userprofile/${Recipe.user?.email}`}>
            By: <b>{Recipe.user?.name}</b>
          </Link>
        </div>

        <div className="space-x-2">
          <Link href={`/${Recipe?._id}`} className="w-full">
            {/* View Recipe Button */}
            <button className="border relative px-3 py-2 border-[#A18549]">
              <AiOutlineEye />
              <span className="-top-5 text-black left-1 absolute opacity-0 hover:opacity-100 transition-opacity duration-300">
                Details {/* Tooltip for view button */}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
