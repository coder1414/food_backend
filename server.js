


import cors from "cors";
import 'dotenv/config'; // Load environment variables
import express from "express";
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
const port =process.env.PORT|| 4000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

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





