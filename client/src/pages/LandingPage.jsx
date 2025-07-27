import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import heroImg from "../assets/hero.png";
import vendorIcon from "../assets/vendor.png";
import supplierIcon from "../assets/supplier.png";
import { AuthContext } from "../context/AppContext";

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVendorSignup = () => {
    toast.success("Redirecting to Vendor Signup...");
    setTimeout(() => navigate("/signup?vendor=true"), 1000);
  };

  const handleSupplierSignup = () => {
    toast.success("Redirecting to Supplier Signup...");
    setTimeout(() => navigate("/signup?supplier=true"), 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
              Connect with{" "}
              <span className="text-orange-700">Trusted Suppliers</span> for
              Your Stall Business
            </h1>
            <p className="text-gray-700 text-lg mb-6">
              Join thousands of food vendors getting fresh vegetables, meat,
              eggs, and grocery materials from verified suppliers at wholesale
              prices.
            </p>
            <div className="flex flex-wrap gap-6 items-center mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                ✅ Verified Suppliers
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                🚚 Fast Delivery
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                🛡 Quality Guaranteed
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                👥 Trusted Community
              </div>
            </div>

            {!user && (
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleVendorSignup}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold"
                >
                  Start as Vendor
                </button>
                <button
                  onClick={handleSupplierSignup}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-md font-semibold"
                >
                  Join as Supplier
                </button>
              </div>
            )}
          </div>

          <div className="md:w-1/2">
            <img
              src={heroImg}
              alt="Fresh Market"
              className="w-full rounded-xl shadow-md"
            />
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto text-center grid grid-cols-2 md:grid-cols-4 gap-6 text-orange-700">
          <div>
            <p className="text-2xl font-bold">2,500+</p>
            <p className="text-sm">Active Vendors</p>
          </div>
          <div>
            <p className="text-2xl font-bold">800+</p>
            <p className="text-sm">Trusted Suppliers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">50,000+</p>
            <p className="text-sm">Orders Delivered</p>
          </div>
          <div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-sm">Verified Listings</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-semibold text-orange-700">
            Why VendorVerse?
          </h2>
          <p className="text-gray-700 text-lg">
            Street vendors often struggle with unreliable suppliers, inflated
            prices, and inconsistent delivery schedules. This leads to daily
            stress and lost income.
          </p>
          <p className="text-gray-700 text-lg">
            VendorVerse solves this by offering a transparent, trustworthy
            platform where vendors connect with verified suppliers, compare
            prices in real-time, and receive dependable deliveries directly to
            their stalls.
          </p>
          <p className="text-gray-600">
            Save time, reduce costs, and build lasting supplier relationships —
            all from your phone.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-orange-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-orange-700 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📝",
                title: "Step 1: Create Your Account",
                desc: "Register as a vendor or supplier. It takes just 2 minutes to get started with your verified profile.",
              },
              {
                icon: "🛒",
                title: "Step 2: Browse & Order",
                desc: "Easily explore verified suppliers, compare pricing, check quality tags, and place your orders in one click.",
              },
              {
                icon: "📦",
                title: "Step 3: Receive & Rate",
                desc: "Track deliveries in real-time, get raw materials on time, and rate your experience to build trust for others.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection CTA (Only if not logged in) */}
      {!user && (
        <section className="bg-gradient-to-br from-orange-50 to-white py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-orange-700 mb-4">
            Choose Your Role
          </h2>
          <p className="text-gray-600 mb-10">
            Join VendorVerse and unlock seamless access to affordable,
            high-quality raw materials — whether you're sourcing or supplying.
          </p>
          <div className="flex justify-center gap-10 flex-wrap">
            <div className="w-72 p-6 border border-orange-200 rounded-xl hover:shadow-xl transition text-center">
              <img
                src={vendorIcon}
                alt="Vendor"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                I’m a Food Vendor
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get access to trusted suppliers, compare pricing, and order
                directly to your stall.
              </p>
              <button
                onClick={handleVendorSignup}
                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
              >
                Sign Up as Vendor
              </button>
            </div>

            <div className="w-72 p-6 border border-orange-200 rounded-xl hover:shadow-xl transition text-center">
              <img
                src={supplierIcon}
                alt="Supplier"
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-700 mb-2">
                I’m a Supplier
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                List your products, manage orders, and grow your customer base
                with ease.
              </p>
              <button
                onClick={handleSupplierSignup}
                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
              >
                Sign Up as Supplier
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LandingPage;
