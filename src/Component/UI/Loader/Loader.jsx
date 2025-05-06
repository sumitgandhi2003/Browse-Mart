import React, { useEffect } from "react";
import "./Loader.css";
import { useTheme } from "../../../Context/themeContext";

export const Loader = () => {
  const { theme } = useTheme();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });
  return (
    <div
      className={` h-screen w-full flex justify-center items-center transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-200"
      } `}
    >
      <div className="loader">
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default Loader;
