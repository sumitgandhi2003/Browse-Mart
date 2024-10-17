import Button from "../Button/Button";
import React, { useState } from "react";
import { handleAddToCart } from "../../utility/addToCart";
const Productcard = ({ product, userDetail, authToken }) => {
  const [productAdding, setProductAdding] = useState(false);
  const { image, name, price, category, id, rating } = product;
  return (
    <div
      className="product-card group w-full h-full max-h-[400px] max-w-[300px]  gap-4 border-2  border-gray-00 tablet:hover:border-blue-500 tablet:hover:bg-gray-200
 rounded-md p-2 shadow-md relative "
    >
      {/* <Link to={"/product/" + id} className="w-full"> */}
      <img
        src={image || image[0]}
        className="aspect-square object-cover w-full z-10 rounded-md object-top "
        alt={name}
      />
      {/* </Link> */}

      <div className="product-info w-full text-left p-2 relative">
        {/* <Link to={"/product/" + id} className="w-full"> */}
        <div className="product-name w-full text-ellipsis overflow-hidden whitespace-nowrap font-roboto text-2xl hover:text-gray-400 mobile:text-base laptop:text-lg font-bold">
          {name}
        </div>
        {/* </Link> */}
        <div className="flex gap-1 items-center justify-between my-1">
          <div className="product-price  font-bold text-lg mobile:text-sm my-1 ">
            {/* ₹{(price * 83.71)?.toFixed(2)} */}₹{price}
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
          <Button
            btntext={"add to cart"}
            className={
              " py-1 px-2 rounded z-10 font-roboto bg-blue-900 text-white outline-none hover:bg-blue-500 mobile:text-[10px] w-max tablet:text-[13px] laptop:text-sm large-device:text-base"
            }
            disabled={false}
            loading={productAdding}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleAddToCart(userDetail, id, authToken, setProductAdding);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Productcard;
