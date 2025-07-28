import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0 }) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          fill={i < rounded ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
      <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
