import React, { useState } from "react";

const ProductImage = ({ productData }) => {
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <div className="img-container flex gap-4 m-4 p-4 w-2/3 mobile:w-full tablet:w-1/2 mobile:m-0 max-h-[500px] mobile:flex-col-reverse mobile:items-center small-device:flex-row  tablet:flex-row">
      <div className="flex flex-col  gap-2 overflow-scroll  items-center min-h-[400px]  min-w-[70px] max-h-[450px] mobile:flex-row mobile:min-h-0  mobile:overflow-scroll mobile:w-full small-device:min-h-[400px] small-device:flex-col tablet:flex-col ">
        {productData?.image?.map((img, index) => (
          <div
            className={`border-2 rounded hover:cursor-pointer min-h-0 min-w-0 max-h-[100px] max-w-[100px] aspect-square mobile:min-w-[70px] mobile:min-h-[70px] p-1 ${
              imageIndex === index
                ? "border-blue-500 border-solid"
                : "border-gray-500 border-dashed"
            } `}
            onClick={() => setImageIndex(index)}
          >
            <img
              key={index}
              src={img}
              className="rounded aspect-square object-cover w-full  h-full"
              alt=""
            />
          </div>
        ))}
      </div>
      <img
        src={productData?.image[imageIndex]}
        className="w-[80%] tablet:w-[70%] object-cover aspect-square object-top border-2 border-black/50 border-dashed p-2 rounded max-h-[450px]"
        alt={productData?.name}
      />
    </div>
  );
};

export default ProductImage;
