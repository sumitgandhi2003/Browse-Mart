import axios from "axios";
import swal from "sweetalert";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const handleAddToCart = (
  userDetail,
  productId,
  authToken,
  setProductAdding
) => {
  if (userDetail === "" || userDetail === undefined || userDetail === null) {
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
      console.log(response);
      setProductAdding((prev) => !prev);
      swal(
        "Product Added!",
        "Your product is Added to Cart you can proceed next",
        "success"
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
