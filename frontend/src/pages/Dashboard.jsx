import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const POLL_INTERVAL_MS = 15_000;

const STATUS_BADGE = {
  pendiente:   'badge badge-pending',
  en_progreso: 'badge badge-progress',
  completado:  'badge badge-done',
  cancelado:   'badge badge-cancelled',
};

const STATUS_LABEL = {
  pendiente:   'Pendiente',
  en_progreso: 'En Progreso',
  completado:  'Completado',
  cancelado:   'Cancelado',
};

// Tarjetas con icono + label limpios (sin doble emoji)
const CARDS = [
  { key: 'pendingTurns',    label: 'Turnos pendientes',   tone: 'border-yellow-200 bg-yellow-50  text-yellow-700',  icon: '⏳' },
  { key: 'inProgressTurns', label: 'En progreso',         tone: 'border-blue-200   bg-blue-50    text-blue-700',    icon: '🔄' },
  { key: 'todayTurns',      label: 'Hoy',                 tone: 'border-green-200  bg-green-50   text-green-700',   icon: '📅' },
  { key: 'pendingOrders',   label: 'Pedidos activos',     tone: 'border-orange-200 bg-orange-50  text-orange-700',  icon: '☕' },
  { key: 'todayRevenue',    label: 'Pagado hoy',          tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',icon: '✅', money: true },
  { key: 'pendingRevenue',  label: 'Pendiente de cobro',  tone: 'border-amber-200  bg-amber-50   text-amber-700',   icon: '📋', money: true },
  { key: 'totalTodayRevenue', label: 'Total facturado hoy', tone: 'border-indigo-200 bg-indigo-50 text-indigo-700', icon: '💵', money: true },
];

function formatMoney(n) {
  return `RD$${(n || 0).toLocaleString('es-DO')}`;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-DO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchDashboard = async () => {
    try {
      const d = await api.dashboard();
      setData(d);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const iv = setInterval(fetchDashboard, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <div className="spinner-dark mr-3" />
        Cargando dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con estado de auto-refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Resumen operativo del negocio en tiempo real
          </p>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
            Actualizado {lastUpdate.toLocaleTimeString('es-DO')}
          </div>
        )}
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CARDS.map((card) => {
          const raw = data?.[card.key] || 0;
          const value = card.money ? formatMoney(raw) : raw;
          return (
            <div
              key={card.key}
              className={`rounded-xl border p-4 transition hover:shadow-sm ${card.tone}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl" aria-hidden="true">{card.icon}</span>
                <span className="text-sm font-medium">{card.label}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          );
        })}
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/turns"
          className="card hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-700">
                Nuevo turno
              </p>
              <p className="text-xs text-gray-500">Registrar vehículo y servicio</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/orders"
          className="card hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-700">
                Pedidos en cola
              </p>
              <p className="text-xs text-gray-500">Gestionar pedidos de cafetería</p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/invoices"
          className="card hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧾</span>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-indigo-700">
                Facturación
              </p>
              <p className="text-xs text-gray-500">Cobrar y consultar facturas</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tabla de últimos turnos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Últimos turnos</h3>
          <Link
            to="/admin/turns"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Ver todos →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Cliente</th>
                <th className="pb-3 font-medium">Vehículo</th>
                <th className="pb-3 font-medium">Servicio</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Creado</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentTurns?.map((turn) => (
                <tr
                  key={turn.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="py-3">{turn.client_name}</td>
                  <td className="py-3 text-gray-600">
                    {turn.brand} {turn.model} —{' '}
                    <span className="font-mono text-xs">{turn.plate}</span>
                  </td>
                  <td className="py-3">{turn.service_name}</td>
                  <td className="py-3">
                    <span className={STATUS_BADGE[turn.status] || 'badge'}>
                      {STATUS_LABEL[turn.status] || turn.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">
                    {formatDateTime(turn.created_at)}
                  </td>
                </tr>
              ))}
              {(!data?.recentTurns || data.recentTurns.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <div className="text-3xl mb-2" aria-hidden="true">📭</div>
                    No hay turnos registrados todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}