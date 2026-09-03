import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import webauthnRoutes from "./routes/webauthnRoutes.js";

const app = express();
const rawOrigins = process.env.CORS_ORIGIN_URL || "*";
const allowedOrigins = rawOrigins.split(",").map((s) => s.trim().replace(/\/$/, ""));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        rawOrigins === "*" ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin === "https://browsemart.vercel.app" ||
        cleanOrigin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }
      return callback(null, cleanOrigin);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/webauthn", webauthnRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/", function (req, res) {
  res.send("Hello, bro");
});

export default app;
