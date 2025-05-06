const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");

const dashBoard = async (req, res) => {
  const sellerId = req?.user?.sellerId;
  // console.log(sellerId);

  // if (req?.user?.userType?.toString()?.toLowerCase() !== "seller") {
  //   return res
  //     ?.status(401)
  //     ?.json({ sucess: false, message: "You don't have seller Account" });
  // }
  const totalSales = await Order.aggregate([
    { $match: { sellerId } }, // Filter orders by seller
    { $group: { _id: null, total: { $sum: "$grandTotal" } } }, // Sum totalAmount
  ]);
  const totalOrder = await Order.countDocuments({ sellerId });
  const totalCustomer = await Order.distinct("customerId", { sellerId });
  const totalProducts = await Product.countDocuments({ sellerId });
  const recentOrders = await Order.find({ sellerId })
    .sort({ createdAt: -1 })
    .limit(5)
    ?.select("orderStatus totalAmount grandTotal orderId customerId")
    ?.populate("customerId", "email name");
  //   console?.log(totalOrder, totalProducts, totalCustomer, recentOrders);
  const topProducts = await Product.find({ sellerId })?.limit(5);
  res?.status(200)?.json({
    sucess: true,
    message: "data fetched sucessfully!",
    totalOrder,
    totalProducts,
    totalCustomer: totalCustomer.length,
    recentOrders,
    totalSales,
    topProducts,
  });
};
module.exports = dashBoard;
