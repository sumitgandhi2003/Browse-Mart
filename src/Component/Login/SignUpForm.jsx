import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Input from "../Input/Input";
import Button from "../Button/Button";
import axios from "axios";
import swal from "sweetalert";
import { Navigate } from "react-router-dom";
const SignUpForm = ({ setIsSignUpShow, setAuthToken }) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");
  const [initialUserDetail, setInitialUserDetail] = useState({
    email: "",
    name: "",
    password: "",
    TandC: false,
  });
  const [error, setError] = useState({
    email: "",
    name: "",
    password: "",
    isError: false,
  });
  const [userDetail, setUserDetail] = useState(initialUserDetail);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const handleInput = (e) => {
    const { name, value, checked, type } = e.target;
    if (value === "" || value === undefined || value === null) {
      setError({ ...error, [name]: `${[name]} is required`, isError: true });
    } else {
      setError({ ...error, [name]: "", isError: false });
    }
    setUserDetail({
      ...userDetail,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userDetail.email || !userDetail.name || !userDetail.password) {
      swal("Oops!", "All fields  are required!", "warning");
    } else {
      handleRegisteration();
      setUserDetail(initialUserDetail);
    }
    console.log(userDetail);
    // make API call to server here
  };
  const handleRegisteration = () => {
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/user/register`,
      data: userDetail,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        if (response.status === 201) {
          swal(
            "Registered Successfully!",
            "you are now resitered with us you can proceed",
            "success"
          ).then(() => {
            localStorage.setItem("AuthToken", response?.data?.AuthToken);
            setAuthToken(response?.data?.AuthToken);
            <Navigate to={"/"} />;
          });
        }
      })
      .catch((error) => {
        console.log(error);
        const status = error?.response?.status;
        if (status === 400) {
          swal(
            "Resgistration Failed!",
            "You are already registered with us",
            "warning"
          );
        } else {
          swal("Oops!", "Something went wrong", "error");
        }
      });
  };
  return (
    <form className="p-3 flex flex-col gap-3">
      <div className="w-full">
        <Input
          type={"text"}
          name={"name"}
          className={
            "w-full bg-transparent outline-none placeholder:text-white p-2 text-white font-roboto  border-2 border-white rounded"
          }
          placeholder={"Name"}
          value={userDetail?.name}
          onChange={handleInput}
          id={"name"}
        />
      </div>
      <div className="w-full">
        <Input
          type={"email"}
          name={"email"}
          className={
            "w-full bg-transparent outline-none placeholder:text-white p-2 text-white font-roboto  border-2 border-white rounded"
          }
          placeholder={"Email"}
          value={userDetail?.email}
          onChange={handleInput}
          id={"email"}
        />
      </div>
      <div className="w-full relative flex">
        <Input
          type={isPasswordShow ? "text" : "password"}
          name={"password"}
          className={
            "w-full bg-transparent outline-none placeholder:text-white p-2 text-white font-roboto  border-2 border-white rounded"
          }
          placeholder={"Password"}
          value={userDetail?.password}
          onChange={handleInput}
          id={"password"}
        />

        <div
          onClick={() => setIsPasswordShow((prev) => !prev)}
          className={`hover:cursor-pointer ${
            userDetail?.password ? "block" : "hidden"
          }`}
        >
          {isPasswordShow ? (
            <FaEyeSlash className="absolute text-white font-bold  right-3 top-1/2 -translate-y-1/2" />
          ) : (
            <FaEye className="absolute text-white font-bold right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <div className={` flex items-center gap-2 text-sm`}>
        <Input
          type={"checkbox"}
          name={"TandC"}
          className={"outline-none border-none"}
          id={"tandc"}
          // className={
          //   "w-full bg-transparent outline-none placeholder:text-white p-2 text-white font-roboto  border-2 border-white rounded"
          // }
          checked={userDetail?.TandC}
          onChange={handleInput}
        />
        {/* <input
      type="checkbox"
      name="TandC"
      id=""
      checked={userDetail?.TandC}
      onChange={handleInput}
    /> */}
        <label htmlFor="tandc" className="text-white font-roboto">
          by creating an account you agree{" "}
          <a
            href="https://drive.google.com/file/d/1PlEAh5E7Z9A4zPCMq67iYGUMYyOY39NH/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 font-roboto font-bold"
          >
            terms & conditions
          </a>
        </label>
      </div>

      <div className="flex gap-2">
        <div className="text-white font-roboto">Already have an account</div>
        <span
          className="text-blue-600 font-bold font-roboto hover:cursor-pointer"
          onClick={() => setIsSignUpShow((prev) => !prev)}
        >
          Sign-in here!
        </span>
      </div>
      <div className="w-full relative">
        <Button
          btntext={"Create Account"}
          className={
            " bg-white text-blue-600 font-bold py-1 px-3 w-full  font-roboto rounded"
          }
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default SignUpForm;
