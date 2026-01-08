
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

  const [isAuthLoading, setIsAuthLoading] = useState(true); // ⭐ IMPORTANT

  // Log whenever accessToken state changes
  useEffect(() => {
    if (accessToken) {
      console.log('[AuthContext] 📊 Current accessToken in state:', accessToken.substring(0, 50) + '...');
    } else {
      console.log('[AuthContext] 📊 Current accessToken in state: null');
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
    } catch {}
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
