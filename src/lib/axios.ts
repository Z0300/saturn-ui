// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ sends httpOnly cookie automatically on every request
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const { accessToken, setAuth, clearAuth } = useAuthStore.getState();

  // Access token expired — proactively refresh before sending request
  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
        null, // ← no body needed, cookie is sent automatically
        { withCredentials: true }, // ← send httpOnly cookie
      );
      setAuth(data.data);
      config.headers.Authorization = `Bearer ${data.data.accessToken}`;
    } catch {
      clearAuth();
      window.location.href = "/login";
      return Promise.reject("Session expired");
    }
  } else if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      const { setAuth, clearAuth } = useAuthStore.getState(); // ← no refreshToken needed

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
          null, // ← no body needed
          { withCredentials: true }, // ← cookie sent automatically
        );

        setAuth(data.data);
        queue.forEach((cb) => cb(data.data.accessToken));
        queue = [];
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        clearAuth();
        queue = [];
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
