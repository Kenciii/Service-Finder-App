import express from 'express'
import { 
    getServiceProviders, 
    getServiceProviderById, 
    getServiceProviderServiceListing, 
    getServiceProviderProfile, 
    register, 
    signIn, 
    updateServiceProviderProfile,
    viewApplications, 
    addReview 
} from '../controllers/serviceProviderController.js';
import userAuth from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/register',register);
router.post('/login',signIn);

router.post('/get-serviceProvider-profile',userAuth,getServiceProviderProfile);
router.post('/get-serviceProvider-servicelisting',userAuth,getServiceProviderServiceListing);
router.post("/:id/add-review", userAuth, addReview);

router.get('/',getServiceProviders);
router.get('/get-serviceProvider/:id',getServiceProviderById);

router.put('/update-serviceProvider',userAuth,updateServiceProviderProfile);

router.get('/services/:id',userAuth,viewApplications);


export default router;