import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Catalog from './pages/Catalog';
import EventDetails from './pages/EventDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import TicketView from './pages/TicketView';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Maintenance from './pages/Maintenance';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';



const AppContent = () => {
  const location = useLocation();
  const { settings, loading: settingsLoading } = useSettings();
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const isAdminPath = location.pathname.startsWith('/admin');

  // Redirection si mode maintenance activé (sauf pour les admins)
  if (!settingsLoading && settings.maintenance_mode === '1' && !isAdmin && !['/login', '/forgot-password', '/reset-password'].some(p => location.pathname.startsWith(p))) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Maintenance />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Catalog />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/evenement/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes – must be authenticated */}
          <Route path="/panier" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/mes-billets" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/billet/:id" element={<PrivateRoute><TicketView /></PrivateRoute>} />
          
          {/* Admin-only route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <Router>
            <Toaster position="top-right" toastOptions={{
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }} />
            <AppContent />
          </Router>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
