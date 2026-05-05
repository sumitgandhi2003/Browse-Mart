import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useUser } from "../Context/userContext";

const AdminLayout = lazy(() => import("../Component/Admin/AdminLayout"));
const AdminDashboard = lazy(() =>
  import("../Component/Admin/Dashboard/AdminDashboard"),
);
const UserManagement = lazy(() =>
  import("../Component/Admin/UserManagement/UserManagement"),
);
const AdminProductList = lazy(() =>
  import("../Component/Admin/ProductManagement/AdminProductList"),
);
const CategoryManagement = lazy(() =>
  import("../Component/Admin/CategoryManagement/CategoryManagement"),
);

const AdminOnly = ({ children }) => {
  const { userDetail } = useUser();
  
  if (!userDetail) return null; // Wait for load
  
  if (userDetail?.userType !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoutes = {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <AdminOnly>
        <AdminLayout />
      </AdminOnly>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <AdminDashboard />,
    },
    {
      path: "users",
      element: <UserManagement />,
    },
    {
      path: "products",
      element: <AdminProductList />,
    },
    {
        path: "categories",
        element: <CategoryManagement />,
    },
  ],
};

export default AdminRoutes;
