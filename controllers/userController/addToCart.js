const Product = require("../../model/productSchema");
const User = require("../../model/userSchema");
const mongoose = require("mongoose");
const getCartItems = require("./getCartItems");
const Order = require("../../model/orderSchema");
const addToCart = async (req, res, next) => {
  try {
    // const { _id } = req.user;
    // console.log(_id);
    // const orders = await Order.find({ userId: _id })
    //   .populate("userId", "name email") // Populate customer data
    //   .exec();
    // console.log(orders);
    const { productId, quantity } = req.body;
    const user = req.user;
    // console.log(user);
    // user.cart = [];
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const existingProduct = user.cart.find(
      (item) => item?.productId?.toString() === productId?.toString()
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    await user.save();
    await res?.status(200)?.json({ message: "Product Added!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

module.exports = addToCart;
