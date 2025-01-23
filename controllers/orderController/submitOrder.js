const Order = require("../../model/orderSchema");
const Product = require("../../model/productSchema");
const submitOrder = async (req, res, next) => {
  try {
    const activeUser = req.user;
    const productCard = req?.body?.cartProduct;
    const shippingAddress = req?.body?.shippingAddress;
    const { methodName, methodDetail } = req?.body?.paymentData;
    const orderIds = [];
    // const [date, time] = req?.body?.timeStamp?.toLocaleString().split(",");
    const timeStamp = req?.body?.timeStamp;
    // const filteredProduct = [];
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
        console.error(" line 29", error);
      }
    };
    // decrease product quantity
    const decreaseProductQuantity = async (productId, quantity) => {
      try {
        // First, fetch the product to check the stock
        const product = await Product.findById(productId);
        console.log("Line No 37", product);
        // console.log("Line No 38", product);
        if (!product) throw new Error("Product not found");

        // Check if the stock is greater than or equal to the quantity to be ordered
        // if (product?.stock >= quantity) {
        //   If sufficient stock, update the stock by decrementing it

        const quantityToOrder = Math?.min(product?.stock, quantity);
        // consol.log(
        //   "line 44 Order quantity",
        //   quantityToOrder,
        //   "real quantity",
        //   quantity
        // );
        product.stock -= quantityToOrder;
        await product.save();
        return quantityToOrder;
        // } else {
        //   throw new Error("Insufficient stock");
        // }
      } catch (error) {
        console.error("Line No 58", error.message);
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
        10000000 + Math.random() * 90000000
      )}`;
      return orderId;
    };

    // productCard?.map((item, index) => {
    //   filteredProduct?.push({
    //     productId: item?.item?.id || item?.item?._id,
    //     productName: item?.item?.name,
    //     price: item?.item?.price,
    //     quantity: decreaseProductQuantity(
    //       item?.item?.id || item?.item?._id,
    //       item?.quantity
    //     ),
    //   });
    // });

    const filteredProduct = await Promise.all(
      productCard?.map(async (item) => {
        const orderedQuantity = await decreaseProductQuantity(
          item?.item?.id || item?.item?._id,
          item?.quantity
        );
        console.log(" Line No 120orderedQuantity ", orderedQuantity);
        if (orderedQuantity > 0)
          return {
            productId: item?.item?.id || item?.item?._id,
            productName: item?.item?.name,
            price: item?.item?.price || item?.item?.sellingPrice,
            sellerId: item?.item?.userId || item?.item?.userID,
            quantity: orderedQuantity, // resolved quantity from decreaseProductQuantity
          };
      })
    );
    // filteredProduct.map((product) => {
    //   decreaseProductQuantity(product.productId, product.quantity);
    // });
    // console.log(filteredProduct);
    const isDefaultShippingAddressSaved = saveDefaultShippingAddress(
      shippingAddress,
      activeUser
    );
    if (isDefaultShippingAddressSaved === false) {
      return res
        .status(400)
        .json({ message: "Failed to save default shipping address" });
    }

    const groupProduct = filteredProduct?.reduce((acc, item) => {
      const sellerId = item?.sellerId;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {});
    // console.log(groupProduct);
    for (const sellerId in groupProduct) {
      const filteredProduct = groupProduct[sellerId];
      // console.log("Active user", activeUser);
      if (filteredProduct[0]?.quantity === 0 || !filteredProduct[0]) {
        console.log("Line No 158 No products available for order");
        continue;
      }

      const order = new Order({
        orderId: generateOrderId(timeStamp),
        customerId: activeUser?._id,
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
          return product?.quantity > 0
            ? totalAmount +
                (product?.price || product?.sellingPrice) * product?.quantity
            : totalAmount;
        }, 0),
        orderDate: timeStamp?.toLocaleString(),
      });
      await order.save();
      const { _id, orderId } = order;
      orderIds?.push(orderId);
      activeUser.order.push({
        orderId: _id,
      });
    }

    console.log("Line No 193", orderIds);
    if (!orderIds.length > 0) {
      return res.status(400).json({ message: "Failed to submit order" });
    }
    await activeUser.save();
    res?.status(201)?.json({
      message: "Order submitted successfully",
      orderIds,
    });
  } catch (error) {
    console.error("Line No 203", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = submitOrder;
