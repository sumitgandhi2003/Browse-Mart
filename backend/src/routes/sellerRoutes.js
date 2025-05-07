import express from "express";
const router = express.Router();

import userAuthentication from "../middleware/userAuthentication.js";
import sellerAuthentication from "../middleware/sellerAuthentication.js";

import sellerRegistration from "../controllers/sellerController/sellerRegistration.js";
import dashBoard from "../controllers/sellerController/dashBoard.js";
import getAllProductUsingSellerId from "../controllers/sellerController/getAllProductUsingSellerId.js";
import productVisibilityToggle from "../controllers/sellerController/productVisibilityToggle.js";

router.route("/register").post(userAuthentication, sellerRegistration);
router
  .route("/seller-dashboard")
  .get(userAuthentication, sellerAuthentication, dashBoard);
router
  .route("/get-all-product")
  .get(userAuthentication, sellerAuthentication, getAllProductUsingSellerId);
router.patch(
  "/product/visibilty-toggle/:id",
  userAuthentication,
  sellerAuthentication,
  productVisibilityToggle
);

export default router;
