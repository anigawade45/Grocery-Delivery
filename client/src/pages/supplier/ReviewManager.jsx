import React, { useState } from "react";

const sampleReviews = [
  {
    id: 1,
    customer: "Anjali P.",
    product: "Onions",
    rating: 4,
    comment: "Fresh and good quality!",
    response: "",
  },
  {
    id: 2,
    customer: "Raj T.",
    product: "Paneer",
    rating: 2,
    comment: "Paneer was a bit sour this time.",
    response: "",
  },
  {
    id: 3,
    customer: "Kavita J.",
    product: "Tomatoes",
    rating: 5,
    comment: "Super fresh and delivered on time.",
    response: "Thank you! 😊",
  },
];

const ReviewManager = () => {
  const [reviews, setReviews] = useState(sampleReviews);

  const handleResponseChange = (id, text) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, response: text } : r))
    );
  };

  const handleSubmit = (id) => {
    alert("Response submitted for review ID: " + id);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">Customer Reviews</h2>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-orange-200 rounded-lg p-4 mb-4"
        >
          <p className="font-semibold text-gray-800">
            {review.customer} — <span className="text-orange-600">{review.product}</span>
          </p>
          <p className="text-sm text-gray-600">Rating: {"⭐".repeat(review.rating)}</p>
          <p className="text-gray-700 mb-2">{review.comment}</p>

          <textarea
            rows="2"
            className="w-full border p-2 rounded text-sm"
            placeholder="Write a response..."
            value={review.response}
            onChange={(e) => handleResponseChange(review.id, e.target.value)}
          />
          <button
            onClick={() => handleSubmit(review.id)}
            className="mt-2 px-4 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
          >
            Submit Response
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReviewManager;
