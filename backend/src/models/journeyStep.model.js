import mongoose from "mongoose";

const journeyStepSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    title: {
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

    instructions: {
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

    responsibleOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      default: null,
    },

    estimatedTime: {
      en: {
        type: String,
        trim: true,
      },
      ne: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

journeyStepSchema.index({
  serviceId: 1,
  order: 1,
});

const JourneyStep = mongoose.model(
  "JourneyStep",
  journeyStepSchema
);

export default JourneyStep;