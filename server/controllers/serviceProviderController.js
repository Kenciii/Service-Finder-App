import mongoose from "mongoose";
import ServiceProviders from "../models/serviceProviderModel.js";
import Services from "../models/servicesModel.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) return next("Service Provider Name is required!");
  if (!email) return next("Email address is required!");
  if (!password) return next("Password is required and must be greater than 6 characters");

  try {
    const accountExist = await ServiceProviders.findOne({ email });
    if (accountExist) return next("Email Already Registered. Please Login");

    const serviceProvider = await ServiceProviders.create({ name, email, password });
    const token = serviceProvider.createJWT();

    res.status(201).json({
      success: true,
      message: "Service Provider Account Created Successfully",
      user: {
        _id: serviceProvider._id,
        name: serviceProvider.name,
        email: serviceProvider.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return next("Please Provide User Credentials");

    const serviceProvider = await ServiceProviders.findOne({ email }).select("+password");
    if (!serviceProvider) return next("Invalid Email or Password");

    const isMatch = await serviceProvider.comparePassword(password);
    if (!isMatch) return next("Invalid Email or Password");

    serviceProvider.password = undefined;
    const token = serviceProvider.createJWT();

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: serviceProvider,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateServiceProviderProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    if (!name || !location || !about || !contact || !profileUrl) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Service Provider with id: ${id}`);

    const updateServiceProvider = { name, contact, location, profileUrl, about, _id: id };
    const serviceProvider = await ServiceProviders.findByIdAndUpdate(id, updateServiceProvider, { new: true });

    const token = serviceProvider.createJWT();
    serviceProvider.password = undefined;

    res.status(200).json({
      success: true,
      message: "Service Provider Profile Updated Successfully",
      serviceProvider,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getServiceProviderProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;
    const serviceProvider = await ServiceProviders.findById(id)
      .populate("servicePosts") 
      .populate("reviews.user", "firstName lastName"); 

    if (!serviceProvider) {
      return res.status(200).send({ message: "Service Provider Not Found", success: false });
    }

    serviceProvider.password = undefined;
    res.status(200).json({ success: true, data: serviceProvider });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getServiceProviders = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;
    const queryObject = {};

    if (search) queryObject.name = { $regex: search, $options: "i" };
    if (location) queryObject.location = { $regex: location, $options: "i" };

    let queryResult = ServiceProviders.find(queryObject).select("-password");

    if (sort === "Newest") queryResult = queryResult.sort("-createdAt");
    if (sort === "Oldest") queryResult = queryResult.sort("createdAt");
    if (sort === "A-Z") queryResult = queryResult.sort("name");
    if (sort === "Z-A") queryResult = queryResult.sort("-name");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await ServiceProviders.countDocuments(queryObject);
    const numOfPage = Math.ceil(total / limit);

    queryResult = queryResult.limit(limit * page);

    const serviceProvider = await queryResult;
    res.status(200).json({ success: true, total, data: serviceProvider, page, numOfPage });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getServiceProviderServiceListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    let sorting;
    if (sort === "Newest") sorting = "-createdAt";
    if (sort === "Oldest") sorting = "createdAt";
    if (sort === "A-Z") sorting = "name";
    if (sort === "Z-A") sorting = "-name";

    const serviceProvider = await ServiceProviders.findById(id).populate({
      path: "servicePosts",
      options: { sort: sorting },
      populate: { path: "serviceProvider", select: "name profileUrl email" }, 
    });

    res.status(200).json({ success: true, serviceProvider });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getServiceProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const serviceProvider = await ServiceProviders.findById(id)
      .populate({
        path: "servicePosts",
        options: { sort: "-_id" },
        populate: { path: "serviceProvider", select: "name profileUrl email" },
      })
      .populate({ path: "reviews.user", select: "firstName lastName" });

    if (!serviceProvider) {
      return res.status(200).send({ message: "Service Provider Not Found", success: false });
    }

    serviceProvider.password = undefined;
    res.status(200).json({ success: true, data: serviceProvider });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const viewApplications = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.body.user.userId;

    const user = await ServiceProviders.findById(user_id);
    if (!user) return res.status(200).send({ message: "Service Provider Not Found", success: false });

    const service = await Services.findById(id).populate("application", "firstName lastName email");
    if (!service) return res.status(500).send({ message: "Service Not Found", success: false });

    res.status(200).json({ message: "Applicants for Service Position", applications: service.application, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error", success: false, error: error.message });
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const serviceProviderId = req.params.id;
    const userId = req.body.user.userId;

    if (!rating || !comment) return next("Please provide rating and comment");

    const serviceProvider = await ServiceProviders.findById(serviceProviderId);
    if (!serviceProvider) return next("Service Provider not found");

    const alreadyReviewed = serviceProvider.reviews.find((rev) => rev.user.toString() === userId);
    if (alreadyReviewed) return next("You have already reviewed this Service Provider");

    const review = { user: userId, rating: Number(rating), comment };
    serviceProvider.reviews.push(review);
    await serviceProvider.save();

    const updatedServiceProvider = await ServiceProviders.findById(serviceProviderId)
      .populate("reviews.user", "firstName lastName");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: updatedServiceProvider.reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};