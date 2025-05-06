const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");
const User = require("../../model/userSchema");

const getOrderById = async (req, res) => {
  try {
    const orderId = req?.body?.orderId;
    if (!orderId) {
      return res.status(400).json({ msg: "No orderId provided" });
    }

    const orderDetails = await Order?.findOne({ orderId: orderId });
    if (orderDetails?.customerId !== req?.user?._id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to view this order",
        });
    }
    if (!orderDetails) {
      return res.status(404).json({ msg: "Order not found" });
    }
    const customerDetails = await User?.findById(orderDetails?.customerId);

    // Resolve promises for all orderItems
    const resolvedOrderItems = await Promise.all(
      orderDetails?.orderItems?.map(async (orderItem) => {
        const itemDetails = await Product?.findById(
          orderItem?.productId || orderItem?.id || orderItem?._id
        );
        return {
          ...orderItem?._doc,
          productImage: itemDetails?.image?.[0],
          productDescription: itemDetails?.description,
        };
      })
    );

    const filteredOrderDetails = {
      ...orderDetails?._doc,
      orderItems: resolvedOrderItems,
      customerDetail: {
        customerName: customerDetails?.name,
        customerEmail: customerDetails?.email,
        customerPhoneNumber: customerDetails?.phoneNumber,
        customerAddress: customerDetails?.address,
      },
    };

    res
      .status(200)
      .json({ message: "Order fetched successfully!", filteredOrderDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = getOrderById;
