import './App.css'
import { AuthProvider } from "@/context/AuthContext";
import AppRouter from "@/router/AppRouter";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
}