import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
// ⬇️ use your wrapped component
import StarRating from "../../components/common/StarRating";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [myReviews, setMyReviews] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [submittingIds, setSubmittingIds] = useState(new Set()); // per-product submit lock

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  const fetchMyReviews = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/reviews/mine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyReviews(res.data?.reviews || res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, [token]);

  const handleReorder = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}/reorder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reordered successfully!");
    } catch (err) {
      console.error("Error during reorder:", err);
      toast.error("Failed to reorder");
    }
  };

  const exportPDF = async () => {
    const input = document.getElementById("invoice-content");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Order_${orderId}.pdf`);
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSubmitReview = async (productId) => {
    const { rating, comment } = reviewInputs[productId] || {};
    if (!rating || !comment) {
      toast.warning("Please fill rating and comment");
      return;
    }
    if (submittingIds.has(productId)) return;

    setSubmittingIds((prev) => new Set(prev).add(productId));
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/reviews`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review submitted!");
      await fetchMyReviews();

      // clear inputs for this product
      setReviewInputs((prev) => ({
        ...prev,
        [productId]: { rating: 0, comment: "" },
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review deleted!");
      fetchMyReviews();
    } catch (err) {
      toast.error("Error deleting review");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500 mt-10">Order not found</p>;
  }

  const isDelivered = (order.status || "").toLowerCase() === "delivered";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-orange-600 hover:underline text-sm font-medium"
      >
        ← Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-orange-700">
          Order #{order._id.slice(-6).toUpperCase()}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleReorder}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Reorder
          </button>
          <button
            onClick={exportPDF}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 border transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-6 text-gray-600 space-y-1">
        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: {order.status}</p>
        <p>Supplier: {order.supplierId?.name || "N/A"}</p>
        <p className="font-semibold text-gray-800">
          Total Amount: ₹{order.totalAmount}
        </p>
      </div>

      <div id="invoice-content" className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Items</h3>
        <ul className="space-y-4">
          {order.items.map((item, idx) => {
            const product = item.productId;

            // find my review for this product from /reviews/mine
            const existingReview = (myReviews || []).find(
              (rev) =>
                rev.productId === product._id || rev.productId?._id === product._id
            );

            const submitting = submittingIds.has(product._id);

            return (
              <li key={idx} className="flex flex-col border-b pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image?.url || "/fallback-image.png"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <Link
                      to={`/vendor/product/${product._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <div className="text-gray-700 text-sm">
                    {item.quantity} × ₹{product.price} = ₹
                    {item.quantity * product.price}
                  </div>
                </div>

                {/* Review Section per product */}
                <div className="mt-2 text-sm text-gray-600 w-full">
                  {existingReview ? (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm mb-1 font-medium">Your Review:</p>
                      <StarRating rating={existingReview?.rating || 0} readOnly />
                      {existingReview?.comment ? (
                        <p className="text-gray-700 mt-1">
                          {existingReview.comment}
                        </p>
                      ) : null}
                      <button
                        onClick={() => handleDeleteReview(existingReview._id)}
                        className="text-red-500 text-xs mt-1 hover:underline"
                      >
                        Delete Review
                      </button>
                    </div>
                  ) : isDelivered ? (
                    <div className="mt-2 bg-gray-50 p-2 rounded">
                      <p className="text-sm font-medium">Leave a review:</p>
                      <StarRating
                        rating={reviewInputs[product._id]?.rating || 0}
                        onChange={(val) =>
                          handleReviewChange(product._id, "rating", val)
                        }
                      />
                      <textarea
                        className="w-full mt-1 p-2 border rounded text-sm"
                        rows="2"
                        placeholder="Write your feedback..."
                        value={reviewInputs[product._id]?.comment || ""}
                        onChange={(e) =>
                          handleReviewChange(
                            product._id,
                            "comment",
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() => handleSubmitReview(product._id)}
                        disabled={submitting}
                        className="mt-2 bg-orange-600 text-white text-xs px-3 py-1 rounded hover:bg-orange-700 disabled:opacity-60"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  ) : (
                    <p className="italic text-gray-400 mt-1">
                      You can review after the order is delivered.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
