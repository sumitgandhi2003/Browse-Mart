import { useState } from "react";

//import components
import Hamburger from "../Hamburger/Hamburger";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isShow, SetIsShow] = useState(false);
  return (
    <div className="nav-bar flex justify-between items-center w-full h-16 p-3 bg-blue-900 sticky top-0 z-50 shadow-md  shadow-black/20">
      <Link to={"/"}>
        <div className="logo text-2xl text-white font-bold">BrowseMart</div>
      </Link>
      <div className="input w-5/12 border border-white mobile:hidden tablet:block">
        Input
      </div>
      <div
        className={`links flex w-min gap-4 only:border-b-white only:border-b-2 justify-end items-center text-white font-semibold text-lg mobile:${
          isShow ? "flex-col" : "hidden"
        } mobile:absolute mobile:top-16 mobile:left-0 mobile:w-full mobile:text-left mobile:p-2 mobile:bg-blue-900 mobile: tablet:flex tablet:top-0 tablet:relative tablet:w-1/3 `}
      >
        <Link to={"/"}>
          <div>Home</div>
        </Link>
        {/* <Link to={"/allproduct"}>
          <div>Product</div>
        </Link> */}
        <Link>
          <div>Cart</div>
        </Link>
        <Link>
          <div className="hover:bg-blue-400 p-2 rounded h-min ">Login</div>
        </Link>
      </div>

      <Hamburger isShow={isShow} SetIsShow={SetIsShow} />
    </div>
  );
};

export default Navbar;
