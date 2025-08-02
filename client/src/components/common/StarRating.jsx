import React from "react";

const StarRating = ({ rating }) => {
  return (
    <div className="text-yellow-500 text-sm mb-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

export default StarRating;
