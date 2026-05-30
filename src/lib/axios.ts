import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../utils/jwt";
import { navigate } from "../lib/navigate";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const SKIP_REFRESH_ROUTES = [
  "/v1/auth/login",
  "/v1/auth/refresh",
  "/v1/auth/register",
];

const isSkipRoute = (url?: string) =>
  SKIP_REFRESH_ROUTES.some((route) => url?.includes(route));

api.interceptors.request.use(async (config) => {
  const { accessToken, setAuth, clearAuth } = useAuthStore.getState();

  if (!isSkipRoute(config.url) && accessToken && isTokenExpired(accessToken)) {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
        null,
        { withCredentials: true },
      );
      setAuth(data.data);
      config.headers.Authorization = `Bearer ${data.data.accessToken}`;
    } catch {
      clearAuth();
      navigate({ to: "/login" });
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
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isSkipRoute(original.url)
    ) {
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
      const { setAuth, clearAuth } = useAuthStore.getState();

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/auth/refresh`,
          null,
          { withCredentials: true },
        );

        setAuth(data.data);
        queue.forEach((cb) => cb(data.data.accessToken));
        queue = [];
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        clearAuth();
        queue = [];
        navigate({ to: "/login" });
        return Promise.reject(refreshError); // ✅
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
