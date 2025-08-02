import React from "react";
const SkeletonReviewCard = () => {
  return (
    <div className="animate-pulse border border-gray-200 rounded-lg p-4 mb-6">
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-300 rounded w-1/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-full mb-3" />
      <div className="h-10 bg-gray-300 rounded w-full mb-2" />
      <div className="h-8 bg-gray-300 rounded w-32" />
    </div>
  );
};

export default SkeletonReviewCard;
