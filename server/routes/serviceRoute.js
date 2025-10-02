import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createService,
  deleteServicePost,
  getServiceById,
  getServicePosts,
  updateService,
  applyForService,
  checkifApplied,
  applicantdetails
} from "../controllers/serviceController.js";

const router = express.Router();

router.post("/upload-service", userAuth, createService);

router.put("/update-service/:serviceId", userAuth, updateService);

router.get("/find-services", getServicePosts);

router.get("/get-service-detail/:id", getServiceById);

router.delete("/delete-service/:id", userAuth, deleteServicePost);

router.put("/get-service-detail/:id",userAuth,applyForService);

router.get("/has-user-applied/:id",userAuth,checkifApplied);

router.get("/applicantdetails",userAuth,applicantdetails);

export default router;