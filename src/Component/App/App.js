import "./App.css";
import { useState, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useCart } from "../../Context/cartContext";
//import components
// import Signup from "./Component/Signup/Signup";
// import Footer from "./Component/Footer/Footer";
// import Checkout from "./Component/Checkout/Checkout";
// import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
// import Home from "./Component/Home/Home";
import Cart from "../Cart/Cart";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
  LoginPage,
  OrderPage,
  ProductPage,
  RegisterPage,
  ForgetPasswordPage,
  HomePage,
  Login,
  SellerRegistrationPage,
} from "../Pages";
import BuyNow from "../BuyNow/BuyNow";
import SuccessPage from "../BuyNow/SuccessPage";
import ProductsContainer from "../Product/ProductsContainer";
import { OrdersContainer } from "../Order";
import SellerDashBoard from "../Seller/SellerDashBoard";
import { useTheme } from "../../Context/themeContext";
import { Button } from "../UI";
import { FaMoon, FaSun } from "react-icons/fa";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const AppLayout = ({ authToken, setAuthToken, userDetail, setUserDetail }) => {
  const { theme, toggleTheme } = useTheme();
  // String.prototype.toCapitalize = function () {
  //   if (this.length === 0) return;
  //   const name = this.split(" ");
  //   for (let i = 0; i < name.length; i++) {
  //     name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
  //   }
  //   return name.join(" ");
  // };
  // String.prototype.toCapitalize = function () {
  //   if (this.length === 0) return "";
  //   const words = this.split(" ");
  //   for (let i = 0; i < words.length; i++) {
  //     words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  //   }
  //   return words.join(" ");
  // };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key?.toString().toLowerCase() === "b") {
        e.preventDefault();
        // alert(" ctrl + B pressd");
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [toggleTheme]);
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar
        authToken={authToken}
        setAuthToken={setAuthToken}
        userDetail={userDetail}
        setUserDetail={setUserDetail}
      />
      <Outlet />
      <Footer />
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
  String.prototype.toCapitalize = function () {
    if (this.length === 0) return "";
    const words = this.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
  };
  useEffect(() => {
    if (authToken) {
      getUserDetail();
    }
  }, [authToken]);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login authToken={authToken} setAuthToken={setAuthToken} />,
    },
    {
      path: "/login-1",
      element: <LoginPage setAuthToken={setAuthToken} authToken={authToken} />,
    },
    {
      path: "/register",
      element: (
        <RegisterPage setAuthToken={setAuthToken} authToken={authToken} />
      ),
    },
    {
      path: "/forget-password",
      element: (
        <ForgetPasswordPage authToken={authToken} userDetail={userDetail} />
      ),
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
          element: <HomePage authToken={authToken} userDetail={userDetail} />,
        },
        {
          path: "/products",
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
          element: <Navigate to="/" />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
