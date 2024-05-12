import express from "express"
import { loginUser, registerUser, getUser, changeUser} from "../controllers/userController.js"
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get",authMiddleware , getUser)
userRouter.post("/change", authMiddleware, changeUser)

export default userRouter;