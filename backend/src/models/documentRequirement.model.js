import mongoose from "mongoose";

const documentRequirementSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    label: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      ne: {
        type: String,
        required: true,
        trim: true,
      },
    },

    mandatory: {
      type: Boolean,
      default: true,
    },

    notes: {
      en: {
        type: String,
        trim: true,
      },
      ne: {
        type: String,
        trim: true,
      },
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

documentRequirementSchema.index({
  serviceId: 1,
  order: 1,
});

const DocumentRequirement = mongoose.model(
  "DocumentRequirement",
  documentRequirementSchema
);

export default DocumentRequirement;