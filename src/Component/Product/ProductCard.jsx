import Button from "../UI/Button";
import React, { useState } from "react";
import { handleAddToCart } from "../../utility/addToCart";
import { formatAmount } from "../../utility/constant";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/cartContext";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
const ProductCard = ({ product, userDetail, authToken }) => {
  const [productAdding, setProductAdding] = useState(false);
  const { setCartCount } = useCart();
  const { image, name, price, category, id, rating, stock, sellingPrice } =
    product;
  const navigate = useNavigate();
  return (
    <div
      className="product-card group w-full h-full max-h-[400px] max-w-[300px]  gap-4 border-2  border-gray-00 tablet:hover:border-blue-500 tablet:hover:bg-gray-200
 rounded-md p-2 shadow-md relative laptop:hover:scale-105 transition-all duration-300 ease-in-out "
    >
      <span className="bg-white absolute h-10 w-10 p-2 flex items-center justify-center rounded-full  right-4 top-4">
        <FaRegHeart className=" text-lg w-full h-full text-gray-400 cursor-pointer hover:text-red-500" />
      </span>
      <FaHeart />

      {/* <Link to={"/product/" + id} className="w-full"> */}
      <img
        src={image || image[0]}
        className="aspect-square object-cover w-full z-10 rounded-md object-top "
        alt={name}
      />
      {/* </Link> */}

      <div className="product-info w-full text-left p-2 relative">
        {/* <Link to={"/product/" + id} className="w-full"> */}
        <div className="product-name w-full text-ellipsis overflow-hidden whitespace-nowrap font-roboto text-2xl hover:text-gray-400 mobile:text-lg laptop:text-2xl font-bold">
          {name}
        </div>
        {/* </Link> */}
        <div className="flex gap-1 items-center justify-between my-1">
          <div className="product-price font-bold text-xl flex justify-center items-center mobile:text-lg tablet:text-xl font-roboto my-1 ">
            {/* ₹{(price * 83.71)?.toFixed(2)} */}
            {formatAmount(price || sellingPrice)}
          </div>
          {rating && rating !== null && (
            <div className="hidden tablet:flex">
              {[1, 2, 3, 4, 5]?.map((index) => {
                return (
                  <svg
                    key={index}
                    className={`w-5 h-5 cursor-pointer ${
                      index <= Math.round(rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
                  </svg>
                );
              })}
            </div>
          )}
        </div>
        <div className="w-1/2 text-ellipsis overflow-hidden whitespace-nowrap font-roboto text-base mobile:text-xs tablet:text-sm">
          {category?.capitalise()}
        </div>
        <div className="add-to-cart-btn absolute bottom-2 right-0  mobile:bottom-1 laptop::bottom-2 ">
          {stock > 0 ? (
            <Button
              btntext={"Add to Cart"}
              className={
                " py-1 px-2 min-w-16 bg-blue-100 text-blue-600 rounded flex justify-center items-center z-10 font-roboto  outline-none hover:bg-blue-500 hover:text-white mobile:text-xs  tablet:text-[13px] laptop:text-sm laptop:w-max large-device:text-base"
              }
              disabled={false}
              loading={productAdding}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleAddToCart(
                  userDetail,
                  id,
                  authToken,
                  setProductAdding,
                  navigate,
                  setCartCount
                );
              }}
            />
          ) : (
            <Button
              btntext={"Out of Stock"}
              className={
                " py-1 px-2 text-red-600 bg-red-100 flex justify-center items-center  text-xs font-roboto rounded mobile:text-xs  tablet:text-[13px] laptop:text-sm laptop:w-max large-device:text-base"
              }
              disabled={true}
              onClick={(e) => {
                e.preventDefault();
                return;
              }}
            />

            // <p className="text-red-600 flex justify-center items-center bg-red-100 text-xs p-1 font-roboto rounded mobile:text-xs mobile:w-20 tablet:text-[13px] laptop:text-sm laptop:w-max large-device:text-base">
            //   Out of Stock
            // </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
