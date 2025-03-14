import React, { useState, useEffect, useRef } from "react";
import Input from "./Input";
import { useTheme } from "../../Context/themeContext";
import Button from "./Button";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const [searchHistory, setSearchHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() === "") return;

    const updatedHistory = [
      searchQuery,
      ...searchHistory.filter((term) => term !== searchQuery),
    ];
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    navigate(`/products?q=${encodeURIComponent(searchQuery?.trim())}`);
    setSearchQuery("");
    setShowDropdown(false); // Hide dropdown after searching
  };

  // Delete a search term without closing dropdown
  const handleDelete = (term, e) => {
    e.stopPropagation(); // Prevent closing dropdown
    const updatedHistory = searchHistory.filter((item) => item !== term);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };
  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  return (
    <div
      className={`relative hidden small-device:block h-9   items-center border transition-all duration-300 ${
        theme === "dark" ? "border-gray-600" : "border-gray-300"
      } rounded-lg`}
      ref={searchRef}
    >
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
        value={searchQuery}
        className={`p-2 pl-4 pr-10 w-full min-w-40 h-full  ${
          theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"
        } rounded-lg `}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* Search Button */}
      <Button
        className={`absolute right-2 top-1/2 -translate-y-1/2 hover:text-indigo-600 ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
        icon={<FaSearch />}
        onClick={handleSearch}
      />

      {/* Dropdown for previous searches */}
      {showDropdown && searchHistory.length > 0 && (
        <div
          className={`absolute w-full border rounded shadow-md mt-1 max-h-40 overflow-y-auto ${
            theme === "dark"
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-gray-200"
          }`}
        >
          {searchHistory.map((term, index) => (
            <div
              key={index}
              className={`flex justify-between items-center    ${
                theme === "dark"
                  ? "even:bg-gray-700 border-b-2 last:border-b-0"
                  : "even:bg-gray-50 border-b-2"
              }`}
            >
              <span
                className="cursor-pointer w-full p-3"
                onClick={() => {
                  navigate(`/products?q=${encodeURIComponent(term?.trim())}`);
                }}
              >
                {term}
              </span>
              <Button
                icon={<MdClose className="text-red-500 font-bold " />}
                onClick={(e) => handleDelete(term, e)}
                className="p-3 "
                // <close
              />
              {/* <Cross */}
              {/* <button
                onClick={(e) => handleDelete(term, e)}
                className="text-red-500 font-bold"
              >
                ×
              </button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
