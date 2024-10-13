import { useEffect, useRef, useState } from "react";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import Button from "../Button/Button";
import "./ReviewForm.css";
import axios from "axios";
import swal from "sweetalert";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ReviewForm = ({
  onClose,
  productId,
  setIsRefreshClicked,
  userDetail,
}) => {
  const [reviewData, setReviewData] = useState({
    productId: productId,
    userId: userDetail?.id || "",
    rating: "5",
    heading: "",
    message: "",
    userName: userDetail.name || "",
  });
  const [error, setError] = useState({
    isError: true,
    heading: "",
    message: "",
  });
  console.log(reviewData);

  const formRef = useRef();
  //   const handleSelect = (e) => {
  //     setReviewData({ ...reviewData, rating: e.target.value });
  //   };

  // for sending data to  server
  const submitReview = () => {
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/submit-review`,
      data: reviewData,
    })
      .then((response) => {
        console.log(response);
        onClose();
        // alert("Review submitted successfully!");
        swal({
          title: "Thankyou for your Review!",
          text: "Review submitted successfully",
          icon: "success",
        }).then(() => setIsRefreshClicked((prev) => !prev));
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to submit review!");
      });
  };

  //handling Inputs
  const handleInput = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
    if (value === undefined || value === "")
      setError({ ...error, [name]: `${[name]} is required`, isError: true });
    else setError({ ...error, [name]: "", isError: false });
  };

  // for handling Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    if (error.isError) return;
    submitReview();
  };

  // for handling form hidden or visible
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="w-screen h-screen bg-gray-500  bg-opacity-50 fixed z-50 top-0 flex justify-center items-center  ">
      <form
        className=" w-[500px] h-[500px] relative  p-3 rounded-lg bg-white shadow-2xl border-2 drop-shadow-lg  border-blue-500"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <i
          class="fa-solid fa-xmark absolute text-2xl font-bold text-blue-700 mobile:block tablet:hidden top-4 right-4"
          onClick={() => onClose()}
        ></i>
        <h2 className=" text-4xl text-center text-blue-700">Review</h2>
        <div className="mt-[2vh]">
          <div className="review Star p-3 flex w-full gap-2 flex-row-reverse justify-end items-center">
            {/* <i class="fa-solid fa-star text-5xl text-yellow-500 "></i> */}
            <i class="fa-regular fa-star text-5xl text-blue-500 s1"></i>
            <i class="fa-regular fa-star text-5xl text-blue-500 s2"></i>
            <i class="fa-regular fa-star text-5xl text-blue-500 s3"></i>
            <i class="fa-regular fa-star text-5xl text-blue-500 s4"></i>
            <i class="fa-regular fa-star text-5xl text-blue-500 s5"></i>
          </div>
          <div className="heading p-3 mt-3">
            <Input
              type={"text"}
              className={
                "form-control w-full min-h-10 outline-none border-2 font-semibold border-blue-500 p-3 rounded placeholder:text-blue-400 text-blue-500"
              }
              placeholder={"Heading"}
              name={"heading"}
              value={reviewData?.heading}
              onChange={handleInput}
              id={"heading"}
            />

            {error.heading && (
              <div className="text-red-500 text-xs ml-2">{error.heading}</div>
            )}
          </div>
          <div className="p-3">
            <TextArea
              id={"comment"}
              name={"message"}
              value={reviewData?.message}
              onChange={handleInput}
              placeholder={"Your Message"}
              className={
                "resize-none w-full outline-none text-blue-500 rounded p-3 border-2 border-blue-500 font-semibold  placeholder:text-blue-400"
              }
              rows={"4"}
              cols={"50"}
            />

            {error.message && (
              <div className="text-red-500 text-xs ml-2">{error.message}</div>
            )}
          </div>
          <div className="p-4 relative">
            <Button
              btntext="Submit"
              className={`relative right-0  ${
                reviewData.heading === "" || reviewData.message === ""
                  ? "bg-blue-500"
                  : "bg-blue-700"
              } w-full text-white p-3 rounded hover:bg-blue-700 outline-none`}
              disabled={
                error.heading !== "" || error.message !== "" ? true : false
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
