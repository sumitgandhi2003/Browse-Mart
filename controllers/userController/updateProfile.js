const User = require("../../model/productSchema");
const jwt = require("jsonwebtoken");

const updateProfile = async (req, res, next) => {
  try {
    const { email, name, phoneNumber, address } = req?.body;
    const foundedUser = req?.user;
    const user = req?.body;
    emailExist = await User?.findOne({ email: email });
    if (
      emailExist &&
      emailExist?._id?.toString() !== foundedUser?._id?.toString()
    ) {
      return res?.status(400)?.json({ message: "Email already exists" });
    }
    foundedUser.name = name || foundedUser?.name;
    foundedUser.email = email || foundedUser?.email;
    foundedUser.phoneNumber = phoneNumber || foundedUser?.phoneNumber;
    foundedUser.address = address || foundedUser?.address;
    await foundedUser?.save();
    console?.log(foundedUser);
    res?.json({ message: "Hello" });
  } catch (error) {
    console?.log("Can't get user Detail", error);
    return res?.status(500)?.json({ message: "Internal Server Error" });
  }
};

module.exports = updateProfile;
