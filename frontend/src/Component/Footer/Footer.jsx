import React, { useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaPaperPlane,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Footer = ({ userDetail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/newsletter/subscribe`,
        { email },
      );
      if (response.data.success) {
        setMessage({ type: "success", text: response.data.message });
        setEmail(""); // clear input on success
      } else if (response.data.already) {
        setMessage({ type: "warning", text: response.data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-5 mobile:px-10 tablet:px-20 border-t-2">
      <div
        className={`max-w-7xl mx-auto grid grid-cols-1 small-device:grid-cols-2 tablet:grid-cols-3  ${
          userDetail?.userType === "seller" || userDetail?.userType === "admin"
            ? "laptop:grid-cols-5"
            : "laptop:grid-cols-4"
        } gap-8`}
      >
        {/* Browse Mart Section */}
        <div>
          <h2 className="text-white text-lg font-semibold">Browse Mart</h2>
          <p className="text-sm mt-2">
            Your one-stop shop for all things amazing.
          </p>
          <div className="flex space-x-4 mt-3">
            <FaFacebookF className="cursor-pointer hover:text-white" />
            <FaTwitter className="cursor-pointer hover:text-white" />
            <FaInstagram className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              <Link to={"/seller-registration"}>Seller Registration</Link>
            </li>
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Shipping</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold">Customer Service</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              {" "}
              <Link to={"/profile"}>My Account</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to={"/orders"}>View Orders</Link>
            </li>
            <li className="hover:text-white cursor-pointer">Track Order</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Wishlist</li>
          </ul>
        </div>
        {userDetail?.userType === "seller" && (
          <div>
            <h3 className="text-white text-lg font-semibold">Seller Service</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">
                <Link to={"/seller"}>Seller DashBoard</Link>
              </li>
              <li className="hover:text-white cursor-pointer">Track Order</li>
              <li className="hover:text-white cursor-pointer">Returns</li>
              <li className="hover:text-white cursor-pointer">Wishlist</li>
            </ul>
          </div>
        )}

        {userDetail?.userType === "admin" && (
          <div>
            <h3 className="text-white text-lg font-semibold">Admin Panel</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">
                <Link to={"/admin"}>Admin Dashboard</Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link to={"/admin/users"}>User Management</Link>
              </li>
              <li className="hover:text-white cursor-pointer">
                <Link to={"/admin/products"}>Global Inventory</Link>
              </li>
            </ul>
          </div>
        )}

        {/* Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold">Newsletter</h3>
          <p className="text-sm mt-2">
            Subscribe to get special offers and updates.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex mt-3 bg-white rounded-lg overflow-hidden border focus-within:border-purple-500"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              disabled={loading}
              className="p-2 w-full text-black focus:outline-none disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 transition-colors p-3 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane className="text-white" />
              )}
            </button>
          </form>
          {message.text && (
            <p
              className={`text-xs mt-2 ${
                message.type === "success"
                  ? "text-green-400"
                  : message.type === "warning"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-5 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/privacy.html"
            className="hover:text-white underline transition-colors"
          >
            Privacy Policy
          </a>
          <span>·</span>
          <a
            href="/terms.html"
            className="hover:text-white underline transition-colors"
          >
            Terms of Service
          </a>
          <span>·</span>
          <a
            href="mailto:itssumitgandhi@gmail.com"
            className="hover:text-white underline transition-colors"
          >
            Contact Us
          </a>
        </div>
        <div>
          &copy; <span>{new Date().getFullYear()}</span> BrowseMart. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
