import { useState, useContext } from "react";
import Hamburger from "../UI/Hamburger";
import { Link } from "react-router-dom";
import ProfileSlider from "../Profile/ProfileSlider";
import { useTheme } from "../../Context/themeContext";
import { useCart } from "../../Context/cartContext";
import { FaSun, FaMoon, FaShoppingCart, FaUser } from "react-icons/fa";
import { Button, SearchBar } from "../UI";
import { useAuth } from "../../Context/authContext";

const maleProfileIcon = require("../../assets/images/maleprofileicon.jpg");
const Navbar = ({ userDetail, setUserDetail }) => {
  const [showProfileSlider, setShowProfileSlider] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { authToken } = useAuth();
  const { cartCount } = useCart();
  const themeClass =
    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900";
  return (
    <>
      <nav
        className={` ${themeClass} sticky top-0 z-50 flex justify-between  items-center p-4 shadow-md transition-all duration-300 `}
      >
        <Link to={"/"}>
          <h1 className="text-2xl  mobile:text-2xl tablet:text-3xl laptop:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Browse Mart
          </h1>
        </Link>
        <div className="flex  items-center gap-4">
          <SearchBar />
          <Button
            onClick={toggleTheme}
            className={`p-1 rounded-full  bg-opacity-75 transition-all duration-300 ${
              theme === "dark" ? "hover:bg-gray-400" : "hover:bg-gray-300"
            }`}
            icon={
              theme === "dark" ? (
                <FaSun className="text-white w-4 h-4 transition-all duration-300" />
              ) : (
                <FaMoon className="text-gray-800 w-4 h-4 transition-all duration-300" />
              )
            }
          />
          {authToken ? (
            <>
              <Link to={"/cart"}>
                <span className="relative">
                  <FaShoppingCart
                    className={`text-lg cursor-pointer  ${
                      theme === "dark"
                        ? "hover:text-indigo-400"
                        : "hover:text-indigo-600"
                    }`}
                    aria-label="Cart"
                  />
                  <span className="absolute bg-white rounded-full flex justify-center items-center font-semibold  h-4 w-4 -top-2 -right-2 text-black text-[12px]   ">
                    {cartCount}
                  </span>
                </span>
              </Link>
              {/* <Link to={""}> */}
              <FaUser
                className={`text-lg cursor-pointer  ${
                  theme === "dark"
                    ? "hover:text-indigo-400"
                    : "hover:text-indigo-600"
                }`}
                aria-label="User Profile"
                onClick={() => setShowProfileSlider((prev) => !prev)}
              />
              {/* </Link> */}
            </>
          ) : (
            <Link to={"/login"}>
              <Button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 "
                aria-label="Login"
                btntext="Login"
              />
            </Link>
          )}
        </div>
        {/* profileSlider */}
        {authToken !== null && authToken !== undefined && authToken !== "" && (
          <ProfileSlider
            showProfileSlider={showProfileSlider}
            setShowProfileSlider={setShowProfileSlider}
            userDetail={userDetail}
            setUserDetail={setUserDetail}
          />
        )}
      </nav>

      {/* <div
        className={`nav-bar flex justify-between items-center w-full h-16 p-3   ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-gray-800"
        } transition-all duration-300 sticky top-0 z-50 shadow-md  shadow-black/20`}
      >
        <Link to={"/"}>
          <h1 className="text-xs mobile:text-2xl tablet:text-3xl laptop:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Browse Mart
          </h1>
        </Link>
        <div
          className={`links flex w-min gap-4 justify-end items-center text-white font-semibold text-lg `}
        >
           Show profile / Login Section 
          {authToken ? (
            <div className="flex gap-3 items-center">
              <Link to={"/cart"}>
                <div className="flex gap-2 items-center cursor-pointer relative">
                  <BsCart2
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    } text-3xl font-bold`}
                  />
                  <p
                    className={`bg-indigo-600 text-white w-6 h-6 p-1  font-roboto rounded-full flex justify-center items-center absolute -top-3 left-3 ${
                      cartCount === 0 ? "hidden" : ""
                    }`}
                  >
                    {cartCount}
                  </p>
                  <span
                    className={`${
                      theme === "dark" ? "text-white" : "text-black"
                    } `}
                  >
                    Cart
                  </span>
                </div>
              </Link>
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => setShowProfileSlider((prev) => !prev)}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={maleProfileIcon}
                    className="w-full"
                    alt="profile icon"
                  />
                </div>
                <div
                  className={`${
                    theme === "dark" ? "text-white" : "text-black"
                  }  w-max mobile:hidden small-device:block`}
                >
                  {userDetail?.name?.toCapitalize().split(" ")[0] || "Profile"}
                </div>
              </div>
            </div>
          ) : (
            <Link to={"/login"}>
              <button
                //  onClick={() => setIsLoggedIn(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 "
                aria-label="Login"
              >
                Login
              </button>
            </Link>
          )}
        </div>

        * profileSlider *
        {authToken !== null && authToken !== undefined && authToken !== "" && (
          <ProfileSlider
            showProfileSlider={showProfileSlider}
            setShowProfileSlider={setShowProfileSlider}
            userDetail={userDetail}
            setUserDetail={setUserDetail}
            authToken={authToken}
            setAuthToken={setAuthToken}
          />
        )}

        <Hamburger isShow={isShow} SetIsShow={SetIsShow} /> 
      </div> */}
    </>
  );
};

export default Navbar;

// mobile:${
//   isShow ? "flex-col" : "hidden"
// } mobile:absolute mobile:top-16 mobile:left-0 mobile:w-full mobile:text-left mobile:p-2 mobile:bg-blue-4000 mobile: tablet:flex tablet:top-0 tablet:relative tablet:w-1/3
