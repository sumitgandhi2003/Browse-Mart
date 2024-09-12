const Product = require("../model/productSchema");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    console.error(error);
  }
};
module.exports = getAllProduct;
