import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import swal from "sweetalert";
import Button from "../Button/Button";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const CartCard = ({
  product,
  authToken,
  isDataFetching,
  setIsDataFetching,
  getCartItem,
}) => {
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  // const handleIncrement = () => {
  //   setQuantity((prevQuantity) => prevQuantity + 1);
  // };

  // const handleDecrement = () => {
  //   if (quantity > 1) {
  //     setQuantity((prevQuantity) => prevQuantity - 1);
  //   }
  // };
  const updateCart = async (newQuantity = 0) => {
    // setIsDataFetching((prevState) => !prevState);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/user/update-cart`,
      data: { productId: product?.item?._id, quantity: newQuantity },
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => {
        console.log(res);
        // setIsDataFetching((prevState) => !prevState);
        getCartItem();
      })
      .catch((error) => {
        console.log(error);
        // setIsDataFetching((prevState) => !prevState);
        swal("Something went wrong!", "Cant update cart", "error");
      });
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
    updateCart(quantity + 1);
  };
  const handleDecrement = () => {
    // if (quantity > 1) {
    setQuantity((prev) => prev - 1);
    updateCart(quantity - 1);
    // }
  };
  const handleRemoveClicked = () => {
    updateCart();
  };

  return (
    <div className="flex gap-4 w-full max-h-[200px] items-center p-2 mobile:flex-col small-device:flex-row">
      <div className="w-1/2 flex gap-4 items-center justify-between overflow-scroll  mobile:w-full small-device:w-1/2">
        <div className="w-2/5">
          <img
            src={product?.item?.image?.[0] || ""}
            alt={product?.item?.name || ""}
            className=" min-w-[70px] min-h-[70px] max-w-[100px] max-h-[100px] w-full object-cover object-top aspect-square rounded"
          />
        </div>

        <div className="h-full w-3/5  flex flex-col gap-2 overflow-scroll">
          <span className="text-lg font-roboto font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
            {product?.item?.name}
          </span>
          <span className="text-sm font-roboto text-ellipsis line-clamp-2 ">
            {product?.item?.description}
          </span>
          {/* <span>{product?.item?.price}</span> */}
          <Button
            btntext={"remove"}
            className={
              "w-min p-1 bg-gray-300 rounded mobile:hidden small-device:block"
            }
            onClick={handleRemoveClicked}
          />
        </div>
      </div>
      <div className="flex gap-2 items-center w-1/2 justify-between font-medium text-sm mobile:w-full small-device:w-1/2">
        <span className="w-1/3 flex justify-center items-center mobile:hidden small-device:flex">
          <FaRupeeSign className="font-roboto font-medium text-sm" />
          {product?.item?.price}
        </span>
        <div className="w-1/3 flex justify-center items-center gap-3">
          <span
            className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            onClick={handleDecrement}
          >
            <FaMinus />
          </span>
          <span className=" bg-gray-200 border-gray-300 border-2 px-3 py-1">
            {product?.quantity}
          </span>
          <span
            className="cursor-pointer p-1 hover:bg-gray-100 rounded-full"
            onClick={handleIncrement}
          >
            <FaPlus />
          </span>
        </div>
        <span className="w-1/3 flex justify-center items-center text-lg">
          <FaRupeeSign className="font-roboto font-medium text-sm" />
          {product?.quantity * product?.item?.price}
        </span>
      </div>
    </div>
  );
};

export default CartCard;
