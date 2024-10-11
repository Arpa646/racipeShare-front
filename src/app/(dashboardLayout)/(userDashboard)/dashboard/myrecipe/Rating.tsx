import React from "react";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Full star
    } else {
      stars.push(<span key={i} className="text-gray-300">&#9733;</span>); // Empty star
    }
  }

  return <div className="flex">{stars}</div>;
};

export default RatingStars;
