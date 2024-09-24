import "./App.css";
import { useState, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { Navigate } from "react-router-dom";

//import components
// import Signup from "./Component/Signup/Signup";
// import Footer from "./Component/Footer/Footer";
// import Cart from "./Component/Cart/Cart";
// import Checkout from "./Component/Checkout/Checkout";
// import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
// import Home from "./Component/Home/Home";
import Login from "./Component/Login/Login";
import Navbar from "./Component/Navbar/Navbar";
import Allproductcontainer from "./Component/Allproductcontainer/Allproductcontainer";
import ProductPage from "./Component/ProductPage/ProductPage";
const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");
const AppLayout = ({ authToken, userDetail }) => {
  return (
    <div className="App">
      <Navbar authToken={authToken} userDetail={userDetail} />
      <Outlet />
    </div>
  );
};

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("AuthToken"));
  const [userDetail, setUserDetail] = useState({});

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
      return response?.data?.user;
    } catch (error) {
      console.log(error?.response?.data?.message);
      if (error?.response?.data?.message === "Token expired") {
        localStorage.removeItem("AuthToken");
        setAuthToken(null);
      }
    }
  };
  // const { data } = getUserDetail();
  // if (data && data.message === "Token expired") {
  //   swal("Expired", "Please login again", "error").then(() => {
  //     localStorage.removeItem("AuthToken");
  //     setAuthToken(null);
  //   });
  // }
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserDetail();
      if (userData) {
        setUserDetail(userData);
      }
    };
    fetchData();
  }, [authToken]);
  console.log(userDetail);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login authToken={authToken} setAuthToken={setAuthToken} />,
    },
    {
      path: "/",
      element: <AppLayout authToken={authToken} userDetail={userDetail} />,
      children: [
        {
          path: "/",
          element: <Allproductcontainer />,
        },
        {
          path: "/allproduct",
          element: <Allproductcontainer />,
        },
        {
          path: "/product/:id",
          element: <ProductPage userDetail={userDetail} />,
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
