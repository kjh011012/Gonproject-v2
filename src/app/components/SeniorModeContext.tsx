import { createContext, useContext, useState, type ReactNode } from "react";

interface SeniorModeContextType {
  isSenior: boolean;
  toggleSenior: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  isSenior: false,
  toggleSenior: () => {},
});

export function SeniorModeProvider({ children }: { children: ReactNode }) {
  const [isSenior, setIsSenior] = useState(false);
  return (
    <SeniorModeContext.Provider value={{ isSenior, toggleSenior: () => setIsSenior((p) => !p) }}>
      {children}
    </SeniorModeContext.Provider>
  );
}

export function useSeniorMode() {
  return useContext(SeniorModeContext);
}
