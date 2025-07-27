import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to load product:", err);
        setError("Failed to load product. Please try again.");
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
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("❌ Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading product details...</p>;
  }

  if (error || !product) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error || "Product not found."}
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-orange-600 hover:underline mb-6"
      >
        ← Back to Browse
      </button>

      <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg shadow p-6">
        {/* Product Image */}
        <img
          src={product.image?.url}
          alt={product.name}
          className="w-full lg:w-1/2 h-64 object-cover rounded"
        />

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-gray-600">{product.description}</p>

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

          <div className="flex items-center gap-2 text-sm">
            <Star size={16} className="text-yellow-500" />
            <span className="text-gray-800 font-medium">
              {product.rating || 4.3} ({product.reviewsCount || 32} reviews)
            </span>
          </div>

          <p
            className={`text-sm font-semibold ${
              product.inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Add to Cart */}
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
    </div>
  );
};

export default ProductDetails;
