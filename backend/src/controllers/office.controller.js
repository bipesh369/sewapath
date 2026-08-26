import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Office from "../models/office.model.js";

const createOffice = asyncHandler(async (req, res) => {
  const office = await Office.create(req.body);

  res.status(201).json({
    success: true,
    message: "Office created successfully",
    data: office,
  });
});

const getOffices = asyncHandler(async (req, res) => {
  const offices = await Office.find();

  res.status(200).json({
    success: true,
    message: "Offices fetched successfully",
    data: offices,
  });
});

const getOfficeById = asyncHandler(async (req, res) => {
  const office = await Office.findById(req.params.id);

  if (!office) {
    throw new ApiError(404, "Office not found");
  }

  res.status(200).json({
    success: true,
    message: "Office fetched successfully",
    data: office,
  });
});

const updateOffice = asyncHandler(async (req, res) => {
  const office = await Office.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!office) {
    throw new ApiError(404, "Office not found");
  }

  res.status(200).json({
    success: true,
    message: "Office updated successfully",
    data: office,
  });
});

const deleteOffice = asyncHandler(async (req, res) => {
  const office = await Office.findByIdAndDelete(req.params.id);

  if (!office) {
    throw new ApiError(404, "Office not found");
  }

  res.status(200).json({
    success: true,
    message: "Office deleted successfully",
    data: office,
  });
});

export default {
  createOffice,
  getOffices,
  getOfficeById,
  updateOffice,
  deleteOffice,
};