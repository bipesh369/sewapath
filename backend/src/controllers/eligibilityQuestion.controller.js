import asyncHandler from "../utils/asyncHandler.js";
import EligibilityQuestion from "../models/eligibilityQuestion.model.js";
import Service from "../models/service.model.js";
import ApiError from "../utils/apiError.js";


const createEligibilityQuestion = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const {
    order,
    questionText,
    options,
    isTerminal,
  } = req.body;

// Check if service exists
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const question = await EligibilityQuestion.create({
    serviceId,
    order,
    questionText,
    options,
    isTerminal,
  });

  res.status(201).json({
    success: true,
    message: "Eligibility question created successfully",
    data: question,
  });
});

const getEligibilityQuestions = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const questions = await EligibilityQuestion.find({
    serviceId,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Eligibility questions fetched successfully",
    data: questions,
  });
});

export default {
  createEligibilityQuestion,
  getEligibilityQuestions,
};