import React, { useState } from "react";

const ReviewStar = ({ setStarRating, rating }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseOver = (rating) => {
    setHoveredRating(rating);
  };
  const handleClick = (index) => {
    // Call your function to handle the star rating click here
    setStarRating((prev) => {
      return {
        ...prev,
        rating: index,
      };
    });
  };
  const handleMouseLeave = () => {
    setHoveredRating(0);
  };
  return (
    <div className=" w-full flex gap-2">
      {[1, 2, 3, 4, 5].map((index) => {
        return (
          <svg
            key={index}
            className={`w-10 h-10 cursor-pointer ${
              index <= (hoveredRating || rating)
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
            onMouseEnter={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
          </svg>
        );
      })}
      {/* <span> ({starRating})</span> */}
    </div>
  );
};

export default ReviewStar;
