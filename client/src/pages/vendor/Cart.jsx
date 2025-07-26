import React, { useState, useEffect } from "react";
import { products } from "../../data/data"; // importing full product list

const initialCartItems = [
  { productId: "p1", quantity: 2 },
  { productId: "p5", quantity: 1 },
  { productId: "p8", quantity: 1 },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [loading, setLoading] = useState(true);

  // Simulate loading (e.g. from backend or localStorage)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getProductDetails = (id) => products.find((p) => p._id === id);

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== id));
  };

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    setCartItems([]);
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (savedCart) setCartItems(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const totalAmount = cartItems.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-semibold text-orange-700 mb-8">
          Your Cart
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white rounded p-4 shadow animate-pulse"
            >
              <div className="w-32 h-24 bg-gray-200 rounded" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-semibold text-orange-700 mb-8">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg">🛒 Your cart is empty.</p>
          <a
            href="/vendor/browse"
            className="text-orange-600 underline hover:text-orange-700 font-medium"
          >
            ← Go browse products
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => {
            const product = getProductDetails(item.productId);
            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white shadow-md rounded-lg p-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Supplier: {product.supplier}
                  </p>
                  <p className="text-orange-600 font-semibold">
                    ₹{product.price} × {item.quantity} = ₹
                    {product.price * item.quantity}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity - 1)
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg"
                  >
                    −
                  </button>
                  <span className="px-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.productId, item.quantity + 1)
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.productId)}
                  className="text-sm text-red-500 hover:underline mt-2 sm:mt-0"
                >
                  Remove
                </button>
              </div>
            );
          })}

          {/* Summary */}
          <div className="text-right mt-8">
            <p className="text-lg font-semibold text-gray-700">
              Total:{" "}
              <span className="text-orange-700 font-bold">₹{totalAmount}</span>
            </p>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
