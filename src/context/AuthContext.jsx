import React, { createContext, useContext, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const me = await base44.auth.me();
        if (!mounted) return;
        setUser(me ?? null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const role = user?.role ?? null;
  const isAuthenticated = Boolean(user);

  const value = {
    user,
    role,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
