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
import Profile1 from "../Profile/profile1";
import { Loader } from "../UI";
import { useAuth } from "../../Context/authContext";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const AppLayout = ({ setAuthToken, userDetail, setUserDetail }) => {
  const { toggleTheme } = useTheme();

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
      <Navbar userDetail={userDetail} setUserDetail={setUserDetail} />
      <Outlet />
      <Footer userDetail={userDetail} />
    </div>
  );
};

const App = () => {
  const [userDetail, setUserDetail] = useState();
  const { setCartCount } = useCart(null);
  const { authToken, setAuthToken } = useAuth();
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

      const { data } = response;
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

  const ProtectedRoute = ({ user, requiredRole, redirectPath, children }) => {
    if (user === undefined) {
      // Show loading UI or return null while fetching user data
      console.log("loading...");
      return <Loader />;
    }
    if (!user) {
      // Redirect to login if not authenticated
      console.log(user);
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.userType !== requiredRole) {
      // Redirect if user does not have the required role
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  };

  // eslint-disable-next-line no-extend-native
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
    } else {
      setUserDetail(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);
  console.log(userDetail);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/login-1",
      element: <LoginPage setAuthToken={setAuthToken} authToken={authToken} />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/forget-password",
      element: <ForgetPasswordPage userDetail={userDetail} />,
    },
    {
      path: "/",
      element: (
        <AppLayout userDetail={userDetail} setUserDetail={setUserDetail} />
      ),
      children: [
        {
          path: "/",
          element: <HomePage userDetail={userDetail} />,
        },
        {
          path: "/products",
          element: <ProductsContainer userDetail={userDetail} />,
        },
        {
          path: "/product/:productId",
          element: <ProductPage userDetail={userDetail} />,
        },
        {
          path: "/cart",
          element: <Cart userDetail={userDetail} />,
        },
        {
          path: "/product/buy/:productId",
          element: <BuyNow userDetail={userDetail} />,
        },
        {
          path: "/checkout",
          element: <BuyNow userDetail={userDetail} />,
        },
        {
          path: "/order-success",
          element: <SuccessPage />,
        },
        {
          path: "/orders",
          element: <OrdersContainer userDetail={userDetail} />,
        },
        {
          path: "/order/:orderId",
          element: <OrderPage userDetail={userDetail} />,
        },
        {
          path: "/seller-registration",
          element: (
            <ProtectedRoute
              user={userDetail}
              requiredRole={"consumer"}
              redirectPath={"/seller-dashboard"}
            >
              <SellerRegistrationPage userDetail={userDetail} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/seller-dashboard",
          element: (
            <ProtectedRoute
              user={userDetail}
              requiredRole={"seller"}
              redirectPath={"/seller-registration"}
            >
              <SellerDashBoard userDetail={userDetail} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: <Profile1 />,
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
