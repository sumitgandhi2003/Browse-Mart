import React from "react";
const serverErrorImage = require("../../assets/images/serverError.jpg");
const ServerError = () => {
  return (
    <div className="w-full flex-1 flex justify-center items-center">
      {/* <h1 className="text-center text-red-500">{error.error}</h1>; */}
      <img src={serverErrorImage} className="h-[500px]" alt="server error" />
    </div>
  );
};

export default ServerError;
