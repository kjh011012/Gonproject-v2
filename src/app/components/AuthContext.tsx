import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthState {
  isLoggedIn: boolean;
  isRegistered: boolean;
  isMember: boolean;
  userName: string | null;
  registeredName: string | null;
  login: () => boolean;
  signup: (name: string) => void;
  completeMembership: () => void;
  logout: () => void;
}

const STORAGE_KEY = "gondolbom-auth";

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isRegistered: false,
  isMember: false,
  userName: null,
  registeredName: null,
  login: () => false,
  signup: () => {},
  completeMembership: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [registeredName, setRegisteredName] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        userName?: string | null;
        registeredName?: string | null;
        isMember?: boolean;
      };
      setUserName(parsed.userName ?? null);
      setRegisteredName(parsed.registeredName ?? null);
      setIsMember(Boolean(parsed.isMember));
    } catch {
      // ignore invalid persisted auth data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ userName, registeredName, isMember }),
    );
  }, [isMember, registeredName, userName]);

  const login = () => {
    if (!registeredName) return false;
    setUserName(registeredName);
    return true;
  };

  const signup = (name: string) => {
    const normalized = name.trim() || "조합원";
    setRegisteredName(normalized);
    setUserName(normalized);
    setIsMember(false);
  };

  const logout = () => setUserName(null);
  const completeMembership = () => {
    setIsMember(true);
  };

  return <AuthContext.Provider value={{
    isLoggedIn: !!userName,
    isRegistered: !!registeredName,
    isMember,
    userName,
    registeredName,
    login,
    signup,
    completeMembership,
    logout,
  }}>{children}</AuthContext.Provider>;
}
