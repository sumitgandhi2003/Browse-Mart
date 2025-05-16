import { Navigate } from "react-router-dom";
import { useUser } from "../Context/userContext";
import { Loader } from "../LIBS";

const ProtectedRoute = ({ requiredRole, redirectPath, children }) => {
  const { userDetail } = useUser();
  if (userDetail === undefined) {
    // Show loading UI or return null while fetching user data
    console.log("loading...");
    return <Loader />;
  }
  if (!userDetail) {
    // Redirect to login if not authenticated
    console.log(userDetail);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userDetail.userType !== requiredRole) {
    // Redirect if user does not have the required role
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
