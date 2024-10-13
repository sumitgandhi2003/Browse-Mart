import React from "react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
const emptyCartImage = require("../../assets/images/emptyCart.png");

const EmptyCart = () => {
  return (
    <div className="loader-container flex justify-center items-center ">
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
            className={"font-roboto bg-blue-400 text-white p-2 rounded"}
          />
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
