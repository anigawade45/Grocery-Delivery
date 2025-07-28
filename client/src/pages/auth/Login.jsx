import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AppContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        form,
        {
          withCredentials: true,
        }
      );

      const { user, token } = res.data;
      login(user, token);

      // Supplier status-based redirects
      if (user.role === "supplier") {
        if (user.status === "pending") {
          navigate("/pending");
          return;
        } else if (user.status === "rejected") {
          navigate("/rejected");
          return;
        }
      }

      // Role-based redirect (if not redirected back to a protected route)
      if (from === "/") {
        switch (user.role) {
          case "vendor":
            navigate("/vendor/browse");
            break;
          case "supplier":
            navigate("/supplier/products");
            break;
          case "admin":
            navigate("/admin/suppliers");
            break;
          default:
            navigate("/");
        }
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-center text-red-600 text-sm mt-2">{error}</div>
          )}
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">Don't have an account?</span>
          <button
            className="ml-2 text-orange-700 hover:underline text-sm"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
