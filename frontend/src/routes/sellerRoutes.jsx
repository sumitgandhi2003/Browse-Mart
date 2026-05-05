// src/routes/sellerRoutes.jsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Setting = lazy(() =>
  import("../Component/Seller").then((module) => ({ default: module.Setting })),
);
const Orders = lazy(() =>
  import("../Component/Seller").then((module) => ({ default: module.Orders })),
);
const DashBoard = lazy(() =>
  import("../Component/Seller").then((module) => ({
    default: module.DashBoard,
  })),
);
const ProductsPanel = lazy(() =>
  import("../Component/Seller").then((module) => ({
    default: module.ProductsPanel,
  })),
);
const AddProductPanel = lazy(() =>
  import("../Component/Seller").then((module) => ({
    default: module.AddProductPanel,
  })),
);
const Customers = lazy(() =>
  import("../Component/Seller").then((module) => ({
    default: module.Customers,
  })),
);
const SellerLayout = lazy(() =>
  import("../Component/Seller").then((module) => ({
    default: module.SellerLayout,
  })),
);

const SellerRoutes = {
  path: "/seller",
  element: (
    <ProtectedRoute requiredRole="seller" redirectPath="/seller-registration">
      <SellerLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="dashboard" />,
    },
    {
      path: "dashboard",
      element: <DashBoard />,
    },
    {
      path: "products",
      element: <ProductsPanel />,
    },
    {
      path: "products/add",
      element: <AddProductPanel />,
    },
    {
      path: "products/edit/:id",
      element: <AddProductPanel />,
    },
    {
      path: "orders",
      element: <Orders />,
    },
    {
      path: "customers",
      element: <Customers />,
    },
    {
      path: "setting",
      element: <Setting />,
    },
    {
      path: "*",
      element: <Navigate to="dashboard" />,
    },
  ],
};

export default SellerRoutes;
