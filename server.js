require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db-connect.js");
const mongoose = require("mongoose");
const product = require("./model/productSchema.js");
const user = require("./model/userSchema.js");
const addProduct = require("./services/addProduct.js");
const createUser = require("./services/createUser.js");
const getAllProduct = require("./services/getAllProduct.js");
const getProductById = require("./services/getProductById.js");
const getRelatedProduct = require("./services/getRelatedProduct.js");
const submitReview = require("./services/submitReview.js");
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 120.99,
    image: "https://via.placeholder.com/150",
    description:
      "High-quality wireless Bluetooth headphones with noise cancellation.",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smartphone",
    price: 799.99,
    image: "https://via.placeholder.com/150",
    description:
      "Latest model smartphone with advanced features and a sleek design.",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Gaming Laptop",
    price: 1299.99,
    image: "https://via.placeholder.com/150",
    description:
      "High-performance gaming laptop with a powerful GPU and fast refresh rate.",
    category: "Computers",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 89.99,
    image: "https://via.placeholder.com/150",
    description:
      "Lightweight and comfortable running shoes for long-distance running.",
    category: "Footwear",
  },
  {
    id: 5,
    name: "Office Chair",
    price: 199.99,
    image: "https://via.placeholder.com/150",
    description:
      "Ergonomic office chair with lumbar support and adjustable height.",
    category: "Furniture",
  },
  {
    id: 6,
    name: "Smart Watch",
    price: 249.99,
    image: "https://via.placeholder.com/150",
    description:
      "Smartwatch with fitness tracking, heart rate monitor, and GPS.",
    category: "Wearables",
  },
  {
    id: 7,
    name: "LED Desk Lamp",
    price: 39.99,
    image: "https://via.placeholder.com/150",
    description: "Adjustable LED desk lamp with multiple brightness settings.",
    category: "Home Decor",
  },
  {
    id: 8,
    name: "Wireless Charger",
    price: 29.99,
    image: "https://via.placeholder.com/150",
    description:
      "Fast wireless charger compatible with all Qi-enabled devices.",
    category: "Accessories",
  },
  {
    id: 9,
    name: "Electric Kettle",
    price: 49.99,
    image: "https://via.placeholder.com/150",
    description:
      "Electric kettle with fast boiling and automatic shut-off feature.",
    category: "Appliances",
  },
  {
    id: 10,
    name: "Yoga Mat",
    price: 24.99,
    image: "https://via.placeholder.com/150",
    description:
      "Non-slip yoga mat with extra cushioning for comfort during workouts.",
    category: "Fitness",
  },
];

connectDB();
app.use(
  cors({
    origin: ["https://browsemart-backend.vercel.app/", "http://localhost:3000"],
  })
);
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.send("Hello, baby");
});

app.get("/add-product", addProduct);
app.get("/create-user", createUser);

app.get("/get-all-products", getAllProduct);
app.post("/get-product-by-id", getProductById);
app.post("/get-related-product", getRelatedProduct);

app.post("/submit-review", submitReview);
app.get("/product", function (req, res) {
  products.map((item, index) => {
    if (index === products.length - 1) {
      res.json(item);
    }
  });
});

app.listen(4000, () => {
  console.log(`server is running on port no ${4000}`);
});

// axios
//   .get("http://localhost:4000/product")
//   .then((response) => {
//     SetAllProduct(response.data);
//     SetFilteredProduct(response.data);
//     setIsDataFetch(true);
//   })
//   .catch((error) => console.log(error));
