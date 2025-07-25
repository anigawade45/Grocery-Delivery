import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRoleRedirect = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const role = user?.publicMetadata?.role;
        if (role === "vendor") navigate("/vendor/dashboard");
        if (role === "supplier") navigate("/supplier/dashboard");
        if (role === "admin") navigate("/admin/dashboard");
    }, [user]);
};
