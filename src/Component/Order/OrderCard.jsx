import React, { useState } from "react";
import { Button } from "../UI";
import { Link } from "react-router-dom";
import { formatAmount } from "../../utility/constant";
import { FaRupeeSign } from "react-icons/fa";
const OrderCard = ({ order }) => {
  const [isOrderItemExpanded, setIsOrderItemExpanded] = useState(false);
  const displayItem = order?.orderItems?.slice(
    0,
    isOrderItemExpanded ? order?.orderItems?.length : 2
  );
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <div className="border-2  border-gray-400 rounded-lg w-full h-full font-roboto">
      <div className=" w-full flex justify-between p-3 border-b-2 border-gray-400 ">
        <div className="flex w-9/12 gap-8 mobile:grid mobile:grid-rows-3 mobile:gap-1 mobile:text-sm  tablet:flex tablet:gap-5 tablet:text-base desktop:text-lg">
          <div className=" flex  flex-col">
            <span className=" font-medium">Order Number</span>
            <span className="">
              {(order?.orderId || order?.id).toUpperCase()}
            </span>
          </div>
          <div className=" flex flex-col">
            <span className="font-medium">Order Date</span>
            <span className="">
              {months?.[order?.orderDate?.month - 1] +
                " " +
                order?.orderDate?.day +
                ", " +
                order?.orderDate?.year}
            </span>
          </div>
          <div className=" flex flex-col">
            <span className="font-medium">Total Amount</span>
            <span className="flex items-center ">
              <FaRupeeSign />
              {formatAmount(order?.totalAmount)}
            </span>
          </div>
        </div>
        <div className=" w-3/12 flex flex-wrap justify-center items-center tablet:flex gap-1">
          <Link
            to={"/order/" + order?.orderId || order?._id || order?.id}
            className=""
          >
            <Button
              btntext={"View Order"}
              className={"p-2 rounded-lg text-sm border-2 border-gray-200"}
            />
          </Link>
          <Link className="">
            <Button
              btntext={"View Invoice"}
              disabled={!order?.isInvoiceUploaded || true}
              className={`p-2 rounded-lg  text-sm border-2 border-gray-200 ${
                !order?.isInvoiceUploaded || true
                  ? "cursor-not-allowed bg-gray-300 text-gray-400"
                  : "bg-blue-400"
              }`}
            />
          </Link>
        </div>
      </div>
      {/* <hr className="border-1 border-gray-400" /> */}
      {/* <p>Order ID: {order?.orderId || order?.id}</p> */}
      {/* <p>Product ID: {order.productId}</p> */}
      <div className="">
        {/* <p>Status: {order.orderStatus}</p>
                  <p>
                    Date:{" "}
                    {`${order.orderDate?.day}-${order.orderDate?.month}-${order.orderDate?.year}`}
                  </p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Price: {order.price}</p> */}
        {displayItem?.map((item, index) => {
          const islastItem = index === displayItem.length - 1;
          return (
            <div
              key={item?.productId || item?.id || item?._id || index}
              className={`p-4 border-gray-400  ${
                islastItem ? "boder-b-0" : "border-b-2"
              }`}
            >
              <div className="flex gap-4 w-full">
                <img
                  src={item?.productImage}
                  className="w-[150px] h-[150px] object-fill aspect-square rounded"
                  alt=""
                />
                <div className="w-full ">
                  <div className="flex justify-between font-semibold">
                    <p className="font-semibold mobile:w-full">
                      {" "}
                      {item?.productName}
                    </p>
                    <span className="flex items-center gap-1 mobile:hidden ">
                      <FaRupeeSign className="font-light" />
                      <p className="font-semibold">
                        {formatAmount(item?.price)}
                      </p>
                    </span>
                  </div>

                  <p>{item?.quantity}</p>
                  <p className="line-clamp-3">{item?.productDescription}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold text-lg p-2">
                  <span>Order Status: </span>
                  {order?.orderStatus} {order?.DeliveryDate || ""}
                </p>
                {/* <p>{item?.price}</p></p> */}
                <div className="flex mobile:grid mobile:grid-rows-3 mobile:gap-0 mobile:place-items-center tablet:flex gap-2 items-center">
                  <Link
                    to={`/product/${item?.productId || item?.id || item?._id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className=" min-w-24 w-24 "
                  >
                    <Button
                      btntext={"View Product"}
                      className={
                        "text-blue-400 bg-none text-sm w-full font-semibold font-roboto"
                      }
                    />
                  </Link>
                  <span className="text-gray-400"> | </span>
                  <Link
                    to={`/product/buy/${
                      item?.productId || item?.id || item?._id
                    }`}
                    className=" min-w-20 w-20 "
                  >
                    <Button
                      btntext={"Buy Again"}
                      className={
                        "text-blue-400 bg-none text-sm w-full font-semibold font-roboto"
                      }
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        {order?.orderItems?.length > 2 && (
          <div className="w-full flex justify-center">
            <p
              className="text-center cursor-pointer  text-blue-500 font-roboto font-medium hover:bg-blue-200 px-2 rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOrderItemExpanded((prev) => !prev);
              }}
            >
              {isOrderItemExpanded
                ? "Less products"
                : `${
                    order?.orderItems?.length - displayItem?.length
                  } More products`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
