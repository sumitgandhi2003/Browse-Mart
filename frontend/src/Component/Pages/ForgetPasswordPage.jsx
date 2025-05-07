import { useEffect, useState } from "react";
import { useTheme } from "../../Context/themeContext";
import { Button, Input, OTPInput } from "../../LIBS";
import axios from "axios";
import { BiLoaderCircle } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BiLoaderAlt } from "react-icons/bi";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useAuth } from "../../Context/authContext";
// import { BiLoaderAlt } from "react-icons/bi";
const ForgetPasswordPage = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { authToken } = useAuth();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const passwordToggle = () => {
    setIsPasswordShow((prev) => !prev);
  };

  //Handle Sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    localStorage.removeItem("resetToken");
    if (!emailRegex?.test(email)) {
      setErrorMessage("Email is Not Valid! ");
      return;
    }
    setMessage("");
    setIsProcessing(true);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/auth/forget-password`,
      data: {
        email,
      },
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(({ status, data }) => {
        if (status === 200) {
          setStep(2);
          setMessage(data?.message);
          setErrorMessage("");
        }
      })
      .catch((error) => {
        console.log(error);
        const {
          message = "",
          sucess = undefined,
          requiresVerification = undefined,
        } = error?.response?.data || error;

        setErrorMessage(message);
      })
      .finally(() => setIsProcessing(false));
  };

  //Handling OTP Verification
  const handleVerifyOtp = async (otp) => {
    // e.preventDefault();
    setErrorMessage("");
    if (otp.length < 6 || otp.length > 6) {
      setErrorMessage(
        "OTP must be a 6-digit number. Please enter a valid OTP."
      );
      return;
    }
    setMessage("");
    setIsProcessing(true);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/auth/verify-otp`,
      data: {
        email,
        otp,
      },
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(({ status = 200, data = {} }) => {
        if (status === 200) {
          localStorage.setItem("resetToken", data?.resetToken);
          setStep(3);
          setErrorMessage("");
          setMessage(data?.message);
        }
      })
      .catch((error) => {
        const {
          message = "",
          sucess = undefined,
          requiresVerification = undefined,
        } = error?.response?.data || error;
        setErrorMessage(message || "Something went wrong");
      })
      .finally(() => {
        setIsProcessing(false);
      });
    // console.log("Verifying OTP", otp);
  };

  //Handling Saving New Password
  const handleResetPassword = async (e) => {
    if (newPassword.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setErrorMessage(
        "Password must be at least 6 characters long and include at least one special character (e.g., @, #, $, !)."
      );
      return;
    }
    setIsProcessing(true);
    e.preventDefault();
    axios({
      method: "post",
      url: `${SERVER_URL}/api/auth/set-password`,
      data: {
        resetToken: localStorage.getItem("resetToken"),
        newPassword,
      },
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => {
        setNewPassword("");
        const { status, data } = response;
        if (status === 200) {
          Swal.fire("Congrats", data?.message, "success").then((value) => {
            navigate("/login");
          });
        }
      })
      .catch((error) => {
        setMessage(error?.response?.data?.message);
      })
      .finally(() => {
        localStorage.removeItem("resetToken");
        setIsProcessing(false);
      });
  };
  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  });
  return (
    !authToken && (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div
          className={`w-full max-w-md p-8 rounded-lg shadow-md transition-all duration-300  ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-900"
          } 
          
          `}
        >
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-4xl mobile:text-2xl font-bold  text-center ">
                  Forgot Password
                </h2>
                <p className="px-2 py-4 font-normal mobile:text-xs small-device:text-sm tablet:text-base laptop:text-lg">
                  Please enter your email to reset the password
                </p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // className="w-full p-3 mb-4 border text-black rounded-md "
                  className={`w-full p-2 rounded-md mb-4 border-2  ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600 focus:border-gray-300"
                      : "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600"
                  }`}
                />
                <p className="text-red-600 px-2 pb-2 font-normal mobile:text-xs small-device:text-sm tablet:text-base laptop:text-lg ">
                  {errorMessage}
                </p>
                <Button
                  btntext={`${isProcessing ? "Sending...." : "Send OTP"}`}
                  // loading={isProcessing}
                  onClick={handleSendOtp}
                  icon={
                    isProcessing ? (
                      <BiLoaderAlt className="animate-spin h-6 w-6" />
                    ) : (
                      ""
                    )
                  }
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md hover:bg-green-700"
                  disabled={isProcessing}
                />
              </div>
            )}
            {step === 2 && (
              <OTPInput
                message={message}
                errorMessage={errorMessage}
                isProcessing={isProcessing}
                onOtpVerify={handleVerifyOtp}
              />
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl mobile:text-2xl font-semibold mb-4 text-center">
                  Enter New Password
                </h2>
                <div className="relative">
                  <p className="px-2 py-4 font-normal mobile:text-xs small-device:text-sm tablet:text-base laptop:text-lg">
                    {message} You Can Enter New Password
                  </p>
                  <div className="relative mb-4">
                    <Input
                      type={`${isPasswordShow ? "text" : "password"}`}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3  border text-black rounded-md "
                    />

                    <div
                      onClick={passwordToggle}
                      className={`hover:cursor-pointer absolute  right-3 top-1/2 -translate-y-1/2 
                  `}
                    >
                      {isPasswordShow ? (
                        <FaEyeSlash
                          className={`${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        />
                      ) : (
                        <FaEye
                          className={` ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  {errorMessage && (
                    <p className="text-red-500 text-sm font-medium my-1 mb-2">
                      {errorMessage}
                    </p>
                  )}
                </div>

                <Button
                  btntext={isProcessing ? "Resetting..." : "Reset Password"}
                  onClick={handleResetPassword}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md"
                  icon={
                    isProcessing ? (
                      <BiLoaderAlt className="animate-spin h-6 w-6" />
                    ) : (
                      ""
                    )
                  }
                  disabled={isProcessing}
                />
              </div>
            )}
          </form>
        </div>

        <Button
          onClick={toggleTheme}
          className={`p-2 rounded-full z-10 bg-opacity-75 fixed shadow w-10 h-10 bottom-5 right-5 ${
            theme === "dark" ? "bg-gray-400" : "bg-gray-300"
          }`}
          icon={
            theme === "dark" ? (
              <FaSun className="text-yellow-400 w-5 h-5 " />
            ) : (
              <FaMoon className="text-gray-800 w-5 h-5" />
            )
          }
        />
      </div>
    )
  );
};

export default ForgetPasswordPage;
