import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";

const Rejected = () => {
  const { signOut } = useClerk();

  useEffect(() => {
    const timeout = setTimeout(() => {
      signOut();
    }, 5000); // Auto logout in 5s

    return () => clearTimeout(timeout);
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          ❌ Application Rejected
        </h2>
        <p className="mb-4">
          Sorry, your application was rejected by the admin.
        </p>
        <p className="text-sm text-gray-600">You will be logged out shortly.</p>
      </div>
    </div>
  );
};

export default Rejected;
