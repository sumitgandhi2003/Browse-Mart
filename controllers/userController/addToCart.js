const Product = require("../../model/productSchema");
const User = require("../../model/userSchema");
const mongoose = require("mongoose");
const getCartItems = require("./getCartItems");
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user;
    // console.log(user);
    // user.cart = [];
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const existingProduct = user.cart.find(
      (item) => item?.productId.toString() === productId.toString()
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    console.log(user.cart);
    await user.save();
    await res.json({ message: "Hello" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = addToCart;
