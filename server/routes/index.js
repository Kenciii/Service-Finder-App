import express from "express"
import authRoute from "./authRoute.js"
import userRoute from "./userRoute.js"
import serviceProviderRoute from "./serviceProviderRoute.js"
import serviceRoute from "./serviceRoute.js"
import uploadRoute from "./uploadRoute.js";

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute);
router.use(`${path}user`, userRoute); 
router.use(`${path}serviceProvider`, serviceProviderRoute);
router.use(`${path}services`, serviceRoute);
router.use(`${path}upload`, uploadRoute);

export default router;