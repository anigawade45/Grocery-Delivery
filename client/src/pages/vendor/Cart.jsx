import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("❌ Failed to fetch cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart/${productId}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("❌ Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`🗑️ Removed item from cart`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("❌ Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("✅ Order placed successfully!");
      fetchCart();
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("❌ Failed to place order");
    }
  };

  const totalAmount = cart?.items?.reduce((sum, item) => {
    const product = item.productId;
    return sum + product.price * item.quantity;
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

      {cart?.items?.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4 text-lg">🛒 Your cart is empty.</p>
          <Link
            to="/vendor/browse"
            className="text-orange-600 underline hover:text-orange-700 font-medium"
          >
            ← Go browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.items.map((item) => {
            const product = item.productId;
            return (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row items-center gap-4 bg-white shadow-md rounded-lg p-4"
              >
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="w-32 h-24 object-cover rounded"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Supplier: {product.supplierId?.name}
                  </p>
                  <p className="text-orange-600 font-semibold">
                    ₹{product.price} × {item.quantity} = ₹
                    {product.price * item.quantity}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, item.quantity - 1)
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg"
                  >
                    −
                  </button>
                  <span className="px-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product._id, item.quantity + 1)
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(product._id)}
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
