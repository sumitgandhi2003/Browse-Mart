const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/userAuthentication");
const submitOrder = require("../controllers/orderController/submitOrder");
const getAllOrderByUserId = require("../controllers/orderController/getAllOrderByUserId");
const getOrderById = require("../controllers/orderController/getOrderById");
router.route("/submit-order").post(userAuthentication, submitOrder);
router.route("/get-all-order").post(userAuthentication, getAllOrderByUserId);
router.route("/get-order-details-by-id").post(userAuthentication, getOrderById);

module.exports = router;
