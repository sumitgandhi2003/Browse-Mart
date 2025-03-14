// import React from "react";
// import { useTheme } from "../../Context/themeContext";
// const serverErrorImage = require("../../assets/images/serverError.jpg");
// const ServerError = () => {
//   const { theme } = useTheme();
//   return (
//     <div
//       className={`min-h-screen flex-1 flex justify-center items-center ${
//         theme === "dark"
//           ? "bg-gray-800 text-white"
//           : "bg-gray-200 text-gray-800"
//       } transition-all duration-300`}
//     >
//       {/* <h1 className="text-center text-red-500">{error.error}</h1>; */}
//       <img src={serverErrorImage} className="h-[500px]" alt="server error" />
//     </div>
//   );
// };

// export default ServerError;

import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "../../Context/themeContext";
import { useEffect } from "react";

const ServerError = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  });

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-300   text-center p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <AlertTriangle
        className={`  w-16 h-16 ${
          theme === "dark" ? "text-red-400" : "text-red-500"
        }`}
      />
      <h1
        className={`text-4xl font-bold   mt-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        500 - Internal Server Error
      </h1>
      <p
        className={`  mt-2 max-w-md ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Oops! Something went wrong on our end. Please try again later or return
        to the homepage.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ServerError;
