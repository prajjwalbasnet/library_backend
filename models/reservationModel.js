import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      studentId: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    book: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      coverImage: {
        url: String,
      },
    },
    reservedDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Fulfilled", "Expired", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const reservationModel =
  mongoose.models.reservation ||
  mongoose.model("reservation", reservationSchema);
