import mongoose from "mongoose";

// key word export to allow access from server.js
export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://admin:ecommerce@cluster0.szjyz2i.mongodb.net/food-del').then(() => console.log("DB connected"));
}

