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
    }),

    makePremium: builder.mutation({
      query: (userId) => {
        console.log("User ID being sent:", userId);
        return {
          url: "/premium",
          method: "POST",
          body: {
            userId: userId,
          },
        };
      },
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
        url: `recipies/${id}`,
        method: "DELETE",
      }),
    }),

    addRecipe: builder.mutation({
      query: (newRecipe) => {
        console.log("Submitting new recipe:", newRecipe);
        return {
          url: "/recipies",
          method: "POST",
          body: newRecipe,
        };
      },
    }),

    forgottenPass: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    changePass: builder.mutation({
      query: ({ id, newPassword }) => ({
        url: `/auth/change-password/${id}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    updateUserStatus: builder.mutation({
      query: (id) => ({
        url: `auth/change-block/${id}`,
        method: "PUT",
      }),
    }),

    updateFacility: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `facility/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/${id}`,
        method: "DELETE",
      }),
    }),

    deleteFacility: builder.mutation({
      query: (id) => ({
        url: `facility/${id}`,
        method: "DELETE",
      }),
    }),

    getFacilityPerUser: builder.query({
      query: () => ({
        url: "/bookings/user",
        method: "GET",
      }),
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
    }),

    getSingleFacility: builder.query({
      query: (id) => ({
        url: `/facility/${id}`,
        method: "GET",
      }),
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
    }),

    getAllUser: builder.query({
      query: () => ({
        url: `/auth`,
        method: "GET",
      }),
    }),

    addRating: builder.mutation({
      query: (ratingData) => {
        console.log("Submitting new rating:", ratingData);
        return {
          url: "/recipies/rating",
          method: "POST",
          body: ratingData,
        };
      },
    }),

    addComment: builder.mutation({
      query: (commentData) => {
        console.log("Submitting new comment:", commentData);
        return {
          url: "/recipies/comment",
          method: "POST",
          body: commentData,
        };
      },
    }),

    updateRecipeStatus: builder.mutation({
      query: ({ id }) => ({
        url: `/recipies/${id}`,
        method: "PUT",
      }),
    }),

    followRequest: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `/auth/follow`,
        method: "POST",
        body: { currentUserId, targetUserId },
      }),
    }),
    unfollowRequest: builder.mutation({
      query: ({ currentUserId, targetUserId }) => ({
        url: `/auth/unfollow`,
        method: "POST",
        body: { currentUserId, targetUserId },
      }),
    }),

    getSingleRecipe: builder.query({
      query: (id) => ({
        url: `/recipies/${id}`,
        method: "GET",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: ({ userId, ...formData }) => {
        console.log("Updating user profile for:", userId);
        console.log("Form data being sent:", formData);
        return {
          url: `auth/updateprofile/${userId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),

    updateRecipe: builder.mutation({
      query: ({ id, ...recipeData }) => {
        console.log("Updating recipe for:", id);
        console.log("Form data being sent:", recipeData);
        return {
          url: `recipies/update/${id}`,
          method: "PUT",
          body: recipeData,
        };
      },
    }),

    likeRecipe: builder.mutation({
      query: (info) => {
        console.log("Sending like request with payload:", info);
        return {
          url: "/recipies/like",
          method: "POST",
          body: info,
        };
      },
    }),

    dislikeRecipe: builder.mutation({
      query: (info) => {
        console.log("Sending dislike request with payload:", info);
        return {
          url: "/recipies/dislike",
          method: "POST",
          body: info,
        };
      },
    }),

    cancelComment: builder.mutation({
      query: ({ id }) => ({
        url: `/recipies/deletecomment/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateRecipeMutation,
  useUpdateUserProfileMutation,
  useLikeRecipeMutation,
  useDislikeRecipeMutation,
  useUnfollowRequestMutation,
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
