import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const setRole = async (role) => {
    await user.update({ publicMetadata: { role } });
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-xl font-semibold">Select your role</h2>
      <button onClick={() => setRole("vendor")} className="px-4 py-2 bg-blue-500 text-white rounded">Vendor</button>
      <button onClick={() => setRole("supplier")} className="px-4 py-2 bg-green-500 text-white rounded">Supplier</button>
      <button onClick={() => setRole("admin")} className="px-4 py-2 bg-red-500 text-white rounded">Admin</button>
    </div>
  );
};

export default RoleSelect;