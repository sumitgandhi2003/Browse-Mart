import axios from "axios";
import React, { useEffect, useState } from "react";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const WishListContainer = ({ authToken }) => {
  const [wishList, setWishList] = useState([]);
  const getAllWishList = async () => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/user/get-wishlist`,
        {
          userId: "",
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      const { status, data } = response;
      if (status === 200) {
        setWishList(...data?.wishListProducts);
      } else if (status === 204) {
        console.log("WishList Is Empty");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (authToken) {
      getAllWishList();
    }
  }, [authToken]);
  return <div>WishListContainer</div>;
};

export default WishListContainer;
