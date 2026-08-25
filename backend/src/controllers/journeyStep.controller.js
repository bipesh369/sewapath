import asyncHandler from "../utils/asyncHandler.js";
import JourneyStep from "../models/journeyStep.model.js";
import Service from "../models/service.model.js";
import ApiError from "../utils/apiError.js";

const createJourneyStep = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const {
    order,
    title,
    instructions,
    responsibleOffice,
    estimatedTime,
  } = req.body;

  // Check whether the service exists
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const journeyStep = await JourneyStep.create({
    serviceId,
    order,
    title,
    instructions,
    responsibleOffice,
    estimatedTime,
  });

  res.status(201).json({
    success: true,
    message: "Journey step created successfully",
    data: journeyStep,
  });
});

const getJourneySteps = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  // Check whether the service exists
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const journeySteps = await JourneyStep.find({
    serviceId,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Journey steps fetched successfully",
    data: journeySteps,
  });
});

export default{
  createJourneyStep,
  getJourneySteps,
};