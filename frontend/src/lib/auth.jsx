import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

const AuthContext = createContext(null);

/**
 * Decodifica el payload de un JWT sin verificar la firma
 * (la verificación real la hace el backend en cada request).
 * Solo nos sirve para saber si el token ya expiró localmente.
 */
function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

const ROLE_HOME = {
  admin:   '/admin',
  cashier: '/admin/turns',
  barista: '/admin/orders',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Limpia sesión local y redirige al login
  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  // Restaurar sesión al cargar (con validación de expiración)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');

    if (!token || !stored) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      clearSession();
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(stored));
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  // Escuchar expiración detectada por api.js (401)
  useEffect(() => {
    const handler = () => clearSession();
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    clearSession();
  };

  /**
   * Devuelve la ruta de inicio apropiada según el rol del usuario.
   * Se usa tras login para no enviar a un barista al Dashboard.
   */
  const homePathFor = (role) => ROLE_HOME[role] || '/admin';

  const hasRole = (...roles) => !!user && roles.includes(user.role);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, homePathFor, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);