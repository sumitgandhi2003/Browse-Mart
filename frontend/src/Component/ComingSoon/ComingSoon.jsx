import React, { useEffect, useState } from "react";

const ComingSoon = ({
  theme = "light",
  launchDate = "2025-05-20T00:00:00",
}) => {
  const isDark = theme === "dark";
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const countdown = () => {
      const target = new Date(launchDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(
        2,
        "0"
      );
      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0"
      );
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(countdown, 1000);
    return () => clearInterval(timer);
  }, [launchDate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-2xl w-full text-center p-8 rounded-lg shadow-lg transition-all duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-4xl font-bold mb-4">🚧 Coming Soon!</h1>
        <p className="text-lg mb-6 text-gray-500 dark:text-gray-300">
          We’re launching soon. Stay tuned!
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-6 mb-6">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label}>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-sm text-gray-400 capitalize">{label}</div>
            </div>
          ))}
        </div>

        {/* Email Notify Form */}
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className={`w-full mobile:w-auto flex-1 px-4 py-2 rounded-md border ${
              isDark
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-100 border-gray-300 text-gray-900"
            } transition-all duration-300`}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          {submitMessage && (
            <p className="text-sm text-green-500 mb-2">{submitMessage}</p>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!inputValue) {
                setSubmitMessage("Please enter a valid email.");
                return;
              }
              setTimeout(() => {
                setSubmitMessage("Thank you for Submitting Email!");
              }, 3000);
            }}
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Notify Me
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4">
          We’ll let you know once we launch!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
