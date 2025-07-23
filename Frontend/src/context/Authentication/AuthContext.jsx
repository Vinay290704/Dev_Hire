import React, { createContext, useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const showToast = (msg, isError = false) => {
    if (isError) {
      toast.error(msg);
      setError(msg);
    } else {
      toast.success(msg);
      setMessage(msg);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("refreshToken");
    setMessage("");
    setError(null);
  };

  const register = async (name, username, email, password) => {
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}users/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
        });
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        showToast(data.message);
        return { success: true, user: data };
      } else {
        showToast(data.message || "Registration failed.", true);
        return {
          success: false,
          error: data.message || "Registration failed.",
        };
      }
    } catch (err) {
      showToast(`Network error during registration: ${err.message}`, true);
      return { success: false, error: `Network error: ${err.message}` };
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}users/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
        });
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        showToast(data.message);
        return { success: true, user: data };
      } else {
        showToast(data.message || "Login failed.", true);
        return { success: false, error: data.message || "Login failed." };
      }
    } catch (err) {
      showToast(`Network error during login: ${err.message}`, true);
      console.log(err.message)
      return { success: false, error: `Network error: ${err.message}` };
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    if (!refreshToken) {
      showToast("No refresh token available. Please log in.", true);
      clearAuth();
      setLoading(false);
      return { success: false, error: "No refresh token." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}users/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        showToast(data.message);
        return {
          success: true,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      } else {
        showToast(data.message || "Failed to refresh tokens.", true);
        clearAuth();
        return {
          success: false,
          error: data.message || "Failed to refresh tokens.",
        };
      }
    } catch (err) {
      showToast(`Network error during token refresh: ${err.message}`, true);
      clearAuth();
      return { success: false, error: `Network error: ${err.message}` };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    if (!accessToken) {
      showToast("Not logged in.", true);
      clearAuth();
      setLoading(false);
      return { success: true };
    }

    try {
      const response = await fetch(`${API_BASE_URL}users/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message);
        clearAuth();
        return { success: true };
      } else {
        showToast(data.message || "Logout failed.", true);
        clearAuth();
        return { success: false, error: data.message || "Logout failed." };
      }
    } catch (err) {
      showToast(`Network error during logout: ${err.message}`, true);
      return { success: false, error: `Network error: ${err.message}` };
    } finally {
      setLoading(false);
    }
  };

  const protectedFetch = async (url, options = {}) => {
    if (!accessToken) {
      const refreshResult = await refreshTokens();
      if (!refreshResult.success) {
        showToast("Authentication required. Please log in.", true);
        return null;
      }
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${refreshResult.accessToken}`,
      };
    } else {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401 && accessToken) {
        showToast("Access token expired. Attempting to refresh...", true);
        const refreshResult = await refreshTokens();
        if (refreshResult.success) {
          options.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
          return fetch(url, options);
        } else {
          showToast("Session expired. Please log in again.", true);
          st;
          clearAuth();
          return response;
        }
      }

      return response;
    } catch (err) {
      showToast(`Network error during protected fetch: ${err.message}`, true);
      throw err;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (refreshToken && !accessToken) {
        showToast("Attempting to re-authenticate with refresh token...");
        await refreshTokens();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      loading,
      error,
      message,
      register,
      login,
      logout,
      refreshTokens,
      protectedFetch,
      clearAuth,
    }),
    [user, accessToken, refreshToken, loading, error, message]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
