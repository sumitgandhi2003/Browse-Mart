const Product = require("../../model/productSchema");
const getCartItems = async (req, res, next) => {
  try {
    const cartProduct = [];
    const cartItem = await req?.user?.cart;
    for (let i = 0; i < cartItem.length; i++) {
      const product = await Product?.findById({ _id: cartItem[i]?.productId });
      // console.log(product);
      const filteredProductData = {
        id: product?._id,
        name: product?.name,
        price: product?.price,
        description: product?.description,
        image: [product?.image?.[0]],
        category: product?.category,
        stock: product?.stock,
      };
      // console.log(filteredProduct);
      cartProduct?.push({
        item: { ...filteredProductData },
        quantity: cartItem[i]?.quantity,
      });
    }
    // console.log(cartProduct);
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
