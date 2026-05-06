let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const authStore = {
  getToken: () => accessToken,

  setToken: (token: string | null) => {
    accessToken = token;
  },

  clearToken: () => {
    accessToken = null;
  },

  // Prevent parallel refresh storms
  getRefreshPromise: () => refreshPromise,
  setRefreshPromise: (p: Promise<string | null> | null) => {
    refreshPromise = p;
  },
};