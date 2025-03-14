const Product = require("../../model/productSchema");
const Order = require("../../model/orderSchema");

const getRelatedProduct = async (req, res) => {
  const { category, id } = req?.query;

  try {
    const product = await Product.find({
      category: category,
      _id: { $ne: id },
      isHide: false,
    }).limit(5);
    const modifiedProducts = product
      // ?.filter((product) => !product?.isHide)
      ?.map((product) => {
        let totalStarRating = 0;
        product?.review?.map((review) => {
          totalStarRating += review?.rating;
        });
        return {
          id: product?._id,
          name: product?.name,
          price: product?.price,
          mrpPrice: product?.mrpPrice,
          sellingPrice: product?.sellingPrice,
          description: product?.description,
          image: product?.image?.[0],
          category: product?.category,
          stock: product?.stock > 0,
          rating: Number(totalStarRating / product?.review?.length),
        };
      });
    res.json({ message: "data fetched", product: modifiedProducts });
    // res.json({message:"data fetched"});
  } catch (error) {
    console.error(error);
  }
};

module.exports = getRelatedProduct;
