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
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/reviews`,
          { headers: { Authorization: `Bearer ${token}` } }
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
    const responseText = (review?.response || "").trim();

    if (!responseText) {
      return toast.error("Response cannot be empty!");
    }

    setSubmitting(id);

    // Optimistic update is already applied via state change above.
    // We just persist:
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/reviews/${id}/respond`,
        { response: responseText },
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
      toast.error(err?.response?.data?.message || "Failed to submit response");
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
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
  }

  if (error) return <p className="p-6 text-red-500 font-semibold">{error}</p>;

  if (reviews.length === 0)
    return <p className="p-6 text-gray-600 italic">No reviews yet.</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">
        Customer Reviews
      </h2>

      <div className="space-y-6">
        {reviews.map((review) => {
          const productName = review.productId?.name || "Product";
          const productImg = review.productId?.image?.url || "/fallback-image.png";
          const customerName = review.vendorId?.name || "Customer";
          const customerEmail = review.vendorId?.email || "";

          return (
            <div
              key={review._id}
              className="border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                {/* Product thumbnail */}
                <img
                  src={productImg}
                  alt={productName}
                  className="w-16 h-16 rounded object-cover border"
                />

                <div className="flex-1">
                  {/* Header row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{customerName}</p>
                      {customerEmail && (
                        <p className="text-xs text-gray-500">{customerEmail}</p>
                      )}
                    </div>
                    <p className="text-sm text-orange-600 font-medium">
                      {productName}
                    </p>
                  </div>

                  {/* Stars + comment */}
                  <div className="mt-1">
                    <StarRating rating={review.rating} readOnly size="small" />
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2 italic">“{review.comment}”</p>
                  )}

                  {/* Response box */}
                  <div className="mt-3">
                    <textarea
                      rows="2"
                      className="w-full border p-2 rounded text-sm"
                      placeholder={
                        review.response
                          ? "Edit your response…"
                          : "Write a response…"
                      }
                      value={review.response || ""}
                      onChange={(e) =>
                        handleResponseChange(review._id, e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleSubmit(review._id)}
                      disabled={submitting === review._id}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
                    >
                      {submitting === review._id ? "Submitting..." : "Submit Response"}
                      <SendHorizonal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewManager;
