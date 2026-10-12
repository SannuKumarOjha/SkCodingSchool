import React, { useEffect } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = React.useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.post(
          "/user/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data.success) {
          setStatus("✅ Email Verified Successfully");
          setTimeout(() => {
            navigate("/main");
          }, 2000);
        } else {
          setStatus("❌ Invalid verification token.");
        }
      } catch (error) {
        console.log(error);
        setStatus("❌ Verification failed. Please try again.");
      }
    };
    verifyEmail();
  }, [token, navigate]);
  return (
    <div className="relative w-full h-[760px] bg-gray-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};

export default Verify;
