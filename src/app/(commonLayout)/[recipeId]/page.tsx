/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { PulseLoader } from "react-spinners"; // Loader package
import {
  useGetSingleRecipeQuery,
  useAddRatingMutation,
  useAddCommentMutation,
  useFollowRequestMutation,
  useCancelCommentMutation,
} from "@/GlobalRedux/api/api"; // Adjust to your API slice
import { jwtDecode } from "jwt-decode";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa"; // Star icons for rating
import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai"; // User icon
import Image from 'next/image';
interface CustomJwtPayload {
  role?: string;
  userId?: string;
  useremail?: string;
}


export default function RecipeDetails({ params }: any) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // Hover effect for stars
  const [comment, setComment] = useState(""); // State for comment
  const [isFollowing, setIsFollowing] = useState(false); // Track follow status

  const token = useSelector((state: RootState) => state.auth.token);
  const user = token ? jwtDecode<CustomJwtPayload>(token) : null;
  const userId: string = user?.useremail || "Guest"; // Extract user ID from token

  const id = params.recipeId;

  const { data: recipeData, isLoading: isRecipeLoading } =
    useGetSingleRecipeQuery(id as string);
  const [addRating, { isLoading: isRatingSubmitting }] = useAddRatingMutation();
  const [addComment] = useAddCommentMutation();
  const [followRequest] = useFollowRequestMutation();
  const [cancelComment, { isLoading: isCommentDeleting }] =
    useCancelCommentMutation();

  const recipe = recipeData?.data;
  const userdata = recipe?.user;

  useEffect(() => {
    if (userdata?.followers) {
      setIsFollowing(userdata.followers.includes(userId));
    }
  }, [userdata, userId]);

  // Handle rating click
  const handleRatingClick = async (rate: number) => {
    setRating(rate);
    const ratingData = { recipeId: id, userId, rating: rate };
    try {
      await addRating(ratingData).unwrap();
      console.log("Rating submitted successfully");
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const commentData = { recipeId: id, userId, comment };
    try {
      await addComment(commentData).unwrap();
      setComment(""); // Clear the input field
      console.log("Comment submitted successfully");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (id: string) => {
    try {
      await cancelComment({ id }).unwrap();
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Handle follow request
  const handleFollow = async () => {
    try {
      await followRequest({
        currentUserId: userId,
        targetUserId: userdata._id,
      });
      setIsFollowing(true);
      console.log("Follow request successful");
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  if (isRecipeLoading || isRatingSubmitting) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <PulseLoader color="#A18549" size={15} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 text-black min-h-screen">
      <div className="max-w-6xl w-full rounded-lg p-6 animate__animated animate__fadeIn">
        <div className="flex flex-col md:flex-row">
          {/* Recipe details */}
          <div>
            <h1 className="text-2xl text-center text-black font-semibold mb-4">
              {recipe?.title}
            </h1>
            <h1 className="text-1xl text-center text-gray font-semibold mb-4">
              {recipe?.createdAt}
            </h1>
            <Image
              src={recipe?.image}
              alt="Recipe"
              className="w-full mb-4 h-[500px] transform hover:scale-105 transition-transform duration-300"
            />
            <div className="text-black mb-4 space-y-7">
              <p className="text-justify">{recipe?.recipe}</p>
            </div>
          </div>

          {/* User profile and rating section */}
          <div className="w-full md:w-1/3 md:ml-8 mt-20">
            <div className="flex flex-col items-center p-4 border rounded-lg shadow-md">
              <div className="w-24 h-24 flex justify-center items-center rounded-full border-2 border-gray-300 mb-4">
                {userdata?.profilePicture ? (
                  <Image
                    src={userdata.profilePicture}
                    alt={userdata.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <AiOutlineUser size={40} className="text-gray-400" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-center">
                {userdata?.name}
              </h2>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleFollow}
                disabled={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Rating Section */}
            <div className="mt-8 mb-2 flex">
              <span className="font-bold text-gray-700">Rate this recipe:</span>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    className={`cursor-pointer ${
                      (hoverRating || rating) >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments and Reviews */}
        <div className="mt-10">
          <div className="flex justify-center space-x-7 text-gray-900 text-3xl">
            <h1 className="border-gray-900 border-b-2">Description</h1>
            <h1 className="border-gray-900 border-b-2">Reviews</h1>
          </div>

          {/* Comment Section */}
          <div className="mt-6">
  <h2 className="text-2xl font-semibold">Comments</h2>
  {recipe?.comments && recipe.comments.length > 0 ? (
    recipe.comments.map((commentObj: { _id: string, userId: { name?: string, _id?: string }, comment: string }) => (
      <div
        key={commentObj._id}
        className="flex space-x-4 border-b border-gray-200 pb-6 mb-6"
      >
        <Image
          src="https://media.istockphoto.com/id/1217967989/photo/portrait-of-an-young-asian-female-malay-smiling.webp?a=1&b=1&s=612x612&w=0&k=20&c=LjhDWrtInpW7Gufcl7hx4tAhsi2AlI-Lrg76LwEaLws="
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover"
          width={48} // Set width explicitly
          height={48} // Set height explicitly
        />
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">
                {commentObj?.userId?.name || "Anonymous"}
              </p>
            </div>
            {userId === commentObj?.userId?._id && (
              <button
                className="text-red-500"
                onClick={() => handleDeleteComment(commentObj._id)}
                disabled={isCommentDeleting}
              >
                {isCommentDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-700">{commentObj.comment}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-600">No comments yet.</p>
  )}
</div>


          {/* Post a Comment */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Post a Comment</h2>
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
              />
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
