import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader, ServerError } from "../UI";
import OrderCard from "./OrderCard";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const OrdersContainer = ({ userDetail, authToken }) => {
  const [ordersArr, setOrdersArr] = useState([]);
  const [filtertedOrdersArr, setFiltertedOrdersArr] = useState([]);
  const [isOrdersFetching, setIsOrdersFetching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getAllOrders = () => {
    setIsOrdersFetching(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/order/get-all-order`,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${authToken}`,
      },
      data: { userId: userDetail?.id },
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 200) {
          setOrdersArr(data?.ordersArr);
          setFiltertedOrdersArr(data?.ordersArr);
          setIsOrdersFetching(false);
        }
      })
      .catch((error) => {
        const { data, status } = error?.response || {};
        if (status === 404) {
          setError({ message: data?.message, status: status });
        } else {
          setError({ error: "Internal Server Error", status: 500 });
        }
      })
      .finally(() => {
        setIsOrdersFetching(false);
      });
  };
  useEffect(() => {
    if (!authToken) {
      navigate(`/login? redirect=${encodeURIComponent(location?.pathname)}`);
    } else {
      getAllOrders();
    }
    // <Navigate to={"/login?redirect-from=order"} />;
  }, [authToken]);

  useEffect(() => {
    if (ordersArr?.length > 0) {
      setFiltertedOrdersArr(() =>
        [...ordersArr].sort((a, b) => {
          const dateA = new Date(
            a?.orderDate?.year,
            a?.orderDate?.month - 1,
            a?.orderDate?.day
          );
          const dateB = new Date(
            b?.orderDate?.year,
            b?.orderDate?.month - 1,
            b?.orderDate?.day
          );
          return dateB - dateA;
        })
      );
    }
  }, [ordersArr]);

  if (isOrdersFetching) {
    return <Loader />;
  }
  if (error?.status === 500) {
    return <ServerError />;
  }
  return (
    filtertedOrdersArr?.length > 0 && (
      <div className="grid gap-4 w-[70%] mobile:w-full tablet:w-[70%] m-auto py-8 mobile:p-3">
        <h2 className=" font-roboto text-2xl font-bold">Order History</h2>
        <div className="grid grid-cols-4 mobile:grid-cols-1  gap-3">
          {filtertedOrdersArr?.map((order, index) => (
            // <Link
            //   to={`/order/${order?._id || order?.id}`}
            //   key={order?._id || order?.id}
            // >
            <OrderCard order={order} key={order?._id || order?.id} />
            // </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default OrdersContainer;
