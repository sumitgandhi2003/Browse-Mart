import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Toast } from "./constant";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const AddRemoveProductFromWishListButton = ({
  authToken,
  productId,
  userDetail,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const addProductToWishList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsSaved(true);
      const response = await axios.post(
        `${SERVER_URL}/api/user/add-to-wishlist`,
        {
          productId: productId,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data, status } = response;
      if (status === 201) {
        Toast?.fire({
          title: "Item saved to Shopping List",
          icon: "success",
        });
      } else if (status === 200) {
        setIsSaved(!data?.isRemoved);
        Toast?.fire({
          title: data?.message,
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  return (
    <span
      className={` absolute top-2 right-2 bg-white rounded-full p-2 shadow  h-8 w-8   flex items-center justify-center    ${
        !authToken ? "hidden" : ""
      }`}
      onClick={addProductToWishList}
    >
      {isSaved ? (
        <FaHeart className={`text-red-500 w-full h-full `} />
      ) : (
        <FaRegHeart className="text-gray-500 w-full h-full" />
      )}
    </span>
  );
};

export default AddRemoveProductFromWishListButton;
