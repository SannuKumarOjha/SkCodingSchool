import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    resetOtpHash: {
      type: String,
      default: null,
    },
    resetOtpExpiresAt: {
      type: Date,
      default: null,
    },
    resetOtpSentAt: {
      type: Date,
      default: null,
    },
    resetOtpAttempts: {
      type: Number,
      default: 0,
    },
    signupOtpHash: {
      type: String,
      default: null,
    },
    signupOtpExpiresAt: {
      type: Date,
      default: null,
    },
    signupOtpSentAt: {
      type: Date,
      default: null,
    },
    signupOtpAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);