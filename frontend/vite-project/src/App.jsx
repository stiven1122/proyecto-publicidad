import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Campaigns from './pages/campaigns/Campaigns';
import Customers from './pages/customers/Customers';
import Analytics from './pages/analytics/Analytics';
import Reports from './pages/reports/Reports';
import Integrations from './pages/integrations/Integrations';
import Users from './pages/users/Users';
import Settings from './pages/settings/Settings';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Public({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Public><Login /></Public>} />
          <Route path="/register" element={<Public><Register /></Public>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
          <Route path="/campaigns" element={<Protected><Layout><Campaigns /></Layout></Protected>} />
          <Route path="/customers" element={<Protected><Layout><Customers /></Layout></Protected>} />
          <Route path="/analytics" element={<Protected><Layout><Analytics /></Layout></Protected>} />
          <Route path="/reports" element={<Protected><Layout><Reports /></Layout></Protected>} />
          <Route path="/integrations" element={<Protected><Layout><Integrations /></Layout></Protected>} />
          <Route path="/users" element={<Protected><Layout><Users /></Layout></Protected>} />
          <Route path="/settings" element={<Protected><Layout><Settings /></Layout></Protected>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
