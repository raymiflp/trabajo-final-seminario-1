import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/turns', label: 'Turnos', icon: '🚗' },
  { path: '/admin/orders', label: 'Pedidos', icon: '☕' },
  { path: '/admin/services', label: 'Servicios', icon: '🔧' },
  { path: '/admin/menu', label: 'Menú', icon: '📋' },
  { path: '/admin/invoices', label: 'Facturas', icon: '🧾' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-indigo-900 text-white transform transition-transform duration-200
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 border-b border-indigo-800">
          <h2 className="text-lg font-bold">CarWash & Café</h2>
          <p className="text-indigo-300 text-xs mt-0.5">Panel Administrativo</p>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            // Activo si la ruta actual es EXACTA o empieza con el prefijo de la sección
            // (ej: /admin/turns/new también marca "Turnos" como activo)
            const active =
              location.pathname === item.path ||
              (item.path !== '/admin' &&
                location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? 'bg-indigo-700 text-white font-medium shadow-inner'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="text-indigo-300 hover:text-white text-sm transition"
            >
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3">
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            {navItems.find((n) => n.path === location.pathname)?.label || 'CarWash & Café El Punto'}
          </h1>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
