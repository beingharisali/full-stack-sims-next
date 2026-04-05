import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Yeh bilkul theek hai
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 👇 YEH LINES HUMEIN EXACT MASLA BATAYENGI 👇
    console.log("❌ FAILED URL:", error.config?.url);
    console.log("❌ FULL ERROR:", error.response?.data);
    console.log("❌ STATUS CODE:", error.response?.status);

    const message =
      error.response?.data?.message || error.message || "Something went wrong!";
    return Promise.reject(new Error(message));
  },
);

export default api;