import React, { useState, useEffect } from "react";
import { products as allProducts } from "../../data/data";
import { Link } from "react-router-dom";

const BrowseProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(allProducts); // simulate API delay
      setLoading(false);
    }, 1500);
  }, []);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setMaxPrice("");
    setSelectedSupplier("");
    setSearchTerm("");
    setSortOption("");
    setMaxPrice("");
  };

  const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];
  const uniqueSuppliers = [...new Set(allProducts.map((p) => p.supplier))];

  const sortedProducts = [...products];
  if (sortOption === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  const filteredProducts = sortedProducts.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesPrice = !maxPrice || product.price <= parseInt(maxPrice);
    const matchesSupplier =
      !selectedSupplier || product.supplier === selectedSupplier;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesPrice && matchesSupplier && matchesSearch;
  });

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart!`);
  };

  const skeletons = Array.from({ length: 6 });

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-56"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-44"
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
            className="border rounded px-3 py-2 w-full sm:w-44"
          >
            <option value="">All Suppliers</option>
            {uniqueSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-44"
          >
            <option value="">Sort By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-36"
          />
        </div>
        <button
          onClick={handleClearFilters}
          className="bg-orange-100 text-orange-700 px-4 py-2 rounded hover:bg-orange-200 transition mt-2 lg:mt-0"
        >
          Clear Filters
        </button>
      </div>

      {/* Product Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          skeletons.map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow animate-pulse space-y-3"
            >
              <div className="h-40 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded mt-4" />
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-3 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm text-gray-600">By {product.supplier}</p>
                <p className="text-orange-600 font-bold text-lg">
                  ₹{product.price}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/vendor/product/${product._id}`}
                  className="hover:underline text-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products match the selected filters or search.
          </p>
        )}
      </section>
    </div>
  );
};

export default BrowseProducts;
