"use client";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // Handle category filter changes
  const handleCategoryFilter = (category: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((cat) => cat !== category)
        : [...prevCategories, category]
    );
  };

  // Handle ingredient filter changes
  const handleIngredientFilter = (ingredient: string) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.includes(ingredient)
        ? prevIngredients.filter((ing) => ing !== ingredient)
        : [...prevIngredients, ingredient]
    );
  };

  // Handle rating filter changes
  const handleRatingFilter = (rating: number) => {
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(rating)
        ? prevRatings.filter((r) => r !== rating)
        : [...prevRatings, rating]
    );
  };

  // Fetch all recipe data
  const RecipeData = data?.data;

  // Apply filters to recipes
  const filteredRecipes =
    RecipeData &&
    RecipeData.filter((recipe) => {
      const inTimeRange =
        recipe.time >= priceRange[0] && recipe.time <= priceRange[1];
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(recipe.category);

      const matchesIngredients =
        selectedIngredients.length === 0 ||
        selectedIngredients.every((ing) =>
          recipe.ingredients.includes(ing.toLowerCase())
        );

      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.includes(recipe.rating);

      return (
        matchesSearch &&
        inTimeRange &&
        matchesCategory &&
        matchesIngredients &&
        matchesRating
      );
    });

  // Sort recipes based on user selection
  const sortedRecipes =
    filteredRecipes &&
    filteredRecipes.slice().sort((a, b) => {
      switch (sortOption) {
        case "time_asc":
          return Number(a.time) - Number(b.time); // Low to High by time
        case "time_desc":
          return Number(b.time) - Number(a.time); // High to Low by time
        case "rating_asc":
          return a.rating - b.rating; // Low to High by rating
        case "rating_desc":
          return b.rating - a.rating; // High to Low by rating
        default:
          return 0;
      }
    });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <PulseLoader color="#A18549" size={15} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      {/* Search and Filter Section */}
      <div className="header flex items-center justify-between mb-4 w-full gap-3">
        <input
          type="text"
          placeholder="Search Within these results..."
          className="border border-gray p-[11px] w-full rounded-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="h-12 px-10 bg-[#6CA12B]">Search</button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Filters */}
        <div className="md:w-3/12 mb-6 md:mb-0">
          {/* Time Range Filter */}
          <h1 className="mt-6 mb-4">Time Range</h1>
          <Slider
            range
            min={0}
            max={1000}
            defaultValue={priceRange}
            onChange={(value) => {
              if (typeof value !== "number") {
                setPriceRange(value);
              }
            }}
            className="mb-4"
          />
          <div className="flex justify-between">
            <span>{priceRange[0]} min</span>
            <span>{priceRange[1]} min</span>
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
                    onChange={() => handleCategoryFilter(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ingredients Filter */}
          <h1 className="mt-6 mb-4">Ingredients</h1>
          <div className="px-4">
            <div className="flex flex-col">
              {["Sugar", "Spicy", "Vegan", "Dairy"].map((ingredient) => (
                <label
                  key={ingredient}
                  className="flex mt-2 items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={ingredient}
                    onChange={() => handleIngredientFilter(ingredient)}
                  />
                  <span>{ingredient}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <h1 className="mt-6 mb-4">Rating</h1>
          <div className="px-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="flex mt-2 items-center space-x-2">
                <input
                  type="checkbox"
                  value={star}
                  onChange={() => handleRatingFilter(star)}
                />
                <span>{star} Star</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recipe Display */}
        <div className="md:w-9/12">
          <div className="flex justify-end mb-6">
            {/* Sorting Options */}
            <Select onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px] ms-2 rounded-none border border-gray text-black">
                <SelectValue placeholder="Sort by Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-white">
                  <SelectLabel>Sort by</SelectLabel>
                  <SelectItem value="time_asc">Time - Low to High</SelectItem>
                  <SelectItem value="time_desc">Time - High to Low</SelectItem>
                  <SelectItem value="rating_asc">
                    Rating - Low to High
                  </SelectItem>
                  <SelectItem value="rating_desc">
                    Rating - High to Low
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Recipe Cards */}
          <div className="my-5 p-3">
            {sortedRecipes && sortedRecipes.length > 0 ? (
              <div className="grid md:grid-cols-1 sm:grid-cols-2 gap-10 mx-auto my-5">
                {sortedRecipes.map((Recipe) => (
                  <RecipeCard key={Recipe._id} Recipe={Recipe} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No Recipes Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipieFeed;
