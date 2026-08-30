import Service from "../models/service.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import DocumentRequirement from "../models/documentRequirement.model.js";

// Get all published services
const getServices = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.query.limit) || 10, 1),
    50
  );

  const skip = (page - 1) * limit;

  const filter = {
    status: "published",
  };

  const [services, total] = await Promise.all([
    Service.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Service.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: services,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
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

const matchServices = asyncHandler(async (req, res) => {
  const { goalText } = req.body;

  if (!goalText || !goalText.trim()) {
    throw new ApiError(400, "goalText is required");
  }

  const services = await Service.find({
    status: "published",
  });

  const keywords = goalText
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  const matches = services
    .map((service) => {
      const searchableText = `
        ${service.title}
        ${service.slug}
        ${service.description}
        ${service.category}
      `.toLowerCase();

      let score = 0;

      keywords.forEach((keyword) => {
        if (searchableText.includes(keyword)) {
          score += 1;
        }
      });

      return {
        service,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  res.status(200).json({
    success: true,
    message: "Services matched successfully",
    data: matches,
  });
});


export default {
  getServices,
  createService,
  getServiceById,
  updateService,
  deleteService,
  matchServices,
};