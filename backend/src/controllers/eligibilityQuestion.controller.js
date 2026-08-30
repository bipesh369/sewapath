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

  return res.status(201).json({
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

  return res.status(200).json({
    success: true,
    message: "Eligibility questions fetched successfully",
    data: questions,
  });
});

const evaluateEligibility = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { answers } = req.body;

  // 1. Validate answers
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new ApiError(400, "Answers are required");
  }

  // 2. Check service
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // 3. Get all questions for this service
  const questions = await EligibilityQuestion.find({
    serviceId,
  }).sort({ order: 1 });

  if (questions.length === 0) {
    throw new ApiError(
      404,
      "No eligibility questions found for this service"
    );
  }

  // 4. Create quick lookup by question order
  const questionMap = new Map(
    questions.map((question) => [question.order, question])
  );

  // 5. Create lookup for submitted answers
  const answerMap = new Map(
    answers.map((answer) => [answer.questionOrder, answer.value])
  );

  // Start from the first question
  let currentQuestionOrder = questions[0].order;

  while (currentQuestionOrder !== null) {
    const question = questionMap.get(currentQuestionOrder);

    if (!question) {
      throw new ApiError(
        400,
        `Question ${currentQuestionOrder} not found`
      );
    }

    const selectedValue = answerMap.get(currentQuestionOrder);

    if (!selectedValue) {
      throw new ApiError(
        400,
        `Answer for question ${currentQuestionOrder} is required`
      );
    }

    // Find selected option
    const selectedOption = question.options.find(
      (option) => option.value === selectedValue
    );

    if (!selectedOption) {
      throw new ApiError(
        400,
        `Invalid answer for question ${currentQuestionOrder}`
      );
    }

    // If this answer makes the citizen ineligible
    if (!selectedOption.resultsInEligible) {
      return res.status(200).json({
        success: true,
        message: "Eligibility evaluated successfully",
        data: {
          eligible: false,
          reason: `You are not eligible for ${service.title}.`,
          alternativeServices: [],
        },
      });
    }

    // Terminal question means eligibility is decided
    if (question.isTerminal) {
      return res.status(200).json({
        success: true,
        message: "Eligibility evaluated successfully",
        data: {
          eligible: true,
          reason: `You are eligible for ${service.title}.`,
          alternativeServices: [],
        },
      });
    }

    // Move to the next question
    currentQuestionOrder = selectedOption.nextQuestionOrder;
  }

  // Safety fallback
  return res.status(200).json({
    success: true,
    message: "Eligibility evaluated successfully",
    data: {
      eligible: false,
      reason: "Eligibility could not be determined.",
      alternativeServices: [],
    },
  });
});


export default {
  createEligibilityQuestion,
  getEligibilityQuestions,
  evaluateEligibility,
};