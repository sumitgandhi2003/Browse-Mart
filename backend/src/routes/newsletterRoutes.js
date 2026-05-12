import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import checkUserStatus from "../middleware/checkUserStatus.js";
import adminAuthentication from "../middleware/adminAuthentication.js";

import subscribeNewsletter from "../controllers/newsletterController/subscribeNewsletter.js";
import unsubscribeNewsletter from "../controllers/newsletterController/unsubscribeNewsletter.js";
import sendNewsletter from "../controllers/newsletterController/sendNewsletter.js";
import getSubscribers from "../controllers/newsletterController/getSubscribers.js";

const router = express.Router();

// Public Routes
router.post("/subscribe", subscribeNewsletter);
router.get("/unsubscribe", unsubscribeNewsletter);

// Admin Protected Routes
router.use(userAuthentication);
router.use(checkUserStatus);
router.use(adminAuthentication);

router.post("/send", sendNewsletter);
router.get("/subscribers", getSubscribers);

export default router;
