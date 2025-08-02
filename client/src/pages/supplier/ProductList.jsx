import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil, Trash2, RotateCcw, Search } from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showDeleted, setShowDeleted] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/supplier/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.products || [];
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/supplier/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product deleted!");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/supplier/products/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product restored!");
      fetchProducts();
    } catch {
      toast.error("Failed to restore product");
    }
  };

  useEffect(() => {
    let result = [...products];
    if (!showDeleted) {
      result = result.filter((p) => !p.isDeleted);
    } else {
      result = result.filter((p) => p.isDeleted);
    }

    if (query) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    setFiltered(result);
  }, [query, category, products, showDeleted]);

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

  const confirmAction = (message = "Are you sure?") => {
    return new Promise((resolve, reject) => {
      const id = toast(
        ({ closeToast }) => (
          <div>
            <p>{message}</p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(id);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  resolve(false);
                  toast.dismiss(id);
                }}
                className="px-3 py-1 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeButton: false,
        }
      );
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-orange-700">Your Products</h2>
        <button
          onClick={() => setShowDeleted((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showDeleted ? "Show Active" : "Show Deleted"}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-orange-400"
        >
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white border p-4 rounded-xl shadow-md"
            >
              <div className="bg-gray-200 h-48 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3" />
              <div className="h-3 bg-gray-200 rounded mb-1 w-1/3" />
              <div className="h-3 bg-gray-200 rounded mb-1 w-1/2" />
              <div className="h-3 bg-gray-200 rounded mb-1 w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product._id}
              className={`bg-white rounded-xl shadow-md border p-4 flex flex-col relative ${
                product.isDeleted ? "opacity-60" : ""
              }`}
            >
              <div className="w-full h-48 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={product.image?.url || "/fallback.jpg"}
                  alt={product.name || "Product image"}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />
              </div>

              <div className="mt-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock} {product.unit}
                </p>
                <p className="text-orange-600 font-semibold mt-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                {product.isDeleted ? (
                  <button
                    onClick={() => handleRestore(product._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <RotateCcw size={16} /> Restore
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => toast.info("Edit coming soon")}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
