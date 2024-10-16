const Product = require("../../model/productSchema");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0)
      return res?.status(200).json({ message: "Product not found" });
    return res?.status(200).json({ message: "data fetched", products });
  } catch (error) {
    res?.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};
module.exports = getAllProduct;
