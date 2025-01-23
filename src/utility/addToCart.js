import axios from "axios";
import swal from "sweetalert";
// import { Navigate, useNavigate } from "react-router-dom";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const handleAddToCart = (
  userDetail,
  productId,
  authToken,
  setProductAdding,
  navigate,
  setCartCount
) => {
  if (
    userDetail === "" ||
    userDetail === undefined ||
    userDetail === null ||
    authToken === "" ||
    authToken === undefined ||
    authToken === null
  ) {
    alert("Please login First!");
    return;
  }
  setProductAdding((prev) => !prev);
  axios({
    method: "POST",
    url: `${SERVER_URL}/api/user/add-to-cart`,
    data: {
      userId: userDetail?.id,
      productId: productId,
      quantity: 1,
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      const { status, data } = response;
      if (status === 200) {
        setProductAdding((prev) => !prev);
        swal(
          {
            title: "Product Added!",
            text: "Your product is Added to Cart you can proceed next",
            icon: "success",
            buttons: {
              cancel: {
                text: "Continue Shopping",
                value: null,
                visible: true,
                className: "btn-glow",
                closeModal: true,
              },
              confirm: {
                text: "View Cart",
                value: true,
                className: "go-to-cart-btn confirm-btn",
                closeModal: true,
              },
            },
          }
          // "Product Added!",
          // "Your product is Added to Cart you can proceed next",
          // "success"
        ).then((value) => {
          if (value) {
            // window.location.href = "/cart";
            navigate("/cart");
          }
        });
        setCartCount(() => data?.cartCount);
      }
    })
    .catch((error) => {
      const { status, data } = error?.response;
      if (status === 401) {
        alert("Unauthorized Access! Please Login First");
      } else if (status === 404) {
        alert(`Product not found with id ${productId}`);
      } else if (status === 500) {
        alert("Internal Server Error");
      }
      setProductAdding((prev) => !prev);
      console.log(error);
    });
};
