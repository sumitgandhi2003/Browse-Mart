import React, { useState } from "react";
import { useTheme } from "../Context/themeContext";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const PasswordEye = ({ password, error }) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const passwordToggle = () => {
    setIsPasswordShow((prev) => !prev);
  };
  const { theme } = useTheme();
  return (
    <div
      onClick={passwordToggle}
      className={`hover:cursor-pointer absolute  right-3  -translate-y-1/2 ${
        password ? "flex items-center justify-center" : "hidden"
      }  ${error.password ? "top-1/3" : "top-1/2"}`}
    >
      {isPasswordShow ? (
        <FaEyeSlash
          className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
        />
      ) : (
        <FaEye
          className={` ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        />
      )}
    </div>
  );
};

export default PasswordEye;
