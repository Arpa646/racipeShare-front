// src/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for API responses and requests

interface RootState {
  auth: {
    token: string;
  };
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    //https://assignment-ivory-two.vercel.app/api

    baseUrl: "http://localhost:5000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      console.log("this is the token", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["facilities", "user"],
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => ({
        url: "/bookings",
        method: "GET",
      }),
    }),

    getFacilities: builder.query({
      query: () => ({
        url: "/facility",
        method: "GET",
      }),
      providesTags: ["facilities"],
    }),
    getUser: builder.query({
      query: () => ({
        url: "/auth",
        method: "GET",
      }),
    }),
    addFacility: builder.mutation({
      query: (newFacility) => ({
        url: "/facility",
        method: "POST",
        body: newFacility,
      }),
      invalidatesTags: ["facilities"],
    }),
    makePremium: builder.mutation({
      query: (userId) => {
        console.log("User ID being sent:", userId); // Logs the userId
        return {
          url: "/premium",
          method: "POST",
          body: {
            userId: userId, // Matches your required format
          },
        };
      },
      invalidatesTags: ["facilities"],
    }),

    getAllRecipe: builder.query({
      query: () => ({
        url: "/recipies",
        method: "GET",
      }),
    }),
    getRecipeByEmail: builder.query({
      query: (email) => ({
        url: `/recipies?email=${email}`,
        method: "GET",
      }),
    }),

    deleteRecipe: builder.mutation({
      query: (id) => ({
        url: `recipies/${id}`, // Change the URL to point to the 'recipies' resource
        method: "DELETE",
      }),
      invalidatesTags: ["recipes"], // Update the invalidated tag if you're using caching or refetching logic
    }),

    // Inside your recipeSlice or API slice file
    addRecipe: builder.mutation({
      query: (newRecipe) => {
        // Console log the recipe before sending it to the server
        console.log("Submitting new recipe:", newRecipe);

        return {
          url: "/recipies",
          method: "POST",
          body: newRecipe,
        };
      },
      invalidatesTags: ["Recipes"], // Adjust the tag name based on your setup
    }),

    forgottenPass: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["facilities"],
    }),
    changePass: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `/auth/change-password/${id}`, // Assuming your backend expects the id in the URL
        method: "POST",
        body: { newPassword }, // Send the new password in the body
      }),
      invalidatesTags: ["facilities"], // Update this based on your tags logic
    }),

    updateUserStatus: builder.mutation({
      query: (id) => ({
        url: `auth/change-block/${id}`,
        method: "PUT", // PUT or PATCH based on your backend
      }),
      invalidatesTags: ["facilities"], // Invalidate tags to refetch updated data
    }),

    updateFacility: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `facility/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["facilities"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["facilities"],
    }),
    deleteFacility: builder.mutation({
      query: (id) => ({
        url: `facility/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["facilities"],
    }),
    getFacilityPerUser: builder.query({
      query: () => ({
        url: "/bookings/user",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    signUp: builder.mutation({
      query: (user) => ({
        url: "/auth/signup",
        method: "POST",
        body: user,
      }),
    }),
    logIn: builder.mutation({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
    }),
    checkAvailability: builder.query({
      query: (date) => ({
        url: `/check-availability?date=${date}`,
        method: "GET",
      }),
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user", "facilities"], // Change this line
    }),

    getSingleFacility: builder.query({
      query: (id) => ({
        url: `/facility/${id}`,
        method: "GET",
      }),
      providesTags: ["facilities"],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: ["facilities"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: `/auth`,
        method: "GET",
      }),
      providesTags: ["facilities"],
    }),
    addRating: builder.mutation({
      query: (ratingData) => {
        // Console log the recipe before sending it to the server
        console.log("Submitting new recipe:", ratingData);

        return {
          url: "/recipies/rating",
          method: "POST",
          body: ratingData,
        };
      },
      // Adjust the tag name based on your setup
    }),
    addComment: builder.mutation({
      query: (commentData) => {
        // Console log the recipe before sending it to the server
        console.log("Submitting new comment:", commentData);

        return {
          url: "/recipies/comment",
          method: "POST",
          body: commentData,
        };
      },
      invalidatesTags: ["Recipes"], // Adjust the tag name based on your setup
    }),

    updateRecipeStatus: builder.mutation({
      query: ({ id }) => ({
        url: `/recipies/${id}`,
        method: "PUT",
        // Pass the updated isPublished status
      }),
      invalidatesTags: ["Recipes"], // Invalidates to refresh the data
    }),
    followRequest: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `/recipies/${id}`,
        method: "PUT",
        body: { currentUserId, targetUserId },
        // Pass the updated isPublished status
      }),
      invalidatesTags: ["Recipes"], // Invalidates to refresh the data
    }),

    getSingleRecipe: builder.query({
      query: (id) => ({
        url: `/recipies/${id}`,
        method: "GET",
      }),
      providesTags: ["facilities"],
    }),

    updateUserProfile: builder.mutation({
      query: ({ userId, ...formData }) => {
        // Log the userId and formData to check the outgoing data
        console.log("Updating user profile for:", userId);
        console.log("Form data being sent:", formData);

        return {
          url: `auth/updateprofile/${userId}`, // Ensure this is the correct API route
          method: "PUT",
          body: formData, // Send the form data as the request body
        };
      },
      invalidatesTags: ["User"], // Invalidate the 'User' cache to ensure fresh data
    }),

    updateRecipe: builder.mutation({
      query: ({ id, ...recipeData }) => {
        // Log the id and formData to check the outgoing data
        console.log("Updating recipe for:", id);
        console.log("Form data being sent:", recipeData);

        return {
          url: `recipies/update/${id}`, // Ensure this is the correct API route for updating a recipe
          method: "PUT",
          body: recipeData, // Send the form data as the request body
        };
      },
      invalidatesTags: ["Recipe"], // Invalidate the 'Recipe' cache to ensure fresh data after updating
    }),

    likeRecipe: builder.mutation({
      query: (info) => {
        console.log("Sending like request with payload:", info); // Log the request payload
        return {
          url: "/recipies/like",
          method: "POST",
          body: info, // Send the entire info object as the body
        };
      },
      // Optional: Add additional configurations like providing tags
      // invalidatesTags: ['Recipes'], // Invalidate any relevant cached data if necessary
    }),
    dislikeRecipe: builder.mutation({
      query: (info) => {
        console.log("Sending like request with payload:", info); // Log the request payload
        return {
          url: "/recipies/dislike",
          method: "POST",
          body: info, // Send the entire info object as the body
        };
      },
    }),

    cancelComment: builder.mutation({
      query: ({id}) => ({
        url: `/recipies/deletecomment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user", "facilities"], // Change this line
    }),
  }),
});

export const {
  useUpdateRecipeMutation,
  useUpdateUserProfileMutation,
  useLikeRecipeMutation,
  useDislikeRecipeMutation,

  useFollowRequestMutation,
  useGetSingleUserQuery,
  useGetAllUserQuery,

  useMakePremiumMutation,
  useGetAllRecipeQuery,
  useForgottenPassMutation,
  useChangePassMutation,

  useAddRecipeMutation,

  useAddRatingMutation,
  useAddCommentMutation,
  useGetSingleRecipeQuery,
  useGetRecipeByEmailQuery,

  useDeleteRecipeMutation,
  useCancelCommentMutation,
  useUpdateUserStatusMutation,
  useUpdateRecipeStatusMutation,

  useDeleteUserMutation,

  useGetUserQuery,
  useLogInMutation,
  useSignUpMutation,
} = baseApi;
