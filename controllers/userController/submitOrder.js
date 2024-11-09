const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");
const submitOrder = async (req, res, next) => {
  try {
    const activeUser = req.user;
    const productCard = req?.body?.cartProduct;
    const shippingAddress = req?.body?.shippingAddress;
    const { methodName, methodDetail } = req?.body?.paymentData;
    // const [date, time] = req?.body?.timeStamp?.toLocaleString().split(",");
    const timeStamp = req?.body?.timeStamp;
    const filteredProduct = [];

    //Saving Default Shipping Address
    const saveDefaultShippingAddress = (shippingAddress, activeUser) => {
      try {
        if (!activeUser) return;
        if (!shippingAddress?.isDefaultShippingAddress) return;
        if (!shippingAddress) return "Shipping Address is required";
        activeUser.shippingAddress = {
          addressLine1: shippingAddress?.addressLine1?.trim(),
          addressLine2: shippingAddress?.addressLine2?.trim() || "",
          state: shippingAddress?.state?.trim(),
          city: shippingAddress?.city?.trim(),
          pinCode: shippingAddress?.pinCode?.trim(),
          country: shippingAddress?.country?.trim(),
        };
        return true;
      } catch (error) {
        console.error(error);
      }
    };
    // decrease product quantity
    const decreaseProductQuantity = async (productId, quantity) => {
      try {
        // First, fetch the product to check the stock
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");

        // Check if the stock is greater than or equal to the quantity to be ordered
        if (product?.stock >= quantity) {
          // If sufficient stock, update the stock by decrementing it
          product.stock -= quantity;
          await product.save();
          return product; // Return updated product if needed
        } else {
          throw new Error("Insufficient stock");
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    // Generating Custom OrderID
    const generateOrderId = (timeStamp) => {
      const prefix = "ORD";
      // const date = originalDate?.split("/")?.reverse()?.join("");
      const [date, time] = timeStamp
        ?.split(",")
        ?.map((part) => part?.split(/[/:" "]/))
        ?.map((part) =>
          part
            ?.filter(
              (subPart) =>
                subPart !== "" && subPart !== "AM" && subPart !== "PM"
            )
            ?.map((subPart) => subPart?.padStart(2, "0"))
            ?.reverse()
            ?.join("")
        );
      // const date = timeStamp
      //   ?.toLocaleString()
      //   .split(",")[0]
      //   ?.split("/")
      //   ?.map((part) => part?.padStart(2, "0"))
      //   ?.reverse()
      //   ?.join("");
      // // const time = originalTime?.split(" ")[0]?.replaceAll(":", "");
      // const time = timeStamp
      //   ?.toLocaleString()
      //   .split(",")[1]
      //   ?.trim()
      //   ?.split(" ")[0]
      //   ?.trim()
      //   ?.split(":")
      //   ?.map((part) => part.padStart(2, "0"))
      //   ?.join("");
      // const orderId = prefix + date + time + Math.floor(Math.random() * 10000);
      const orderId = `${prefix}-${date}-${time}-${Math.floor(
        1000 + Math.random() * 10000
      )}`;
      return orderId;
    };

    productCard?.map((item, index) => {
      filteredProduct?.push({
        productId: item?.item?.id || item?.item?._id,
        productName: item?.item?.name,
        price: item?.item?.price,
        quantity: item?.quantity,
      });
    });
    filteredProduct.map((product) => {
      decreaseProductQuantity(product.productId, product.quantity);
    });

    const isDefaultShippingAddressSaved = saveDefaultShippingAddress(
      shippingAddress,
      activeUser
    );
    if (isDefaultShippingAddressSaved === false) {
      return res
        .status(400)
        .json({ message: "Failed to save default shipping address" });
    }
    // console.log("Active user", activeUser);
    const order = new Order({
      orderId: generateOrderId(timeStamp),
      userId: activeUser?._id,
      orderItems: filteredProduct,
      shippingAddress: {
        addressLine1: shippingAddress?.addressLine1?.trim(),
        addressLine2: shippingAddress?.addressLine2?.trim() || "",
        state: shippingAddress?.state?.trim(),
        city: shippingAddress?.city?.trim(),
        pinCode: shippingAddress?.pinCode?.trim(),
        country: shippingAddress?.country?.trim(),
      },
      paymentMethod: methodName,
      paymentStatus: methodName?.toString() !== "cod" ? "success" : "pending",
      paymentMethodDetail: { ...methodDetail },
      totalAmount: filteredProduct?.reduce((totalAmount, product) => {
        return totalAmount + product?.price * product?.quantity;
      }, 0),
      orderDate: timeStamp?.toLocaleString(),
    });
    await order.save();
    const { _id, orderId } = order;
    activeUser.order.push({
      orderId: _id,
    });
    await activeUser.save();

    res?.status(201)?.json({
      message: "Order submitted successfully",
      orderId,
      id: _id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = submitOrder;
