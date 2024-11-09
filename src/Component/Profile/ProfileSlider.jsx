import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import { FaUpload } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import swal from "sweetalert";
import Profile from "./Profile";
import ProductUpload from "../UploadProduct/ProductUpload";
import { useNavigate } from "react-router-dom";
const ProfileSlider = ({
  showProfileSlider,
  setShowProfileSlider,
  userDetail,
  setUserDetail,
  authToken,
  setAuthToken,
}) => {
  const [active, setActive] = useState("user");
  const navigate = useNavigate();
  const [isProfileShow, setISProfileShow] = useState(true);
  const handleLogOut = () => {
    swal("Are you Leaving?", "Are you sure want to logout?", "warning", {
      buttons: {
        cancel: {
          text: "Cancel",
          visible: true,
        },
        confirm: {
          text: "Logout",
          visible: true,
          className: " bg-blue-500",
        },
      },
    }).then((willLogOut) => {
      if (willLogOut) {
        localStorage.removeItem("AuthToken");
        setAuthToken(null);
        setShowProfileSlider(false);
        navigate("/");
        setUserDetail(null);
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
              onClick={() => setActive("user")}
            />
          </div>
          <div>
            {userDetail?.userType === "seller" ? (
              <FaUpload
                className=" text-3xl rounded-full p-1 text-white hover:text-blue-500 cursor-pointer font-extrabold hover:bg-white"
                onClick={() => setActive("upload")}
              />
            ) : userDetail?.userType === "admin" ? (
              <div>Admin</div>
            ) : (
              <div>Buyer</div>
            )}
          </div>
        </div>

        <LuLogOut
          className="absolute p-1 bottom-2 text-3xl rounded-full text-white -scale-100 hover:bg-white hover:text-blue-500 cursor-pointer font-extrabold left-[50%] translate-x-[-50%]"
          onClick={handleLogOut}
        />
      </div>
      {active === "user" && (
        <Profile
          userDetail={userDetail}
          authToken={authToken}
          setUserDetail={setUserDetail}
        />
      )}
      {/* {isProfileShow && (
        <Profile userDetail={userDetail} authToken={authToken} />
      )} */}
      {active === "upload" && userDetail?.userType === "seller" && (
        <ProductUpload authToken={authToken} />
      )}
    </div>
  );
};

export default ProfileSlider;
