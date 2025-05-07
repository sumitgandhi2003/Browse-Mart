import { useEffect, useState } from "react";
import {
  FaUser,
  FaBox,
  FaHeart,
  FaMapMarkerAlt,
  FaCog,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useTheme } from "../../Context/themeContext";
import { useAuth } from "../../Context/authContext";
import { useLocation, useNavigate } from "react-router-dom";

const Profile1 = () => {
  const { theme } = useTheme();
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = `/login?redirect=${encodeURIComponent(location?.pathname)}`;
  useEffect(() => {
    if (!authToken) {
      navigate(redirect);
    }
  }, [authToken]);
  return (
    <div
      className={`flex min-h-screen  ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }  transition-all duration-300`}
    >
      {/* Sidebar */}
      <aside className="w-64  shadow-md p-6 hidden small-device:block">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-300"></div>
          <h2 className="mt-2 text-lg font-semibold">John Doe</h2>
          <p className="text-sm text-gray-500">Member since Jan 2025</p>
        </div>
        <nav className="mt-6 space-y-4">
          <NavItem icon={FaUser} text="Profile Overview" />
          <NavItem icon={FaBox} text="Orders" />
          <NavItem icon={FaHeart} text="Wishlist" />
          <NavItem icon={FaMapMarkerAlt} text="Addresses" />
          <NavItem icon={FaCog} text="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Profile Overview</h1>

        {/* Personal Information */}
        <SectionTitle title="Personal Information" />
        <div className=" p-4 rounded-lg shadow-md grid grid-cols-1 small-device:grid-cols-2 gap-4">
          <InputField label="First Name" value="John" />
          <InputField label="Last Name" value="Doe" />
          <InputField label="Email" value="john.doe@example.com" />
          <InputField label="Phone" value="+1 234 567 8900" />
        </div>

        {/* Recent Orders */}
        <SectionTitle title="Recent Orders" />
        <div
          className={` p-4 rounded-lg shadow-md  transition-all duration-300 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <OrderItem
            id="#12345"
            date="Jan 15, 2025"
            status="Delivered"
            total="$128.99"
          />
          <OrderItem
            id="#12344"
            date="Jan 10, 2025"
            status="Processing"
            total="$89.99"
          />
        </div>

        {/* Saved Addresses */}
        <SectionTitle title="Saved Addresses" />
        <div className="grid grid-cols-1 small-device:grid-cols-2 gap-4">
          <AddressCard
            title="Home"
            address="123 Main Street, Apt 4B, New York, NY 10001"
          />
          <AddressCard
            title="Office"
            address="456 Business Ave, Floor 12, New York, NY 10002"
          />
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer">
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="mt-6 mb-2 text-lg font-semibold">{title}</h2>
);

const InputField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="mt-1 p-2 w-full border rounded-md bg-gray-100"
    />
  </div>
);

const OrderItem = ({ id, date, status, total }) => (
  <div className="flex justify-between items-center p-2 border-b">
    <span>{id}</span>
    <span>{date}</span>
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        status === "Delivered"
          ? "bg-green-100 text-green-600"
          : "bg-yellow-100 text-yellow-600"
      }`}
    >
      {status}
    </span>
    <span className="font-semibold">{total}</span>
  </div>
);

const AddressCard = ({ title, address }) => (
  <div className="bg-white p-4 rounded-lg shadow-md relative">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-gray-600 mt-1">{address}</p>
    <div className="absolute top-2 right-2 flex space-x-2 text-gray-500">
      <FaEdit className="cursor-pointer hover:text-blue-500" />
      <FaTrash className="cursor-pointer hover:text-red-500" />
    </div>
  </div>
);

export default Profile1;
