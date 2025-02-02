const Product = require("../../model/productSchema");
const getAllWishList = async (req, res) => {
  try {
    // const activeUser = req.user;
    const wishList = await req.user?.wishlist;
    // console.log(wishList);
    if (wishList?.length === 0) {
      return res.status(204).json({
        success: true,
        message: "WishList is empty",
      });
    }
    const wishListProducts = await Promise?.all(
      wishList?.map(async (item) => {
        const product = await Product?.findById(item?.productId);
        return {
          id: product?._id || item?.productId || item?.id,
          name: product?.name,
          price: product?.price,
          description: product?.description,
          image: product?.image?.[0],
          category: product?.category,
          stock: product?.stock,
          //   rating: Number(totalStarRating / product?.review?.length),
          mrpPrice: product?.mrpPrice,
          sellingPrice: product?.sellingPrice,
        };
      })
    );
    // console.log(wishListProducts);
    return res.status(200).json({
      success: true,
      message: "WishList Products",
      wishListProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = getAllWishList;
