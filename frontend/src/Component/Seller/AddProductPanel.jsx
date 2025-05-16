import { useState } from "react";
import { useTheme } from "../../Context/themeContext";
import { Button, Input, Select, TextArea } from "../../LIBS";
import {
  checkValidation,
  initialProductDetails,
  productBrands,
  productCategory,
} from "../../utility/constant";

export const AddProductPanel = () => {
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

export default AddProductPanel;
