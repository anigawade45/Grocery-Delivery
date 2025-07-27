import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/supplier/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("❌ Failed to load products.");
      }
    };
    fetchProducts();
  }, [token]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-orange-700 mb-8">Your Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md border border-orange-100 p-4 flex flex-col"
          >
            <div className="w-full h-48 rounded-md overflow-hidden bg-gray-100">
              <img
                src={product.image?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
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
              <p className="text-sm text-gray-500 mt-1">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
