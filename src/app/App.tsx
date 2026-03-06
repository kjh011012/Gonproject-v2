import { RouterProvider } from "react-router";
import { router } from "./routes";
import { SeniorModeProvider } from "./components/SeniorModeContext";
import { AuthProvider } from "./components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SeniorModeProvider>
        <RouterProvider router={router} />
      </SeniorModeProvider>
    </AuthProvider>
  );
}