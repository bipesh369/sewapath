import asyncHandler from "../utils/asyncHandler.js";
import DocumentRequirement from "../models/documentRequirement.model.js";
import Service from "../models/service.model.js";

// Add a document requirement to a service
const createDocumentRequirement = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const { label, mandatory, notes, order } = req.body;

  // Check whether the service exists
  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  const document = await DocumentRequirement.create({
    serviceId,
    label,
    mandatory,
    notes,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Document requirement created successfully",
    data: document,
  });
});

// Get all document requirements for a service
const getDocumentRequirements = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;

  const documents = await DocumentRequirement.find({
    serviceId,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    message: "Document requirements fetched successfully",
    data: documents,
  });
});

export default {
  createDocumentRequirement,
  getDocumentRequirements,
};