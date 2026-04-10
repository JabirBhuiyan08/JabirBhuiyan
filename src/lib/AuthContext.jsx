import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null);   // { email } or null
  const [loading, setLoading] = useState(true);

  // On mount: validate stored token
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }

    api.get("/api/auth/me")
      .then(r => setAdmin(r.data))
      .catch(() => localStorage.removeItem("admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("admin_token", r.data.token);
    setAdmin({ email: r.data.email });
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/api/auth/logout"); } catch (_) {}
    localStorage.removeItem("admin_token");
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
