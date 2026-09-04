import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sewapath_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, verify it's still valid and refresh
  // the cached user (covers role changes / renamed accounts).
  useEffect(() => {
    const token = localStorage.getItem("sewapath_token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("sewapath_user", JSON.stringify(res.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("sewapath_token");
        localStorage.removeItem("sewapath_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password }) => {
    const res = await loginUser({ email, password });
    localStorage.setItem("sewapath_token", res.data.token);
    localStorage.setItem("sewapath_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async ({ name, email, password, phone }) => {
    await registerUser({ name, email, password, phone });
    // Registration doesn't return a token, so log in right after.
    return login({ email, password });
  };

  const logout = () => {
    localStorage.removeItem("sewapath_token");
    localStorage.removeItem("sewapath_user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
