import React from "react";
import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-8">
      <div className="max-w-md w-full rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">
          Welcome Back
        </h2>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/signup"
            afterSignInUrl="/select-role"
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

export default LoginPage;
