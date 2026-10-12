import User from "../models/userModels.js";
import PendingSignup from "../models/pendingSignupModel.js";
import { Session } from "../models/sessionModel.js";

const migrateUnverifiedUsers = async () => {
  const unverifiedUsers = await User.find({ isVerified: { $ne: true } });
  let migratedCount = 0;

  for (const user of unverifiedUsers) {
    let pendingSignup = await PendingSignup.findOne({ email: user.email });
    if (!pendingSignup) {
      pendingSignup = new PendingSignup({
        username: user.username,
        email: user.email,
        password: user.password,
        otpHash: user.signupOtpHash,
        otpExpiresAt: user.signupOtpExpiresAt,
        otpSentAt: user.signupOtpSentAt,
        otpAttempts: user.signupOtpAttempts,
      });
      await pendingSignup.save();
    }

    await Session.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });
    migratedCount += 1;
  }

  if (migratedCount > 0) {
    console.log(`Moved ${migratedCount} unverified account(s) to pending signup storage`);
  }
};

export default migrateUnverifiedUsers;
