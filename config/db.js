import mongoose from "mongoose";

export const connectDb=async()=>{
    await mongoose.connect('mongodb+srv://prakash:Aloo1313@cluster0.faubi.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}