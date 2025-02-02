import React, { useEffect } from "react";
import { Button } from "../UI";
import { useNavigate } from "react-router-dom";

const SellerDashBoard = ({ userDetail, authToken }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);
  if (userDetail?.userType !== "seller") {
    return (
      <div className="flex-1 flex justify-center items-center font-roboto">
        <div className="flex flex-col w-1/3 mx-auto  gap-5 items-center">
          {/* <span className="text-8xl items-start">OOPS...</span> */}
          <span className="text-4xl">
            You Don't Have Seller Account register as Seller
          </span>
          <Button
            btntext={"Become Seller"}
            onClick={() => navigate("/seller-registration")}
          />
        </div>
      </div>
    );
  }
  return <div>SellerDashBoard</div>;
};

export default SellerDashBoard;
