import User from "../../model/userSchema.js";

const updateCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const foundedUser = await req.user;
  const item = foundedUser?.cart?.find(
    (item) => item.productId?.toString() === productId?.toString()
  );
  if (!item) {
    return res?.status(404)?.json({ message: "Item not found" });
  }
  if (quantity === 0) {
    foundedUser.cart = foundedUser?.cart?.filter(
      (item) => item?.productId?.toString() !== productId.toString()
    );
  } else {
    item.quantity = quantity;
  }
  await foundedUser?.save();

  res
    ?.status(200)
    ?.json({ message: "data updated", cartCount: foundedUser?.cart?.length });
};
export default updateCart;
