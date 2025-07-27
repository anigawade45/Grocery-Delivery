import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleSelect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setRoleAndRedirect = async () => {
      if (isLoaded && user) {
        const searchParams = new URLSearchParams(location.search);
        const role = searchParams.get("role");

        // Only set metadata if it hasn’t been set yet
        if (!user.unsafeMetadata?.role && role) {
          await user.update({
            unsafeMetadata: {
              role: role,
            },
          });
        }

        const finalRole = user.unsafeMetadata?.role || role;

        if (finalRole === "vendor") {
          navigate("/vendor");
        } else if (finalRole === "supplier") {
          navigate("/supplier");
        } else {
          navigate("/signup");
        }
      }
    };

    setRoleAndRedirect();
  }, [isLoaded, user, location, navigate]);

  return null;
};

export default RoleSelect;
