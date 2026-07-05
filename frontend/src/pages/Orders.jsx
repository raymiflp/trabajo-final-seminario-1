import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { formatMoney, formatDateTime, orderStatusMeta } from '../lib/format';
import {
  EmptyState,
  LoadingScreen,
  ErrorBanner,
  ActionButton,
} from '../components/ui';

const POLL_INTERVAL_MS = 10_000;

const NEXT_STATUS = {
  pendiente:  { value: 'preparando', label: 'Preparando', cls: '!bg-blue-600 hover:!bg-blue-700' },
  preparando: { value: 'listo',      label: 'Marcar listo', cls: '!bg-green-600 hover:!bg-green-700' },
  listo:      { value: 'entregado',  label: 'Entregado', cls: '!bg-gray-700 hover:!bg-gray-800' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      const data = await api.getActiveOrders();
      setOrders(data || []);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(() => load(true), POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [load]);

  const handleStatus = async (id, status) => {
    setBusyId(id);
    setError('');
    try {
      await api.updateOrderStatus(id, status);
      await load(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingScreen label="Cargando pedidos…" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <ErrorBanner message={error} onClose={() => setError('')} />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pedidos de cafetería</h2>
          <p className="text-sm text-gray-500">
            {orders.length} activo{orders.length === 1 ? '' : 's'}
            {lastUpdate && (
              <>
                {' · '}
                <span className="inline-flex items-center gap-1">
                  {refreshing && (
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse-soft" />
                  )}
                  Actualizado {lastUpdate.toLocaleTimeString('es-DO')}
                </span>
              </>
            )}
          </p>
        </div>
        <ActionButton variant="secondary" onClick={() => load(false)} loading={refreshing}>
          ↻ Actualizar
        </ActionButton>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="☕"
          title="No hay pedidos activos"
          description="Cuando un cliente envíe un pedido desde su mesa aparecerá aquí."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const meta = orderStatusMeta(order.status);
            const next = NEXT_STATUS[order.status];
            const isBusy = busyId === order.id;
            return (
              <article
                key={order.id}
                className="card space-y-3 hover:shadow-md transition animate-fade-in"
              >
                <header className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-lg font-bold text-gray-800">
                      Mesa {order.table_number || '—'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {order.client_name || 'Anónimo'}
                    </p>
                    {order.plate && (
                      <p className="text-xs text-gray-400 font-mono">
                        🚗 {order.plate}
                      </p>
                    )}
                  </div>
                  <span className={meta.cls}>{meta.label}</span>
                </header>

                {order.items_list && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Productos
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {order.items_list}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {formatDateTime(order.created_at)}
                  </p>
                  <p className="text-base font-bold text-indigo-600">
                    {formatMoney(order.total)}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {next && (
                    <ActionButton
                      onClick={() => handleStatus(order.id, next.value)}
                      loading={isBusy}
                      className={`!text-xs ${next.cls}`}
                    >
                      {next.label}
                    </ActionButton>
                  )}
                  {(order.status === 'pendiente' || order.status === 'preparando') && (
                    <button
                      type="button"
                      onClick={() => handleStatus(order.id, 'cancelado')}
                      disabled={isBusy}
                      className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-medium hover:bg-red-200 transition disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}