"use client";

import Link from "next/link";
import {
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineLike,
  AiOutlineDislike,
} from "react-icons/ai";
import { FaStar } from "react-icons/fa"; // Import FaStar for star rating
import {
  useDeleteRecipeMutation,
  useLikeRecipeMutation,
  useDislikeRecipeMutation,
} from "@/GlobalRedux/api/api"; // Adjust the import path based on your setup
import { getUser } from "@/services";

export const RecipeCard = ({ Recipe }) => {
  console.log("Rendering RecipeCard", Recipe);
  const { userId } = getUser();
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [likeRecipe, { isLoading: isLiking, error: likeError }] =
    useLikeRecipeMutation();
  const [dislikeRecipe, { isLoading: isDisliking, error: dislikeError }] =
    useDislikeRecipeMutation();

  // Check if the user has liked or disliked the recipe
  const hasLiked = Recipe.likedBy.includes(userId);

  const hasDisliked = Recipe.dislikedBy.includes(userId);

  // const hasLiked = Recipe.likedBy.some((user) => user._id === userId);
  // const hasDisliked = Recipe.dislikedBy.some((user) => user._id === userId);

  // Log the results and the contents of likedBy and dislikedBy
  // console.log("hasLiked:", hasLiked);
  // console.log("hasDisliked:", hasDisliked);

  // console.log("Liked By Users:");
  // Recipe.likedBy.forEach((user) => console.log("Liked User ID:", user._id));

  // console.log("Disliked By Users:");
  // Recipe.dislikedBy.forEach((user) =>
  //   console.log("Disliked User ID:", user._id)
  // );

  // Function to limit the recipe description to 100 characters while preserving HTML tags
  const getRecipePreview = (html, maxLength) => {
    let currentLength = 0;
    let result = "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const traverseNodes = (node) => {
      if (currentLength >= maxLength) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue;
        const remainingLength = maxLength - currentLength;

        if (text.length > remainingLength) {
          result += text.slice(0, remainingLength) + "...";
          currentLength = maxLength;
        } else {
          result += text;
          currentLength += text.length;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        result += `<${node.nodeName.toLowerCase()}>`;
        Array.from(node.childNodes).forEach(traverseNodes);
        result += `</${node.nodeName.toLowerCase()}>`;
      }
    };

    Array.from(tempDiv.childNodes).forEach(traverseNodes);
    return result;
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the recipe "${Recipe.title}"?`
      )
    ) {
      try {
        await deleteRecipe(Recipe._id);
        console.log("Recipe deleted successfully!");
      } catch (error) {
        console.error("Failed to delete the recipe:", error);
      }
    }
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= filledStars ? "text-yellow-500" : "text-gray-300"}
          size={20}
        />
      );
    }
    return stars;
  };

  const recipePreview = getRecipePreview(Recipe.recipe, 100);

  const handleLike = async () => {
    console.log("hiiii");
    const info = { recipeId: Recipe._id, userId };
    try {
      await likeRecipe(info);
      console.log("Recipe liked successfully!");
    } catch (error) {
      console.error("Failed to like the recipe:", error);
    }
  };

  const handleDislike = async () => {
    const info = { recipeId: Recipe._id, userId };
    try {
      await dislikeRecipe(info);
      console.log("Recipe disliked successfully!");
    } catch (error) {
      console.error("Failed to dislike the recipe:", error);
    }
  };

  return (
    <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="Recipe-image w-full md:w-2/4">
        <img
          src={Recipe?.image}
          alt={Recipe.title}
          className="w-full p-2 h-48 md:h-48 object-cover rounded-l-lg md:rounded-none"
        />
      </div>

      {/* Content */}
      <div className="p-4 w-full md:w-1/2">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {Recipe.title}
        </h3>

        {/* Recipe details rendered as HTML */}
        <div
          className="text-gray-600 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: recipePreview }}
        ></div>

        {/* Meta information */}
        <div className="mb-2">
          <span className="font-bold text-gray-700">
            {Recipe?.comments.length}
          </span>{" "}
          comments
        </div>

        {/* Rating Section */}
        <div className="flex items-center">
          {renderStars(Recipe.rating)}
          <span className="ml-2 text-gray-500 text-sm">
            ({Recipe.rating}/5)
          </span>
        </div>

        {/* Like and Dislike Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleLike}
            className={`${hasLiked ? "text-blue-500" : "text-gray-500"}`}
          >
            <AiOutlineLike size={25} />
          </button>
          <button
            onClick={handleDislike}
            className={` ${hasDisliked ? "text-blue-500" : "text-gray-500"}`}
          >
            <AiOutlineDislike size={25} />
          </button>
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
          <Link href={`/${Recipe._id}`} className="w-full">
            <button className="border relative px-3 py-2 border-[#A18549]">
              <AiOutlineEye />
              <span className="-top-5 text-black left-1 absolute opacity-0 hover:opacity-100 transition-opacity duration-300">
                Details
              </span>
            </button>
          </Link>

          {/* Delete Button */}
          {/* <button
            className="border relative px-3 py-2 border-red-500 text-red-500"
            onClick={handleDelete}
          >
            <AiOutlineDelete />
            <span className="-top-5 left-1 text-black absolute opacity-0 hover:opacity-100 transition-opacity duration-300">
              Delete
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};
