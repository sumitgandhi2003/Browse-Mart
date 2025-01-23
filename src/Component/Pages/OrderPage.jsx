import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../UI";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Orderpage = ({ authToken, userDetail }) => {
  const { orderId } = useParams();
  const [isOrderDataFetching, setIsOrderDataFetching] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const getOrderDetailsById = () => {
    setIsOrderDataFetching(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/order/get-order-details-by-id`,
      data: {
        orderId: orderId,
      },
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 200) {
          setOrderDetails(data?.filteredOrderDetails?.[0]);
        }
        setIsOrderDataFetching(false);
      })
      .catch((error) => {
        console.log(error);
        setIsOrderDataFetching(false);
      });
  };
  useEffect(() => {
    getOrderDetailsById();
  }, [orderId]);
  console.log(orderDetails);
  if (isOrderDataFetching) {
    return <Loader />;
  }
  return (
    <div className="min-h-screen w-screen flex justify-center">
      <div className="w-8/12 border-2 h-min border-gray-300 rounded-lg">
        <div className="border-b-2 border-gray-300 p-2 flex gap-3">
          <span className=" font-medium font-roboto text-xl text-gray-600">
            Order Details
          </span>
          <span>{orderDetails?.orderDate}</span>
          <span className="">{orderDetails?.orderItems?.length} Products</span>
        </div>
        <div className="p-2 flex flex-col gap-3">
          <div className="border-gray-300 w-full grid grid-cols-3 rounded-lg  overflow-hidden font-roboto  border-2">
            <div className="customer-detail border-r-2 border-gray-300 ">
              <h2 className="heading text-xl border-b-2 border-gray-300 p-2">
                Customer Detail
              </h2>
              <div className="detail-div p-3">
                <p>{orderDetails?.customerDetail?.customerName}</p>
                <p>{orderDetails?.customerDetail?.customerPhoneNumber}</p>
                <p>{orderDetails?.customerDetail?.customerEmail}</p>
              </div>
            </div>
            <div className="shipping-detail border-r-2 border-gray-300">
              <h2 className="heading text-xl border-b-2 border-gray-300 p-2">
                Shipping Detail
              </h2>
              <div className="detail-div p-3">
                <p>{orderDetails?.customerDetail?.customerName}</p>
                {/* <p>{Object?.values(orderDetails?.shippingAddress)}</p> */}
                <p>{orderDetails?.customerDetail?.customerPhoneNumber}</p>
              </div>
            </div>
            <div className="total-summary">
              <h2 className="heading text-xl border-b-2 border-gray-300 p-2">
                Total Summary
              </h2>
              <div className="detail-div"></div>
              <div></div>
            </div>
          </div>

          <div className="w-full border-2 p-3 rounded-lg border-gray-300   overflow-hidden font-roboto">
            <div>
              <span>{orderDetails?.orderId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderpage;
