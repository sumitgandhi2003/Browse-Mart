import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import {
  sellerRegistrationInputFields,
  initialSellerDetails,
  swalWithCustomConfiguration,
} from "../../utility/constant";
import { Button, Input } from "../UI";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const SellerRegistrationPage = ({ authToken, userDetail }) => {
  const [sellerDetail, setSellerDetail] = useState(initialSellerDetails);
  const [isDataSending, setIsDataSending] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const tab = [
    { id: "businessInformation", value: "Business Information" },
    { id: "legalInformation", value: "Legal Information" },
    { id: "financialInformation", value: "Financial Information" },
  ];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerDetail({ ...sellerDetail, [name]: value });
    setError((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmit(true);
    const allValid = tab.every((tab) => validateTabFields(tab?.id));
    if (!allValid) {
      return;
    }
    try {
      setIsDataSending(true);
      const response = await axios(`${SERVER_URL}/api/seller/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: sellerDetail,
      });
      console.log(response);
      const { data, status } = response;
      if (status === 201) {
        console.log(data);
        swalWithCustomConfiguration?.fire({
          title: "Seller Registration Successful!",
          text: "You have successfully registered as a seller.",
          icon: "success",
        });
        // navigate("/seller/dashboard");
        navigate("/");
      }
    } catch (error) {
      const { status, data } = error?.response;
      if (status === 400) {
        swalWithCustomConfiguration?.fire({
          title: "Seller Registration Failed!",
          text: data?.message,
          icon: "error",
        });
      }
    } finally {
      setIsDataSending(false);
      //   navigate("/seller/dashboard");
    }
  };

  const validateTabFields = (currentTab) => {
    const currentTabFields = sellerRegistrationInputFields.filter(
      (field) => field?.tab === currentTab
    );
    let valid = true;
    currentTabFields.forEach((field) => {
      const error = field?.validationRule(sellerDetail[field?.name]);
      if (error) {
        setError((prev) => ({
          ...prev,
          [field?.name]: error,
        }));
        valid = false;
      }
    });
    return valid;
  };

  const handleTabChange = (index) => {
    if (validateTabFields(tab[activeTab]?.id)) {
      console.log(sellerDetail);
      setActiveTab(index);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else if (userDetail?.userType === "seller") {
      navigate("/");
      // navigate("/seller/dashboard");
    }
    return () => {
      setSellerDetail(initialSellerDetails);
    };
  }, [authToken, navigate, userDetail?.userType]);

  return (
    <div className=" flex-1 flex justify-center items-center  h-full bg-gray-200">
      <div className="rounded-lg bg-white w-full min-h-[90vh] max-w-4xl mt-4 relative">
        <h1 className="font-roboto text-center  text-gray-400 text-3xl m-3 p-4 font-semibold">
          Seller Registration
        </h1>
        <form action="" method="post">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3">
              {tab.map((item, index) => (
                <span
                  key={item.id}
                  //   onClick={(e) => {
                  //     console.log(index);
                  //     e.preventDefault();
                  //     handleTabChange(index);
                  //   }}
                  className={`p-2 flex items-center border-y-2 font-roboto  border-r-2 last:border-r-0  ${
                    activeTab === index
                      ? "text-blue-600 bg-blue-50 text-lg font-medium  border-b-blue-500 border-b-4"
                      : "border-gray-200"
                  }`}
                >
                  {item.value}
                </span>
              ))}
            </div>
            <div className="w-full grid p-4  gap-4 gap-y-7 mobile:text-sm mobile:grid-cols-2 small-device:grid-cols-3 tablet:text-base tablet:grid-cols-2 laptop:grid-cols-3">
              {sellerRegistrationInputFields
                ?.filter((field) => field?.tab === tab[activeTab]?.id)
                ?.map((field, index) => {
                  return (
                    <div
                      className="flex flex-col gap-2 relative"
                      key={field?.id}
                    >
                      <label htmlFor={field?.name}>
                        {field.label?.toCapitalise()}
                        {field?.required ? (
                          <span className="required"> *</span>
                        ) : (
                          ""
                        )}
                      </label>
                      <Input
                        type={field?.type}
                        id={field?.name}
                        name={field?.name}
                        placeholder={field?.placeholder}
                        className={`p-2 bg-gray-100 border-2 rounded border-gray-300 outline-gray-400 outline-2`}
                        value={sellerDetail?.[field?.name]}
                        onChange={handleChange}
                        maxLength={field?.maxLength || null}
                      />
                      <p className="text-red-600 absolute -bottom-5">
                        {error?.[field?.name]}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="w-full p-3 flex justify-between absolute bottom-0">
            <Button
              btntext={"Previous"}
              disabled={activeTab === 0}
              className="font-bold text-blue-500 text-xl py-2 px-4 rounded hover:cursor-pointer"
              icon={<GrFormPrevious className="text-xl font-bold" />}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
              }}
            />
            <Button
              btntext={`${activeTab !== tab?.length - 1 ? "Next" : "Submit"}`}
              loading={isDataSending}
              icon={<GrFormNext className="text-xl hover:cursor-pointer " />}
              onClick={(e) => {
                e.preventDefault();
                setIsSubmit(true);
                if (activeTab < tab.length - 1) {
                  handleTabChange(activeTab + 1);
                } else {
                  handleSubmit(e); // Submit when at last tab
                }
              }}
              iconPosition="right"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistrationPage;
