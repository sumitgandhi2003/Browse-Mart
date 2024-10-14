import axios from "axios";
import swal from "sweetalert";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const handleAddToCart = (
  userDetail,
  productId,
  authToken,
  setProductAdding
) => {
  if (
    userDetail === "" ||
    userDetail === undefined ||
    userDetail === null ||
    authToken
  ) {
    alert("Please login First!");
    return;
  }
  setProductAdding((prev) => !prev);
  axios({
    method: "POST",
    url: `${SERVER_URL}/api/user/add-to-cart`,
    data: {
      userId: userDetail.id,
      productId: productId,
      quantity: 1,
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      const { status } = response;
      if (status === 200) {
        setProductAdding((prev) => !prev);
        swal(
          "Product Added!",
          "Your product is Added to Cart you can proceed next",
          "success"
        );
      }
    })
    .catch((error) => {
      const { status, data } = error.response;
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
