import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthState {
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  userName: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);

  const login = (name: string) => setUserName(name);
  const logout = () => setUserName(null);

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!userName, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
