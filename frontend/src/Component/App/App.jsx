import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useCart } from "../../Context/cartContext";
import { useAuth } from "../../Context/authContext";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { ConsumerRoutes, SellerRoutes } from "../../routes";
import AdminRoutes from "../../routes/AdminRoutes";

const AppLayout = lazy(() => import("../AppLayout/AppLayout"));
const Login = lazy(() => import("../Pages/Login"));
const RegisterPage = lazy(() => import("../Pages/RegisterPage"));
const ForgetPasswordPage = lazy(() => import("../Pages/ForgetPasswordPage"));
const GoogleCallback = lazy(() => import("../Pages/GoogleCallback"));
const Profile1 = lazy(() => import("../Profile/profile1"));
const ProfileIndexRedirect = lazy(() =>
  import("../Profile/profile1").then((module) => ({
    default: module.ProfileIndexRedirect,
  })),
);
const ProfileOrdersPage = lazy(() =>
  import("../Profile/profile1").then((module) => ({
    default: module.ProfileOrdersPage,
  })),
);
const ProfileOverviewPage = lazy(() =>
  import("../Profile/profile1").then((module) => ({
    default: module.ProfileOverviewPage,
  })),
);
const ProfileWishlistPage = lazy(() =>
  import("../Profile/profile1").then((module) => ({
    default: module.ProfileWishlistPage,
  })),
);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Global Security Interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || "";
      if (message.includes("suspended")) {
        // Enforce block mechanism globally
        localStorage.removeItem("AuthToken");
        window.location.href = `/login?error=${encodeURIComponent(message)}`;
      }
    }
    return Promise.reject(error);
  },
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/oauth/callback",
    element: <GoogleCallback />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      ...ConsumerRoutes,
      SellerRoutes,
      AdminRoutes,
      {
        path: "/profile",
        element: <Profile1 />,
        children: [
          {
            index: true,
            element: <ProfileIndexRedirect />,
          },
          {
            path: "overview",
            element: <ProfileOverviewPage />,
          },
          {
            path: "orders",
            element: <ProfileOrdersPage />,
          },
          {
            path: "wishlist",
            element: <ProfileWishlistPage />,
          },
          {
            path: "*",
            element: <Navigate to="/profile/overview" replace />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
]);

const App = () => {
  const { setUserDetail } = useUser();
  const { setCartCount } = useCart();
  const { authToken, setAuthToken } = useAuth();
  const { theme } = useTheme();
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

  return (
    <Suspense
      fallback={
        <div
          className={`app-route-loader ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          } flex items-center justify-center`}
        >
          <div
            className={`animate-spin rounded-full h-12 w-12 border-4 ${
              theme === "dark"
                ? "border-gray-700 border-t-white"
                : "border-gray-300 border-t-gray-900"
            }`}
          ></div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
