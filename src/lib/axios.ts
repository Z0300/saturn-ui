import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const { accessToken, refreshToken, setAuth, clearAuth } =
    useAuthStore.getState();

  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
        { refreshToken },
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

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
          { refreshToken },
        );

        setAuth(data.data);
        queue.forEach((cb) => cb(data.data.accessToken));
        queue = [];
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        clearAuth();
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
