import mongoose from "mongoose";

const savedServiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedServiceSchema.index(
  { userId: 1, serviceId: 1 },
  { unique: true }
);

const SavedService = mongoose.model(
  "SavedService",
  savedServiceSchema
);

export default SavedService;