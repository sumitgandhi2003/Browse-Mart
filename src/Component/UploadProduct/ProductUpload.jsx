import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import swal from "sweetalert";
import { useDropzone } from "react-dropzone";
import ImagePreview from "./ImagePreview";
import { productCategory, productBrands } from "../../utility/constant";
// import cloudinary from "../../cloudinary.config";
import { Cloudinary, CloudinaryConfig } from "@cloudinary/url-gen";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY;
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const API_SECRET = process.env.REACT_APP_CLOUDINARY_API_SECRET;
const ProductUpload = ({ authToken }) => {
  const [productUploading, setProductUploading] = useState(false);
  const [initialProductDetail] = useState({
    name: "",
    price: "",
    image: [],
    category: "",
    description: "",
    stock: null,
  });
  const [productDetails, setProductDetails] = useState(initialProductDetail);

  const [image, setImage] = useState([]);
  const [error, setError] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
    stock: "",
  });

  const onDrop = (accepted) => {
    setImage((prev) => [...prev, ...accepted]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImage((prev) => [...prev, ...files]);
  };
  const saveImageToCloudinary = async () => {
    try {
      const uploadPromises = image.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "mycloud");
        formData.append("cloud_name", CLOUD_NAME);
        const response = await axios({
          method: "POST",
          url: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          data: formData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        console.log(response?.data?.secure_url?.toString());
        return response?.data?.secure_url?.toString();
      });

      const imageUrl = await Promise.all(uploadPromises);
      console.log(imageUrl);
      const updatedProductDetail = {
        ...productDetails,
        image: [...productDetails?.image, ...imageUrl],
      };
      setProductDetails(updatedProductDetail);
      return updatedProductDetail;
    } catch (error) {
      console.log(error);
    }
  };
  const uploadProduct = async (detail) => {
    console.log(API_KEY);
    axios({
      method: "POST",
      url: `${SERVER_URL}/api/product/add-product`,
      data: detail,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 201) {
          swal(
            "Product successfully uploaded",
            "your product is added",
            "success"
          ).then(() => {
            setProductDetails(initialProductDetail);
            setImage(() => []);
          });
          // console.log("Product added successfully", data);
        }
        setProductUploading(false);
        // setProductDetails({});
        // setError({});
        // setImage([]);
      })
      .catch((error) => {
        const { data, status } = error?.response;
        setProductUploading(false);
        if (status === 500) {
          swal("Error uploading!", data?.message, "error");
        }
        console.log("Error uploading product", error);
        console.log(productDetails);
      });
  };

  const handleSubmit = async (e) => {
    setProductUploading((prev) => !prev);
    e.preventDefault();
    const updatedProductDetail = await saveImageToCloudinary();
    console.log(updatedProductDetail);
    if (updatedProductDetail) {
      await uploadProduct(updatedProductDetail);
    }
  };

  return (
    <div className="w-11/12 p-3">
      <form
        action=""
        className="h-full flex flex-col gap-3 overflow-y-scroll"
        onSubmit={handleSubmit}
      >
        <div
          {...getRootProps()}
          className={`w-full min-h-[200px] flex flex-col justify-center items-center border-2 ${
            image.length > 0 ? "hidden" : "flex"
          } ${
            isDragActive
              ? "border-blue-500 border-solid"
              : "border-gray-500 border-dashed"
          }  rounded gap-3 overflow-scroll`}
        >
          {isDragActive ? (
            <span>Drop Here</span>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <span>
                <FiUpload className="text-3xl" />
              </span>
              <span className="font-roboto">
                <span>Drag & Drop or </span>
                <span>
                  <label
                    htmlFor="image"
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Choose file
                  </label>
                  <Input
                    type={"file"}
                    id={"image"}
                    name={"image"}
                    // value={productDetails.image}
                    className={"hidden"}
                    multiple={true}
                    accept={"image/*"}
                    onChange={handleFileChange}
                  />
                </span>
                <span> to upload</span>
              </span>
            </div>
          )}
        </div>
        {image.length > 0 && <ImagePreview image={image} />}

        <div className=" product-detail-container  flex flex-col gap-5">
          <div className="w-full flex gap-3">
            <div className="w-1/2 flex flex-col gap-3">
              <label htmlFor="name">Product Name</label>
              <Input
                type={"text"}
                id={"name"}
                name={"name"}
                value={productDetails?.name}
                onChange={handleChange}
                placeholder={"Product Name"}
                className="p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
              />
              {error.name && <p>{error.name}</p>}
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <label htmlFor="stock">Brand</label>
              <select
                name="brand"
                id="brand"
                className="p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
              >
                <option value="">Select Brand</option>
                {productBrands?.map((item) => {
                  return (
                    <option key={item?.id} value={item?.value}>
                      {item.value.capitalise()}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="w-full flex gap-3">
            <div className="w-1/2 flex flex-col gap-3 ">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                className="p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                onChange={handleChange}
                value={productDetails?.category}
              >
                <option value="">Select Category</option>
                {productCategory?.map((item) => {
                  return (
                    <option key={item?.id} value={item?.value}>
                      {item.value.capitalise()}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* {productDetails?.category && */}
            {/* // productDetails?.category !== "others" && ( */}
            <div className="w-1/2  flex flex-col gap-3">
              <label htmlFor="subCategory">Sub Category</label>
              <select
                name="subCategory"
                className="p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                id="subCategory"
                disabled={
                  productDetails?.category === "others" ||
                  !productDetails?.category
                }
                onChange={handleChange}
              >
                <option value="">Select Sub Category</option>
                {productCategory?.map((item) => {
                  return item.value === productDetails?.category
                    ? item.child?.map((subItem) => {
                        return (
                          <option key={subItem?.id} value={subItem?.value}>
                            {subItem.capitalise()}
                          </option>
                        );
                      })
                    : "";
                })}
              </select>
            </div>
            {/* // )} */}
            {error.category && <p>{error.category}</p>}
          </div>
          <div className="w-full flex gap-3">
            <div className="w-1/2 flex flex-col gap-3">
              <label htmlFor="price">Price</label>
              <Input
                type={"number"}
                id={"price"}
                name={"price"}
                value={productDetails?.price}
                onChange={handleChange}
                placeholder={"Price"}
                className={
                  "p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
                }
              />
              {error.price && <p>{error.price}</p>}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex flex-col gap-3">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id={"description"}
                value={productDetails?.description}
                onChange={handleChange}
                placeholder="Description"
                className="resize-none w-full min-h-[150px] p-2 bg-gray-100 border-2 rounded border-gray-300 outline-none"
              ></textarea>
              {error.description && <p>{error.description}</p>}
            </div>
          </div>
        </div>
        <div className="">
          <Button
            btntext={"Upload"}
            loading={productUploading}
            className={"w-full text-white bg-blue-500 p-2 rounded"}
          />
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
