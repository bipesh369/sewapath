import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import DocumentRequirement from "../models/documentRequirement.model.js";
import Service from "../models/service.model.js";

const createDocumentRequirement = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const document = await DocumentRequirement.create({
    serviceId,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Document requirement created successfully",
    data: document,
  });
});

const getDocumentRequirements = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const documents = await DocumentRequirement.find({
    serviceId,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Document requirements fetched successfully",
    data: documents,
  });
});

const updateDocumentRequirement = asyncHandler(async (req, res) => {
  const document = await DocumentRequirement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!document) {
    throw new ApiError(404, "Document requirement not found");
  }

  res.status(200).json({
    success: true,
    message: "Document requirement updated successfully",
    data: document,
  });
});

const deleteDocumentRequirement = asyncHandler(async (req, res) => {
  const document = await DocumentRequirement.findByIdAndDelete(
    req.params.id
  );

  if (!document) {
    throw new ApiError(404, "Document requirement not found");
  }

  res.status(200).json({
    success: true,
    message: "Document requirement deleted successfully",
    data: document,
  });
});

export default {
  createDocumentRequirement,
  getDocumentRequirements,
  updateDocumentRequirement,
  deleteDocumentRequirement,
};