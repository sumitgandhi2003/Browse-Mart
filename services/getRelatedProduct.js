const Product = require("../model/productSchema");
getRelatedProduct = async (req, res) => {
  try {
    const product = await Product.find({
      category: req.body.category,
      _id: { $ne: req.body.productId },
    }).limit(5);
    res.json(product);
  } catch (error) {
    console.error(error);
  }
};

module.exports = getRelatedProduct;
