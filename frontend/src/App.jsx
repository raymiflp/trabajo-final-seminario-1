import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Turns from './pages/Turns';
import Orders from './pages/Orders';
import ServicesManagement from './pages/ServicesManagement';
import MenuManagement from './pages/MenuManagement';
import Invoices from './pages/Invoices';
import ClientView from './pages/ClientView';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="turns" element={<Turns />} />
        <Route path="orders" element={<Orders />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="invoices" element={<Invoices />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cliente" element={<ClientView />} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminRoutes /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
