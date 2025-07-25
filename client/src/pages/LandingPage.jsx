import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import heroImg from "../assets/hero.png"; // Use a relevant illustration

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section className="bg-orange-50 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-700 mb-4">
            Empowering Street Food Vendors Across India 🇮🇳
          </h1>
          <p className="text-gray-700 mb-6 text-lg">
            RasoiSathi helps vendors find trusted suppliers for affordable raw
            materials — fresh, fast, and fair.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            Get Started
          </button>
        </div>
        <img
          src={heroImg}
          alt="hero"
          className="w-full max-w-xl mx-auto mt-10"
        />
      </section>

      {/* Problem */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-semibold text-orange-700">
            The Real Problem
          </h2>
          <p className="text-gray-600">
            India’s street food vendors struggle to source quality ingredients
            due to unreliable supply chains, high costs, and lack of
            transparency. RasoiSathi bridges this gap with verified suppliers
            and real-time tracking.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-orange-100 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-2xl font-semibold text-center text-orange-700">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-gray-700">
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-2 text-orange-600">1. Sign Up</h3>
              <p>
                Choose your role as Vendor or Supplier and create your account.
              </p>
            </div>
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-2 text-orange-600">2. Explore</h3>
              <p>
                Vendors browse verified suppliers. Suppliers list their
                products.
              </p>
            </div>
            <div className="bg-white rounded shadow p-6">
              <h3 className="font-semibold mb-2 text-orange-600">3. Connect</h3>
              <p>
                Place orders, track delivery, rate sellers, and build trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Call-to-Action */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">
          Who Are You?
        </h2>
        <p className="text-gray-600 mb-6">Choose your journey:</p>
        <div className="flex justify-center gap-6 flex-wrap">
          <button
            onClick={() => navigate("/signup?vendor=true")}
            className="px-6 py-3 border border-orange-600 text-orange-700 rounded hover:bg-orange-50"
          >
            I'm a Vendor
          </button>
          <button
            onClick={() => navigate("/signup?supplier=true")}
            className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            I'm a Supplier
          </button>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
