import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart, Eye, MapPin } from "lucide-react";
import { debounce } from "lodash"; // Install lodash for debounce

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [nearbyOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let apiUrl = `${import.meta.env.VITE_API_URL}/api/vendor/products`;
      if (nearbyOnly && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            apiUrl = `${
              import.meta.env.VITE_API_URL
            }/api/vendor/products/nearby?lat=${latitude}&lng=${longitude}`;
            const res = await axios.get(apiUrl, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data.products || []);
            setLoading(false);
          },
          () => {
            toast.error("Failed to get location");
            setLoading(false);
          }
        );
      } else {
        const res = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleClearFilters = useCallback(() => {
    setSelectedCategory("");
    setMaxPrice("");
    setSelectedSupplier("");
    setSearchTerm("");
    setSortOption("");
  }, []);

  const filterProducts = useCallback(() => {
    let temp = [...products];

    if (selectedCategory) {
      temp = temp.filter((p) => p.category === selectedCategory);
    }
    if (selectedSupplier) {
      temp = temp.filter((p) => p.supplierId?.name === selectedSupplier);
    }
    if (maxPrice) {
      temp = temp.filter((p) => p.price <= parseFloat(maxPrice));
    }
    if (searchTerm) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "asc") {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortOption === "desc") {
      temp.sort((a, b) => b.price - a.price);
    }

    return temp;
  }, [
    products,
    selectedCategory,
    selectedSupplier,
    maxPrice,
    searchTerm,
    sortOption,
  ]);

  const filteredProducts = useMemo(() => filterProducts(), [filterProducts]);

  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );
  const uniqueSuppliers = useMemo(
    () => [...new Set(products.map((p) => p.supplierId?.name).filter(Boolean))],
    [products]
  );

  const handleAddToCart = useCallback(async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  }, []);

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for products..."
          onChange={(e) => debouncedSetSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 md:w-1/2 px-6 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            <option value="">All Suppliers</option>
            {uniqueSuppliers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            <option value="">Sort</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          />

          <label className="flex items-center gap-2 text-sm col-span-full sm:col-auto">
            <input
              type="checkbox"
              checked={nearbyOnly}
              onChange={() => setNearbyOnly(!nearbyOnly)}
              className="h-4 w-4"
            />
            Nearby Only
            <MapPin className="w-4 h-4 text-gray-500" />
          </label>
        </div>

        <button
          onClick={handleClearFilters}
          className="mt-4 lg:mt-0 bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200 font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Product Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          skeletons.map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow animate-pulse space-y-4"
            >
              <div className="h-40 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 w-3/4 rounded" />
              <div className="h-4 bg-gray-200 w-1/2 rounded" />
              <div className="h-4 bg-gray-200 w-1/4 rounded" />
              <div className="h-10 bg-gray-200 w-full rounded" />
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={product.image?.url || "/fallback.jpg"}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-3 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="flex items-center gap-1">
                  <img
                    src={product.supplierId?.logoUrl || "/default-logo.png"}
                    alt={product.supplierId?.name || "Unknown"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <p className="text-sm text-gray-600">
                    By {product.supplierId?.name || "Unknown"}
                  </p>
                </div>
                {/* Add rating and reviews here */}
                <p className="text-orange-600 font-bold text-lg">
                  ₹{product.price}
                </p>
                {product.stock <= 0 && (
                  <p className="text-red-500 font-semibold">Out of Stock</p>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <Link
                  to={`/vendor/product/${product._id}`}
                  className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
                >
                  <Eye className="w-4 h-4" /> View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No matching products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default BrowseProducts;
