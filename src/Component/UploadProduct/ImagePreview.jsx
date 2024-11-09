import React, { useState } from "react";
import Button from "../UI/Button";
const ImagePreview = ({ image }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : image.length - 1));
    // setCurrentIndex((currentIndex - 1 + image.length) % image.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentIndex((currentIndex + 1) % image.length);
  };
  return (
    <div className={`image-conatiner`}>
      <div className="  w-full flex gap-3 overflow-scroll">
        <div className="w-full p-3 flex flex-col gap-3">
          {/* {image?.map((file, index) => (
                <div key={index} className="">
                  <img src={URL.createObjectURL(file)} className="w-[200px]" />
                </div>
              ))} */}
          <img
            src={URL?.createObjectURL(image?.[currentIndex])}
            className="w-full h-[200px] object-contain aspect-square"
            alt=""
          />

          <div className="w-full flex gap-3 justify-between items-center">
            <Button
              btntext={"Prev"}
              className={`w-1/2  ${
                currentIndex === 0 ? "bg-blue-300" : "bg-blue-500"
              } text-white rounded font-roboto p-2`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            />
            <Button
              btntext={"Next"}
              className={`w-1/2  ${
                currentIndex === image.length - 1
                  ? "bg-blue-300"
                  : "bg-blue-500"
              } text-white rounded font-roboto p-2`}
              onClick={handleNext}
              disabled={currentIndex === image.length - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
