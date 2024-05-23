import express from 'express'
import { addFood, listFood, removeFood, getFoodById, addComment, searchFood, getFoodByName } from '../controllers/foodController.js'
import multer from 'multer'
import authMiddleware from "../middleware/auth.js"

const foodRouter = express.Router();

// Image Storage Engine: where to storage food image
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`) // use this method, our filename will become unique
    }
}) 

const upload = multer({storage: storage})

// modify router
foodRouter.get("/get", getFoodByName)
foodRouter.get("/search", searchFood);
foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.get('/list',listFood)
foodRouter.post('/remove',removeFood);

foodRouter.get('/:id', getFoodById);
foodRouter.post("/:id", authMiddleware, addComment)

export default foodRouter;
