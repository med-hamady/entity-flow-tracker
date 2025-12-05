import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EntitiesPage from "./pages/EntitiesPage";
import EntityDetailPage from "./pages/EntityDetailPage";
import StatisticsPage from "./pages/StatisticsPage";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminAuthProvider } from "./hooks/useAdminAuth";
import { ProtectedAdminRoute } from "./components/admin/ProtectedAdminRoute";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import ContentManagementPage from "./pages/admin/ContentManagementPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SiteSettingsPage from "./pages/admin/SiteSettingsPage";

// User imports
import { UserAuthProvider } from "./hooks/useUserAuth";
import { ProtectedUserRoute } from "./components/user/ProtectedUserRoute";
import UserLoginPage from "./pages/user/UserLoginPage";
import UserRegisterPage from "./pages/user/UserRegisterPage";
import UserDashboard from "./pages/user/UserDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <UserAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/entities" element={<EntitiesPage />} />
              <Route path="/entities/:id" element={<EntityDetailPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />

              {/* User auth routes */}
              <Route path="/login" element={<UserLoginPage />} />
              <Route path="/register" element={<UserRegisterPage />} />

              {/* User dashboard (protected) */}
              <Route path="/dashboard" element={
                <ProtectedUserRoute>
                  <UserDashboard />
                </ProtectedUserRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UsersManagementPage />} />
                <Route path="content" element={<ContentManagementPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SiteSettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
