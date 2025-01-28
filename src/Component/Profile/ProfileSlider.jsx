import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import { FaUpload } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

import Swal from "sweetalert2";
import { swalWithCustomConfiguration } from "../../utility/constant";
import Profile from "./Profile";
import ProductUpload from "../UploadProduct/ProductUpload";
import { useNavigate } from "react-router-dom";
// const wishListIcon = require("../../assets/images/wishlist-list-favorite-svgrepo-com.svg");
const ProfileSlider = ({
  showProfileSlider,
  setShowProfileSlider,
  userDetail,
  setUserDetail,
  authToken,
  setAuthToken,
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [isProfileShow, setISProfileShow] = useState(true);
  const handleLogOut = () => {
    swalWithCustomConfiguration
      .fire({
        title: "Are you Leaving?",
        text: "Are you sure want to logout?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: "Logout",
        denyButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((response) => {
        if (response.isConfirmed) {
          localStorage.removeItem("AuthToken");
          setAuthToken(null);
          setShowProfileSlider(false);
          navigate("/");
          setUserDetail(null);
        } else if (response.isDenied) {
          return;
        }
      });
  };
  return (
    <div
      className={`h-full fixed top-0 flex right-0 w-4/12 mobile:w-full mobile:rounded-none tablet:w-4/12 tablet:rounded-l-lg shadow-md shadow-black/60 rounded-l-lg overflow-hidden transition-transform duration-75 transform bg-white  ${
        showProfileSlider ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full w-1/12 relative bg-blue-500 max-w-[40px] min-w-[35px]  ">
        <RxCross2
          className="relative top-2 left-[50%] translate-x-[-50%]  cursor-pointer font-extrabold text-2xl bg-white text-blue-500 rounded-full p-1 "
          onClick={() => setShowProfileSlider((prev) => !prev)}
        />
        <div className="w-full relative top-10 flex flex-col gap-5 items-center justify-normal">
          <div>
            <FaUser
              className=" text-3xl rounded-full p-1 text-white hover:text-blue-500 cursor-pointer font-extrabold hover:bg-white"
              onClick={() => setActiveTab("profile")}
            />
          </div>
          <div>
            {userDetail?.userType === "seller" ? (
              <FaUpload
                className=" text-3xl rounded-full p-1 text-white hover:text-blue-500 cursor-pointer font-extrabold hover:bg-white"
                onClick={() => setActiveTab("upload")}
              />
            ) : userDetail?.userType === "admin" ? (
              <div>Admin</div>
            ) : (
              <div>Buyer</div>
            )}
          </div>
          <div>
            {/* <img src={wishListIcon} alt="" className=" h-5" />
             */}
            <svg
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.05"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 p-0.5  font-bold text-white rounded-full cursor-pointer hover:bg-white hover:text-blue-500 flex justify-center items-center"
            >
              <g data-name="24 wishlist" id="_24_wishlist">
                <path d="M27.11,17.74a1,1,0,0,1-1,1H16.79a1,1,0,0,1,0-2h9.32A1,1,0,0,1,27.11,17.74Z" />
                <path d="M39.79,16.65,35.71,20a1.025,1.025,0,0,1-.64.23.948.948,0,0,1-.65-.25l-2.78-2.42a1,1,0,0,1-.1-1.41,1.011,1.011,0,0,1,1.42-.1l2.13,1.87,3.44-2.82a.989.989,0,0,1,1.4.14A1,1,0,0,1,39.79,16.65Z" />
                <path d="M27.11,27.06a1,1,0,0,1-1,1H16.79a1,1,0,0,1,0-2h9.32A1,1,0,0,1,27.11,27.06Z" />
                <path d="M39.79,25.97l-4.08,3.35a.97.97,0,0,1-.64.23.948.948,0,0,1-.65-.25l-2.78-2.42a1,1,0,0,1-.1-1.41,1.011,1.011,0,0,1,1.42-.1l2.13,1.87,3.44-2.82a.989.989,0,0,1,1.4.14A1,1,0,0,1,39.79,25.97Z" />
                <path d="M27.11,36.38a1,1,0,0,1-1,1H16.79a1,1,0,0,1,0-2h9.32A1,1,0,0,1,27.11,36.38Z" />
                <path d="M39.79,35.29l-4.08,3.36a1.015,1.015,0,0,1-.64.22.987.987,0,0,1-.65-.24L31.64,36.2a1,1,0,0,1-.1-1.41,1.01,1.01,0,0,1,1.42-.09l2.13,1.86,3.44-2.82a1,1,0,0,1,1.26,1.55Z" />
                <path d="M27.11,45.7a1,1,0,0,1-1,1H16.79a1,1,0,0,1,0-2h9.32A1,1,0,0,1,27.11,45.7Z" />
                <path d="M45.75,38.46V9.93A3.718,3.718,0,0,0,41.96,6.3H35.5V5.5a2.006,2.006,0,0,0-2-2H22.45a2.006,2.006,0,0,0-2,2v.8H13.99a3.727,3.727,0,0,0-3.8,3.63V52.2a3.728,3.728,0,0,0,3.8,3.64H33.45a11.248,11.248,0,1,0,12.3-17.38ZM22.45,5.5H33.5V9.09H22.45ZM13.99,53.84a1.752,1.752,0,0,1-1.8-1.64V9.93a1.751,1.751,0,0,1,1.8-1.63h6.46v.79a2,2,0,0,0,2,2H33.5a2,2,0,0,0,2-2V8.3h6.46a1.741,1.741,0,0,1,1.79,1.63V38.06a11.726,11.726,0,0,0-1.2-.07A11.238,11.238,0,0,0,32.29,53.84ZM42.55,58.5a9.255,9.255,0,1,1,9.26-9.25A9.261,9.261,0,0,1,42.55,58.5Z" />
                <path d="M49.52,46.61c-.01-.11-.03-.21-.05-.32a3.519,3.519,0,0,0-3.48-2.94h-.02a5,5,0,0,0-3.42,1.46,4.963,4.963,0,0,0-3.42-1.46h-.01a3.326,3.326,0,0,0-.96.15.749.749,0,0,0-.16.04,3.5,3.5,0,0,0-2.01,1.73c-.01.03-.02.05-.03.08a3.682,3.682,0,0,0-.33.95c-.02.1-.03.2-.05.31-.65,4.9,4.37,8.58,5.89,9.57l.51.35a.931.931,0,0,0,.57.19.959.959,0,0,0,.58-.19l.47-.33C45.15,55.19,50.17,51.51,49.52,46.61ZM42.55,54.5c-2.67-1.76-5.38-4.67-4.98-7.63l.03-.21a1.526,1.526,0,0,1,1.52-1.31,3.026,3.026,0,0,1,2.54,1.58,1.039,1.039,0,0,0,1.78,0,3.039,3.039,0,0,1,2.54-1.58,1.518,1.518,0,0,1,1.52,1.3l.04.22C47.93,49.82,45.25,52.72,42.55,54.5Z" />
              </g>
            </svg>
          </div>
        </div>

        <LuLogOut
          className="absolute p-1 bottom-2 text-3xl rounded-full text-white -scale-100 hover:bg-white hover:text-blue-500 cursor-pointer font-extrabold left-[50%] translate-x-[-50%]"
          onClick={handleLogOut}
        />
      </div>
      {activeTab === "profile" && (
        <Profile
          userDetail={userDetail}
          authToken={authToken}
          setUserDetail={setUserDetail}
        />
      )}
      {/* {isProfileShow && (
        <Profile userDetail={userDetail} authToken={authToken} />
      )} */}
      {activeTab === "upload" && userDetail?.userType === "seller" && (
        <ProductUpload authToken={authToken} />
      )}
    </div>
  );
};

export default ProfileSlider;
