import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
    },

    processingTime: {
      type: String,
      required: true,
    },

    deliveryMode: {
      type: String,
      required: true,
    }
},

  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service