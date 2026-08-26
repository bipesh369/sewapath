import Service from "../models/service.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import DocumentRequirement from "../models/documentRequirement.model.js";

// Get all published services
const getServices = asyncHandler(async (req, res) => {
  const { category, deliveryMode, q } = req.query;

  const filter = {
    status: "published",
  };

  if (category) {
    filter.category = category;
  }

  if (deliveryMode) {
    filter.deliveryMode = deliveryMode;
  }

  if (q) {
    filter.$or = [
      {
        title: {
          $regex: q,
          $options: "i",
        },
      },
      {
        description: {
          $regex: q,
          $options: "i",
        },
      },
      {
        slug: {
          $regex: q,
          $options: "i",
        },
      },
    ];
  }

  const services = await Service.find(filter);

  res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: services,
  });
});

// Create a new service
const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

// Get single published service
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findOne({
    _id: req.params.id,
    status: "published",
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const requiredDocuments = await DocumentRequirement.find({
    serviceId: service._id,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Service fetched successfully",
    data: {
      ...service.toObject(),
      requiredDocuments,
    },
  });
});

// Update service
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

// Delete service
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
};