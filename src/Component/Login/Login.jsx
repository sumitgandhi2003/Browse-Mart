import React, { useEffect, useState } from "react";
import image from "../../assets/images/login_panel_logo.png";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import axios from "axios";
import swal from "sweetalert";
const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");
//form direct action config
// action={`${SERVER_URL}${isSignUpShow ? "/create-user" : ""}`}
// method={`${isSignUpShow ? "post" : "get"}`

const Login = ({ authToken, setAuthToken }) => {
  const [islogining, setIslogining] = useState(false);
  const navigate = useNavigate();
  const [isSignUpShow, setIsSignUpShow] = useState(false);
  const guestUser = {
    email: "guest@gmail.com",
    password: "guestuser",
  };

  const handleGuestLogin = () => {
    setIslogining((prev) => !prev);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/user/login`,
      data: guestUser,
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("userId", response.data.userId);
        // setIsSignUpShow(false);
        if (response.status === 200) {
          // swal("success", "User Login Successfully", "success");
          localStorage.setItem("AuthToken", response?.data?.AuthToken);
          setAuthToken(response?.data?.AuthToken);
          setIslogining((prev) => !prev);
          navigate("/");
        } else {
          swal("Oops!", "Something went wrong", "error");
        }
      })
      .catch((error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message;
        setIslogining((prev) => !prev);
        if (status === 404) {
          swal("Oops!", message, "error");
        } else if (status === 401) {
          swal("Oops!", message, "error");
        } else if (status === 400) {
          swal("Oops!", message, "error");
        } else {
          swal("Oops!", "Something went wrong", "error");
        }
      });
  };
  // const [authToken, setAuthToken] = useState(localStorage.getItem("AuthToken"));
  useEffect(() => {
    if (authToken !== null && authToken !== undefined) navigate("/");
  }, [authToken]);

  return (
    <div className="w-screen flex h-screen laptop:w-screen laptop:h-screen bg-blue-300  ">
      <div
        className={`w-1/2 mobile:w-full tablet:w-1/2 flex  justify-center transform  transition-transform duration-700  items-center  ${
          isSignUpShow
            ? " mobile:translate-x-0 small-device:translate-x-full"
            : "translate-x-0"
        }`}
      >
        <div className=" min-w-[300px] mobile:w-full small-device:w-[500px] ">
          <div className="flex w-full items-center gap-3 p-3 ">
            <div
              onClick={() => setIsSignUpShow((prev) => !prev)}
              className={` p-3 font-bold font-roboto w-1/2 border-2 border-transparent text-2xl hover:cursor-pointer ${
                !isSignUpShow ? "text-blue-600 " : "text-blue-400"
              }`}
            >
              Login
              <div
                className={`w-full ${
                  !isSignUpShow ? "bg-blue-600" : "bg-blue-400"
                }  h-[3px] rounded`}
              ></div>
            </div>
            <div
              onClick={() => setIsSignUpShow((prev) => !prev)}
              className={`p-3 font-bold font-roboto w-1/2 border-2 border-transparent text-2xl hover:cursor-pointer ${
                isSignUpShow ? "text-blue-600 " : "text-blue-400"
              }`}
            >
              Sign up
              <div
                className={`w-full ${
                  isSignUpShow ? "bg-blue-600" : "bg-blue-400"
                }  h-[3px] rounded`}
              ></div>
            </div>
          </div>

          {isSignUpShow ? (
            <SignUpForm
              setIsSignUpShow={setIsSignUpShow}
              setAuthToken={setAuthToken}
            />
          ) : (
            <LoginForm
              setIsSignUpShow={setIsSignUpShow}
              setAuthToken={setAuthToken}
            />
          )}
          <div className="w-full p-3 flex justify-center">
            <Button
              btntext={"Guest Login"}
              className={"w-full p-2 bg-blue-500 rounded text-white"}
              onClick={handleGuestLogin}
              loading={islogining}
            />
          </div>
        </div>
      </div>

      <div
        className={`w-1/2 relative overflow-hidden mobile:hidden tablet:block transform transition-transform duration-700  ${
          isSignUpShow ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div
          className={`z-50 absolute w-[300px] top-1/2 -translate-y-1/2  transform left-1/2 -translate-x-1/2   ${
            isSignUpShow ? "scale-x-[-1] " : ""
          }  `}
        >
          <img src={image} alt="" />
        </div>
        <div
          className={`w-full bg-[#CAF4FF] rounded-full transform transition-transform duration-700 absolute ${
            isSignUpShow
              ? "-left-1/2 translate-x-1/4"
              : "-right-1/2 -translate-x-1/4"
          } top-1/2 -translate-y-1/2   scale-[1.5] h-full`}
        >
          <div
            className={`w-full  bg-[#A0DEFF] rounded-full  h-full transform transition-transform duration-700 absolute ${
              isSignUpShow ? "-left-1/4" : "-right-1/4"
            }   top-1/2 -translate-y-1/2 `}
          >
            <div
              className={` w-full bg-[#5AB2FF] rounded-full  h-full transform transition-transform duration-700 absolute ${
                isSignUpShow ? "-left-1/4" : "-right-1/4"
              } -right-1/4 top-1/2 -translate-y-1/2`}
            ></div>
          </div>
        </div>
        {/* <div className="w-full bg-[#a3c7f0] rounded-full transform absolute -right-1/2 top-1/2 -translate-y-1/2 -translate-x-1/4  scale-[1.5] h-full">
          <div className="w-full  bg-[#9bb7dd] rounded-full  h-full absolute -right-1/4 top-1/2 -translate-y-1/2  ">
            <div className=" w-full bg-[#76a9d0] rounded-full  h-full absolute -right-1/4 top-1/2 -translate-y-1/2"></div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
