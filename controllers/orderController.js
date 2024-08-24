import crypto from "crypto";
import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to place an order
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5175";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create a Razorpay order
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error in placing order." });
  }
};

// Function to verify payment




// Function to verify payment
const verifyOrder = async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;


// Log the received values
console.log("Received orderId:", orderId);
console.log("Received razorpay_payment_id:", razorpay_payment_id);
console.log("Received razorpay_order_id:", razorpay_order_id);
console.log("Received razorpay_signature:", razorpay_signature);



  try {
    // Generate the signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    // Log for debugging
    console.log('Received Signature:', razorpay_signature);
    console.log('Generated Signature:', generated_signature);

    if (generated_signature === razorpay_signature) {
      // Update the order as paid
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: 'Payment successful and verified.' });
    } else {
      res.json({ success: false, message: 'Payment verification failed. Signature mismatch.' });
    }
  } catch (error) {
    console.log('Error during payment verification:', error);
    res.json({ success: false, message: 'Error during payment verification.' });
  }
};


// user orders for frontend
  

const userOrders=async (req,res)=>{


  try {
    const orders=await orderModel.find({
      userId:req.body.userId
    });
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"error"})
  }
}


export { placeOrder, verifyOrder,userOrders };

