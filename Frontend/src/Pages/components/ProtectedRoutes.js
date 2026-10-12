import { useUser } from "../Navbar/context/userContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return null; 
  }

  if (!user || user.isVerified !== true) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoutes;