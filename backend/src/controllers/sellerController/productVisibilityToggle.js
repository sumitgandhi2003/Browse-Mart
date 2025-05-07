import Product from "../../model/productSchema.js";
const productVisibilityToggle = async (req, res) => {
  const productId = req?.params?.id;
  const sellerId = req?.user?.sellerId?.toString();
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product?.sellerId?.toString() !== sellerId) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  product.isHide = !req?.body?.state;
  const updatedProduct = await product.save();

  res?.status(200).json({
    message: "Product visibility toggled successfully",
    product: {
      ...updatedProduct._doc,
      isHide: !updatedProduct.isHide,
    },
  });
};

export default productVisibilityToggle;
