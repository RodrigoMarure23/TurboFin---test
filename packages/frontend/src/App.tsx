// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { LoginContainer } from "./modules/login/ui/containers/LoginContainer";
import { MainLayout } from "./modules/layout/ui/containers/MainLayout";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { FeedbackContainer } from "./modules/feedback-feed/components/FeedbackContainer";
import { UsersManagementContainer as UsersContainer } from "./modules/user-management/ui/containers/UsersManagementContainer";
import { SettingsContainer } from "./modules/settings/ui/containers/SettingsContainer";
import { DashboardContainer } from "./modules/dashboard-home/ui/containers/DashboardContainer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Privadas Anidadas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Estas rutas se inyectan en el <Outlet /> de MainLayout */}
            <Route index element={<DashboardContainer />} />
            <Route path="feed" element={<FeedbackContainer />} />
            <Route path="users" element={<UsersContainer />} />
            <Route path="settings" element={<SettingsContainer />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
