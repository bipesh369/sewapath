import mongoose from "mongoose";

const eligibilityQuestionSchema = new mongoose.Schema(
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

    questionText: {
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

    options: [
      {
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

        value: {
          type: String,
          required: true,
          trim: true,
        },

        resultsInEligible: {
          type: Boolean,
          required: true,
        },

        nextQuestionOrder: {
          type: Number,
          default: null,
        },
      },
    ],

    isTerminal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

eligibilityQuestionSchema.index({
  serviceId: 1,
  order: 1,
});

const EligibilityQuestion = mongoose.model(
  "EligibilityQuestion",
  eligibilityQuestionSchema
);

export default EligibilityQuestion;