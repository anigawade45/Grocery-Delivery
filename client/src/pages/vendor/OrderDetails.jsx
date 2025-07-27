import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(res.data.order);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleReorder = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/orders/${orderId}/reorder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Reordered successfully!");
    } catch (err) {
      console.error("Error during reorder:", err);
      alert("❌ Failed to reorder");
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

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500 mt-10">Order not found</p>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-orange-600 hover:underline"
        >
          ← Back to Orders
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-orange-700">
            Order #{order._id.slice(-6).toUpperCase()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleReorder}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Reorder
            </button>
            <button
              onClick={exportPDF}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              Export PDF
            </button>
          </div>
        </div>

        <p className="mb-2 text-gray-600">
          Date: {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="mb-2 text-gray-600">Status: {order.status}</p>
        <p className="mb-6 text-gray-700 font-semibold">
          Total Amount: ₹{order.totalAmount}
        </p>

        {/* Printable Content */}
        <div id="invoice-content" className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-medium mb-2">Items:</h3>
          <ul className="space-y-4">
            {order.items.map((item, idx) => {
              const product = item.productId;
              return (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Link
                      to={`/vendor/product/${product._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <div className="text-gray-700">
                    {item.quantity} × ₹{product.price} = ₹
                    {item.quantity * product.price}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Generate Review Section */}
      <div className="max-w-4xl mx-auto px-4 py-10 mt-10 bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold text-orange-700 mb-4">
          Generate Review
        </h3>
        <ReviewForm orderId={order._id} />
      </div>
    </>
  );
};

const ReviewForm = ({ orderId }) => {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      alert("Please provide a star rating.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/reviews",
        { orderId, rating, comment },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      alert("✅ Review submitted successfully!");
      setComment("");
      setRating(0);
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("❌ Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Write your review here..."
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Star Rating
        </label>
        <StarRating
          rating={rating}
          setRating={setRating}
          disabled={submitting}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

const StarRating = ({ rating, setRating, disabled }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && setRating(star)}
          className={`text-3xl ${
            star <= rating ? "text-orange-500" : "text-gray-300"
          } focus:outline-none`}
          aria-label={`${star} Star`}
          disabled={disabled}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default OrderDetails;
