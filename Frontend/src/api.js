import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL?.trim();
const isProduction = process.env.NODE_ENV === "production";

const api = axios.create({
  baseURL: (apiUrl || (isProduction ? "" : "http://localhost:8000")).replace(/\/+$/, ""),
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  if (isProduction && !apiUrl) {
    return Promise.reject(
      new Error(
        "REACT_APP_API_URL is not configured. Set it to your Render API URL in Vercel, then redeploy."
      )
    );
  }

  return config;
});

export default api;
