import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StarRating from "../../components/common/StarRating";
import { toast } from "react-toastify";
import moment from "moment";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("token");

  const getCurrentUserId = () => {
    try {
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const json = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return json?.id || json?._id || json?.userId || null;
    } catch {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/product/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct(res.data.product);
    } catch {
      toast.error("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [productId, token]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/vendor/reviews/product/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(res.data?.reviews || res.data || []);
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, [productId, token]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleAddToCart = async () => {
    if (!product || !product._id) return;
    setAdding(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  // ---- Edit / Delete ----
  const startEdit = (review) => {
    setEditingId(review._id);
    setEditingText(review.comment || "");
    setEditingRating(review.rating || 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setEditingRating(5);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editingText || !editingRating) {
      toast.info("Please provide rating and comment.");
      return;
    }
    setSavingEdit(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/vendor/reviews/${editingId}`,
        { rating: editingRating, comment: editingText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated!");
      await fetchReviews();
      cancelEdit();
    } catch {
      toast.error("Failed to update review");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review deleted!");
      await fetchReviews();
      if (editingId === reviewId) cancelEdit();
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const avgRating = useMemo(() => {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  // ---- Helpers ----
  const calcAverage = (list) => {
    if (!list?.length) return 0;
    const sum = list.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / list.length) * 10) / 10; // 1-decimal
  };

  // If your StarRating supports onChange(value: number), we can use it for editing:
  const handleStarEditChange = (val) => setEditingRating(val);

  // Fallback: simple clickable stars if your StarRating is display-only.
  // Uncomment below and use <EditableStars ... /> instead of <StarRating ... onChange={...} />
  /*
  const EditableStars = ({ value, onChange, max = 5 }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1;
        const active = idx <= value;
        return (
          <button
            key={idx}
            type="button"
            aria-label={`Rate ${idx}`}
            className={active ? "text-yellow-500" : "text-gray-300"}
            onClick={() => onChange(idx)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
  */

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-orange-600 hover:underline mb-6"
      >
        ← Back to Browse
      </button>

      {loading ? (
        <div className="flex gap-8">
          <Skeleton height={250} width={"50%"} />
          <div className="flex-1 space-y-3">
            <Skeleton height={30} width="80%" />
            <Skeleton count={3} />
            <Skeleton height={20} width="60%" />
            <Skeleton height={40} width="30%" />
          </div>
        </div>
      ) : !product ? (
        <p className="text-center text-red-500">Product not found.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow p-6">
          <img
            src={!imgError ? product.image?.url : "/fallback-image.png"}
            onError={() => setImgError(true)}
            alt={product.name}
            className="w-full lg:w-1/2 h-64 object-cover rounded"
          />
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <div className="text-xl text-orange-700 font-bold">
              ₹{product.price} / {product.unit}
            </div>
            <p className="text-sm text-gray-600">
              Category: <span className="font-medium">{product.category}</span>
            </p>
            <p className="text-sm text-gray-600">
              Supplier:{" "}
              <span className="font-medium">
                {product.supplierId?.name || "Unknown"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Description:{" "}
              <span className="font-medium">{product.description}</span>
            </p>

            {/* You can keep or remove this static product.rating */}
            <div className="flex items-center gap-2 text-black">
              <StarRating rating={avgRating} />
              <span className="mt-1 text-shadow-md text-black">
                {avgRating} ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>

            <p
              className={`text-sm font-semibold ${
                product.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {product.inStock && (
              <div className="flex items-center gap-2 mt-2">
                <label htmlFor="qty" className="text-sm">
                  Quantity:
                </label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-sm"
                />
              </div>
            )}

            <button
              disabled={!product.inStock || adding}
              onClick={handleAddToCart}
              className={`mt-4 px-6 py-3 rounded text-white font-medium ${
                product.inStock
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-400 cursor-not-allowed"
              } ${adding ? "opacity-70" : ""}`}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      )}

      {/* --- All Reviews (inline edit/delete for current user's review) --- */}
      {!loading && product && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Product Reviews
          </h3>
          {reviewsLoading ? (
            <Skeleton count={3} />
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const reviewVendorId = review.vendorId?._id || review.vendorId;
                const isMine =
                  currentUserId &&
                  reviewVendorId &&
                  String(reviewVendorId) === String(currentUserId);

                const isEditing = editingId === review._id;

                return (
                  <div
                    key={review._id}
                    className={`border rounded-md p-4 shadow-sm ${
                      isMine ? "bg-orange-50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-800">
                        {review.vendorId?.name || "Anonymous"}
                        {isMine && (
                          <span className="ml-2 text-xs text-orange-700">
                            (You)
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {moment(review.createdAt).fromNow()}
                      </span>
                    </div>

                    {/* Content */}
                    {!isEditing ? (
                      <>
                        <StarRating rating={review.rating} />
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                        {review.response ? (
                          <p className="text-sm mt-2 italic text-gray-600">
                            Supplier response: “{review.response}”
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {/* ⭐ Use interactive stars for editing. 
                            If your StarRating is display-only, use the fallback component. */}
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm text-gray-600">Rating:</span>
                          <StarRating
                            rating={editingRating}
                            onChange={handleStarEditChange}
                          />
                          {/* Fallback:
                          <EditableStars value={editingRating} onChange={setEditingRating} />
                          */}
                        </div>
                        <textarea
                          className="w-full border rounded p-2 text-sm"
                          rows={3}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          placeholder="Update your comment"
                        />
                      </>
                    )}

                    {/* Actions for my review */}
                    {isMine && (
                      <div className="flex gap-2 mt-3">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => startEdit(review)}
                              className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteReview(review._id)}
                              disabled={deletingId === review._id}
                              className="border border-red-300 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-50 disabled:opacity-60"
                            >
                              {deletingId === review._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={saveEdit}
                              disabled={savingEdit}
                              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 disabled:opacity-60"
                            >
                              {savingEdit ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
