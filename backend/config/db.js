import mongoose from "mongoose";

// key word export to allow access from server.js
export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://22022638:bakeryweb@cluster0.zcdqe8x.mongodb.net/food-del').then(() => console.log("DB connected"));
}

// mongodb+srv://22022638:bakeryweb@cluster0.zcdqe8x.mongodb.net/food-del