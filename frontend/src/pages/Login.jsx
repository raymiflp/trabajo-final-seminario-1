import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('admin@carwash.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, homePathFor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si el usuario venía de una ruta protegida, lo devolvemos allí tras login
  const fromPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Redirección inteligente:
      // 1) si venía de una ruta protegida → ahí
      // 2) si no → home según rol (cashier → turnos, barista → pedidos, admin → dashboard)
      const target = fromPath || homePathFor(user.role);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3" aria-hidden="true">🚗☕</div>
            <h1 className="text-2xl font-bold text-gray-800">
              CarWash &amp; Café El Punto
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Panel administrativo · Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="admin@carwash.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Demo: <code className="text-gray-600">admin@carwash.com</code> /{' '}
            <code className="text-gray-600">admin123</code>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Seminario de Proyecto I · UAPA · Mayo–Julio 2026
        </p>
      </div>
    </div>
  );
}