import axios from "axios";
import { getRefreshToken, setAccessToken } from './tokenStore';
import {BASE_URL } from '../config/config.jsx';

const api = axios.create({
  baseURL: BASE_URL + "/api",
  timeout: 30000, // Increased to 30 seconds for better reliability
});

(async () => {
  try {
    const { getAccessToken } = await import('./tokenStore');
    const token = await getAccessToken();
    console.log('[API] Initial access token:', token);
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error('[API] Error loading initial access token:', e);
  }
})();

// Auto refresh access token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Only handle 401 fallback, do not call scheduled refresh here
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = await getRefreshToken();
      console.log('[API] Interceptor (401): refreshToken', refreshToken);

      try {
        const res = await axios.post(BASE_URL + "/api/auth/refresh-token", {
          token: refreshToken,
        });

        const newToken = res.data.accessToken;
        console.log('[API] Interceptor (401): new accessToken from backend', newToken);
        await setAccessToken(newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        original.headers["Authorization"] = `Bearer ${newToken}`;
        console.log('[API] Interceptor (401): accessToken set in cookies/SecureStore');
        return api(original);
      } catch (refreshError) {
        console.log('[API] Interceptor (401): Refresh token failed:', refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default api;