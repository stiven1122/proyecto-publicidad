import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './layouts/Layout';
import Landing from './pages/landing/Landing';
import Services from './pages/landing/Services';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/analytics/Analytics';
import Campaigns from './pages/campaigns/Campaigns';
import Customers from './pages/customers/Customers';
import Integrations from './pages/integrations/Integrations';
import Users from './pages/users/Users';
import Products from './pages/products/Products';
import Quotes from './pages/quotes/Quotes';

function Protected({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function Public({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Landing - redirige a Dashboard si está autenticado */}
            <Route path="/" element={<Public><Landing /></Public>} />
            <Route path="/servicios" element={<Services />} />

            {/* Public Auth */}
            <Route path="/login" element={<Public><Login /></Public>} />
            <Route path="/register" element={<Public><Register /></Public>} />

            {/* Protected - Admin + User */}
            <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
            <Route path="/analytics" element={<Protected><Layout><Analytics /></Layout></Protected>} />
            <Route path="/campaigns" element={<Protected><Layout><Campaigns /></Layout></Protected>} />
            <Route path="/customers" element={<Protected><Layout><Customers /></Layout></Protected>} />
            <Route path="/products" element={<Protected><Layout><Products /></Layout></Protected>} />
            {/* Protected - Admin Only */}
            <Route path="/integrations" element={<Protected adminOnly><Layout><Integrations /></Layout></Protected>} />
            <Route path="/users" element={<Protected adminOnly><Layout><Users /></Layout></Protected>} />
            <Route path="/quotes" element={<Protected adminOnly><Layout><Quotes /></Layout></Protected>} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
