
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import {
  setAccessToken as persistAccessToken,
  getAccessToken as tokenStoreGetAccessToken,
  getRefreshToken as tokenStoreGetRefreshToken,
  setRefreshToken as tokenStoreSetRefreshToken,
} from '../utils/tokenStore';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const [isAuthLoading, setIsAuthLoading] = useState(true); // ⭐ IMPORTANT

  const fetchUser = async () => {
    try {
      // Fetch both auth info and profile info as they might contain different details
      const results = await Promise.allSettled([
        api.get("/auth/user-info"),
        api.get("/profile/me")
      ]);

      let combinedData = {};

      // Process user info
      if (results[0].status === 'fulfilled') {
        combinedData = { ...combinedData, ...results[0].value.data };
      }

      // Process profile info (most important for profile_photo)
      if (results[1].status === 'fulfilled') {
        const profile = results[1].value.data.profile || results[1].value.data;
        combinedData = { ...combinedData, ...profile };
      }

      console.log('[AuthContext] Combined user data:', combinedData);
      setUser(combinedData);
    } catch (err) {
      console.error('[AuthContext] Unexpected error in fetchUser:', err);
    }
  };


  // Log whenever accessToken state changes
  useEffect(() => {
    if (accessToken) {
      console.log('[AuthContext] 📊 Current accessToken in state:', accessToken.substring(0, 50) + '...');
      fetchUser();
    } else {
      console.log('[AuthContext] 📊 Current accessToken in state: null');
      setUser(null);
    }
  }, [accessToken]);

  // ------------------------------
  // LOAD TOKEN ON APP STARTUP
  // ------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        console.log('[AuthContext] 🚀 Loading initial auth state...');

        // Initialize token system (removed: initializeTokenSystem)

        const token = await tokenStoreGetAccessToken();
        if (token) {
          // Just set state and header, don't call startAutoRefresh again
          setAccessTokenState(token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('[AuthContext] Access token loaded from storage');
        }
      } catch (e) {
        console.error('[AuthContext] Error loading auth:', e);
      }
      setIsAuthLoading(false); // ⭐ done loading auth
    };

    load();
  }, []);

  // ------------------------------
  // CLEAR AUTH
  // ------------------------------
  const clearAuth = async () => {
    console.log('[AuthContext] Clearing auth...');
    setAccessTokenState(null);
    setRole(null);
    setUser(null);

    await tokenStoreSetRefreshToken(null);
    await persistAccessToken(null);

    // Auto-refresh logic removed
  };

  // ------------------------------
  // REFRESH TOKEN HANDLING
  // ------------------------------
  const getRefreshToken = async () => {
    try {
      return await tokenStoreGetRefreshToken();
    } catch {
      return null;
    }
  };

  const setRefreshToken = async (token) => {
    try {
      await tokenStoreSetRefreshToken(token);
    } catch { }
  };

  // ------------------------------
  // SET ROLE
  // ------------------------------
  const setRoleAndStore = (r) => {
    setRole(r);
  };

  // ------------------------------
  // SET ACCESS TOKEN
  // ------------------------------
  const setAccessToken = (t) => {
    console.log(`[AuthContext] setAccessToken called: ${t ? 'Setting token' : 'Removing token'}`);
    setAccessTokenState(t);

    if (t) {
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      persistAccessToken(t);

      // Auto-refresh logic removed
    } else {
      delete api.defaults.headers.common['Authorization'];
      persistAccessToken(null);

      // Auto-refresh logic removed
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        user,
        setUser,
        fetchUser,
        setAccessToken,
        setRole: setRoleAndStore,
        clearAuth,
        getRefreshToken,
        setRefreshToken,
        isAuthLoading, // ⭐ must use this everywhere
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

