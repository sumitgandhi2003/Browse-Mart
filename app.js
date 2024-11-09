const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(
  cors({
    origin: [
      "https://browsemart.vercel.app",
      "http://localhost:3000",
      "http://192.168.1.40:3000",
    ],
  })
);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.get("/", function (req, res) {
  res.send("Hello, bro");
});

module.exports = app;
