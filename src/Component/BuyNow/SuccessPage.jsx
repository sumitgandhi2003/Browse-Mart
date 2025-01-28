import React, { useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
const orderPlacedSuccessImage = require("../../assets/images/oderPlacedSuccessfully.gif");

const SuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderIds = location?.state || [];
  useEffect(() => {
    if (!orderIds.length) {
      navigate("/orders", { replace: true });
      return;
    }
  });
  return (
    orderIds && (
      <div className="p-6 flex justify-center items-center loader-container">
        <div className="border-2 p-3 border-gray-100 rounded-lg shadow-2xl min-h-[400px] min-w-[600px] flex justify-center items-center mobile:w-full mobile:min-h-0 mobile:min-w-0 tablet:w-max tablet:min-h-[400px] tablet:min-w-[600px] ">
          <div className="w-full flex flex-col justify-center items-center">
            {/* <h2 className="text-2xl font-bold mb-4">
            Order Placed Successfully!
          </h2>
          <p>
            Your order ID is <span className="font-semibold">{orderId}</span>
          </p> */}
            <img
              src={orderPlacedSuccessImage}
              className=" h-[200px] w-full object-contain"
              alt=""
            />
            <p className="font-roboto font-medium text-2xl my-4">
              Thank you for Ordering!
            </p>
            <p className="">Thank you for shopping with us!</p>
            <p>You will receive an email confirmation shortly.</p>
            <div className="text-gray-500 flex gap-2 items-center ">
              <span>Order ID: </span>
              <div className="font-semibold flex flex-col gap-1">
                {orderIds?.map((id) => {
                  return <span> {id}</span>;
                })}
              </div>
            </div>
            <div className="flex gap-3 p-4 my-4 w-full">
              <Link
                to={`/order${
                  orderIds?.length === 1 ? `/${orderIds?.[0]}` : ""
                }`}
                className="w-1/4 mobile:w-1/2"
              >
                <Button
                  btntext={"View Order "}
                  className={"w-full  border-2 border-gray-200 p-2 rounded "}
                />
              </Link>
              <Link to="/" className=" w-3/4 mobile:w-1/2">
                <Button
                  btntext={"Contuine Shopping"}
                  className={"w-full text-white bg-blue-500 p-2 rounded"}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SuccessPage;
