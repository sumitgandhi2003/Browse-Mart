import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import CartCard from "../Cart/CartCard";
import Input from "../UI/Input";
import { predominant } from "@cloudinary/url-gen/qualifiers/background";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatAmount } from "../../utility/constant";
import Button from "../UI/Button";

// import { FaRupeeSign } from "react-icons/fa";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BuyNow = ({ authToken, userDetail }) => {
  const navigate = useNavigate();
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const { productId } = useParams();
  const [isorderSubmitting, setIsOrderSubmitting] = useState(false);
  const [productArr, setProductArr] = useState([]);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [paymentData, setPaymentData] = useState({
    methodName: "",
    methodDetail: {},
  });
  const [shippingAddress, setShippingAddress] = useState({});
  const [isError, setIsError] = useState({});
  if (authToken === null || authToken === undefined || authToken === "") {
    navigate("/login");
  }
  //Getting Single Product Data By Id
  const getProductDataById = () => {
    setIsDataFetch(false);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/get-product-by-id`,
      data: {
        productId: productId,
        quantity: 1,
      },
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 200) {
          // setProductData(data?.product);
          setProductArr((prev) => {
            return [
              {
                item: data?.product,
                quantity: 1,
              },
            ];
          });
        } else {
          // Handle error
        }
        setIsDataFetch(true);
      })
      .catch((error) => {
        const { data, status } = error?.response;
        if (status === 404) {
          setIsError({ error: data?.message, status: status });
          setIsDataFetch(true);
        }
        // swal(`Oops! Error ${status}`, data?.message, "error");
        // console.error(error);
      });
  };

  // Getting Cart Item From Cart from database
  const getCartItem = () => {
    // setIsDataFetching(true);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/user/get-cart-items`,
      headers: { Authorization: `Bearer ${authToken}` },
      data: { userId: userDetail?.id },
    })
      .then((response) => {
        setProductArr(response?.data?.cartProduct);
        // setCartItem(response?.data?.cartProduct);
        // setIsDataFetching(false);
        // setCartItem(response.data);
      })
      .catch((error) => {
        console.error(error);
        // setError(() => {
        //   return {
        //     message: "Failed to fetch cart items",
        //     status: error?.response?.status,
        //   };
        // });
        // setIsDataFetching(false);
      });
  };
  // Checking that All required Address fields are entered
  const checkAddressDetailsCompleted = () => {
    if (
      shippingAddress.addressLine1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.country &&
      shippingAddress.pinCode
    ) {
      return true;
    }
    return false;
  };
  // Checking that All required Payment fields are entered
  const checkPaymentDetailsCompleted = () => {
    if (!paymentData?.methodName) {
      return false;
    } else {
      if (paymentData?.methodName === "debitcard") {
        if (
          paymentData?.methodDetail?.cardNumber &&
          paymentData?.methodDetail?.cardHolderName &&
          paymentData?.methodDetail?.expiryMonth &&
          paymentData?.methodDetail?.expiryYear &&
          paymentData?.methodDetail?.cvv
        ) {
          return true;
        } else {
          return false;
        }
      } else if (paymentData?.methodName === "upi") {
        if (paymentData?.methodDetail?.upiId) {
          return true;
        } else {
          return false;
        }
      } else if (paymentData?.methodName === "cod") {
        return true;
      }
    }
  };

  //order Submissions
  const submitOrder = () => {
    // Validate and submit payment details
    // If successful, send order to server
    // If not, display error message
    // Navigate to success page
    setIsOrderSubmitting((prev) => !prev);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/user/order/submit-order`,
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        cartProduct: productArr,
        shippingAddress: shippingAddress,
        paymentData,
        timeStamp: new Date().toLocaleString(),
      },
    })
      .then((response) => {
        const { data, status } = response;
        setIsOrderSubmitting((prev) => !prev);
        if (status === 201) {
          // swal(
          //   "Order Placed successfully!",
          //   "your order has been placed successfully",
          //   "success"
          // );
          navigate(`/order-success/${response?.data?.orderId}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //handle submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    const address = checkAddressDetailsCompleted();
    const payment = checkPaymentDetailsCompleted();
    if (!address || !payment) {
      swal(
        !address
          ? "Please Enter Address Detail!"
          : "Please Enter Payment Detail!",
        !address
          ? "Please Enter required address detail which denote by *"
          : "Please Enter required Payment Detail which denote by *",
        "warning"
      );
      return;
    }
    submitOrder();
    // // Reset paymentData
    // setPaymentData({
    //   methodName: "",
    //   methodDetail: {},
    // });
    // // Reset shippingAddress
    // setShippingAddress({});
    // Navigate to success page
  };
  // Handle Payemnt Method Change
  const handlePaymentMethodChange = (e) => {
    if (e.target.name === "paymentMethod") {
      setPaymentData((prev) => {
        return {
          ...prev,
          methodName: e.target.value,
          methodDetail: {},
        };
      });
    }
  };
  // Handle Payment Detail Change
  const handlePaymentDetailChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "cardNumber") {
      // Validate card number here
      // if valid, proceed to next field
      if (value.length <= 16) {
        setPaymentData((prev) => {
          return {
            ...prev,
            methodDetail: {
              ...prev.methodDetail,
              [name]: value,
            },
          };
        });
      }
    } else if (name === "cvv") {
      if (value.length <= 3) {
        setPaymentData((prev) => {
          return {
            ...prev,
            methodDetail: {
              ...prev.methodDetail,
              [name]: value,
            },
          };
        });
      }
    } else {
      setPaymentData((prev) => {
        return {
          ...prev,
          methodDetail: {
            ...prev.methodDetail,
            [name]: value,
          },
        };
      });
    }
  };
  // Handle Shipping Address Change
  const handleShippingAddressChange = (e) => {
    const name = e.target.name;
    const value = e.target?.value?.toLowerCase();
    if (name === "pinCode") {
      if (value.length <= 6) {
        setShippingAddress((prev) => {
          return {
            ...prev,
            [name]:
              name === "isDefaultShippingAddress" ? e?.target?.checked : value,
          };
        });
      }
    } else {
      setShippingAddress((prev) => {
        return {
          ...prev,
          [name]:
            name === "isDefaultShippingAddress" ? e?.target?.checked : value,
        };
      });
    }
  };
  // Generating Dynamic future Years
  const generateFutureYearsForExpiryDate = () => {
    const currentYear = new Date().getFullYear();
    const futureYears = [];
    let yearOption = "";
    for (let i = currentYear; i <= currentYear + 20; i++) {
      futureYears.push(i.toString());
      yearOption += `<option value="${i}">${i}</option>`;
    }
    return [futureYears, yearOption];
  };
  const [expiryYears, expiryYearOptions] = generateFutureYearsForExpiryDate();

  // Fetching Order Product Details
  useEffect(() => {
    if (productId) {
      getProductDataById();
    } else {
      getCartItem();
    }
  }, [productId]);
  return (
    <div className="w-full loader-container ">
      {/* <CartCard product={productData} />
      
      */}
      <div className="p-5 w-[80%] m-auto mobile:w-full tablet:w-[90%] laptop:w-[80%]">
        <div className="m-5">
          <span className="text-2xl font-bold font-roboto m-4">Checkout</span>
        </div>

        <div className="w-full h-full flex justify-between gap-8 mobile:flex-col mobile:gap-8 tablet:flex-row">
          <div className="w-8/12 p-3 rounded border-2 border-gray-100 min-h-[150px] flex flex-col gap-3 h-max mobile:w-full tablet:w-7/12 desktop:8/12">
            {/* customer detail section */}
            <div className="border-gray-200 border-b-2 w-full p-3 flex flex-col gap-3">
              <div className="font-roboto font-semibold text-lg">
                Customer Detail
              </div>

              <div className="grid grid-cols-2 gap-4 w-full  mobile:text-sm  tablet:text-base">
                <div className="flex flex-col gap-2  ">
                  <label htmlFor="name">
                    Name <span>*</span>
                  </label>
                  <Input
                    type={"text"}
                    name={"name"}
                    id={"name"}
                    className={`p-2 bg-gray-100 border-2 w-full rounded border-gray-300 outline-none ${
                      userDetail?.name ? "cursor-not-allowed" : ""
                    }`}
                    placeholder={"Name"}
                    value={userDetail?.name?.capitalise()}
                    disabled={userDetail?.name ? true : false}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phoneNumber">
                    Phone <span>*</span>
                  </label>
                  <Input
                    type={"number"}
                    id={"phoneNumber"}
                    name={"phoneNumber"}
                    className={`p-2 bg-gray-100 border-2 w-full rounded border-gray-300 outline-none  ${
                      userDetail?.phoneNumber ? "cursor-not-allowed" : ""
                    }`}
                    placeholder={"Phone Number"}
                    value={userDetail?.phoneNumber}
                    disabled={userDetail?.phoneNumber ? true : false}
                  />
                </div>
              </div>
            </div>

            {/* shipping address section */}
            <div className="border-gray-200 border-b-2 w-full p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold font-roboto text-lg">
                  Shipping Address
                </span>
                {userDetail?.shippingAddress && (
                  <Button
                    btntext={"Use Default Address"}
                    className={
                      "bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-medium "
                    }
                    onClick={() =>
                      setShippingAddress(() => userDetail?.shippingAddress)
                    }
                  />
                )}
              </div>
              <div className="w-full grid  gap-4 mobile:text-sm mobile:grid-cols-2 small-device:grid-cols-3 tablet:text-base tablet:grid-cols-2 laptop:grid-cols-3">
                <div className="flex flex-col gap-2 ">
                  <label htmlFor="addressLine1">
                    Address Line 1 <span>*</span>
                  </label>
                  <Input
                    type={"text"}
                    id={"addressLine1"}
                    name={"addressLine1"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                    }
                    placeholder={"Address Line 1"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.addressLine1?.capitalise()}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="addressLine2">Address Line 2</label>
                  <Input
                    type={"text"}
                    id={"addressLine2"}
                    name={"addressLine2"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                    }
                    placeholder={"Address Line 2"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.addressLine2?.capitalise()}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="country">Coutry *</label>
                  <Input
                    type={"text"}
                    id={"country"}
                    name={"country"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                    }
                    placeholder={"Country"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.country?.capitalise()}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="state">
                    State <span>*</span>
                  </label>
                  <Input
                    type={"text"}
                    id={"state"}
                    name={"state"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                    }
                    placeholder={"State"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.state?.capitalise()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="city">
                    City <span>*</span>
                  </label>
                  <Input
                    type={"text"}
                    id={"city"}
                    name={"city"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                    }
                    placeholder={"City"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.city?.capitalise()}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="pinCode">
                    Pincode <span>*</span>
                  </label>
                  <Input
                    type={"text"}
                    id={"pinCode"}
                    name={"pinCode"}
                    className={
                      "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none no"
                    }
                    placeholder={"PinCode"}
                    onChange={handleShippingAddressChange}
                    value={shippingAddress?.pinCode}
                  />
                </div>
                <div className="flex gap-2 w-full font-roboto items-center mobile:col-span-2 small-device:col-span-3 tablet:col-span-2 laptop:col-span-3 ">
                  <Input
                    type={"checkbox"}
                    id={"isDefaultShippingAddress"}
                    name={"isDefaultShippingAddress"}
                    onChange={handleShippingAddressChange}
                    checked={shippingAddress?.isDefaultShippingAddress}
                    className={"border-gray-300"}
                  />
                  <label htmlFor="isDefaultShippingAddress">
                    Make this address as default shipping address
                  </label>
                </div>
              </div>
            </div>

            {/* Payment method section */}

            <div className="border-gray-200 border-b-2 w-full p-3 flex flex-col gap-3">
              <div className="font-roboto font-semibold text-lg">
                Payment Method
              </div>

              <div className=" mobile:text-sm tablet:text-base ">
                <div
                  className="grid grid-cols-3  justify-center gap-4 w-max   rounded mobile:w-full mobile:gap-2 tablet:w-full "
                  onChange={handlePaymentMethodChange}
                >
                  {/* <div
                    className={`debitcreditcard border-gray-200 border-2 rounded p-2${
                      paymentData?.methodName === "debitcard"
                        ? "bg-gray-600"
                        : "bg-none"
                    }`}
                  > */}
                  <div
                    className={`debitcreditcard flex justify-center items-center  gap-3 border-gray-200 border-2 rounded p-2 ${
                      paymentData?.methodName === "debitcard"
                        ? "bg-blue-200 border-transparent"
                        : "bg-none"
                    } `}
                  >
                    <Input
                      type="radio"
                      id="debitcard"
                      name="paymentMethod"
                      value={"debitcard"}
                      className={"hidden"}
                    />
                    <label
                      htmlFor="debitcard"
                      className={
                        "w-full h-full cursor-pointer flex items-center  "
                      }
                    >
                      Debit / Credit Card
                    </label>
                  </div>
                  <div
                    className={`upi flex gap-3 justify-center items-center border-gray-200 border-2 rounded p-2 ${
                      paymentData?.methodName === "upi"
                        ? "bg-blue-200 border-transparent"
                        : "bg-none"
                    }`}
                  >
                    <Input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value={"upi"}
                      className={"hidden"}
                    />
                    <label
                      htmlFor="upi"
                      className={
                        " w-full h-full flex items-center  cursor-pointer"
                      }
                    >
                      UPI
                    </label>
                  </div>

                  <div
                    className={` cod first-line:flex gap-3 justify-center items-center   border-gray-200 border-2 rounded p-2 ${
                      paymentData?.methodName === "cod"
                        ? "bg-blue-200 border-transparent"
                        : "bg-none"
                    } `}
                  >
                    <Input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value={"cod"}
                      className={"hidden"}
                    />
                    <label
                      htmlFor="cod"
                      className={
                        "w-full h-full flex items-center  cursor-pointer"
                      }
                    >
                      Cash On Delivery
                    </label>
                  </div>
                </div>

                <div>
                  {paymentData?.methodName === "debitcard" && (
                    <div className="grid  flex-col gap-4 p-3 mobile:grid-cols-2 small-device:grid-cols-3 tablet:grid-cols-2 laptop:grid-cols-3">
                      {/* <div className="flex  gap-4 w-full"> */}
                      <div className="flex flex-col gap-2 min-w-[100px] small-device:col-span-2 tablet:col-span-1 laptop:col-span-2">
                        <label htmlFor="cardNumber">
                          Card Number <span>*</span>
                        </label>
                        <Input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          placeholder={"Card Number"}
                          className={
                            "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none w-full"
                          }
                          onChange={handlePaymentDetailChange}
                          value={paymentData?.methodDetail?.cardNumber}
                        />
                      </div>

                      <div className="flex flex-col gap-2 ">
                        <label htmlFor="cardHolderName">
                          Name <span>*</span>
                        </label>
                        <Input
                          type="text"
                          id="cardHolderName"
                          name="cardHolderName"
                          placeholder={"Card Holder Name"}
                          className={
                            "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                          }
                          onChange={handlePaymentDetailChange}
                          value={paymentData?.methodDetail?.cardHolderName}
                        />
                      </div>
                      {/* </div> */}
                      {/* <div className="flex  gap-4 w-full"> */}
                      <div className="flex flex-col gap-2 ">
                        <label htmlFor="expirydate">
                          Expiry Date <span>*</span>
                        </label>
                        <div className="flex gap-2 border-2 border-gray-200 rounded p-2 w-full">
                          <div className="w-1/2">
                            <select
                              name="expiryMonth"
                              id=""
                              className="outline-none bg-gray-200 p-1 rounded w-full"
                              onChange={handlePaymentDetailChange}
                              value={paymentData?.methodDetail?.expirymonth}
                            >
                              <option value="">Month</option>
                              {months.map((month, i) => {
                                return (
                                  <option key={i} value={month}>
                                    {month}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="w-1/2">
                            <select
                              name="expiryYear"
                              id=""
                              className="outline-none bg-gray-200 p-1 rounded scroll w-full"
                              onChange={handlePaymentDetailChange}
                              value={paymentData?.methodDetail?.expiryear}
                            >
                              <option value="">Year</option>
                              {expiryYears.map((year, i) => {
                                return (
                                  <option key={i} value={year}>
                                    {year}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ">
                        <label htmlFor="cvv">
                          CVV <span>*</span>
                        </label>
                        <Input
                          type="password"
                          id="cvv"
                          name="cvv"
                          placeholder={"CVV"}
                          className={
                            "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                          }
                          onChange={handlePaymentDetailChange}
                          value={paymentData?.methodDetail?.cvv}
                        />
                      </div>
                      {/* </div> */}
                    </div>
                  )}

                  {paymentData?.methodName === "upi" && (
                    <div className="flex gap-4 p-3 ">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="upi">
                          UPI ID <span>*</span>
                        </label>
                        <Input
                          type="text"
                          id="upi"
                          name="upiId"
                          placeholder={"UPI ID"}
                          className={
                            "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                          }
                          onChange={handlePaymentDetailChange}
                          value={paymentData?.methodDetail?.upiid}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* order summary section */}
          <div className="w-4/12 p-2 rounded border-2 border-gray-100 min-h-[150px] h-max mobile:w-full  tablet:w-5/12 laptop:w-5/12 desktop:w-4/12 ">
            <div className="m-2">
              <span className="  font-roboto font-semibold text-2xl">
                Your Order
              </span>
            </div>

            <div className="flex flex-col gap-3 max-h-[350px] overflow-scroll">
              {productArr?.map((product, index) => {
                return (
                  <div key={index} className="flex gap-4 p-2 w-full">
                    {/* <div className="flex gap-2 p-2"> */}
                    <img
                      src={product?.item?.image[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover object-top rounded scale-105"
                    />
                    <div className="w-2/3 flex flex-col gap-2">
                      <span className="font-semibold font-roboto w-full">
                        {product?.item?.name}
                      </span>
                      <div>
                        Qty: {product.quantity}
                        <span className="text-gray-400">
                          {" "}
                          x {product?.item?.price}
                        </span>
                      </div>
                      <span className="flex w-full items-center ">
                        Subtotal:{" "}
                        <span>
                          <FaRupeeSign className="text-xs" />
                        </span>
                        {formatAmount(product?.item?.price * product.quantity)}
                      </span>
                    </div>
                    {/* </div> */}
                  </div>
                );
              })}
            </div>

            <div className="m-2">
              <div className="flex gap-4 p-2 w-full total-price">
                <span className="text-lg font-roboto w-full">Total</span>
                <span className="flex items-center ">
                  <span>
                    <FaRupeeSign className="text-lg" />
                  </span>
                  <span className="text-lg font-semibold font-roboto">
                    {formatAmount(
                      productArr?.reduce((total, product) => {
                        return total + product.item.price * product.quantity;
                      }, 0)
                    )}
                  </span>
                </span>
              </div>

              <div className="flex gap-4 p-2 w-full total-price">
                <span className="  text-lg font-roboto w-full">Discount</span>
                <span className="flex items-center ">
                  <span>
                    <FaRupeeSign className="text-lg" />
                  </span>
                  <span className="text-lg font-semibold font-roboto">
                    {formatAmount(
                      productArr?.reduce((total, product) => {
                        return (
                          total +
                          (product.item.price * product.quantity -
                            product?.item?.discountedPrice ||
                            0 * product?.quantity)
                        );
                      }, 0)
                    )}
                  </span>
                </span>
              </div>

              <div className="w-full p-2">
                <Button
                  btntext={"Place Order"}
                  className={
                    "w-full bg-blue-500 rounded p-2 text-white font-roboto font-semibold outline-none border-none"
                  }
                  onClick={handleSubmit}
                  loading={isorderSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
