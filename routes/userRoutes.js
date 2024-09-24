const express = require("express");
const router = express.Router();
const userLogin = require("../controllers/userController/userLogin");
const createUser = require("../controllers/userController/createUser");
const userProfile = require("../controllers/userController/userProfile");
const changePassword = require("../controllers/userController/changePassword");

router.route("/register").post(createUser);
router.route("/login").post(userLogin);
router.route("/profile").post(userProfile);
router.route("/change-password").post(changePassword);

module.exports = router;
