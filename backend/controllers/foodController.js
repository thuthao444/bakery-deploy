import foodModel from "../models/foodModel.js";
import fs from 'fs'
import fetch from "node-fetch"

// add food item

// function addFood take 2 paras: request, response
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({success:true, message:'Food Added'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:'Error'})
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true, data:foods})
    } catch(error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    } 
}

//remove food item
const removeFood = async(req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:'Food Removed'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Error'})
    }
}

const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id); // Tìm food theo id từ database
        res.json({success:true, data:food})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error'});
    }
};

const addComment = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);

        food.ratings.push({
            userId: req.body.userId,
            comment: req.body.comment,
            rating: req.body.rating,
        });

        await food.save();
        res.json({success:true, message:"Added comment"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }  
}

const searchFood = async (req, res) => {
    try {
        const search = req.query.search || "";
        const foods = await foodModel.find({ name: { $regex: search, $options: "i" } });
        res.json({ success: true, message: "Searched", data: foods });
    } catch (error) {
        console.error("Error searching for food:", error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

const recommendFood = async (req, res) => {
    const itemName = req.params.name; 
    const userName = req.params.userName;
    try {
        const response = await fetch(`http://localhost:4040/recommend/?item_name=${itemName}&user_name=${userName}`);
        const responseData = await response.json();
        console.log(response.status)
        if (response.ok) {
            res.json({ success: true, data: responseData, message: "Successful" });
        } else {
            console.log("Error fetching recommendations");
            res.status(response.status).json({ success: false, message: "Error fetching recommendations" });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export {addFood, listFood, removeFood, getFoodById, addComment, searchFood, recommendFood} 