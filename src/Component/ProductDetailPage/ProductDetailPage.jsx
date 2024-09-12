import React, { useEffect, useState } from "react";
import Productcard from "../Productcard/Productcard";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
// import { SERVER_URL } from "../../config";
import { Link } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");

const ProductDetailPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const getProductData = () => {
    // axios.get(API_URL + "products/" + id).then((response) => {
    //   setProductData(response.data);
    //   console.log(response);
    //   setIsDataFetch(true);
    // }); // Replace with actual category method to fetch category dynamically
    axios({
      method: "post",
      url: `${SERVER_URL}/get-product-by-id`,
      data: {
        productId: id,
        quantity: 1,
      },
    })
      .then((response) => {
        // console.log(response.data);
        setProductData(response.data);
        setIsDataFetch(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRelatedProduct = () => {
    try {
      axios({
        method: "post",
        url: `${SERVER_URL}/get-related-product`,
        data: {
          category: productData?.category,
          productId: id,
        },
      }).then((response) => setRelatedProduct(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  // const getRelatedProductsData = (category) => {
  //   axios.get(API_URL + "products/category/" + category).then((response) => {
  //     console.log(response.data);
  //   });
  // };
  //https://fakestoreapi.com/products/category/jewelery
  useEffect(() => getProductData(), [id]);
  useEffect(() => getRelatedProduct(), [productData]);
  if (!isDataFetch) return <Loader />; // Loading state while data is fetched.  Replace with your own loading component.  e.g., <Loading /> or <CircularProgress /> from material-ui.  Also, add error handling here.  e.g., axios.get().catch(error => console.error(error))

  return (
    // productData && (
    <div>
      <div className="flex p-3 gap-3">
        <div className="img-container w-1/2">
          <img
            src={productData?.image}
            className="w-[80%] object-contain aspect-square p-2 border"
            alt=""
          />
        </div>
        <div className="product-description w-1/2 flex flex-col gap-3 ">
          <h1 className="product-name font-bold text-2xl text-left">
            {productData?.name}
          </h1>
          <p className="product-description text-left w-[90%]">
            {productData?.description}
          </p>
          <p className="product-price text-left">
            ₹ {(productData?.price * 83.71).toFixed(2)}
          </p>
          <div className="buy-buttons flex gap-3   ">
            {/* <div className="w-full bg-green-700 rounded text-white p-2">
            Add To Cart
            </div> */}
            <Button
              btntext={"Add to Cart"}
              className={"bg-blue-200 rounded w-full text-white p-2"}
            />
            <Button
              btntext={"Buy Now"}
              className={
                "bg-blue-500 rounded w-full text-white p-2 shadow-md hover:scale-105 transition-all active:bg-blue-100"
              }
              click={() => alert("Buy Sucessfully!")}
            />
          </div>
        </div>
      </div>

      <div className="related-product-section p-4">
        {relatedProduct.length > 0 && (
          <h2 className="text-2xl font-bold font-mono w-max min-w-[10rem]">
            Related Products
          </h2>
        )}
        <div className="m-auto">
          <div className={` w-full grid grid-cols-5 gap-3 items-stretch`}>
            {relatedProduct.length > 0 &&
              relatedProduct.map((product, index) => {
                return (
                  <div className="">
                    <Link to={`/product/${product?.["_id"]}`} key={index}>
                      <Productcard product={product} />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="review-section p-4">
        <div className="flex gap-3">
          <h2 className="text-3xl p-2 font-mono font-bold">reviews</h2>
          <Button
            btntext={"add Review"}
            className={
              "rounded bg-blue-500 hover:bg-blue-700 px-2 text-white font-sans"
            }
          />
        </div>
      </div>
    </div>
    // )
  );
};

export default ProductDetailPage;
