
import foodModel from "../models/foodModel.js";
 import fs from "fs"
// add food item

const addFood=async(req,res)=>{
  
    let image_filename=`${req.file.filename}`;
    const food=new foodModel({
        name:req.body.name,
        category:req.body.category,
        description:req.body.description,
        price:req.body.price,
        image:image_filename
    })
    try{
        await food.save();
       res.json({success:true,message:"Food Added"})
    }catch(error){
       console.log(error)
       res.json({success:false, message:"Error"})
    }
    
}

// ALL food list , export to food route , with that we can access from database
 const listFood=async( req,res)=>{

    try {
        const foods=await foodModel.find({});
        res.json({success:true,data:foods});
    } catch (error) {
        
        console.log(error);
        res.json({success:false,message:"error"});
    }

 }
// remove food item and export to foodroute

const removeFood=async(req,res)=>{
    try {
        const food=await foodModel.findById(req.body.id); // find  food model using id
        fs.unlink(`uploads/${food.image}`,()=>{})// delte image from uploads folder
        await foodModel.findByIdAndDelete(req.body.id);// delete image from database
        res.json({success:true,message:"Food Removed"}); // response of success execution

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
        
    }
}

export { addFood,listFood,removeFood };

