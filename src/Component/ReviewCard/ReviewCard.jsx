import React from "react";

const ReviewCard = ({ review }) => {
  console.log(review);
  const { rating, heading, message, username } = review;
  return (
    <div className="bg-white relative p-2 border-2 border-dashed border-black/60  text-black min-w-[300px] min-h-[150px] max-h-[200px] max-w-[400px] mobile:w-1/2 mobile:min-w-[100%] small-device:w-auto small-device:min-w-[300px] small-device:max-w-[150px]  rounded">
      <div className="font-roboto font-bold">{heading}</div>
      <div>{rating}</div>
      <div className="font-roboto">{message}</div>
      <div className="font-roboto group absolute text-ellipsis  whitespace-nowrap max-w-40 bottom-1 right-2 font-bold">
        <div>By {username || "Sumit Gandhi"}</div>
        <div className="group-hover:block bg-gray-600 p-1 absolute bottom-7 font-light text-white text-[10px] rounded  hidden ">
          By {username || "Sumit Gandhi"}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
