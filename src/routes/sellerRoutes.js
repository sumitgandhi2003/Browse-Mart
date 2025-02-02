const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/userAuthentication");
const sellerRegistration = require("../controllers/sellerController/sellerRegistration");

router.route("/register").post(userAuthentication, sellerRegistration);

module.exports = router;
