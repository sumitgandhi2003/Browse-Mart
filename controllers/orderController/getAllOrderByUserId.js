const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");
const getAllOrderByUserId = async (req, res, next) => {
  const orderItems = req?.user?.order;
  const activeUsers = req?.user;
  //   const ordersArr = [];
  if (!orderItems || !activeUsers) {
    return res.status(400).json({ message: "Invalid user or order data" });
  }
  const formatDate = (originalDate) => {
    const [month, day, year] = originalDate?.split(",")[0].split("/");
    return {
      day,
      month,
      year,
    };
  };
  const ordersArr = await Promise.all(
    orderItems?.map(async (orderItem) => {
      try {
        const filteredOrderArr = await Order.findById(orderItem.orderId);
        if (!filteredOrderArr) return null;
        // console.log(filteredOrderArr);
        return {
          orderStatus: filteredOrderArr?.orderStatus,
          id: filteredOrderArr?._id,
          orderId: filteredOrderArr?.orderId,
          orderDate: formatDate(filteredOrderArr?.orderDate),
          orderItems: await Promise.all(
            filteredOrderArr?.orderItems?.map(async (item, index) => {
              const productData = await Product?.findById(item.productId);
              // console.log(productData);
              return {
                ...item?._doc,
                quantity: item.quantity,
                productImage: productData?.image?.[0],
                productDescription: productData?.description,
              };
            })
          ),
          totalAmount: filteredOrderArr?.totalAmount,
        };
      } catch (err) {
        console.log("Error in fetching orders", err);
        return null;
      }
    })
  );
  //   const id = orderItems[0]?.orderId;
  //   console.log(id);
  //   ordersArr.push(Order);

  res
    .status(200)
    .json({ message: "All order fetched successfully!", ordersArr });
};
module.exports = getAllOrderByUserId;
