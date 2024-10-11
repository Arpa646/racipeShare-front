import { useState } from "react";
import { RecipeCard } from "./RecipeCard"; // Component for displaying each recipe
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import { PulseLoader } from "react-spinners"; // Loader package for loading state
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useGetAllRecipeQuery } from "@/GlobalRedux/api/api"; // Query to fetch all recipes

const RecipieFeed = () => {
  interface CustomJwtPayload {
    role?: string;
    userId?: string;
    useremail?: string;
  }

  const token = useSelector((state) => state.auth.token);
  const user = token ? jwtDecode<CustomJwtPayload>(token) : null;
  const role: string = user?.role || "Guest";
  const email: string = user?.userId || "Guest";

  const { data, isLoading } = useGetAllRecipeQuery(undefined);

  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]); // Range for time (in minutes)
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all recipe data
  const RecipeData = data?.data;

  const filteredFacilities =
    RecipeData &&
    RecipeData.filter((recipe) => {
      const inTimeRange =
        recipe.time >= priceRange[0] && recipe.time <= priceRange[1];
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

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

  console.log("RecipeData:", RecipeData); // Debugging log for fetched recipes
  console.log("FilteredFacilities:", filteredFacilities); // See how many remain after filtering
  console.log("SortedFacilities:", sortedFacilities); // Debugging log for sorted recipes

  return (
    <div className="container mx-auto p-5">
      <div className="header flex items-center justify-between mb-4 w-full gap-3">
        <input
          type="text"
          placeholder="Search Within these results..."
          className="border border-gray  p-[11px] w-full rounded-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="h-12 px-10 bg-[#6CA12B]">Search</button>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/12 mb-6 md:mb-0">
          {/* Time Range Filter */}
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

          {/* Category Filter */}
          <h1 className="mt-6 mb-4">Category</h1>
          <div className="px-4">
            <div className="flex flex-col">
              {["Pizza", "Faluda", "Coffee", "Desserts"].map((category) => (
                <label
                  key={category}
                  className="flex mt-2 items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={category}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-t-1 border-gray-300 my-6" />

          {/* Rating Filter */}

          <h1 className="mt-6 mb-4">Ingredients</h1>
          <div className="px-4">
            <div className="flex flex-col">
              {["Sugar", "Spicy", "Vegan", "Dairy"].map((ingredient) => (
                <label
                  key={ingredient}
                  className="flex  mt-2 items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={ingredient}
                    onChange={(e) => handleIngredientFilter(e.target.value)}
                  />
                  <span>{ingredient}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className="border-t-1 border-gray-300 my-6" />
          {/* Star Rating Filter */}
          <h1 className="mt-6 mb-4">Rating</h1>
          <div className="px-4">
            <div className="flex flex-col">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="flex  mt-2 items-center space-x-2">
                  <input
                    type="checkbox"
                    value={star}
                    onChange={(e) => handleRatingFilter(e.target.value)}
                  />
                  <span>{star} Star</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Filter */}
        </div>

        <>
          <div className="md:w-9/12">
            <div className="flex justify-end mb-6">
              <button className="btn border  px-10">Newest</button>
              <button className="border ms-2  px-10">Best Rated</button>
              <Select onValueChange={(value) => setSortOption(value)}>
                <SelectTrigger className="w-[180px] ms-2 rounded-none border border-gray text-black">
                  <SelectValue placeholder="Sort by Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-white">
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="time_asc">Time - Low to High</SelectItem>
                    <SelectItem value="time_desc">
                      Time - High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSortOption(value)}>
                <SelectTrigger className="w-[180px] ms-2 rounded-none border border-gray text-black">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-white">
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="time_asc">Time - Low to High</SelectItem>
                    <SelectItem value="time_desc">
                      Time - High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSortOption(value)}>
                <SelectTrigger className="w-[180px] ms-2 rounded-none border border-gray text-black">
                  <SelectValue placeholder="Sort by Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="bg-white">
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="time_asc">Time - Low to High</SelectItem>
                    <SelectItem value="time_desc">
                      Time - High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="my-5 p-3">
              <div className="facility-category-section">
                {sortedFacilities && sortedFacilities.length > 0 ? (
                  <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-10 mx-auto my-5">
                    {sortedFacilities.map((Recipe) => (
                      <RecipeCard key={Recipe._id} Recipe={Recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No recipes found for this search.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default RecipieFeed;  