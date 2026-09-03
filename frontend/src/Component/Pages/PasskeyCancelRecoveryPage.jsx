import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useTheme } from "../../Context/themeContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PasskeyCancelRecoveryPage = () => {
  const { cancelToken } = useParams();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cancelRecovery = async () => {
      if (!cancelToken) return;
      try {
        const { data } = await axios.get(
          `${SERVER_URL}/api/webauthn/recovery/cancel/${cancelToken}`
        );
        if (data?.success) {
          setSuccess(true);
          setMessage(data.message);
        }
      } catch (err) {
        setSuccess(false);
        setMessage(
          err?.response?.data?.message ||
            "This recovery request has already been cancelled or expired."
        );
      } finally {
        setIsLoading(false);
      }
    };

    cancelRecovery();
  }, [cancelToken]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl text-center ${
          theme === "dark"
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        {isLoading ? (
          <div className="py-12">
            <BiLoaderAlt className="mx-auto animate-spin text-3xl text-indigo-500" />
            <p className="mt-3 text-xs text-slate-500">Cancelling recovery request...</p>
          </div>
        ) : success ? (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 mb-4">
              <FaCheckCircle className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold">Recovery Cancelled</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {message}
            </p>

            <div
              className={`mt-5 rounded-2xl border p-4 text-xs ${
                theme === "dark"
                  ? "border-slate-800 bg-slate-800/40 text-slate-400"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <p className="font-semibold text-slate-300 dark:text-slate-200">
                Account Status: Protected
              </p>
              <p className="mt-1">
                Your existing passkeys remain untouched and unauthorized access was blocked.
              </p>
            </div>

            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30"
            >
              <span>Back to Login</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 mb-4">
              <FaTimesCircle className="text-3xl" />
            </div>

            <h2 className="text-2xl font-bold">Request Inactive</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 py-3 text-xs font-semibold text-white hover:bg-slate-700"
            >
              <span>Go to Login</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasskeyCancelRecoveryPage;
