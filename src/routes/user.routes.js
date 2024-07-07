import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router()
router.route("/register").post(registerUser)
//  generated url will look somewhat like: http://localhost:8000/users/register
export default router