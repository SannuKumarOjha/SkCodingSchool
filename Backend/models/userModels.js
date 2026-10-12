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
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    readingProgress: {
      type: [String],
      default: [],
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
    pendingEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    emailChangeOtpHash: {
      type: String,
      default: null,
    },
    emailChangeOtpExpiresAt: {
      type: Date,
      default: null,
    },
    emailChangeOtpSentAt: {
      type: Date,
      default: null,
    },
    emailChangeOtpAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);