import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../api";
import { useUser } from "../Navbar/context/userContext";

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const res = await api.post(
        "/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success(res.data.message);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log("AXIOS ERROR:", error.response?.data);
      console.log("STATUS:", error.response?.status);
      const message = error.code === "ECONNABORTED"
        ? "The server took too long to respond. Please try again in a moment."
        : error.response?.data?.message
          || (error.request
            ? "Could not reach the server. Check the backend service and try again."
            : error.message)
          || "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  document.title = `Login - SkCodingSchool`;

  return (
    <>
      <div className="main-login w-[100vw] h-full bg-transparent flex justify-center items-center pt-32 pb-16 dark:bg-black dark:text-white">
        <div className="bgColor absolute top-16 left-8 w-44 h-44 rounded-full bg-[#da1317] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-100 left-1/2 w-44 h-44 rounded-full bg-[#fe00d4] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>
        <div className="bgColor fixed top-20 right-8 w-44 h-44 rounded-full bg-[#f7d52d] overflow-hidden blur-[85px] opacity-10 z-0 dark:opacity-20"></div>

        <div className="relative z-10 w-full max-w-md mx-4 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                placeholder="skcodingschool@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition duration-200 flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;