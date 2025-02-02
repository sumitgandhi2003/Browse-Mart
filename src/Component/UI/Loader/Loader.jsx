import React from "react";
import "./Loader.css";

export const Loader = () => {
  return (
    <div className=" flex-1 w-full h-full flex justify-center items-center">
      <div className="loader">
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default Loader;
