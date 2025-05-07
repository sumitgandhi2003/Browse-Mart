import express from "express";
const router = express.Router();

import userAuthentication from "../middleware/userAuthentication.js";
import submitOrder from "../controllers/orderController/submitOrder.js";
import getAllOrderByUserId from "../controllers/orderController/getAllOrderByUserId.js";
import getOrderById from "../controllers/orderController/getOrderById.js";
router.route("/submit-order").post(userAuthentication, submitOrder);
router.route("/get-all-order").post(userAuthentication, getAllOrderByUserId);
router.route("/get-order-details-by-id").post(userAuthentication, getOrderById);

export default router;
