import { useState } from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isShow, SetIsShow] = useState(false);
  return (
    <div className="nav-bar flex justify-between items-center w-full h-16 p-3 bg-blue-900">
      <Link to={"/"}>
        <div
          className="logo text-2xl text-white font-bold"
          onClick={() => SetIsShow(!isShow)}
        >
          BrowseMart
        </div>
      </Link>
      <div className="input w-5/12 border border-white">Input</div>
      <div
        className={`links flex w-min gap-4 justify-around text-white font-semibold text-lg mobile:${
          isShow ? "block" : "hidden"
        } mobile:absolute mobile:top-16 mobile:left-0 mobile:w-full mobile:text-left mobile:p-2 mobile:bg-blue-900 tablet:flex tablet:top-0 tablet:relative tablet:w-1/3`}
      >
        <Link to={"/"}>
          <div>Home</div>
        </Link>
        <Link to={"/allproduct"}>
          <div>Product</div>
        </Link>
        <Link>
          <div>Cart</div>
        </Link>
        <Link>
          <div>Contact</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
