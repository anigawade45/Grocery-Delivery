import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Stripe"); // default
  const [placingOrder, setPlacingOrder] = useState(false); // NEW: track order request
  const navigate = useNavigate();

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
      toast.error("Failed to fetch cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (
    productId,
    newQty,
    productName,
    currentQty
  ) => {
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

      if (newQty > currentQty) {
        toast.success(`Added one more of "${productName}" to your cart.`);
      } else if (newQty < currentQty) {
        toast.info(`Removed one "${productName}" from your cart.`);
      }

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.productId._id === productId) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
        return { ...prevCart, items: updatedItems };
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity.");
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
      toast.success("🗑️ Item removed from cart");

      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter(
          (item) => item.productId._id !== productId
        );
        return { ...prevCart, items: updatedItems };
      });
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");

      const items = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        supplierId: item.productId.supplierId?._id || item.productId.supplierId,
      }));

      const supplierIds = [...new Set(items.map((item) => item.supplierId))];
      if (supplierIds.length !== 1) {
        toast.error(
          "All items must be from the same supplier to place an order."
        );
        return;
      }

      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      const orderData = {
        items,
        totalAmount,
        deliveryDate,
        supplierId: supplierIds[0],
        paymentMethod,
      };

      if (paymentMethod === "COD") {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/vendor/order`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 201) {
          toast.success("✅ Order placed successfully with Cash on Delivery.");
          setCart({ items: [] }); // clear cart frontend
          navigate("/order");
        } else {
          toast.error("Failed to place COD order.");
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/vendor/create-checkout-session`,
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.data.sessionUrl) {
          toast.error("Failed to create Stripe checkout session.");
          return;
        }
        window.location.href = res.data.sessionUrl;
      }
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
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
      <h2 className="text-3xl font-bold text-orange-700 mb-8">Your Cart</h2>

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
                  src={product.image?.url || "/fallback.jpg"}
                  onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                  alt={product.name}
                  className="w-32 h-24 object-cover rounded border"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Supplier: {product.supplierId?.name || "Unknown"}
                  </p>

                  <p className="text-orange-600 font-medium">
                    ₹{product.price} × {item.quantity} ={" "}
                    <span className="font-semibold">
                      ₹{product.price * item.quantity}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        item.quantity - 1,
                        product.name,
                        item.quantity
                      )
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg disabled:opacity-50"
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        item.quantity + 1,
                        product.name,
                        item.quantity
                      )
                    }
                    className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-lg"
                    aria-label="Increase quantity"
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

          {/* Payment Method Selector */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Payment Method:</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="Stripe"
                  checked={paymentMethod === "Stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment (Stripe)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="COD" // ⬅ uppercase to match backend
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="text-right mt-10 border-t pt-6">
            <p className="text-xl font-semibold text-gray-700">
              Total:{" "}
              <span className="text-orange-700 font-bold">
                ₹{totalAmount.toLocaleString()}
              </span>
            </p>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-60"
              disabled={placingOrder} // disable during request
            >
              {placingOrder ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
