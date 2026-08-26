import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    name: {
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

    address: {
      type: String,
      required: true,
      trim: true,
    },

    province: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    municipality: {
      type: String,
      required: true,
      trim: true,
    },

    ward: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    hours: {
      type: String,
      trim: true,
    },

    mapUrl: {
      type: String,
      trim: true,
    },

    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Office = mongoose.model("Office", officeSchema);

export default Office;