import foodModel from "../models/foodModel.js";
import fs from 'fs'

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

const getFoodByName = async (req, res) => {
    try {
        const food = await foodModel.findOne({name: req.query.name});

        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        res.json({ success: true, message: "Get food by name successful.", data: food });
    } catch (error) {
        console.error("Error fetching food by name:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export {addFood, listFood, removeFood, getFoodById, addComment, searchFood, getFoodByName} 