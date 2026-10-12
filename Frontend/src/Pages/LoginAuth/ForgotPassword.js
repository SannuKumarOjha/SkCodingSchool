import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, LoaderCircle, MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    try {
      setIsSending(true);
      const response = await api.post("/user/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setCodeSent(true);
      toast.success(response.data.message);
    } catch (error) {
      const wait = error.response?.data?.retryAfterSeconds;
      toast.error(
        wait
          ? `Please wait ${wait} seconds before requesting another code.`
          : error.response?.data?.message
            || (error.request
              ? "Could not reach the server. Please try again."
              : error.message)
            || "Could not send the reset code."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Your new password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsResetting(true);
      const response = await api.post("/user/reset-password", {
        email: email.trim().toLowerCase(),
        otp,
        newPassword,
        confirmPassword,
      });
      toast.success(response.data.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message
          || (error.request
            ? "Could not reach the server. Please try again."
            : error.message)
          || "Could not reset your password."
      );
    } finally {
      setIsResetting(false);
    }
  };

  document.title = "Reset Password - SkCodingSchool";

  return (
    <main className="main-login flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-28 pb-16 dark:bg-gray-950">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          {codeSent ? (
            <KeyRound size={28} aria-hidden="true" />
          ) : (
            <MailCheck size={28} aria-hidden="true" />
          )}
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {codeSent ? "Reset your password" : "Forgot your password?"}
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-300">
          {codeSent
            ? <>Enter the 6-digit code sent to <strong className="break-all">{email}</strong>, then choose a new password. The code expires in 10 minutes.</>
            : "Enter your account email and we’ll send you a one-time password reset code."}
        </p>

        {!codeSent ? (
          <form className="mt-7 space-y-5" onSubmit={handleRequestCode}>
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? (
                <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Sending code...</>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="reset-otp" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                6-digit reset code
              </label>
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="000000"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your new password again"
              />
            </div>
            <button
              type="submit"
              disabled={isResetting || otp.length !== 6}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResetting ? (
                <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Resetting password...</>
              ) : (
                "Reset password"
              )}
            </button>
            <button
              type="button"
              disabled={isSending || isResetting}
              onClick={handleRequestCode}
              className="w-full text-sm font-semibold text-blue-600 hover:underline disabled:opacity-60 dark:text-blue-400"
            >
              {isSending ? "Sending a new code..." : "Resend code"}
            </button>
            <button
              type="button"
              disabled={isSending || isResetting}
              onClick={() => {
                setCodeSent(false);
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full text-sm text-gray-500 hover:underline disabled:opacity-60 dark:text-gray-400"
            >
              Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
