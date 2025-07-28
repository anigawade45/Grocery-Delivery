import React, { useState } from "react";
import { toast } from "react-toastify";

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/vendor/product/${productId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment: text }),
        }
      );
      toast.success("✅ Review submitted!");
      setRating(5);
      setText("");
    } catch (err) {
      toast.error("❌ Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Your Review</span>
        <textarea
          className="mt-1 block w-full border p-2 rounded"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Rating</span>
        <select
          className="mt-1 block w-24 border p-1 rounded"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((val) => (
            <option key={val} value={val}>
              {val} Star{val > 1 && "s"}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
