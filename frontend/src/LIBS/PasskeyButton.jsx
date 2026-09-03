import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { FaFingerprint } from "react-icons/fa";
import { useTheme } from "../Context/themeContext";

const PasskeyButton = ({
  onClick,
  loading = false,
  disabled = false,
  text = "Sign in with Passkey",
  subtext = "",
  className = "",
  variant = "primary", // "primary" | "secondary" | "outline"
  icon: CustomIcon,
}) => {
  const { theme } = useTheme();

  const baseStyles =
    "relative flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    primary:
      theme === "dark"
        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white focus:ring-indigo-500 focus:ring-offset-gray-900 shadow-indigo-900/30"
        : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white focus:ring-indigo-600 focus:ring-offset-white shadow-indigo-200",
    secondary:
      theme === "dark"
        ? "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 focus:ring-gray-600 focus:ring-offset-gray-900"
        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 focus:ring-gray-300 focus:ring-offset-white",
    outline:
      theme === "dark"
        ? "bg-transparent hover:bg-gray-800/60 text-indigo-400 border border-indigo-500/40 focus:ring-indigo-500"
        : "bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-300 focus:ring-indigo-600",
  };

  const IconComponent = CustomIcon || FaFingerprint;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? (
        <BiLoaderAlt className="animate-spin text-lg" />
      ) : (
        <IconComponent className="text-lg shrink-0" />
      )}
      <div className="flex flex-col items-start leading-tight">
        <span>{loading ? "Verifying..." : text}</span>
        {subtext && !loading && (
          <span className="text-[11px] opacity-75 font-normal">{subtext}</span>
        )}
      </div>
    </button>
  );
};

export default PasskeyButton;
