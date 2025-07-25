import React from "react";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignUp path="/signup" routing="path" />
    </div>
  );
};

export default Signup;
