import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import "./ReviewForm.css";
import axios from "axios";
import swal from "sweetalert";
const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");
const ReviewForm = ({ onClose, productId }) => {
  const [reviewData, setReviewData] = useState({
    productId: productId,
    userId: "",
    rating: "5",
    heading: "",
    message: "",
    userName: "",
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
  const submitReview = () => {
    axios({
      method: "post",
      url: `${SERVER_URL}/submit-review`,
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
        });
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to submit review!");
      });
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
    if (value === undefined || value === "")
      setError({ ...error, [name]: `${[name]} is required`, isError: true });
    else setError({ ...error, [name]: "", isError: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    if (error.isError) return;
    submitReview();
  };
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
    <div className="w-screen h-screen bg-gray-500  bg-opacity-50 fixed top-0 flex justify-center items-center  ">
      <form
        className=" w-[500px] h-[500px] relative  p-3 rounded-lg bg-white shadow-md border-2 drop-shadow-lg  border-blue-500"
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
            <input
              type="text"
              className="form-control w-full min-h-10 outline-none bg-blue-500 p-3 rounded placeholder:text-blue-100 text-white"
              placeholder="Heading"
              name="heading"
              value={reviewData?.heading}
              onChange={handleInput}
            ></input>
            {error.heading && (
              <div className="text-red-500 text-xs ml-2">{error.heading}</div>
            )}
          </div>
          <div className="p-3">
            <textarea
              id="comment"
              name="message"
              value={reviewData?.message}
              onChange={handleInput}
              rows="4"
              cols="50"
              placeholder="Your Message"
              className="resize-none w-full outline-none bg-blue-500 rounded p-3 text-white placeholder:text-blue-100"
            ></textarea>
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
