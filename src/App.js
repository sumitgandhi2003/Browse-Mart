import "./App.css";
import { useState, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useCart } from "./Context/cartContext";
//import components
// import Signup from "./Component/Signup/Signup";
// import Footer from "./Component/Footer/Footer";
// import Checkout from "./Component/Checkout/Checkout";
// import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
// import Home from "./Component/Home/Home";
import Cart from "./Component/Cart/Cart";
import Navbar from "./Component/Navbar/Navbar";
import {
  LoginPage,
  OrderPage,
  ProductPage,
  SellerRegistrationPage,
} from "./Component/Pages";
import BuyNow from "./Component/BuyNow/BuyNow";
import SuccessPage from "./Component/BuyNow/SuccessPage";
import ProductsContainer from "./Component/Product/ProductsContainer";
import { OrdersContainer } from "./Component/Order";
import SellerDashBoard from "./Component/Seller/SellerDashBoard";
import HomePage from "./Component/Pages/HomePage";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const AppLayout = ({ authToken, setAuthToken, userDetail, setUserDetail }) => {
  String.prototype.toCapitalise = function () {
    if (this.length === 0) return;
    const name = this.split(" ");
    for (let i = 0; i < name.length; i++) {
      name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
    }
    return name.join(" ");
    // return this.charAt(0).toUpperCase() + this.slice(1);
  };
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar
        authToken={authToken}
        setAuthToken={setAuthToken}
        userDetail={userDetail}
        setUserDetail={setUserDetail}
      />
      <Outlet />
    </div>
  );
};

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("AuthToken"));
  const [userDetail, setUserDetail] = useState();
  const { setCartCount } = useCart(null);
  const getUserDetail = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: `${SERVER_URL}/api/user/profile`,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { status, data } = response;
      setUserDetail(data?.userDetail);
      if (data?.userDetail?.cartCount) {
        setCartCount(data?.userDetail?.cartCount);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      if (error?.response?.data?.message === "Token expired") {
        localStorage.removeItem("AuthToken");
        setAuthToken(null);
      }
    }
  };

  useEffect(() => {
    if (authToken) {
      getUserDetail();
    }
  }, [authToken]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage authToken={authToken} setAuthToken={setAuthToken} />,
    },
    {
      path: "/",
      element: (
        <AppLayout
          authToken={authToken}
          setAuthToken={setAuthToken}
          userDetail={userDetail}
          setUserDetail={setUserDetail}
        />
      ),
      children: [
        {
          path: "/",
          element: (
            <ProductsContainer authToken={authToken} userDetail={userDetail} />
          ),
        },
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          path: "/allproduct",
          element: (
            <ProductsContainer authToken={authToken} userDetail={userDetail} />
          ),
        },
        {
          path: "/product/:productId",
          element: (
            <ProductPage userDetail={userDetail} authToken={authToken} />
          ),
        },
        {
          path: "/cart",
          element: <Cart userDetail={userDetail} authToken={authToken} />,
        },
        {
          path: "/product/buy/:productId",
          element: <BuyNow authToken={authToken} userDetail={userDetail} />,
        },
        {
          path: "/checkout",
          element: <BuyNow authToken={authToken} userDetail={userDetail} />,
        },
        {
          path: "/order-success",
          element: <SuccessPage />,
        },
        {
          path: "/orders",
          element: (
            <OrdersContainer userDetail={userDetail} authToken={authToken} />
          ),
        },
        {
          path: "/order/:orderId",
          element: <OrderPage authToken={authToken} userDetail={userDetail} />,
        },
        {
          path: "/seller-registration",
          element: (
            <SellerRegistrationPage
              authToken={authToken}
              userDetail={userDetail}
            />
          ),
        },
        {
          path: "/seller-dashboard",
          element: (
            <SellerDashBoard userDetail={userDetail} authToken={authToken} />
          ),
        },
        {
          path: "*",
          element: <Navigate to="/allproduct" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
