import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";

const BuyNow = lazy(() => import("../Component/BuyNow/BuyNow"));
const SuccessPage = lazy(() => import("../Component/BuyNow/SuccessPage"));
const Cart = lazy(() => import("../Component/Cart/Cart"));
const OrdersContainer = lazy(() =>
  import("../Component/Order").then((module) => ({
    default: module.OrdersContainer,
  })),
);
const HomePage = lazy(() => import("../Component/Pages/HomePage"));
const OrderPage = lazy(() => import("../Component/Pages/OrderPage"));
const ProductPage = lazy(() => import("../Component/Pages/ProductPage"));
const SellerRegistrationPage = lazy(() =>
  import("../Component/Pages/SellerRegistrationPage"),
);
const ProductsContainer = lazy(() =>
  import("../Component/Product/ProductsContainer"),
);

const ConsumerRoutes = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductsContainer />,
  },
  {
    path: "/product/:productId",
    element: <ProductPage />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/product/buy/:productId",
    element: <BuyNow />,
  },
  {
    path: "/checkout",
    element: <BuyNow />,
  },
  {
    path: "/order-success",
    element: <SuccessPage />,
  },
  {
    path: "/orders",
    element: <OrdersContainer />,
  },
  {
    path: "/order/:orderId",
    element: <OrderPage />,
  },
  {
    path: "/seller-registration",
    element: (
      <ProtectedRoute requiredRole={"consumer"} redirectPath={"/seller"}>
        <SellerRegistrationPage />
      </ProtectedRoute>
    ),
  },
];

export default ConsumerRoutes;
