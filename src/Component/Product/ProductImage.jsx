import React, { useState } from "react";

const ProductImage = ({ productData }) => {
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <div className="img-container flex gap-4 m-4 p-4 w-1/3 mobile:w-full tablet:w-1/2 mobile:m-0 max-h-[500px] mobile:flex-col-reverse mobile:items-center small-device:flex-row  tablet:flex-row">
      <div className="flex flex-col  gap-2 overflow-scroll  items-start justify-start min-h-[400px]  min-w-[70px] max-h-[450px] mobile:flex-row mobile:min-h-[60px]  mobile:overflow-scroll mobile:w-full small-device:w-max small-device:min-h-[400px] small-device:flex-col tablet:flex-col ">
        {productData?.image?.map((img, index) => (
          <div
            className={`border-2 rounded hover:cursor-pointer aspect-square min-h-[50px] min-w-[50px] h-[60px] w-[60px] mobile:max-w-[70px] mobile:max-h-[70px] p-1 ${
              imageIndex === index
                ? "border-blue-500 border-solid"
                : "border-gray-500 border-dashed"
            } `}
            onClick={() => setImageIndex(index)}
            key={index}
          >
            <img src={img} className=" object-cover w-full  h-full" alt="" />
          </div>
        ))}
      </div>
      <img
        src={productData?.image?.[imageIndex]}
        className="w-[80%] mobile:w-full small-device:w-[80%]  object-cover aspect-square object-top border-2 border-black/50 border-dashed p-2 rounded max-h-[450px]"
        alt={productData?.name}
      />
    </div>
  );
};

export default ProductImage;
