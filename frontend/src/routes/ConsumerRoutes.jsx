import BuyNow from "../Component/BuyNow/BuyNow";
import SuccessPage from "../Component/BuyNow/SuccessPage";
import Cart from "../Component/Cart/Cart";
import { OrdersContainer } from "../Component/Order";
import {
  HomePage,
  OrderPage,
  ProductPage,
  SellerRegistrationPage,
} from "../Component/Pages";
import ProductsContainer from "../Component/Product/ProductsContainer";
import ProtectedRoute from "./ProtectedRoute";

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
