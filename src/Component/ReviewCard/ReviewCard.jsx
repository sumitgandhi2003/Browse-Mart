import React from "react";

const ReviewCard = ({ review }) => {
  const { rating, heading, message } = review;
  return (
    <div className="bg-white relative p-2 border-2 border-dashed border-black/60  text-black min-w-[400px] min-h-[200px] max-h-[200px] max-w-[400px] mobile:w-full mobile:min-w-[100%] small-device:w-auto small-device:min-w-[400px] small-device:max-w-[400px]  rounded">
      <div>{heading}</div>
      <div>{rating}</div>
      <div>{message}</div>
      <div className="font-roboto absolute bottom-1 right-2 font-bold">
        By Sumit Gandhi
      </div>
    </div>
  );
};

export default ReviewCard;
