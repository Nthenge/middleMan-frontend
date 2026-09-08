import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "middleman_token";
const EMAIL_KEY = "middleman_email";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY));

  const persist = (newToken, newEmail) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(EMAIL_KEY, newEmail);
    setToken(newToken);
    setEmail(newEmail);
  };

  const login = useCallback(async (loginEmail, password) => {
    const data = await api.login(loginEmail, password);
    persist(data.token, loginEmail);
    return data;
  }, []);

  const register = useCallback(async (registerEmail, password) => {
    const data = await api.register(registerEmail, password);
    persist(data.token, registerEmail);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, email, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
