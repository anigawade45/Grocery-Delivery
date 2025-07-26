import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RoleSelect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const role = user.publicMetadata?.role;

    // ✅ Only redirect if role is already assigned
    if (role === "vendor") navigate("/vendor");
    else if (role === "supplier") navigate("/supplier");
    else if (role === "admin") navigate("/admin");
  }, [isLoaded, user, navigate]);

  const handleRoleSelect = async (role) => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Update Clerk metadata
      await user.update({
        publicMetadata: { role },
      });

      // 2. Save user in MongoDB
      await axios.post("http://localhost:3000/api/users/assign-role", {
        clerkId: user.id,
        role,
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
      });

      // 3. Redirect
      if (role === "vendor") navigate("/vendor");
      else if (role === "supplier") navigate("/supplier");
      else if (role === "admin") navigate("/admin");
    } catch (error) {
      console.error("❌ Failed to assign role:", error);
      alert("Something went wrong while assigning the role.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-50 px-4">
      <h2 className="text-2xl font-bold text-orange-700 mb-6">
        Choose Your Role
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => handleRoleSelect("vendor")}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
        >
          I'm a Vendor
        </button>

        <button
          onClick={() => handleRoleSelect("supplier")}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
        >
          I'm a Supplier
        </button>

        <button
          onClick={() => handleRoleSelect("admin")}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded"
        >
          I'm an Admin
        </button>
      </div>
    </div>
  );
};

export default RoleSelect;
