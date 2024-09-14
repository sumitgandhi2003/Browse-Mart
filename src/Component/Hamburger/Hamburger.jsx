import React from "react";

const Hamburger = ({ isShow, SetIsShow }) => {
  return (
    <div
      className="w-10 h-8 grid gap-0 tablet:hidden relative"
      onClick={() => SetIsShow(!isShow)}
    >
      <div
        className={`w-full bg-white h-1  transition-all delay-100 rounded-md ${
          isShow ? " transform -rotate-45  origin-right relative bottom-2 " : ""
        }`}
      ></div>
      <div
        className={`w-full bg-white h-1 transition-opacity delay-100 rounded-md ${
          isShow ? " hidden " : ""
        }`}
      ></div>
      <div
        className={`w-full bg-white h-1 transition-all delay-100 rounded-md ${
          isShow ? "transform rotate-45 origin-right relative top-1 " : ""
        }`}
      ></div>
    </div>
  );
};

export default Hamburger;
