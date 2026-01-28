import axios from "axios";

const api = axios.create({
  baseURL: "/api", // important: points directly to app/api folder
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data || error.message || "Something went wrong!";
    return Promise.reject(new Error(message));
  }
);

export default api;
