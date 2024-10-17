import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { FaShare } from "react-icons/fa";
import Productcard from "../Productcard/Productcard";
import Loader from "../Loader/Loader";
import Button from "../Button/Button";
import ReviewForm from "../ReviewForm/ReviewForm";
import ReviewCard from "../ReviewCard/ReviewCard";
import ProductImage from "../ProductImage/ProductImage";
import { socialMedia } from "../../utility/constant";
import { handleAddToCart } from "../../utility/addToCart";
// import { SERVER_URL } from "../../config";
const pageNotFind = require("../../assets/images/pageNotFind.jpg");
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ProductPage = ({ isAuthenticated, userDetail, authToken }) => {
  const currentURL = window.location.href;
  const { productId } = useParams();
  const [productData, setProductData] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [isReviewClicked, setIsReviewClicked] = useState(false);
  const [isRefreshClicked, setIsRefreshClicked] = useState(false);
  const [isShareShow, setIsShareShow] = useState(false);
  const [productAdding, setProductAdding] = useState(false);
  const [isError, setIsError] = useState({});
  const message = `🚀 Exciting News! 🌟\n\nI just discovered the **${productData.name}** and I can't stop raving about it! 🎉\n\n✨ **Why You’ll Love It**:\n- Top-notch quality that speaks for itself!\n- Perfect for tech enthusiasts.\n- Limited-time offer: Don't miss out! 🕒\n\n👉 Check it out here: ${currentURL}\n\n💬 Let me know what you think, and tag your friends who need this in their lives!`;

  const handleClick = () => {
    setIsReviewClicked((isReview) => !isReview);
  };
  const getProductDataById = () => {
    setIsDataFetch(false);
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/get-product-by-id`,
      data: {
        productId: productId,
        quantity: 1,
      },
    })
      .then((response) => {
        const { data, status } = response;
        if (status === 200) {
          setProductData(data?.product);
        } else {
          // Handle error
        }
        setIsDataFetch(true);
      })
      .catch((error) => {
        const { data, status } = error?.response;
        if (status === 404) {
          setIsError({ error: data?.message, status: status });
          setIsDataFetch(true);
        }
        // swal(`Oops! Error ${status}`, data?.message, "error");
        // console.error(error);
      });
  };

  const getRelatedProduct = () => {
    axios({
      method: "post",
      url: `${SERVER_URL}/api/product/get-related-product`,
      data: {
        category: productData.category,
        productId: productId,
      },
    })
      .then((response) => {
        setRelatedProduct(response?.data?.product);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // eslint-disable-next-line
  useEffect(() => getProductDataById(), [productId, isRefreshClicked]);
  // eslint-disable-next-line
  useEffect(() => getRelatedProduct(), [productData]);

  if (!isDataFetch && !isReviewClicked) return <Loader />; // Loading state while data is fetched.  Replace with your own loading component.  e.g., <Loading /> or <CircularProgress /> from material-ui.  Also, add error handling here.  e.g., axios.get().catch(error => console.error(error))
  if (isError.error) {
    return (
      <div className="w-full loader-container flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <img
            src={pageNotFind}
            className="h-[400px] rounded-3xl"
            alt="Page Not Found"
          />
          <div className="font-roboto text-ellipsis text-lg">
            <p>Ohh....</p>
            <p className="">{isError?.error}!</p>
          </div>
        </div>
      </div>
    );
  }
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

          <div className="product-description w-1/2 mobile:w-full tablet:w-1/2 flex flex-col gap-3 ">
            <h1 className="product-name font-roboto font-bold text-2xl text-left">
              {productData?.name}
            </h1>
            <p className="product-description font-roboto">
              {productData?.description}
            </p>
            <p className="product-price text-left">₹ {productData?.price}</p>

            <div className="buy-buttons  flex gap-3   ">
              <Button
                btntext={"Add to Cart"}
                className={
                  "bg-blue-200 rounded w-full font-roboto text-white p-2"
                }
                onClick={() =>
                  handleAddToCart(
                    userDetail,
                    productId,
                    authToken,
                    setProductAdding
                  )
                }
                loading={productAdding}
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

            {/* Share Button */}
            <div className="flex flex-col mobile:flex-row tablet:flex-col gap-2">
              <span onClick={() => setIsShareShow((prev) => !prev)}>
                <FaShare className="text-3xl cursor-pointer p-1 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white" />
              </span>
              {isShareShow && (
                <div className="flex flex-col mobile:flex-row tablet:flex-col gap-2 w-min  h-min">
                  {socialMedia.map((media, index) => (
                    <div className="group relative">
                      <span
                        className={`bg-blue-400 absolute bottom-0 left-10 mobile:-left-3 mobile:-bottom-8  tablet:left-10 tablet:bottom-0 text-white text-xs hidden grou p-1 rounded group-hover:block`}
                      >
                        {media.name}
                      </span>
                      <a
                        href={media.link + encodeURIComponent(message)}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-media-icon "
                      >
                        {media.icon}
                      </a>
                    </div>
                  ))}
                </div>
              )}
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
                    <Link to={`/product/${product?.id}`} key={index}>
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
            {/* <p className="text-sm text-gray-500">
              {productData?.review?.length} reviews
            </p> */}
            {userDetail && authToken && (
              <Button
                btntext={"Write a Review"}
                className={
                  "rounded bg-blue-500 hover:bg-blue-700 p-2 text-white font-roboto text-sm w-max h-max"
                }
                onClick={handleClick}
              />
            )}
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
            authToken={authToken}
          />
        )}
      </div>
      // ).
    )
  );
};

export default ProductPage;
