import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // eligibility: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    fee: {
      type: Number,
      required: true,
      min: 0,
    },

    processingTime: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryMode: {
      type: String,
      required: true,
      trim: true,
    },

    officialUrl: {
      type: String,
      trim: true,
    },

    status: {
  type: String,
  enum: ["draft", "published", "archived"],
  default: "draft",
  },
},

  {
    timestamps: true,
  }
);

serviceSchema.index({
  status: 1,
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;