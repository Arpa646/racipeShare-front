"use client";

import Link from "next/link";
import {
    AiOutlineEye,
    AiOutlineDelete,
    AiOutlineLike,
    AiOutlineDislike,
} from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import {
    useDeleteRecipeMutation,
    useLikeRecipeMutation,
    useDislikeRecipeMutation,
} from "@/GlobalRedux/api/api";
import { getUser } from "@/services";
import { useEffect, useState } from "react";

export const RecipeCard = ({ Recipe }) => {
    const { userId } = getUser();
    const [deleteRecipe] = useDeleteRecipeMutation();
    const [likeRecipe] = useLikeRecipeMutation();
    const [dislikeRecipe] = useDislikeRecipeMutation();

    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [likesCount, setLikesCount] = useState(Recipe.likedBy.length);
    const [dislikesCount, setDislikesCount] = useState(Recipe.dislikedBy.length);

    useEffect(() => {
        setHasLiked(Recipe.likedBy.includes(userId));
        setHasDisliked(Recipe.dislikedBy.includes(userId));
    }, [Recipe, userId]);

    const handleLike = async () => {
        const info = { recipeId: Recipe._id, userId };
        try {
            await likeRecipe(info);
            setHasLiked(true);
            if (hasDisliked) {
                setHasDisliked(false);
            }
            setLikesCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error("Failed to like the recipe:", error);
        }
    };

    const handleDislike = async () => {
        const info = { recipeId: Recipe._id, userId };
        try {
            await dislikeRecipe(info);
            setHasDisliked(true);
            if (hasLiked) {
                setHasLiked(false);
            }
            setDislikesCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error("Failed to dislike the recipe:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the recipe "${Recipe.title}"?`)) {
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
        return Array.from({ length: totalStars }, (_, i) => (
            <FaStar
                key={i}
                className={i < filledStars ? "text-yellow-500" : "text-gray-300"}
                size={20}
            />
        ));
    };

    return (
        <div className="Recipe-card border flex flex-col md:flex-row justify-center items-center border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="Recipe-image w-full md:w-2/4">
                <img
                    src={Recipe?.image}
                    alt={Recipe.title}
                    className="w-full p-2 h-48 md:h-48 object-cover rounded-l-lg md:rounded-none"
                />
            </div>

            <div className="p-4 w-full md:w-1/2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {Recipe.title}
                </h3>
                <div
                    className="text-gray-600 text-sm mb-4"
                    dangerouslySetInnerHTML={{ __html: Recipe.recipe }}
                ></div>
                <div className="mb-2">
                    <span className="font-bold text-gray-700">
                        {Recipe?.comments.length}
                    </span>{" "}
                    comments
                </div>

                <div className="flex items-center">
                    {renderStars(Recipe.rating)}
                    <span className="ml-2 text-gray-500 text-sm">
                        ({Recipe.rating}/5)
                    </span>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleLike}
                        className={`${hasLiked ? "text-blue-500" : "text-gray-500"}`}
                    >
                        <AiOutlineLike size={25} />
                    </button>
                    <button
                        onClick={handleDislike}
                        className={`${hasDisliked ? "text-blue-500" : "text-gray-500"}`}
                    >
                        <AiOutlineDislike size={25} />
                    </button>
                </div>
            </div>

            <div className="h-full border-t md:border-t-0 md:border-l p-4 w-full md:w-1/3 flex flex-col justify-between items-center">
                <div className="mb-4 text-center">
                    <span className="font-semibold text-gray-700 text-lg">
                        {Recipe.time} Min
                    </span>
                    <span className="font-semibold text-gray-700 text-lg"> ${Recipe.price}</span>
                </div>
                <div className="flex justify-center mt-2">
                    <Link href={`/recipes/${Recipe._id}`}>
                        <button className="bg-blue-500 text-white rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-blue-600">
                            View Recipe
                        </button>
                    </Link>
                    {userId === Recipe.createdBy && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white rounded-lg px-4 py-2 transition-colors duration-300 hover:bg-red-600 ml-2"
                        >
                            <AiOutlineDelete />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
