import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { Link } from "react-router-dom";
// imort all components
import Productcard from "../Productcard/Productcard";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
import ReviewForm from "../ReviewForm/ReviewForm";
import ReviewCard from "../ReviewCard/ReviewCard";
import ProductImage from "../ProductImage/ProductImage";
// import { SERVER_URL } from "../../config";
const SERVER_URL = process.env.REACT_APP_SERVER_URL.replace(";", "");

const ProductPage = ({ isAuthenticated, userDetail }) => {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [isReviewClicked, setIsReviewClicked] = useState(false);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);

  const handleClick = () => {
    setIsReviewClicked((isReview) => !isReview);
  };
  const getProductDataById = () => {
    // axios.get(API_URL + "products/" + id).then((response) => {
    //   setProductData(response.data);
    //   console.log(response);
    //   setIsDataFetch(true);
    // }); // Replace with actual category method to fetch category dynamically
    setIsDataFetch(false);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/get-product-by-id`,
      data: {
        productId: id,
        quantity: 1,
      },
    })
      .then((response) => {
        setProductData(response.data);

        setIsDataFetch(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRelatedProduct = () => {
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/get-related-product`,
      data: {
        category: productData.category,
        productId: id,
      },
    })
      .then((response) => {
        setRelatedProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // const getRelatedProductsData = (category) => {
  //   axios.get(API_URL + "products/category/" + category).then((response) => {
  //     console.log(response.data);
  //   });
  // };
  // eslint-disable-next-line
  useEffect(() => getProductDataById(), [id, isRefreshClicked]);
  // eslint-disable-next-line
  useEffect(() => getRelatedProduct(), [productData]);

  if (!isDataFetch && !isReviewClicked) return <Loader />; // Loading state while data is fetched.  Replace with your own loading component.  e.g., <Loading /> or <CircularProgress /> from material-ui.  Also, add error handling here.  e.g., axios.get().catch(error => console.error(error))

  return (
    productData &&
    relatedProduct && (
      // productData && (
      <div className="product-page-section">
        {/* product detail section */}

        <div className="flex p-3 gap-3 mobile:flex-col tablet:flex-row">
          {/* product image section */}
          <ProductImage productData={productData} />

          {/* product description section */}

          <div className="product-description w-1/2 mobile:w-full small-device:w-1/2 flex flex-col gap-3 ">
            <h1 className="product-name font-roboto font-bold text-2xl text-left">
              {productData?.name}
            </h1>
            <p className="product-description font-roboto">
              {productData?.description}
            </p>
            <p className="product-price text-left">
              ₹ {(productData?.price * 83.71).toFixed(2)}
            </p>

            <div className="buy-buttons  flex gap-3   ">
              <Button
                btntext={"Add to Cart"}
                className={
                  "bg-blue-200 rounded w-full font-roboto text-white p-2"
                }
              />
              <Button
                btntext={"Buy Now"}
                className={
                  "bg-blue-500 rounded w-full text-white p-2 shadow-md hover:scale-105 transition-all active:bg-blue-100"
                }
                onClick={() => {
                  if (isAuthenticated) swal("Buy Sucessfully!", "", "success");
                  else alert("Please Login First!");
                }}
              />
            </div>
          </div>
        </div>

        {/* related product section */}

        <div className="related-product-section p-4 mt-4">
          {relatedProduct.length > 0 && (
            <h2 className="text-4xl font-bold font-roboto w-max min-w-[10rem] mb-5">
              Related Products
            </h2>
          )}
          <div className="">
            <div
              className={` w-full grid grid-cols-5 mobile:grid-cols-2 small-device:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 gap-3 items-stretch`}
            >
              {relatedProduct.length > 0 &&
                relatedProduct.map((product, index) => {
                  return (
                    <Link to={`/product/${product?.["_id"]}`} key={index}>
                      <Productcard product={product} />
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        {/* review section  */}

        <div className="review-section p-4">
          <div className="flex gap-3 justify-between mb-3 items-center ">
            <h2 className="text-4xl p-2 font-roboto font-bold">Reviews</h2>
            <Button
              btntext={"add Review"}
              className={
                "rounded bg-blue-500 hover:bg-blue-700 p-2 text-white font-sans text-base w-max h-max"
              }
              onClick={handleClick}
            />
          </div>

          {/* all review section */}
          {productData?.review?.length > 0 && (
            <div className="flex gap-4 overflow-scroll mobile:flex-col mobile:overflow-hidden small-device:flex-row small-device:overflow-scroll ">
              {productData?.review?.map((review, index) => {
                return <ReviewCard review={review} key={index} />;
              })}
            </div>
          )}
        </div>

        {/* review popup  */}

        {isReviewClicked && (
          <ReviewForm
            onClose={handleClick}
            productId={productData?.["_id"]}
            setIsRefreshClicked={setIsRefreshClicked}
            userDetail={userDetail}
          />
        )}
      </div>
      // ).
    )
  );
};

export default ProductPage;
