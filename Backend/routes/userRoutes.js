import express from "express";
import {
  registerUser,
  verifySignupOtp,
  resendSignupOtp,
  loginUser,
  getCurrentUser,
  updateProfile,
  recordReadingProgress,
  requestEmailChangeOtp,
  verifyEmailChangeOtp,
  logoutUser,
  forgetPassword,
  resetPassword,
} from "../controlers/userControler.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateUser, userSchema } from "../validators/userValidate.js";

const router = express.Router();

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify-otp", verifySignupOtp);
router.post("/resend-verification-otp", resendSignupOtp);
router.post("/login", loginUser);
router.get("/me", isAuthenticated, getCurrentUser);
router.patch("/profile", isAuthenticated, updateProfile);
router.post("/profile/email/request", isAuthenticated, requestEmailChangeOtp);
router.post("/profile/email/verify", isAuthenticated, verifyEmailChangeOtp);
router.post("/progress", isAuthenticated, recordReadingProgress);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
