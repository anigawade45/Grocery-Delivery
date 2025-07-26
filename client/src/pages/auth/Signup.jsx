import React, { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("vendor");
  const { signUp } = useSignUp();

  // Set metadata after sign-up is completed
  const handleOnSignUp = async () => {
    try {
      await signUp.update({
        publicMetadata: {
          role: role,
        },
      });
      navigate("/select-role");
    } catch (err) {
      console.error("Metadata update failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-8">
      <div className="max-w-xl w-full rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-700">
          Create Your Account
        </h2>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md font-semibold border ${
              role === "vendor"
                ? "bg-orange-600 text-white"
                : "bg-white text-orange-600 border-orange-400"
            }`}
            onClick={() => setRole("vendor")}
          >
            Vendor
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold border ${
              role === "supplier"
                ? "bg-orange-600 text-white"
                : "bg-white text-orange-600 border-orange-400"
            }`}
            onClick={() => setRole("supplier")}
          >
            Supplier
          </button>
        </div>

        {/* Clerk SignUp Component */}
        <div className="flex justify-center">
          <SignUp
            path="/signup"
            routing="path"
            signInUrl="/login"
            afterSignUpUrl="/select-role"
            appearance={{
              elements: {
                card: "shadow-none border-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
