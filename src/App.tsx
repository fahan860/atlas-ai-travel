import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import FlightsPage from "@/pages/FlightsPage";
import HotelsPage from "@/pages/HotelsPage";
import PackagesPage from "@/pages/PackagesPage";
import ChatPage from "@/pages/ChatPage";
import PlannerPage from "@/pages/PlannerPage";
import AuthPage from "@/pages/AuthPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/flights" element={<FlightsPage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/packages" element={<PackagesPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Routes>
              <Route path="/chat" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
