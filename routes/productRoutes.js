const express = require("express");
const router = express.Router();
const addProduct = require("../controllers/productController/addProduct");
const getAllProduct = require("../controllers/productController/getAllProduct");
const getProductById = require("../controllers/productController/getProductById");
const getRelatedProduct = require("../controllers/productController/getRelatedProduct");
const submitReview = require("../controllers/reviewController/submitReview");

router.route("/add-product").post(addProduct);
router.route("/get-all-products").get(getAllProduct);
router.route("/get-product-by-id").post(getProductById);
router.route("/get-related-product").post(getRelatedProduct);

router.post("/submit-review", submitReview);

module.exports = router;
