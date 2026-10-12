import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import User from "../models/userModels.js";
import PendingSignup from "../models/pendingSignupModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";

const hashOtp = (otp) => createHash("sha256").update(otp).digest("hex");
const allowedReadingLessons = new Set([
  "html-home",
  "html-introduction",
  "html-basic",
  "html-editors",
  "html-elements",
  "html-attributes",
  "html-headings",
  "html-paragraphs",
  "html-styles",
  "html-formattings",
  "css-full-course",
]);

const toPublicUser = (user) => {
  const publicUser = user.toObject();
  [
    "password",
    "signupOtpHash",
    "signupOtpExpiresAt",
    "signupOtpSentAt",
    "signupOtpAttempts",
    "resetOtpHash",
    "resetOtpExpiresAt",
    "resetOtpSentAt",
    "resetOtpAttempts",
    "pendingEmail",
    "emailChangeOtpHash",
    "emailChangeOtpExpiresAt",
    "emailChangeOtpSentAt",
    "emailChangeOtpAttempts",
  ].forEach((key) => delete publicUser[key]);
  return publicUser;
};

const getEmailDeliveryHelp = (error) => {
  const message = String(error?.message || "");

  if (
    message.includes("Email delivery is not configured")
    || message.includes("MAIL_FROM must be set")
  ) {
    return "OTP email is not configured. In Render, set RESEND_API_KEY and MAIL_FROM to an address on a verified Resend domain, then redeploy.";
  }

  if (message.includes("Resend email delivery failed")) {
    return "Resend rejected the email. Check the API key and verify the sender domain used by MAIL_FROM in Resend, then try again.";
  }

  return "The email provider could not send the code. Check the Render service logs and Resend delivery status, then try again.";
};

const isEmailDeliveryError = (error) => {
  const message = String(error?.message || "");
  return message.includes("Email delivery is not configured")
    || message.includes("MAIL_FROM must be set")
    || message.includes("Resend email delivery failed")
    || message.includes("fetch failed")
    || error?.name === "TimeoutError";
};

const issueSignupOtp = async (pendingSignup) => {
  const resendAvailableAt = pendingSignup.otpSentAt
    ? pendingSignup.otpSentAt.getTime() + 60_000
    : 0;

  if (Date.now() < resendAvailableAt) {
    const retryAfterSeconds = Math.ceil((resendAvailableAt - Date.now()) / 1000);
    const error = new Error("Please wait before requesting another code.");
    error.statusCode = 429;
    error.retryAfterSeconds = retryAfterSeconds;
    throw error;
  }

  const otp = randomInt(100000, 1000000).toString();
  pendingSignup.otpHash = hashOtp(otp);
  pendingSignup.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  pendingSignup.otpSentAt = new Date();
  pendingSignup.otpAttempts = 0;
  await pendingSignup.save();

  try {
    await sendOtpMail(pendingSignup.email, otp, pendingSignup.username);
  } catch (error) {
    pendingSignup.otpSentAt = null;
    await pendingSignup.save();
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
    const existingUser = await User.findOne({ email });
    if (existingUser?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let pendingSignup = await PendingSignup.findOne({ email });
    if (!pendingSignup) {
      pendingSignup = new PendingSignup({
        username,
        email,
        password: hashedPassword,
      });
    } else {
      pendingSignup.username = username;
      pendingSignup.password = hashedPassword;
    }
    await pendingSignup.save();
    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ _id: existingUser._id });
    }

    try {
      await issueSignupOtp(pendingSignup);
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      console.error("Signup verification email failed:", error);
      return res.status(502).json({
        success: false,
        message: `Your signup is pending, but its OTP email was not sent. ${getEmailDeliveryHelp(error)}`,
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
        message: `Your signup is pending, but its OTP email was not sent. ${getEmailDeliveryHelp(error)}`,
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

    const pendingSignup = await PendingSignup.findOne({ email });
    const legacyUser = pendingSignup
      ? null
      : await User.findOne({ email, isVerified: false });
    if (!pendingSignup && !legacyUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (pendingSignup) {
      const verifiedUser = await User.findOne({
        email: pendingSignup.email,
        isVerified: true,
      });
      if (verifiedUser) {
        await PendingSignup.deleteOne({ _id: pendingSignup._id });
        return res.status(200).json({
          success: true,
          message: "Your email is already verified. You can sign in.",
        });
      }

      if (!pendingSignup.otpHash || !pendingSignup.otpExpiresAt) {
        return res.status(400).json({
          success: false,
          message: "No active verification code. Request a new code.",
        });
      }

      if (pendingSignup.otpExpiresAt.getTime() <= Date.now()) {
        pendingSignup.otpHash = null;
        pendingSignup.otpExpiresAt = null;
        pendingSignup.otpAttempts = 0;
        await pendingSignup.save();
        return res.status(400).json({
          success: false,
          message: "The code has expired. Request a new one.",
        });
      }

      if (pendingSignup.otpAttempts >= 5) {
        return res.status(429).json({
          success: false,
          message: "Too many incorrect attempts. Request a new code.",
        });
      }

      const candidateHash = Buffer.from(hashOtp(otp), "hex");
      const storedHash = Buffer.from(pendingSignup.otpHash, "hex");
      if (
        candidateHash.length !== storedHash.length
        || !timingSafeEqual(candidateHash, storedHash)
      ) {
        pendingSignup.otpAttempts += 1;
        await pendingSignup.save();
        return res.status(400).json({
          success: false,
          message: "Incorrect verification code.",
        });
      }

      await User.create({
        username: pendingSignup.username,
        email: pendingSignup.email,
        password: pendingSignup.password,
        isVerified: true,
      });
      await PendingSignup.deleteOne({ _id: pendingSignup._id });
      return res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now sign in.",
      });
    }

    const user = legacyUser;
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

    const pendingSignup = await PendingSignup.findOne({ email });
    if (pendingSignup) {
      await issueSignupOtp(pendingSignup);
      return res.status(200).json({
        success: true,
        message: "A new verification code has been sent.",
      });
    }

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No unverified signup was found for this email.",
      });
    }

    const resendAvailableAt = user.signupOtpSentAt
      ? user.signupOtpSentAt.getTime() + 60_000
      : 0;
    if (Date.now() < resendAvailableAt) {
      const retryAfterSeconds = Math.ceil((resendAvailableAt - Date.now()) / 1000);
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
        retryAfterSeconds,
      });
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
      message: getEmailDeliveryHelp(error),
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
    const authenticatedUser = toPublicUser(user);
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      accessToken,
      refreshToken,
      user: authenticatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.isVerified !== true) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    return res.status(200).json({
      success: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Fetching authenticated user failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not validate your session.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.isVerified !== true) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { username, phone, skills } = req.body;
    if (username !== undefined) {
      if (
        typeof username !== "string"
        || username.trim().length < 3
        || username.trim().length > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 3 and 50 characters.",
        });
      }
      user.username = username.trim();
    }

    if (phone !== undefined) {
      if (
        typeof phone !== "string"
        || phone.trim().length > 25
        || (phone.trim() && !/^[+()\d\s.-]{7,25}$/.test(phone.trim()))
      ) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid phone number, or leave it blank.",
        });
      }
      user.phone = phone.trim();
    }

    if (skills !== undefined) {
      if (
        !Array.isArray(skills)
        || skills.length > 20
        || skills.some((skill) => (
          typeof skill !== "string"
          || skill.trim().length < 1
          || skill.trim().length > 40
        ))
      ) {
        return res.status(400).json({
          success: false,
          message: "Add up to 20 skills, each between 1 and 40 characters.",
        });
      }
      user.skills = [...new Set(skills.map((skill) => skill.trim()))];
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Updating profile failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update your profile. Please try again.",
    });
  }
};

export const recordReadingProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    if (typeof lessonId !== "string" || !allowedReadingLessons.has(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "This lesson is not available for progress tracking.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { readingProgress: lessonId } },
      { new: true }
    );
    if (!user || user.isVerified !== true) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      readingProgress: user.readingProgress,
    });
  } catch (error) {
    console.error("Recording reading progress failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save reading progress.",
    });
  }
};

export const requestEmailChangeOtp = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const user = await User.findById(req.userId);
    if (!user || user.isVerified !== true) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (email === user.email) {
      return res.status(400).json({
        success: false,
        message: "This is already your account email.",
      });
    }
    if (await User.exists({ email, _id: { $ne: user._id } })) {
      return res.status(409).json({
        success: false,
        message: "An account already uses this email address.",
      });
    }

    if (
      user.emailChangeOtpSentAt
      && Date.now() < user.emailChangeOtpSentAt.getTime() + 60_000
    ) {
      const retryAfterSeconds = Math.ceil(
        (user.emailChangeOtpSentAt.getTime() + 60_000 - Date.now()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another code.",
        retryAfterSeconds,
      });
    }

    const otp = randomInt(100000, 1000000).toString();
    user.pendingEmail = email;
    user.emailChangeOtpHash = hashOtp(otp);
    user.emailChangeOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.emailChangeOtpSentAt = new Date();
    user.emailChangeOtpAttempts = 0;
    await user.save();

    try {
      await sendOtpMail(email, otp, user.username, "confirm your new email address");
    } catch (error) {
      user.pendingEmail = null;
      user.emailChangeOtpHash = null;
      user.emailChangeOtpExpiresAt = null;
      user.emailChangeOtpSentAt = null;
      await user.save();
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: `A verification code was sent to ${email}.`,
    });
  } catch (error) {
    console.error("Requesting email change verification failed:", error);
    if (error.statusCode === 429) {
      return res.status(429).json({
        success: false,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
      });
    }
    if (isEmailDeliveryError(error)) {
      return res.status(502).json({
        success: false,
        message: getEmailDeliveryHelp(error),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Could not send the verification code. Please try again.",
    });
  }
};

export const verifyEmailChangeOtp = async (req, res) => {
  try {
    const otp = typeof req.body.otp === "string" ? req.body.otp.trim() : "";
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter the 6-digit code sent to your new email address.",
      });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.pendingEmail || !user.emailChangeOtpHash || !user.emailChangeOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "No active email verification code. Request a new one.",
      });
    }
    if (user.emailChangeOtpExpiresAt.getTime() <= Date.now()) {
      user.pendingEmail = null;
      user.emailChangeOtpHash = null;
      user.emailChangeOtpExpiresAt = null;
      user.emailChangeOtpSentAt = null;
      user.emailChangeOtpAttempts = 0;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "The code has expired. Request a new one.",
      });
    }
    if (user.emailChangeOtpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Request a new code.",
      });
    }

    const candidateHash = Buffer.from(hashOtp(otp), "hex");
    const storedHash = Buffer.from(user.emailChangeOtpHash, "hex");
    if (
      candidateHash.length !== storedHash.length
      || !timingSafeEqual(candidateHash, storedHash)
    ) {
      user.emailChangeOtpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }
    if (await User.exists({ email: user.pendingEmail, _id: { $ne: user._id } })) {
      return res.status(409).json({
        success: false,
        message: "An account already uses this email address. Request a code for another email.",
      });
    }

    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.emailChangeOtpHash = null;
    user.emailChangeOtpExpiresAt = null;
    user.emailChangeOtpSentAt = null;
    user.emailChangeOtpAttempts = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email address updated successfully.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Verifying email change failed:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account already uses this email address.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Could not verify the new email. Please try again.",
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
    if (isEmailDeliveryError(error)) {
      return res.status(502).json({
        success: false,
        message: getEmailDeliveryHelp(error),
      });
    }
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
