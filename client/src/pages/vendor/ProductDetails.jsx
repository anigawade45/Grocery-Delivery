import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StarRating from "../../components/common/StarRating";
import ReviewForm from "../../components/common/ReviewForm";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/product/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(res.data.product);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || !product._id) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

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
      ) : error || !product ? (
        <p className="text-center text-red-500">
          {error || "Product not found."}
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow p-6">
          {/* Image with fallback */}
          <img
            src={!imgError ? product.image?.url : "/fallback-image.png"}
            onError={() => setImgError(true)}
            alt={product.name}
            className="w-full lg:w-1/2 h-64 object-cover rounded"
          />

          {/* Product info */}
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

            <StarRating rating={product.rating || 4.3} />
            <p
              className={`text-sm font-semibold ${
                product.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

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

      {!loading && product && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Leave a Review
          </h3>
          <ReviewForm productId={productId} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
