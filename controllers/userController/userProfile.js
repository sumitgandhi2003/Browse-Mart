const User = require("../../model/userSchema");
const jwt = require("jsonwebtoken");

const userProfile = async (req, res, next) => {
  try {
    const foundedUser = req.user;
    const userDetail = {
      id: foundedUser?._id,
      name: foundedUser?.name,
      email: foundedUser?.email,
      phoneNumber: foundedUser?.phoneNumber,
      profilePic: foundedUser?.profilePic,
      userType: foundedUser?.userType,
      address: foundedUser?.address,
      shippingAddress: foundedUser?.shippingAddress,
      cartCount: foundedUser?.cart?.length || 0,
    };
    return res.status(200).json({ mesaage: "data Found", userDetail });
  } catch (error) {
    console.log("Can't get user Detail", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = userProfile;
