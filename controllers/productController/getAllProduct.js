const Product = require("../../model/productSchema");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) return res.status(404).send("Product not found");
    return res.json(products);
  } catch (error) {
    console.error(error);
  }
};
module.exports = getAllProduct;
