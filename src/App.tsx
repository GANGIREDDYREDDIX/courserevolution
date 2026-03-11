import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudentProvider } from "@/context/StudentContext";
import Home from "./pages/Home";
import CategoryDetail from "./pages/CategoryDetail";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import AppShell from "./components/layout/AppShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StudentProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<AppShell><CategoryDetail /></AppShell>} />
            <Route path="/preview/:categoryId" element={<AppShell><Preview /></AppShell>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StudentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
