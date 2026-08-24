import Service from "../models/service.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import DocumentRequirement from "../models/documentRequirement.model.js";


const getServices = asyncHandler(async (req, res)=> {
    const services = await Service.find({
      status: "published",
    })

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services
    });
  }); 

  const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }


  const requireDocuments = await DocumentRequirement.find({
    serviceId: service._id,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Service fetched successfully",
    data: {
      ...service.toObject(),
      requireDocuments,
    },
  });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
    data: service,
  });
});


export default {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
}