import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, ServerError } from "../UI";
import { formatAmount, orderStatus } from "../../utility/constant";
import { FaCheck } from "react-icons/fa";
import { useTheme } from "../../Context/themeContext";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Orderpage = ({ authToken, userDetail }) => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [isOrderDataFetching, setIsOrderDataFetching] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const getOrderDetailsById = async () => {
    setIsOrderDataFetching(true);
    try {
      const response = await axios?.post(
        `${SERVER_URL}/api/order/get-order-details-by-id`,
        {
          orderId: orderId,
        },
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data, status } = response;
      if (status === 200) {
        setOrderDetails(data?.filteredOrderDetails);
      }
    } catch (error) {
      const { data, status } = error?.response || {};
      if (status === 404) {
        setError({ message: data?.message, status: status });
      } else {
        setError({ error: "Internal Server Error", status: 500 });
      }
    } finally {
      setIsOrderDataFetching(false);
    }
  };
  useEffect(() => {
    if (!authToken) navigate("/login");
  }, [authToken, navigate]);
  useEffect(() => {
    getOrderDetailsById();
  }, [orderId]);

  if (isOrderDataFetching) {
    return <Loader />;
  }
  if (!isOrderDataFetching && !orderDetails && !error) {
    return (
      <div className="text-center text-2xl font-semibold text-red-500">
        No Order Found
      </div>
    );
  }
  if (error?.status === 500) return <ServerError />;
  return (
    <div
      className={`min-h-screen w-screen flex justify-center font-roboto ${
        theme === "dark" ? " bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-all duration-300`}
    >
      <div className="w-8/12 my-10 border-2 h-min border-gray-300 rounded-lg font-roboto overflow-hidden">
        <div className="border-b-2 border-gray-300 p-2 flex gap-3">
          <span className=" font-medium text-xl text-gray-600">
            Order Details
          </span>
          <span>{orderDetails?.orderDate}</span>
          <span className="">{orderDetails?.orderItems?.length} Products</span>
        </div>
        <div className="p-2 flex flex-col gap-3">
          <div className="border-gray-300 w-full grid grid-cols-3 rounded-lg  overflow-hidden  border-2">
            <div className="customer-detail border-r-2 border-gray-300 ">
              <h2 className="heading text-lg font-semibold text-gray-400 border-b-2 border-gray-300 p-2">
                Customer Details
              </h2>
              <div className="detail-div p-3">
                <p className="text-lg font-medium">
                  {orderDetails?.customerDetail?.customerName?.toCapitalize()}
                </p>
                <p>
                  {orderDetails?.shippingAddress &&
                    Object.values(orderDetails.shippingAddress)
                      .filter(Boolean) // Remove falsy values (e.g., null, undefined, empty strings)
                      .map((item, index, arr) => (
                        <span key={index}>
                          {item.toString().toCapitalize()}
                          {index < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                </p>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Email</span>
                  <span>
                    {orderDetails?.customerDetail?.customerEmail ||
                      "default@gmail.com"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Phone No</span>
                  <span>
                    {orderDetails?.customerDetail?.customerPhoneNumber ||
                      "123456789"}
                  </span>
                </div>
              </div>
            </div>
            <div className="shipping-detail border-r-2 border-gray-300">
              <h2 className="heading text-lg font-semibold text-gray-400 border-b-2 border-gray-300 p-2">
                Shipping Details
              </h2>
              <div className="detail-div p-3">
                <p className="text-lg font-medium">
                  {orderDetails?.customerDetail?.customerName?.toCapitalize()}
                </p>
                <p>
                  {orderDetails?.shippingAddress &&
                    Object.values(orderDetails.shippingAddress)
                      .filter(Boolean) // Remove falsy values (e.g., null, undefined, empty strings)
                      .map((item, index, arr) => (
                        <span key={index}>
                          {item.toString().toCapitalize()}
                          {index < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                </p>

                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Email</span>
                  <span>
                    {orderDetails?.customerDetail?.customerEmail ||
                      "default@gmail.com"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400">Phone No</span>
                  <span>
                    {orderDetails?.customerDetail?.customerPhoneNumber ||
                      "123456789"}
                  </span>
                </div>
              </div>
            </div>
            <div className="total-summary flex flex-col overflow-hidden">
              <h2 className="heading text-lg font-semibold text-gray-400 border-b-2 border-gray-300 p-2">
                Total Summary
              </h2>

              <div className="detail-div h-full relative  font-roboto">
                <div className="p-2 ">
                  <div className="flex  text-lg font-roboto p-1 border-b-2 last:border-none w-full">
                    <span className="w-1/2">Amount: </span>
                    <span className="w-1/2">
                      {formatAmount(orderDetails?.totalMrpPrice)}
                    </span>
                  </div>
                  <div className="flex  text-lg font-roboto p-1  w-full border-b-2 last:border-none">
                    <span className="w-1/2">Discount:</span>
                    <span className="w-1/2">
                      {formatAmount(orderDetails?.totalDiscount || 0)}
                    </span>
                  </div>
                  <div className="flex  text-lg font-roboto p-1  w-full border-b-2 last:border-none">
                    <span className="w-1/2">ShippingCharges:</span>
                    <span className="w-1/2">
                      {formatAmount(orderDetails?.shippingCharge || 0) || 0}
                    </span>
                  </div>
                </div>
                <div className="absolute flex  text-lg  bottom-0 w-full p-2 border-t-2 border-gray-300">
                  <span className="w-1/2">Total</span>
                  <span className="w-1/2 font-medium">
                    {formatAmount(orderDetails?.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-2 p-3 rounded-lg border-gray-300   overflow-hidden font-roboto">
            <div>
              <span className="text-gray-400">Order ID: </span>
              <span>{orderDetails?.orderId}</span>
            </div>
            <div>
              <span className="text-gray-400">Item Number: </span>
              <span>
                {orderDetails?.orderItems?.reduce(
                  (totalQty, item) => (totalQty += item?.quantity),
                  0
                )}
              </span>
            </div>
          </div>
          <div>
            <div className="flex  flex-wrap items-center justify-center p-10">
              {orderStatus?.map((status, index, arr) => {
                const isActive =
                  arr.indexOf(orderDetails?.orderStatus) >= index;
                return (
                  <div
                    className="relative flex justify-center items-center"
                    key={status}
                  >
                    <div className="relative">
                      <div
                        className={`h-14 w-14  text-white rounded-full flex justify-center items-center ${
                          isActive
                            ? "bg-blue-800"
                            : "bg-white border-dashed border-2 border-blue-800 text-blue-500"
                        }`}
                      >
                        {isActive ? (
                          <FaCheck className={``} />
                        ) : (
                          <p className="text-blue-500">
                            {index < 10 ? "0" + (index + 1) : ""}
                          </p>
                        )}
                        {/* <FaCheck className={`${!isActive ? "hidden" : ""}`} />
                        {!isActive ? (
                          <p className="text-blue-500">
                            {index < 10 ? "0" + (index + 1) : ""}
                          </p>
                        ) : (
                          ""
                        )} */}
                      </div>
                      <span
                        className={`absolute w-max -bottom-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2  py-2 ${
                          isActive
                            ? "text-blue-800 font-medium"
                            : "text-blue-500"
                        }`}
                      >
                        {status?.toCapitalize()}
                      </span>
                    </div>
                    <div
                      className={`h-2 w-28  ${
                        arr?.length - 1 === index ? "hidden" : ""
                      } ${isActive ? "bg-blue-800" : " bg-blue-200"} `}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mb-2">
          <div
            className={`grid grid-cols-5  p-3 gap-3 duration-300 transition-all ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <span className="col-span-2">Product Name</span>
            <span className="col-span-1"> Price</span>
            <span className="col-span-1">Quantity</span>
            <span className="col-span-1">Amount</span>
          </div>

          <div className="flex flex-col p-3  gap-3">
            {orderDetails?.orderItems?.map((product, index) => {
              return (
                <div
                  className="grid grid-cols-5 items-center gap-3"
                  key={product?.productId || product?.id || product?._id}
                >
                  <div className=" grid grid-cols-4 col-span-2 gap-3 pl-2 items-center">
                    <img
                      src={product?.productImage}
                      className="col-span-1 h-20 w-24 rounded object-fill aspect-square"
                      alt=""
                    />
                    <p className="col-span-3">{product?.productName}</p>
                  </div>
                  <span className="col-span-1">
                    {formatAmount(product?.price)}
                  </span>
                  <span className="col-span-1">{product?.quantity}</span>
                  <span className="col-span-1">
                    {formatAmount(product?.price * product?.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderpage;
