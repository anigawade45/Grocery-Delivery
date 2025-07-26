import React, { useState } from "react";
import { products as allProducts } from "../../data/data";

const BrowseProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const filteredProducts = allProducts.filter((product) => {
    return (
      (!selectedCategory || product.category === selectedCategory) &&
      (!maxPrice || product.price <= parseInt(maxPrice)) &&
      (!selectedSupplier || product.supplier === selectedSupplier)
    );
  });

  const handleClearFilters = () => {
    setSelectedCategory("");
    setMaxPrice("");
    setSelectedSupplier("");
  };

  const uniqueCategories = [...new Set(allProducts.map((p) => p.category))];
  const uniqueSuppliers = [...new Set(allProducts.map((p) => p.supplier))];

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-4">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-orange-700 mb-4">Filters</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price (₹)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. 100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            {uniqueSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleClearFilters}
          className="w-full mt-4 bg-orange-100 text-orange-700 py-2 rounded hover:bg-orange-200 transition"
        >
          Clear Filters
        </button>
      </aside>

      {/* Product Grid */}
      <section className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
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
                <button className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500">
            No products match the selected filters.
          </p>
        )}
      </section>
    </div>
  );
};

export default BrowseProducts;
