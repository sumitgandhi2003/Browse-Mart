const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const app = express();
const CORS_ORIGIN_URL = process.env.CORS_ORIGIN_URL || "*";
app.use(
  cors({
    origin: CORS_ORIGIN_URL,
  })
);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/seller", sellerRoutes);

app.get("/", function (req, res) {
  res.send("Hello, bro");
});

module.exports = app;
