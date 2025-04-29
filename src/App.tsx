import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EmailLoginForm from "./components/EmailLoginForm";

const queryClient = new QueryClient();

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // Function to open login dialog - expose this to the header component in a real implementation
  const openLogin = () => setIsLoginOpen(true);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-md">
            <EmailLoginForm onClose={() => setIsLoginOpen(false)} />
          </DialogContent>
        </Dialog>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index openLogin={openLogin} />} />
            <Route path="/user/:username" element={<UserProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
