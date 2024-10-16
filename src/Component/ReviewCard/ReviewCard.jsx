import React from "react";

const ReviewCard = ({ review }) => {
  const { rating, title, message, userName } = review;
  return (
    <div className="bg-white relative p-2 border-2 border-dashed border-black/60  text-black min-w-[300px] min-h-[150px] max-h-[200px] max-w-[400px] mobile:w-1/2 mobile:min-w-[100%] small-device:w-auto small-device:min-w-[300px] small-device:max-w-[150px]  rounded">
      {/* <div className="absolute top-2 left-2 font-semibold text-white text-[12px] rounded-full bg-gray-600">
        {rating}
      </div> */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5]?.map((index) => {
          return (
            <svg
              key={index}
              className={`w-8 h-8 cursor-pointer ${
                index <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
          );
        })}
      </div>

      <div className="font-roboto font-bold text-ellipsis overflow-hidden whitespace-nowrap">
        {title}
      </div>
      {/* <div>{rating}</div> */}
      <div className="font-roboto  max-h-[60px] line-clamp-3 overflow-hidden text-ellipsis">
        {message}
      </div>
      <div className="font-roboto group absolute text-ellipsis  whitespace-nowrap max-w-40 bottom-1 right-2 font-bold">
        <div>By {userName?.capitalise() || "Sumit Gandhi"}</div>
        <div className="group-hover:block bg-gray-600 p-1 absolute bottom-7 font-semibold text-white text-[10px] rounded  hidden ">
          By {userName?.capitalise() || "Sumit Gandhi"}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
