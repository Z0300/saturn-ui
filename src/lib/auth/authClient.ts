import axios from "axios";
import { authStore } from "./authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Required: sends httpOnly refresh cookie
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = authStore.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Deduplicate concurrent refresh calls
      let refreshPromise = authStore.getRefreshPromise();
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
        authStore.setRefreshPromise(refreshPromise);
      }

      const newToken = await refreshPromise;
      authStore.setRefreshPromise(null);

      if (newToken) {
        authStore.setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      // Refresh failed — force logout
      authStore.clearToken();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

async function refreshAccessToken(): Promise<string | null> {
  try {
    // Cookie is sent automatically via withCredentials
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return data.accessToken;
  } catch {
    return null;
  }
}