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
  TextArea,
} from "../../LIBS";
import axios from "axios";
import {
  checkValidation,
  formatNumber,
  initialProductDetails,
  productBrands,
  productCategory,
} from "../../utility/constant";
import { BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "../../Context/authContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
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

export const DashBoard = () => {
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

export const AddProductForm = () => {
  const [productForm, setProductForm] = useState(initialProductDetails);
  const [error, setError] = useState({});
  const { theme } = useTheme();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProductForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productForm);
    const result = checkValidation(productForm);
    console.log(result);
    if (result) {
      setError(result);
    } else if (productForm?.mrpPrice < productForm?.sellingPrice) {
      console.log("MRP Price should be greater than Selling Price");
      setError((prev) => {
        return {
          ...prev,
          mrpPrice: "MRP Price should be greater than Selling Price",
        };
      });
    } else {
      setError({});
      // Submit the form data to the server or perform any other action
      console.log("Form submitted successfully:", productForm);
    }
  };
  return (
    <div
      className={`w-full rounded-lg shadow-md p-6 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Add New Product</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create and publish a new product listing
          </p>
        </div>
        <div className="space-x-2">
          <button
            className={`px-4 py-2 border rounded-md ${
              theme === "dark"
                ? "border-gray-600 text-white"
                : "border-gray-300 text-gray-700"
            }`}
          >
            Save as Draft
          </button>
          <Button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            btntext="Publish Product"
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 small-device:grid-cols-2 gap-4">
          <div className=" flex flex-col gap-3">
            <label htmlFor="name">
              Product Name <span className="required">*</span>
            </label>
            <Input
              type={"text"}
              id={"name"}
              name={"name"}
              value={productForm?.name}
              onChange={handleChange}
              placeholder={"Product Name"}
              className="p-2  bg-gray-100 border-2 rounded border-gray-300"
            />
            {error.name && <p className="required-field-error">{error.name}</p>}
          </div>

          <div className=" flex flex-col gap-3">
            <label htmlFor="stock">
              Brand <span className="required">*</span>
            </label>
            <Select
              name="brand"
              id="brand"
              className="p-2 bg-gray-100 border-2 rounded border-gray-300"
              onChange={handleChange}
              value={productForm?.brand}
              displayName="Select Brand"
              itemArray={productBrands}
            />
            {error.brand && (
              <p className="required-field-error">{error.brand}</p>
            )}
          </div>

          {/* <div>
            <label className="block font-medium mb-1">SKU</label>
            <input
              type="text"
              placeholder="Enter SKU"
              className="w-full border p-2 rounded-md"
            />
          </div> */}
        </div>

        {/* Media */}
        <div>
          <label className="block font-medium mb-1">Product Media</label>
          <div className="w-full p-6 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center text-gray-500">
            <span className="text-3xl">📁</span>
            <p className="my-2">Drag and drop your product images here</p>
            <button className="text-blue-600 underline">Browse Files</button>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 small-device:grid-cols-3 gap-4">
          {/* <div>
            <label className="block font-medium mb-1">Regular Price</label>
            <input
              type="number"
              placeholder="$ 0.00"
              className="w-full border p-2 rounded-md"
            />
          </div> */}

          <div className=" flex flex-col gap-3">
            <label htmlFor="mrpPrice">
              MRP Price <span className="required">*</span>
            </label>
            <Input
              type={"number"}
              id={"mrpPrice"}
              name={"mrpPrice"}
              value={productForm?.mrpPrice}
              onChange={handleChange}
              placeholder={"MRP Price"}
              className={"p-2 bg-gray-100 border-2 rounded border-gray-300"}
            />
            {error.mrpPrice && (
              <p className="required-field-error">{error.mrpPrice}</p>
            )}
          </div>

          <div className=" flex flex-col gap-3">
            <label htmlFor="discountedPrice">
              Selling Price <span className="required">*</span>
            </label>
            <Input
              type={"number"}
              id={"sellingPrice"}
              name={"sellingPrice"}
              value={productForm?.sellingPrice}
              onChange={handleChange}
              placeholder={"Selling Price"}
              className={"p-2 bg-gray-100 border-2 rounded border-gray-300"}
            />
            {error.sellingPrice && (
              <p className="required-field-error">{error.sellingPrice}</p>
            )}
          </div>

          <div className=" flex flex-col gap-3">
            <label htmlFor="stock">
              Stock Quantity <span className="required">*</span>
            </label>
            <Input
              type={"number"}
              id={"stock"}
              name={"stock"}
              value={productForm?.stock}
              onChange={handleChange}
              placeholder={"Stock"}
              className={"p-2 bg-gray-100 border-2 rounded border-gray-300"}
            />
            {error.stock && (
              <p className="required-field-error">{error.stock}</p>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="w-full flex flex-col gap-3">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <TextArea
            name="description"
            id={"description"}
            value={productForm?.description}
            onChange={handleChange}
            placeholder="Description"
            className={`resize-none w-full min-h-[150px] p-2 border-2 outline-none rounded ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600 focus:border-gray-300"
                : "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600"
            }`}
          />

          {error.description && (
            <p className="required-field-error">{error.description}</p>
          )}
        </div>

        {/* Categories & Tags */}

        <div className="grid grid-cols-1 small-device:grid-cols-2 gap-4">
          <div className=" flex flex-col gap-3 ">
            <label htmlFor="category">
              Category <span className="required">*</span>
            </label>
            <Select
              name="category"
              id="category"
              className="p-2 bg-gray-100 border-2 rounded border-gray-300"
              onChange={handleChange}
              value={productForm?.category}
              itemArray={productCategory}
              displayName={"Select Category"}
            />

            {error.category && (
              <p className="required-field-error">{error.category}</p>
            )}
          </div>

          <div className="  flex flex-col gap-3">
            <label htmlFor="subCategory">
              Sub Category <span className="required">*</span>
            </label>

            <select
              name="subCategory"
              className={`p-2 bg-gray-100 border-2 rounded border-gray-300 outline-gray-400 outline-0 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600 focus:border-gray-300"
                  : "text-gray-900 bg-gray-100 border-gray-300 focus:border-gray-600"
              }  `}
              id="subCategory"
              disabled={
                productForm?.category === "others" || !productForm?.category
              }
              onChange={handleChange}
              value={productForm?.subCategory}
            >
              <option value="">Select Sub Category</option>
              {productCategory?.map((item) => {
                return item.value === productForm?.category
                  ? item.child?.map((subItem) => {
                      return (
                        <option key={subItem?.id} value={subItem?.value}>
                          {subItem.toCapitalize()}
                        </option>
                      );
                    })
                  : "";
              })}
            </select>

            {error.subCategory && (
              <p className="required-field-error">{error.subCategory}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export const Product = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productArr, setProductArr] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
          params: { filters, page: currentPage },
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
  const handleFiltersChange = (e) => {
    const { name, value } = e?.target || {};
    console.log(name, value);
    setFilters((prev) => {
      return {
        ...prev,
        [name]: value?.toString()?.trim(),
      };
    });
    setCurrentPage(1);
  };
  useEffect(() => {
    getAllProduct();
  }, [authToken, JSON.stringify(filters), currentPage]);

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
          <Link to={"add"}>
            <Button
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700"
              btntext="+ Add New Product"
            />
          </Link>
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
            onChange={handleFiltersChange}
          />
          <Select
            className="p-2 bg-gray-100 border-2 rounded border-gray-300 cursor-pointer"
            name="productStockStatus"
            itemArray={[
              { id: 1, value: "in stock" },
              { id: 2, value: "low stock" },
              { id: 3, value: "out of stock" },
            ]}
            onChange={handleFiltersChange}
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
              className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
              btntext="Previous"
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              disabled={currentPage === 1}
            />
            {/* <button className="px-3 py-1 bg-gray-300 rounded-md">
              Previous
            </button> */}

            {[...Array(totalPages)].map((item, index) => (
              <Button
                className={`px-3 py-1 rounded-md ${
                  index + 1 === currentPage
                    ? "bg-purple-600 text-white"
                    : "bg-gray-300"
                } `}
                key={index}
                btntext={index + 1}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}

            <Button
              className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
              btntext="Next"
              onClick={() => {
                setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
              }}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      </main>
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
      icon: "",
      redirect: "dashboard",
    },
    {
      id: 2,
      name: "Products",
      icon: "",
      redirect: "products",
    },
    {
      id: 3,
      name: "Orders",
      icon: "",
      redirect: "orders",
    },
    {
      id: 4,
      name: "Cutomers",
      icon: "",
      redirect: "/",
    },
    {
      id: 5,
      name: "Setting",
      icon: Settings,
      redirect: "setting",
    },
  ];
  // const ActiveTabComponent = tabs[activeTab]?.component;
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
        <Outlet />
        {/* Header */}
        {/* <ActiveTabComponent /> */}
      </div>
    </div>
  );
};

export default SellerDashBoard;
