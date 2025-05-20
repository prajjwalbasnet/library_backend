import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        returned: {
          type: Boolean,
          default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
      },
    ],
    reservedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reservation",
        },
        bookTitle: String,
        coverImage: {
          url: String,
        },
        reservationDate: Date,
        expirationDate: Date,
        status: {
          type: String,
          enum: ["Active", "Fulfilled", "Expired", "Cancelled"],
          default: "Active",
        },
      },
    ],
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { minimize: false },
  { timestamp: true }
);

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
