const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/userAuthentication");
const userLogin = require("../controllers/userController/userLogin");
const createUser = require("../controllers/userController/createUser");
const userProfile = require("../controllers/userController/userProfile");
const changePassword = require("../controllers/userController/changePassword");
const updateProfile = require("../controllers/userController/updateProfile");

router.route("/register").post(createUser);
router.route("/login").post(userLogin);
router.route("/profile").post(userAuthentication, userProfile);
router.route("/change-password").post(changePassword);
router.route("/update-profile").post(userAuthentication, updateProfile);

module.exports = router;
