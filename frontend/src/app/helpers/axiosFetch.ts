import axios from "axios";
import { getItem, setItem } from "./localStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      switch (status) {
        case 400:
          return Promise.reject(
            new Error(
              serverMessage || "Invalid request. Please check your input."
            )
          );

        case 401:
          // Only redirect to login if this is not the login/signin request itself
          if (!error.config?.url?.includes("/signin")) {
            setItem("token", undefined);
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
          return Promise.reject(
            new Error(serverMessage || "Invalid credentials. Please try again.")
          );

        case 403:
          return Promise.reject(
            new Error(serverMessage || "You don't have permission to do this.")
          );

        case 404:
          return Promise.reject(
            new Error(serverMessage || "Resource not found.")
          );

        case 409:
          return Promise.reject(
            new Error(serverMessage || "This item already exists.")
          );

        case 413:
          return Promise.reject(
            new Error(serverMessage || "File is too large.")
          );

        case 429:
          return Promise.reject(
            new Error(
              serverMessage || "Too many requests. Please wait and try again."
            )
          );

        case 500:
        case 502:
        case 503:
          return Promise.reject(
            new Error(serverMessage || "Server error. Please try again later.")
          );

        default:
          return Promise.reject(
            new Error(serverMessage || "An error occurred. Please try again.")
          );
      }
    }

    if (error.message === "Network Error" || error.code === "ECONNABORTED") {
      return Promise.reject(
        new Error("No internet connection. Please check your network.")
      );
    }

    return Promise.reject(error);
  }
);
export default api;
