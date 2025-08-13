import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SplashScreen from "./components/SplashScreen";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

const queryClient = new QueryClient();

type AppState = "splash" | "login" | "dashboard";

const App = () => {
  const [currentState, setCurrentState] = useState<AppState>("splash");

  const handleSplashComplete = () => {
    setCurrentState("login");
  };

  const handleLogin = () => {
    setCurrentState("dashboard");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {currentState === "splash" && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        
        {currentState === "login" && (
          <LoginForm onLogin={handleLogin} />
        )}
        
        {currentState === "dashboard" && <Dashboard />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
