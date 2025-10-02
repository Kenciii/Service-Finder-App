import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { 
    getApplications, 
    getUser, 
    getUserDetails, 
    updateUser 
} from "../controllers/userController.js";

const router = express.Router();

router.post("/get-user", userAuth, getUser);

router.put("/update-user", userAuth, updateUser);

router.get("/applied-services",userAuth,getApplications);

router.get("/get-user-details/:id",getUserDetails);

export default router;