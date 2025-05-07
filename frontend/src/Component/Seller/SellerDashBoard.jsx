import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/themeContext";

import { Settings } from "lucide-react";
import {
  SideBar,
  Loader,
  ServerError,
  Input,
  Select,
  SectionTitle,
  Button,
} from "../../LIBS";
import axios from "axios";
import { formatNumber, productCategory } from "../../utility/constant";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "../../Context/authContext";
import { useNavigate } from "react-router-dom";
// import Select from "../UI/Select";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const SlidingButton = () => {
  const [isSliding, setIsSliding] = useState(false);

  const handleClick = () => {
    setIsSliding((prev) => !prev);
  };

  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      <button
        className={`absolute px-6 py-2 text-white font-semibold rounded-md shadow-md transition-transform duration-500 ${
          isSliding
            ? "translate-x-full bg-green-500"
            : "translate-x-0 bg-blue-500"
        }`}
        onClick={handleClick}
      >
        {isSliding ? "Slide Left" : "Slide Right"}
      </button>
    </div>
  );
};

const ToggleSwitch = ({ visibiltyState = true, onToggle }) => {
  const [isOn, setIsOn] = useState(visibiltyState);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
    onToggle && onToggle(!isOn);
  };
  return (
    <div className="flex items-center">
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
          isOn ? "bg-blue-500" : "bg-gray-300"
        }`}
        onClick={handleToggle}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>
    </div>
  );
};

const DashBoard = () => {
  const [dashBoardDetail, setDashBoardDetail] = useState(null);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { authToken } = useAuth();

  const getDashBoardDetail = async () => {
    setIsDataFetching(true);

    try {
      const response = await axios.get(
        `${SERVER_URL}/api/seller/seller-dashboard`,
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setDashBoardDetail(response?.data);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsDataFetching(false);
    }
  };
  useEffect(() => {
    getDashBoardDetail();
  }, [authToken]);

  if (isDataFetching) {
    return <Loader />;
  }
  if (!isDataFetching && error) {
    return <ServerError />;
  }
  return (
    dashBoardDetail && (
      <div
        className={`${
          theme === "dark" ? " text-white " : " text-gray-900"
        } font-roboto`}
      >
        <SectionTitle title="Dashboard Overview" />
        {/* <h2 className="text-2xl m-3 font-semibold">Dashboard Overview</h2> */}
        {/* Stats Section */}
        <div
          className={`grid grid-cols-1 mobile:grid-cols-1 small-device:grid-cols-2 laptop:grid-cols-4 gap-4 mt-6 `}
        >
          {[
            {
              label: "Total Sales",
              value: dashBoardDetail?.totalSales?.[0]?.total,
              change: "+12.5%",
              icon: "📈",
              symbol: "₹",
            },
            {
              label: "Total Orders",
              value: dashBoardDetail?.totalOrder,
              change: "+8.2%",
              icon: "🛒",
            },
            {
              label: "Total Products",
              value: dashBoardDetail?.totalProducts,
              change: "+24",
              icon: "📦",
            },
            {
              label: "Total Customers",
              value: dashBoardDetail?.totalCustomer,
              change: "+18.3%",
              icon: "👤",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-4 rounded-lg shadow-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between space-x-2">
                <h3 className="text-lg font-semibold">{stat.label}</h3>
                <span className="text-4xl p-2">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold">
                {formatNumber(stat.value, stat?.symbol ? stat?.symbol : "")}
              </p>
              <p className="text-sm text-green-500">
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Orders Section */}
        <div
          className={`${
            theme === "dark" ? "bg-gray-800  " : "bg-white "
          } p-6 mt-6 rounded-lg shadow-md transition-all    duration-300  `}
        >
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="w-full overflow-x-scroll">
            <table className=" text-left  w-full min-w-max  ">
              <thead
                className={`${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
                } transition-colors duration-300 p-5`}
              >
                <tr className="border-b">
                  <th className="p-2 w-max">Order ID</th>
                  <th className="p-2">Customer</th>
                  {/* <th className="p-2">Product</th> */}
                  <th className="p-2">Amount</th>
                  <th className="p-2 w-max">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashBoardDetail?.recentOrders?.map((order, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 w-max">{order?.orderId}</td>
                    <td className="p-2">
                      {order?.customerId?.name} <br />
                      <span className="text-sm text-gray-500">
                        {order?.customerId?.email}
                      </span>
                    </td>
                    {/* <td className="p-2">{order.product}</td> */}
                    <td className="p-2 font-bold">
                      {formatNumber(order?.grandTotal || order?.totalAmount)}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-md w-max ${
                          order.orderStatus === "delivered"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order?.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 small-device:grid-cols-2 gap-4 mt-6 ">
          {/* Top Products */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800  " : "bg-white "
            } p-6 rounded-lg shadow-md transition-all duration-300`}
          >
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <ul>
              {[
                {
                  name: "Wireless Headphones",
                  sales: "1,156",
                  revenue: "$45,257",
                },
                { name: "Laptop Stand", sales: "956", revenue: "$38,952" },
                { name: "Phone Case", sales: "841", revenue: "$25,545" },
              ].map((product, index) => (
                <li key={index} className="flex justify-between py-2 border-b">
                  <span>
                    {product.name} ({product.sales} sales)
                  </span>
                  <span className="font-bold">{product.revenue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Reviews */}
          <div
            className={`${
              theme === "dark" ? "bg-gray-800  " : "bg-white "
            } p-6 rounded-lg shadow-md transition-all duration-300 w-full`}
          >
            <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
            <ul>
              {[
                {
                  name: "Lisa Anderson",
                  review: "Great product! Exactly what I was looking for.",
                  rating: "⭐⭐⭐⭐⭐",
                },
                {
                  name: "James Cooper",
                  review:
                    "Good quality but shipping took longer than expected.",
                  rating: "⭐⭐⭐⭐",
                },
                {
                  name: "Maria Garcia",
                  review: "Amazing customer service and product quality!",
                  rating: "⭐⭐⭐⭐⭐",
                },
              ].map((review, index) => (
                <li key={index} className="py-2 border-b">
                  <span className="font-bold">{review.name}</span>{" "}
                  {review.rating}
                  <p className="text-sm text-gray-500">{review.review}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

const Product = () => {
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [productArr, setProductArr] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productCount, setProductCount] = useState(null);
  const [productRange, setProductRange] = useState({});
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [filters, setFilters] = useState({});
  const { theme } = useTheme();
  const { authToken } = useAuth();
  let tempSearchQuery = "";
  const getAllProduct = async () => {
    setIsDataFetching(true);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/seller/get-all-product`,
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
          params: { filters, page },
        }
      );
      setProductArr(response?.data?.allProduct);
      setTotalPages(response?.data?.totalPages);
      setProductCount(response?.data?.totalProducts);
      setProductRange(() => {
        return {
          startProductIndex: response?.data?.startProductIndex,
          endProductIndex: response?.data?.endProductIndex,
        };
      });
      // console.log(response?.data); // Handle your data here
    } catch (error) {
      console.error(error?.response?.data?.message || error.message);
    } finally {
      setIsDataFetching(false);
    }
  };

  const products = [
    {
      id: "PRD001",
      name: "iPhone 14 Pro",
      category: "Electronics",
      stock: 245,
      price: "$999.00",
      status: "In Stock",
      img: "📱",
    },
    {
      id: "PRD002",
      name: "Cotton T-Shirt",
      category: "Clothing",
      stock: 12,
      price: "$24.99",
      status: "Low Stock",
      img: "👕",
    },
    {
      id: "PRD003",
      name: "Cotton T-Shirt",
      category: "Clothing",
      stock: 0,
      price: "$24.99",
      status: "Low Stock",
      img: "👕",
    },
  ];

  useEffect(() => {
    getAllProduct();
  }, [authToken, JSON.stringify(filters), page]);
  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      } h-full  transition-all duration-300`}
    >
      {/* Main Content */}
      <main className=" p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          {/* <h1 className="text-2xl font-bold">Products</h1> */}
          {/* <h2 className="text-2xl  font-semibold">Products</h2> */}
          <SectionTitle title="Products" className="text-2xl font-semibold" />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700">
            + Add New Product
          </button>
        </div>

        <p className="text-gray-500 mt-2">Manage your product inventory</p>

        {/* Search & Filter Bar */}
        <div className="mt-6 grid grid-cols-1 mobile:grid-cols-2 small-device:grid-cols-5 laptop:grid-cols-6 gap-4">
          <Input
            type="text"
            placeholder="Search Products..."
            className={`p-2 bg-gray-100 flex-1 border-2 rounded border-gray-300  mobile:col-span-2 small-device:col-span-3 laptop:col-span-4  ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "text-gray-900 bg-gray-100 border-gray-300"
            }`}
            value={searchQuery}
            onChange={(e) => {
              tempSearchQuery += e?.target?.value;
              // console.log(e);
              // setSearchQuery(e?.target?.value);
            }}
            onKeyDown={(e) => {
              console.log(e);
              if (e?.key?.toString().toLowerCase() === "enter") {
                setSearchQuery(tempSearchQuery);
              }
            }}
          />

          <Select
            name="category"
            itemArray={productCategory}
            className="p-2 bg-gray-100 border-2 rounded border-gray-300 cursor-pointer"
            displayName="all category"
            onChange={(e) => {
              setCategory(e?.target?.value?.toString()?.trim());
              setFilters((prev) => {
                return {
                  ...prev,
                  category: e?.target?.value?.toString()?.trim(),
                };
              });
              setPage(1);
            }}
          />
          <Select
            className="p-2 bg-gray-100 border-2 rounded border-gray-300 cursor-pointer"
            name="status"
            itemArray={[
              { id: 1, value: "in stock" },
              { id: 2, value: "low stock" },
              { id: 3, value: "out of stock" },
            ]}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => {
                return {
                  ...prev,
                  productStockStatus: e?.target?.value
                    ?.toString()
                    ?.trim()
                    ?.toLowerCase(),
                };
              });
            }}
            displayName="status"
          />
        </div>

        {/* Products Table */}
        <div className="mt-6">
          <div className="overflow-x-auto overflow-scroll w-full">
            <table className="w-full text-left border-collapse ">
              <thead>
                <tr
                  className={`${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                  } transition-all duration-300`}
                >
                  <th className="p-3 w-max ">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Visibility</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="w-full h-full">
                {productArr.map((product) => (
                  <tr key={product?._id} className="border-b h-full">
                    <td className="p-3 flex items-center w-max">
                      {/* <span className="text-2xl mr-2">
                        {product?.image?.[0]}
                      </span> */}
                      <img
                        src={product?.image?.[0]}
                        alt=""
                        className="w-20 h-20 rounded-md m-3 object-cover "
                      />
                      <div className="flex-1">
                        <p className="font-semibold max-w-56 line-clamp-1">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-500 w-min">
                          {product?._id}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">{product?.category?.toCapitalize()}</td>
                    <td className="p-3">{product?.stock}</td>
                    <td className="p-3">
                      <ToggleSwitch
                        visibiltyState={!product?.isHide}
                        onToggle={async (state) => {
                          try {
                            console.log(state);
                            const response = await axios.patch(
                              `${SERVER_URL}/api/seller/product/visibilty-toggle/${product?._id}`,
                              { state },
                              {
                                headers: {
                                  "Content-Type":
                                    "application/json; charset=UTF-8",
                                  Authorization: `Bearer ${authToken}`,
                                },
                              }
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      />
                    </td>

                    <td className="p-3">
                      {formatNumber(product?.price || product?.mrpPrice)}
                    </td>
                    <td
                      className={`p-3 font-semibold w-max ${
                        product?.stock > 20
                          ? "text-green-500"
                          : product?.stock > 0
                          ? "text-yellow-500"
                          : "text-red-500"
                        // product.stock === "In Stock"
                        //   ? "text-green-500"
                        //   : "text-yellow-500"
                      }`}
                    >
                      {product?.stock > 20
                        ? "In Stock"
                        : product?.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </td>
                    <td className="p-3 space-x-2 ">
                      {/* <p>k</p> */}
                      <Button className="text-blue-500" btntext="✏️" />
                      <Button className="text-red-500" btntext="🗑️" />
                    </td>
                  </tr>
                ))}
                {productArr?.length === 0 && !isDataFetching && (
                  <tr className=" text-center">
                    <td colSpan="7" className="p-5">
                      {/* <div className="flex items-center justify-center h-full">
                        <img
                          src="/images/empty.png"
                          alt="No Data"
                          className="w-20 h-20"
                        />
                      </div> */}
                      Nothing to Display
                    </td>
                    {/* <td></td> */}
                  </tr>
                )}
                {isDataFetching && (
                  <tr className="">
                    <td colSpan="7" className="p-5">
                      <div className="w-full flex justify-center gap-2">
                        <BiLoaderAlt className="animate-spin h-6 w-6 " />
                        <span>Loading...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between mobile:flex-col small-device:flex-row mobile:gap-4 small-device:gap-0">
          <p className="text-gray-500">
            Showing {productRange?.startProductIndex} to{" "}
            {productRange?.endProductIndex} of {productCount} results
          </p>
          <div className="flex space-x-2">
            <Button
              className="px-3 py-1 bg-gray-300 rounded-md"
              btntext="Previous"
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
            />
            {/* <button className="px-3 py-1 bg-gray-300 rounded-md">
              Previous
            </button> */}

            {[...Array(totalPages)].map((item, index) => (
              <Button
                className={`px-3 py-1 rounded-md ${
                  index + 1 === page ? "bg-purple-600" : "bg-gray-300"
                } `}
                key={index}
                btntext={index + 1}
                onClick={() => setPage(index + 1)}
              />
            ))}

            <Button
              className="px-3 py-1 bg-gray-300 rounded-md"
              btntext="Next"
              onClick={() => {
                setPage((prev) => (prev < totalPages ? prev + 1 : prev));
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const Orders = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Orders" />
    </div>
  );
};

const Customers = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Customer" />
    </div>
  );
};

const Setting = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Setting" />
    </div>
  );
};

const SellerDashBoard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const { authToken } = useAuth();

  const tabs = [
    {
      id: 1,
      name: "Dashboard",
      component: DashBoard,
      icon: "",
    },
    { id: 2, name: "Products", component: Product, icon: "" },
    { id: 3, name: "Orders", component: Orders, icon: "" },
    {
      id: 4,
      name: "Cutomers",
      component: Customers,
      icon: "",
    },
    {
      id: 5,
      name: "Setting",
      component: Setting,
      icon: Settings,
    },
  ];
  const ActiveTabComponent = tabs[activeTab]?.component;
  console.log(authToken);
  useEffect(() => {
    if (!authToken) {
      console.log("authToken", authToken);
      navigate("/login");
    }
  }, [authToken, navigate]);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on component mount
  }, []);

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      } h-screen pb-4 transition-all duration-300 mobile:text-xs tablet:text-base flex font-roboto `}
    >
      {/* Sidebar */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      {/* Main Content */}
      <div className="flex-1 p-6 mobile:p-1 tablet:p-6 transition-all duration-300 h-screen overflow-y-scroll">
        {/* Header */}
        <ActiveTabComponent />
      </div>
    </div>
  );
};

export default SellerDashBoard;
