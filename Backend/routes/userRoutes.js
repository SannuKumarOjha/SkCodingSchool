import express from "express";
import {
  registerUser,
  verification,
  loginUser,
  logoutUser,
  forgetPassword,
  verifyOTP,
  changePassword,
} from "../controlers/userControler.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validateUser, userSchema } from "../validators/userValidate.js";

const router = express.Router();

router.post("/register", validateUser(userSchema), registerUser);
router.post("/verify", verification);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.post("/forgot-password", forgetPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

export default router;
