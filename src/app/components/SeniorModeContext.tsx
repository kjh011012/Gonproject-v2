import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

  useEffect(() => {
    if (isSenior) {
      document.documentElement.classList.add("senior-mode");
    } else {
      document.documentElement.classList.remove("senior-mode");
    }
  }, [isSenior]);

  return (
    <SeniorModeContext.Provider value={{ isSenior, toggleSenior: () => setIsSenior((p) => !p) }}>
      {children}
    </SeniorModeContext.Provider>
  );
}

export function useSeniorMode() {
  return useContext(SeniorModeContext);
}