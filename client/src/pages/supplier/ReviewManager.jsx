import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "../../components/common/StarRating";
import SkeletonReviewCard from "./SkeletonReviewCard";
import { toast } from "react-toastify";
import { SendHorizonal } from "lucide-react";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  const handleResponseChange = (id, text) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, response: text } : r))
    );
  };

  const handleSubmit = async (id) => {
    const review = reviews.find((r) => r._id === id);
    if (!review?.response) return toast.error("Response cannot be empty!");

    setSubmitting(id);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/reviews/${id}/respond`,
        { response: review.response },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Response submitted!");
    } catch (err) {
      console.error("Failed to submit response:", err);
      toast.error("Failed to submit response");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading)
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-orange-700 mb-6">
          Customer Reviews
        </h2>
        {[...Array(3)].map((_, i) => (
          <SkeletonReviewCard key={i} />
        ))}
      </div>
    );

  if (error) return <p className="p-6 text-red-500 font-semibold">{error}</p>;

  if (reviews.length === 0)
    return <p className="p-6 text-gray-600 italic">No reviews yet.</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">
        Customer Reviews
      </h2>
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border border-orange-200 rounded-lg p-4 mb-6"
        >
          <p className="font-semibold text-gray-800">
            {review.customerName || "Customer"} —{" "}
            <span className="text-orange-600">{review.productName}</span>
          </p>
          <StarRating rating={review.rating} />
          <p className="text-gray-700 mb-2 italic">"{review.comment}"</p>

          <textarea
            rows="2"
            className="w-full border p-2 rounded text-sm"
            placeholder="Write a response..."
            value={review.response || ""}
            onChange={(e) => handleResponseChange(review._id, e.target.value)}
          />
          <button
            onClick={() => handleSubmit(review._id)}
            disabled={submitting === review._id}
            className="mt-2 flex items-center gap-2 px-4 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting === review._id ? "Submitting..." : "Submit Response"}
            <SendHorizonal size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReviewManager;
