const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/userAuthentication");
const sellerRegistration = require("../controllers/sellerController/sellerRegistration");
const dashBoard = require("../controllers/sellerController/dashBoard");
const sellerAuthentication = require("../middleware/sellerAuthentication");
const getAllProductUsingSellerId = require("../controllers/sellerController/getAllProductUsingSellerId");
const productVisibilityToggle = require("../controllers/sellerController/productVisibilityToggle");

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

module.exports = router;
