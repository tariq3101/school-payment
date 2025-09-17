import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Transactions from "./pages/Transactions";
import SchoolTransactions from "./pages/SchoolTransactions";
import StatusCheck from "./pages/StatusCheck";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import NewOrder from "./pages/NewOrder";
import { DarkModeProvider } from "./context/DarkModeContext";

const queryClient = new QueryClient();

const App = () => (
  <DarkModeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/transactions" element={<DashboardLayout><Transactions /></DashboardLayout>} />
          <Route path="/schools" element={<DashboardLayout><SchoolTransactions /></DashboardLayout>} />
          <Route path="/status-check" element={<DashboardLayout><StatusCheck /></DashboardLayout>} />
          <Route path="/neworder" element={<DashboardLayout><NewOrder /></DashboardLayout>} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</DarkModeProvider>
);

export default App;
