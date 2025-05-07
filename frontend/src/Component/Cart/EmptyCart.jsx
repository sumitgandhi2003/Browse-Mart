import React from "react";
import Button from "../../LIBS/Button";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/themeContext";
import emptyCartImage from "../../assets/images/emptyCart.png";

const EmptyCart = () => {
  const { theme } = useTheme();
  return (
    <div
      // className={`flex gap-5 p-3  min-h-screen mobile:h-full mobile:flex-col tablet:flex-row ${
      //   theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      // } transition-all duration-300 `}
      className={`min-h-screen flex justify-center items-center  ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-all duration-300 `}
    >
      <div className="flex flex-col items-center gap-3">
        <img
          src={emptyCartImage}
          alt="Empty Cart"
          className="max-w-[350px] mobile:w-[200px] laptop:w-[300px]"
        />
        <h1 className="text-center text-2xl mobile:text-base laptop:text-xl font-roboto">
          Ohh... Your cart is empty!
        </h1>
        <Link to={"/"}>
          <Button
            btntext={"Shop Now"}
            className={"font-roboto bg-indigo-600 text-white p-2 rounded"}
          />
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
