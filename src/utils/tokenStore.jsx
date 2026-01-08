// tokenStore.js
import Cookies from "js-cookie";
import { BASE_URL } from "../config/config.jsx";
// Web-only implementation

const REFRESH_TOKEN_KEY = "izhaar_refresh";
const ACCESS_TOKEN_KEY = "izhaar_access";

export const getRefreshToken = () => {
  const token = Cookies.get(REFRESH_TOKEN_KEY);
  console.log(`[TokenStore] getRefreshToken: ${token ? 'Found' : 'Not found'}`);
  return token;
};

export const setRefreshToken = (token) => {
  console.log(`[TokenStore] setRefreshToken: ${token ? 'Setting token' : 'Removing token'}`);
  if (!token) {
    Cookies.remove(REFRESH_TOKEN_KEY);
    console.log('[TokenStore] setRefreshToken: Refresh token removed');
    return;
  }
  Cookies.set(REFRESH_TOKEN_KEY, token, { sameSite: "lax" });
  console.log('[TokenStore] setRefreshToken: Refresh token saved successfully');
};

export const getAccessToken = () => {
  try {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    console.log(`[TokenStore] getAccessToken: ${token ? 'Found' : 'Not found'}`);
    return token;
  } catch (error) {
    console.error('[TokenStore] getAccessToken error:', error);
    return null;
  }
};

export const setAccessToken = (token) => {
  console.log(`[TokenStore] setAccessToken: ${token ? 'Setting token' : 'Removing token'}`);
  if (!token) {
    Cookies.remove(ACCESS_TOKEN_KEY);
    console.log('[TokenStore] setAccessToken: Access token removed');
    return;
  }
  Cookies.set(ACCESS_TOKEN_KEY, token, { sameSite: "lax" });
  console.log('[TokenStore] setAccessToken: Access token saved successfully');
  // Verify token was actually saved
  const saved = Cookies.get(ACCESS_TOKEN_KEY);
  console.log(`[TokenStore] setAccessToken: Verification - Token ${saved ? 'exists' : 'FAILED TO SAVE'}`);
};

// (Auto refresh and native logic removed for web-only)
