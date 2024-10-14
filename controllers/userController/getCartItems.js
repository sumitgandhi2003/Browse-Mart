const Product = require("../../model/productSchema");
const getCartItems = async (req, res, next) => {
  try {
    const cartProduct = [];
    const cartItem = await req?.user?.cart;
    for (let i = 0; i < cartItem.length; i++) {
      const product = await Product?.findById({ _id: cartItem[i]?.productId });
      //   console.log(product);
      cartProduct?.push({
        item: { ...product?._doc },
        quantity: cartItem[i]?.quantity,
      });
    }
    // cartItem?.map(async (item, inde) => {
    //   const product = await Product.findById(item.productId);
    //    cartProduct.push({ ...product, quantity: item.quantity });
    //   //   console.log(product);
    // });
    // console.log(cartItem);
    res
      ?.status(200)
      ?.json({ cartProduct, message: "Data Fetch Successfully!" });
  } catch (error) {
    //   console.log(req.user);

    console.log(error);
  }
};

module.exports = getCartItems;
