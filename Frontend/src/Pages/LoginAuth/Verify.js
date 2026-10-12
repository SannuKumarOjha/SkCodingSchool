import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle, MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const from = location.state?.from || "/";
  const [otp, setOtp] = useState("");
  const [mailPending, setMailPending] = useState(
    Boolean(location.state?.mailPending)
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    try {
      setIsVerifying(true);
      const response = await api.post("/user/verify-otp", { email, otp });
      toast.success(response.data.message);
      navigate("/login", {
        replace: true,
        state: { from: { pathname: from } },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message
          || (error.request
            ? "Could not reach the server. Please try again."
            : error.message)
          || "Could not verify the code."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      const response = await api.post("/user/resend-verification-otp", { email });
      setOtp("");
      setMailPending(false);
      toast.success(response.data.message);
    } catch (error) {
      const wait = error.response?.data?.retryAfterSeconds;
      toast.error(
        wait
          ? `Please wait ${wait} seconds before requesting another code.`
          : error.response?.data?.message
            || "Could not resend the code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  document.title = "Verify Email - SkCodingSchool";

  return (
    <main className="main-login flex min-h-[calc(100vh-80px)] items-center justify-center px-4 pt-28 pb-16 dark:bg-gray-950">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <MailCheck size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Verify your email
        </h1>
        {email ? (
          <>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {mailPending
                ? <>Your signup is pending, but the code could not be emailed to <strong className="break-all">{email}</strong>. Once the email settings are fixed, use the button below to request a code.</>
                : <>A 6-digit code was requested for <strong className="break-all">{email}</strong>.
                  Enter it below to activate your account. The code expires in 10 minutes.</>}
            </p>
            <form className="mt-7 space-y-4" onSubmit={handleVerify}>
              <label className="sr-only" htmlFor="signup-otp">
                6-digit verification code
              </label>
              <input
                id="signup-otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                required
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify email"
                )}
              </button>
            </form>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isVerifying}
              className="mt-5 text-sm font-semibold text-blue-600 hover:underline disabled:opacity-60 dark:text-blue-400"
            >
              {isResending
                ? "Sending a new code..."
                : mailPending
                  ? "Try sending code again"
                  : "Resend code"}
            </button>
          </>
        ) : (
          <div className="mt-3">
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              Start by creating an account. We’ll email you a code to verify your address.
            </p>
            <Link
              to="/signup"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Create an account
            </Link>
          </div>
        )}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already verified?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Verify;
