const Product = require("../../model/productSchema");
const User = require("../../model/userSchema");
const getAllProduct = async (req, res) => {
  try {
    const { activeUserId, searchQuery, searchCategory } = req?.query;
    const activeUser = activeUserId ? await User.findById(activeUserId) : null;
    // const isAddedToWislist = await activeUser?.wishlist?.some(
    //   (item) => item?.productId?.toString() === "670c1ca6dc874450c9d49338"
    // );
    // console.log("line 9", isAddedToWislist);
    // const products = await Product.find({name:searchQuery});
    const products = await Product.find(
      searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery?.toString(), $options: "i" } },
              {
                description: { $regex: searchQuery?.toString(), $options: "i" },
              },
            ],
          }
        : searchCategory
        ? {
            $or: [
              {
                category: { $regex: searchCategory?.toString(), $options: "i" },
              },
              {
                subCategory: {
                  $regex: searchCategory?.toString(),
                  $options: "i",
                },
              },
            ],
          }
        : {}
    );
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
          stock: product?.stock > 0,
          rating: Number(totalStarRating / product?.review?.length),
          ratingNumber: product.review?.length || null,
          mrpPrice: product?.mrpPrice,
          sellingPrice: product?.sellingPrice,
          isAddedToWislist: activeUserId
            ? activeUser?.wishlist?.some(
                (item) =>
                  item?.productId?.toString() === product?._id?.toString()
              )
            : false,
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
