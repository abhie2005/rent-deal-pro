import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  role: "buyer" | "seller";
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: "buyer" | "seller") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("homescreen_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    // Simulated login — replace with Firebase Auth
    const u: User = { id: "1", email, role: "buyer", name: email.split("@")[0] };
    setUser(u);
    localStorage.setItem("homescreen_user", JSON.stringify(u));
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string, role: "buyer" | "seller") => {
    const u: User = { id: "1", email, role, name };
    setUser(u);
    localStorage.setItem("homescreen_user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("homescreen_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
