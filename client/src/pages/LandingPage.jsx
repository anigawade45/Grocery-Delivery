import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-orange-700">
        Welcome to RasoiSathi 🍲
      </h1>
      <p className="text-gray-700 mb-8 max-w-md">
        Empowering street food vendors with affordable, trusted raw materials.
        Join our platform to buy or sell quality supplies!
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-2 bg-white border border-orange-600 text-orange-600 rounded hover:bg-orange-100 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
