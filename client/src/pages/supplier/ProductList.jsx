import React from "react";
import tomatoImg from "../../assets/tomato.png";
import paneerImg from "../../assets/paneer.png";
import onionImg from "../../assets/onion.png";
import milkImg from "../../assets/milk.png";

const products = [
  {
    id: 1,
    name: "Tomatoes",
    category: "Vegetables",
    supplier: "FreshKart",
    price: 30,
    image: tomatoImg,
  },
  {
    id: 2,
    name: "Milk",
    category: "Dairy",
    supplier: "AgroHub",
    price: 48,
    image: milkImg,
  },
  {
    id: 3,
    name: "Onion",
    category: "Vegetables",
    supplier: "FarmFresh",
    price: 32,
    image: onionImg,
  },
  {
    id: 4,
    name: "Paneer",
    category: "Dairy",
    supplier: "LocalDairy",
    price: 240,
    image: paneerImg,
  },
];

export default function ProductList() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-orange-700 mb-8">Your Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md border border-orange-100 p-4 flex flex-col"
          >
            <div className="w-full h-48 rounded-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-sm text-gray-500">By {product.supplier}</p>
              <p className="text-orange-600 font-semibold mt-2">₹{product.price}</p>
              <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
