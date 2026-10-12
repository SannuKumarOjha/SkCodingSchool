import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";

const hashOtp = (otp) => createHash("sha256").update(otp).digest("hex");

const issueSignupOtp = async (user) => {
  const resendAvailableAt = user.signupOtpSentAt
    ? user.signupOtpSentAt.getTime() + 60_000
    : 0;

  if (Date.now() < resendAvailableAt) {
    const retryAfterSeconds = Math.ceil((resendAvailableAt - Date.now()) / 1000);
    const error = new Error("Please wait before requesting another code.");
    error.statusCode = 429;
    error.retryAfterSeconds = retryAfterSeconds;
    throw error;
  }

  const otp = randomInt(100000, 1000000).toString();
  user.signupOtpHash = hashOtp(otp);
  user.signupOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.signupOtpSentAt = new Date();
  user.signupOtpAttempts = 0;
  await user.save();

  try {
    await sendOtpMail(user.email, otp, user.username);
  } catch (error) {
    user.signupOtpSentAt = null;
    await user.save();
    throw error;
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = req.body.email.trim().toLowerCase();
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required fields",
      });
    }
    let user = await User.findOne({ email });
    if (user?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!user) {
      user = new User({ username, email, password: hashedPassword });
    } else {
      user.username = username;
      user.password = hashedPassword;
    }
    user.isVerified = false;
    await user.save();
    try {
      await issueSignupOtp(user);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      console.error("Signup verification email failed:", error);
      return res.status(502).json({
        success: false,
        message: "Your account is saved, but the verification email could not be sent. Please try resending the code.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "A 6-digit verification code has been sent to your email.",
    });
  } catch (error) {
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    if (error.code === "ECONNABORTED" || error.command === "AUTH") {
      console.error("Signup verification email failed:", error);
      return res.status(502).json({
        success: false,
        message: "Your account is saved, but the verification email could not be sent. Please try resending the code.",
      });
    }
    console.error("Signup failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create your account. Please try again.",
    });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const { otp } = req.body;

    if (!email || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter the 6-digit code sent to your email.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Your email is already verified. You can sign in.",
      });
    }

    if (!user.signupOtpHash || !user.signupOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active verification code. Request a new code.",
      });
    }

    if (user.signupOtpExpiresAt.getTime() <= Date.now()) {
      user.signupOtpHash = null;
      user.signupOtpExpiresAt = null;
      user.signupOtpAttempts = 0;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "The code has expired. Request a new one.",
      });
    }

    if (user.signupOtpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new code.",
      });
    }

    const candidateHash = Buffer.from(hashOtp(otp), "hex");
    const storedHash = Buffer.from(user.signupOtpHash, "hex");
    if (
      candidateHash.length !== storedHash.length
      || !timingSafeEqual(candidateHash, storedHash)
    ) {
      user.signupOtpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    user.signupOtpHash = null;
    user.signupOtpExpiresAt = null;
    user.signupOtpSentAt = null;
    user.signupOtpAttempts = 0;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Signup OTP verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not verify the code. Please try again.",
    });
  }
};

export const resendSignupOtp = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "No unverified signup was found for this email.",
      });
    }

    await issueSignupOtp(user);
    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      });
    }

    console.error("Resending signup OTP failed:", error);
    return res.status(502).json({
      success: false,
      message: "Could not send the verification code. Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the required fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(402).json({
        success: false,
        message: "Invalid Password",
      });
    }
    if (user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }
    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
      await Session.deleteOne({ userId: user._id });
    }
    await Session.create({ userId: user._id });

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    user.isLoggedIn = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    await Session.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If a verified account exists for that email, a reset code has been sent.",
      });
    }

    const resendAvailableAt = user.resetOtpSentAt
      ? user.resetOtpSentAt.getTime() + 60_000
      : 0;
    if (Date.now() < resendAvailableAt) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
        retryAfterSeconds: Math.ceil((resendAvailableAt - Date.now()) / 1000),
      });
    }

    const otp = randomInt(100000, 1000000).toString();
    user.resetOtpHash = hashOtp(otp);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpSentAt = new Date();
    user.resetOtpAttempts = 0;
    await user.save();

    try {
      await sendOtpMail(email, otp, user.username, "reset your password");
    } catch (error) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      user.resetOtpSentAt = null;
      await user.save();
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "If a verified account exists for that email, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Password reset code request failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send the reset code. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const email = typeof req.body.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  const { otp, newPassword, confirmPassword } = req.body;

  if (!email || typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      message: "Enter the email address and 6-digit reset code.",
    });
  }
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Your new password must be at least 6 characters long.",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "The reset code is invalid or expired. Request a new code.",
      });
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active reset code. Request a new one.",
      });
    }

    if (user.resetOtpExpiresAt.getTime() <= Date.now()) {
      user.resetOtpHash = null;
      user.resetOtpExpiresAt = null;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "The reset code has expired. Request a new one.",
      });
    }

    if (user.resetOtpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new reset code.",
      });
    }

    const candidateHash = Buffer.from(hashOtp(otp), "hex");
    const storedHash = Buffer.from(user.resetOtpHash, "hex");
    if (
      candidateHash.length !== storedHash.length
      || !timingSafeEqual(candidateHash, storedHash)
    ) {
      user.resetOtpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "The reset code is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    user.resetOtpSentAt = null;
    user.resetOtpAttempts = 0;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Your password has been reset. You can now sign in.",
    });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reset your password. Please try again.",
    });
  }
};
