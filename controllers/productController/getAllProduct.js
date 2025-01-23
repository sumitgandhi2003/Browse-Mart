const Product = require("../../model/productSchema");

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0)
      return res?.status(200).json({ message: "Product not found" });
    const modifiedProducts = products
      ?.filter((product) => !product?.isHide)
      ?.map((product) => {
        let totalStarRating = 0;
        product?.review?.map((review) => {
          totalStarRating += review?.rating;
        });
        return {
          id: product?._id,
          name: product?.name,
          price: product?.price,
          description: product?.description,
          image: product?.image?.[0],
          category: product?.category,
          stock: product?.stock,
          rating: Number(totalStarRating / product?.review?.length),
          mrpPrice: product?.mrpPrice,
          sellingPrice: product?.sellingPrice,
        };
      });
    return res
      ?.status(200)
      .json({ message: "data fetched", products: modifiedProducts });
  } catch (error) {
    res?.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};
module.exports = getAllProduct;
