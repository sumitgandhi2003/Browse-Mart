const sendEmail = require("./emailService");

const sendOrderConfirmationEmail = async (email, orderDetail) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center;">🛍️ Thank you for your order!</h2>
        <p><strong>Order ID:</strong> ${orderDetail?.orderId}</p>
        <p><strong>Total Amount:</strong> ₹${orderDetail?.grandTotal}</p>
        
        <h3>🛒 Order Details:</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderDetail?.orderItems
            .map(
              (item) => `
            <li style="padding: 10px; border-bottom: 1px solid #ddd;">
              <strong>${item.productName}</strong> - ₹${
                item.sellingPrice || item.price
              } x ${item.quantity} = ₹${
                (item.sellingPrice || item.price) * item.quantity
              }
            </li>`
            )
            .join("")}
        </ul>

        <h3>📦 Shipping Address:</h3>
        <p>
          ${Object.values(orderDetail.shippingAddress)
            .filter(Boolean)
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(", ")}
        </p>

        <p><strong>Estimated Delivery:</strong> 4-7 business days</p>
        
        <p style="text-align: center; margin-top: 20px;">
          <a href="https://browsemart.vercel.app/orders/${orderDetail.orderId}" 
             style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Track Your Order
          </a>
        </p>

        <hr>
        <p style="text-align: center; font-size: 12px; color: #777;">Thank you for shopping with us!<br><strong>Browse Mart</strong></p>
      </div>
    </div>
  `;

  await sendEmail(
    email,
    `Order Confirmation - ${orderDetail?.orderId}`,
    htmlContent
  );
};

module.exports = sendOrderConfirmationEmail;
