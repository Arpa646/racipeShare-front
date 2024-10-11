"use client";

import { useState, useEffect } from "react";
import { RecipeCard } from "./RecipeCard"; // Component for displaying each recipe
import Pagination from "./Pagination"; // Pagination component
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import { Button } from "@/app/ui/button";
import { useGetRecipeByEmailQuery } from "@/GlobalRedux/api/api"; // Query to fetch all recipes
import { PulseLoader } from "react-spinners"; // Loader package for loading state
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {jwtDecode} from "jwt-decode";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
const MyRecipie = () => {

    interface CustomJwtPayload {
        role?: string;
        userId?: string;
        useremail?: string;
      }
    const token = useSelector((state) => state.auth.token);
    const user = token ? jwtDecode(token) : null;

    console.log(user);
    const role: string = user?.role || "Guest";
    const email: string = user?.userId || "Guest";



    const { data, isLoading } = useGetRecipeByEmailQuery(email); 






  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]); // Range for time (in minutes)
  const postsPerPage = 6;
// Fetch all recipe data
  const RecipeData = data?.data;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFacilities =
    RecipeData &&
    RecipeData.filter((recipe) => {
      const inTimeRange =
        recipe.time >= priceRange[0] && recipe.time <= priceRange[1];
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // If there's no search query and the price range is default, show all
      return (
        (!searchQuery || matchesSearch) &&
        (priceRange[0] === 0 && priceRange[1] === 1000 ? true : inTimeRange)
      );
    });

  // Sort recipes by time (ascending or descending)
  const sortedFacilities =
    filteredFacilities &&
    filteredFacilities.slice().sort((a, b) => {
      const timeA = Number(a.time); // Ensure 'time' is a number
      const timeB = Number(b.time); // Ensure 'time' is a number
      switch (sortOption) {
        case "time_asc":
          return timeA - timeB; // Low to High
        case "time_desc":
          return timeB - timeA; // High to Low
        default:
          return 0;
      }
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <PulseLoader color="#A18549" size={15} /> {/* Customizable loader */}
      </div>
    );
  }

  // Pagination calculations
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts =
    sortedFacilities && sortedFacilities.slice(firstPostIndex, lastPostIndex);

  console.log("RecipeData:", RecipeData); // Check if all 6 items are there
  console.log("FilteredFacilities:", filteredFacilities); // See how many remain after filtering
  console.log("CurrentPosts:", currentPosts); // See how many are paginated

  return (
    <div className="container mx-auto p-5">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/12 mb-6 md:mb-0">
          <h1 className="mt-6 mb-4">Time Range</h1>
          <div className="px-4">
            <Slider
              range
              min={0}
              max={1000}
              defaultValue={priceRange}
              onChange={(value) => {
                if (typeof value === "number") {
                  setPriceRange([value, priceRange[1]]);
                } else {
                  setPriceRange(value);
                }
              }}
              className="mb-4"
            />
            <div className="flex justify-between">
              <span>{priceRange[0]} min</span>
              <span>{priceRange[1]} min</span>
            </div>
          </div>
        </div>

        <div className="md:w-9/12">
          <div className="flex justify-end mb-6">
            <div className="header flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Search by name..."
                className="border border-black p-[11px] me-3 rounded-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select onValueChange={(value) => setSortOption(value)}>
              <SelectTrigger className="w-[180px] rounded-none border border-black text-black">
                <SelectValue placeholder="Sort by Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-white">
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="time_asc">Time - Low to High</SelectItem>
                  <SelectItem value="time_desc">Time - High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="my-5 p-3">
            <div className="facility-category-section">
              {currentPosts && currentPosts.length > 0 ? (
                <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-10 mx-auto my-5">
                  {currentPosts.map((recipe) => (
                    <RecipeCard key={recipe._id} Recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No recipes found for this search.
                </div>
              )}

              {/* Pagination */}
              {sortedFacilities.length > 0 && (
                <Pagination
                  totalPosts={sortedFacilities.length}
                  postsPerPage={postsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRecipie;
