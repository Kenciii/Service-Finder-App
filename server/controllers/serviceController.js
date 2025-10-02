import mongoose from "mongoose"; 
import Services from "../models/servicesModel.js";
import ServiceProviders from "../models/serviceProviderModel.js";
import Users from "../models/userModel.js";

export const createService = async (req, res, next) => {
  try {
    const {
      serviceTitle,
      serviceType,
      location,
      salary,
      experience,
      desc,
      requirements,
    } = req.body;

    if (
      !serviceTitle ||
      !serviceType ||
      !location ||
      !salary ||
      !requirements ||
      !desc
    ) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Service Provider with id: ${id}`);
    }

    const servicePost = {
      serviceTitle,
      serviceType,
      location,
      salary,
      experience,
      detail: { desc, requirements },
      serviceProvider: id,
    };

    const service = new Services(servicePost);
    await service.save();

    const serviceProvider = await ServiceProviders.findById(id);
    serviceProvider.servicePosts.push(service._id);

    await ServiceProviders.findByIdAndUpdate(id, serviceProvider, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Service Posted Successfully",
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateService = async (req, res, next) => {
  try {
    const {
      serviceTitle,
      serviceType,
      location,
      salary,
      experience,
      desc,
      requirements,
    } = req.body;
    const { serviceId } = req.params;

    if (
      !serviceTitle ||
      !serviceType ||
      !location ||
      !salary ||
      !desc ||
      !requirements
    ) {
      return next("Please Provide All Required Fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Service Provider with id: ${id}`);
    }

    const servicePost = {
      serviceTitle,
      serviceType,
      location,
      salary,
      experience,
      detail: { desc, requirements },
    };

    const updated = await Services.findByIdAndUpdate(serviceId, servicePost, { new: true });

    res.status(200).json({
      success: true,
      message: "Service Post Updated Successfully",
      service: updated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const getServicePosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(",");
    const experience = exp?.split("-");

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.serviceType = { $in: types };
    }

    if (exp) {
  if (exp === "5+") {
    queryObject.experience = { $gte: 5 };
  } else {
    const [minStr, maxStr] = exp.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);

    if (!isNaN(min) && !isNaN(max)) {
      queryObject.experience = { $gte: min, $lte: max };
    }
  }
}


    if (search) {
      queryObject.$or = [
        { serviceTitle: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    let queryResult = Services.find(queryObject).populate({
      path: "serviceProvider",
      select: "name profileUrl about email location",
    });

    if (sort === "Newest") queryResult = queryResult.sort("-createdAt");
    if (sort === "Oldest") queryResult = queryResult.sort("createdAt");
    if (sort === "A-Z") queryResult = queryResult.sort("serviceTitle");
    if (sort === "Z-A") queryResult = queryResult.sort("-serviceTitle");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalServices = await Services.countDocuments(queryObject);
    const numOfPage = Math.ceil(totalServices / limit);

    const services = await queryResult.skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      totalServices,
      data: services,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const service = await Services.findById(id)
      .populate({
        path: "serviceProvider",
        select: "name profileUrl about email location",
      })
      .populate({
        path: "application",
        select: "firstName lastName email profileUrl about",
      });

    if (!service) {
      return res.status(404).json({
        message: "Service Post Not Found",
        success: false,
      });
    }

    const searchQuery = {
      $or: [
        { serviceTitle: { $regex: service.serviceTitle, $options: "i" } },
        { serviceType: { $regex: service.serviceType, $options: "i" } },
      ],
    };

    const similarServices = await Services.find(searchQuery)
      .populate({
        path: "serviceProvider",
        select: "name profileUrl about email location",
      })
      .sort({ _id: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: service,
      similarServices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteServicePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Services.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Service Post Deleted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const applyForService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.body.user.userId;

    const user = await Users.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found", success: false });
    }

    const service = await Services.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service Not Found", success: false });
    }

    if (service.application.includes(user_id)) {
      return res.status(400).json({ message: "User already applied", success: false });
    }

    service.application.push(user_id);
    await service.save();

    res.status(200).json({ message: "Application successfull", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const checkifApplied = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.body.user.userId;

    const service = await Services.findById(id);
    const applied = service?.application.includes(user_id);

    res.status(200).json({ applicationstatus: applied, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const applicantdetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Services.findById(id).populate({
      path: "application",
      select: "firstName lastName email profileUrl about",
    });

    res.status(200).json({
      applicants: service?.application || [],
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};