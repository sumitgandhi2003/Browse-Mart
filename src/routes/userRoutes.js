const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/userAuthentication");
const userProfile = require("../controllers/userController/userProfile");
const changePassword = require("../controllers/userController/changePassword");
const updateProfile = require("../controllers/userController/updateProfile");
const addToCart = require("../controllers/userController/addToCart");
const getCartItems = require("../controllers/userController/getCartItems");
const updateCart = require("../controllers/userController/updateCart");
const addRemoveItemToWishList = require("../controllers/userController/addRemoveItemtoWishList");
const getAllWishList = require("../controllers/userController/getAllWishList");
// User routes
router.route("/profile").post(userAuthentication, userProfile);
router.route("/change-password").post(changePassword);
router.route("/update-profile").post(userAuthentication, updateProfile);
router.route("/add-to-cart").post(userAuthentication, addToCart);
router.route("/get-cart-items").post(userAuthentication, getCartItems);
router.route("/update-cart").post(userAuthentication, updateCart);
router
  .route("/add-to-wishlist")
  .post(userAuthentication, addRemoveItemToWishList);
router.route("/get-wishlist").post(userAuthentication, getAllWishList);
module.exports = router;
