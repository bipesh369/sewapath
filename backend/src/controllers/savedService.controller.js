import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import SavedService from "../models/savedService.model.js";
import Service from "../models/service.model.js";

const saveService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findOne({
    _id: serviceId,
    status: "published",
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const existingSavedService = await SavedService.findOne({
    userId: req.user._id,
    serviceId,
  });

  if (existingSavedService) {
    throw new ApiError(409, "Service already saved");
  }

  const savedService = await SavedService.create({
    userId: req.user._id,
    serviceId,
  });

  res.status(201).json({
    success: true,
    message: "Service saved successfully",
    data: savedService,
  });
});

const getSavedServices = asyncHandler(async (req, res) => {
  const savedServices = await SavedService.find({
    userId: req.user._id,
  })
    .populate("serviceId")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Saved services fetched successfully",
    data: savedServices,
  });
});

const removeSavedService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const savedService = await SavedService.findOneAndDelete({
    userId: req.user._id,
    serviceId,
  });

  if (!savedService) {
    throw new ApiError(404, "Saved service not found");
  }

  res.status(200).json({
    success: true,
    message: "Service removed from saved services",
    data: savedService,
  });
});

export default {
  saveService,
  getSavedServices,
  removeSavedService,
};