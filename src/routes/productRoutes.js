import express from "express";
const router = express.Router();

import addProduct from "../controllers/productController/addProduct.js";
import getAllProduct from "../controllers/productController/getAllProduct.js";
import getProductById from "../controllers/productController/getProductById.js";
import getRelatedProduct from "../controllers/productController/getRelatedProduct.js";

import submitReview from "../controllers/reviewController/submitReview.js";

import userAuthentication from "../middleware/userAuthentication.js";
router.route("/add-product").post(userAuthentication, addProduct);
router.route("/get-all-products").get(getAllProduct);
router.route("/get-related-product").get(getRelatedProduct);
router.route("/:id").get(getProductById);

router.route("/submit-review").post(userAuthentication, submitReview);

export default router;
