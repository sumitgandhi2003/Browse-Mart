const User = require("../../model/userSchema");
const Product = require("../../model/productSchema");
const mongoose = require("mongoose");
const addRemoveItemToWishList = async (req, res) => {
  try {
    const activeUser = req?.user;
    const { productId } = req?.body;
    const isProductExist = await Product?.findById(
      new mongoose.Types.ObjectId(productId)
    );
    if (!isProductExist) {
      return res?.status(404)?.json({
        success: false,
        message: "Product No Found",
      });
    }
    const isAlreadyExist = await activeUser?.wishlist?.some(
      (item) => item?.productId?.toString() === productId?.toString()
    );
    if (isAlreadyExist) {
      activeUser.wishlist = await activeUser?.wishlist?.filter(
        (item) => item?.productId?.toString() !== productId?.toString()
      );
      await activeUser.save();
      return res?.status(200)?.json({
        success: true,
        isRemoved: true,
        message: "Item Removed from Shopping List!",
      });
    }
    await activeUser.wishlist.push({ productId });
    await activeUser.save();

    res?.status(201)?.json({
      success: true,
      isItem: true,
      message: "Added Successfully!",
    });
  } catch (error) {
    console.log(error);
    return res?.status(500)?.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
module.exports = addRemoveItemToWishList;
