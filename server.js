
import cors from "cors";
import express from "express";
import 'dotenv/config'; // Load environment variables
import { connectDb } from "./config/db.js";
import cartRouter from "./routes/cartRoutes.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";

// Log environment variables
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

// Create a basic server
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// Allow requests from multiple origins
const allowedOrigins = [
  'https://food-frontend-blond.vercel.app',  // Frontend URL
  'https://admin-uyxr.onrender.com',  // Admin URL
  'https://food-backend-62oi.onrender.com'  // Backend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests from allowed origins and requests without origin (e.g., from curl or Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// DB connection
connectDb();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// Run Express server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
