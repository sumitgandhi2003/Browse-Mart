import { useState } from "react";
//import components
import Hamburger from "../Hamburger/Hamburger";
import { Link } from "react-router-dom";
const maleProfileIcon = require("../../assets/images/maleprofileicon.jpg");
const Navbar = ({ authToken, userDetail }) => {
  const [isShow, SetIsShow] = useState(false);
  return (
    <div className="nav-bar flex justify-between items-center w-full h-16 p-3 bg-blue-400 sticky top-0 z-50 shadow-md  shadow-black/20">
      <Link to={"/"}>
        <div className="logo text-2xl text-white font-bold">BrowseMart</div>
      </Link>
      {/* <div className="input w-5/12 border border-white mobile:hidden tablet:block">
        Input
      </div> */}
      <div
        className={`links flex w-min gap-4 only:border-b-white only:border-b-2 justify-end items-center text-white font-semibold text-lg mobile:${
          isShow ? "flex-col" : "hidden"
        } mobile:absolute mobile:top-16 mobile:left-0 mobile:w-full mobile:text-left mobile:p-2 mobile:bg-blue-4000 mobile: tablet:flex tablet:top-0 tablet:relative tablet:w-1/3 `}
      >
        {/* <Link to={"/allproduct"}>
          <div>Product</div>
        </Link> */}
        {/* <Link>
          <div>Cart</div>
        </Link> */}
        {authToken !== null && authToken !== undefined && authToken !== "" ? (
          <div className="flex gap-2 items-center cursor-pointer">
            <div className="max-w-12 h-12 rounded-full overflow-hidden">
              <img src={maleProfileIcon} className="w-full" />
            </div>
            <div>{userDetail?.name}</div>
          </div>
        ) : (
          <Link to={"/login"}>
            <div className="bg-blue-600 py-1 px-3 rounded h-min ">Login</div>
          </Link>
        )}
      </div>

      <Hamburger isShow={isShow} SetIsShow={SetIsShow} />
    </div>
  );
};

export default Navbar;
