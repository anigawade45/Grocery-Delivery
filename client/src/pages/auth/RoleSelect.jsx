import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role;

      if (role === "vendor") {
        navigate("/vendor");
      } else if (role === "supplier") {
        navigate("/supplier");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/signup");
      }
    }
  }, [isLoaded, user, navigate]);

  return null;
};

export default RoleSelect;
