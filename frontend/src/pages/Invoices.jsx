import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import {
  formatMoney,
  formatDateTime,
  shortId,
  invoiceStatusMeta,
  PAYMENT_METHODS,
} from '../lib/format';
import {
  EmptyState,
  LoadingScreen,
  ErrorBanner,
  SuccessBanner,
  Modal,
  ConfirmDialog,
  ActionButton,
} from '../components/ui';

const STATUS_FILTERS = [
  { v: 'todos',      l: 'Todas' },
  { v: 'pendiente',  l: 'Pendientes' },
  { v: 'pagado',     l: 'Pagadas' },
  { v: 'anulado',    l: 'Anuladas' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const [payingId, setPayingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [deletingId, setDeletingId] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Totales agregados
  const totals = useMemo(() => {
    return invoices.reduce(
      (acc, inv) => {
        if (inv.status === 'pagado') acc.pagado += Number(inv.total) || 0;
        if (inv.status === 'pendiente') acc.pendiente += Number(inv.total) || 0;
        return acc;
      },
      { pagado: 0, pendiente: 0 }
    );
  }, [invoices]);

  const visible = filter === 'todos'
    ? invoices
    : invoices.filter((i) => i.status === filter);

  const handlePay = async () => {
    if (!payingId) return;
    setBusy(true);
    setError('');
    try {
      await api.payInvoice(payingId, paymentMethod);
      setSuccess(`Factura cobrada (${paymentMethod}).`);
      setPayingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setBusy(true);
    setError('');
    try {
      await api.deleteInvoice(deletingId);
      setSuccess('Factura eliminada.');
      setDeletingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingScreen label="Cargando facturas…" />;

  return (
    <div className="space-y-4 animate-fade-in">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <SuccessBanner message={success} onClose={() => setSuccess('')} />

      {/* Totales agregados */}
      {invoices.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card border-l-4 border-l-green-500">
            <p className="text-xs text-gray-500 uppercase font-medium">Total cobrado</p>
            <p className="text-2xl font-bold text-green-700">{formatMoney(totals.pagado)}</p>
          </div>
          <div className="card border-l-4 border-l-yellow-500">
            <p className="text-xs text-gray-500 uppercase font-medium">Por cobrar</p>
            <p className="text-2xl font-bold text-yellow-700">{formatMoney(totals.pendiente)}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Facturación</h2>
          <p className="text-sm text-gray-500">
            {invoices.length} factura{invoices.length === 1 ? '' : 's'} registrada{invoices.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.v}
              type="button"
              onClick={() => setFilter(f.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f.v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No hay facturas para mostrar"
          description={
            filter === 'todos'
              ? 'Las facturas se generan automáticamente al completar un turno.'
              : 'No hay facturas con este estado. Prueba otro filtro.'
          }
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Servicio</th>
                  <th className="px-4 py-3 font-medium">Subtotal</th>
                  <th className="px-4 py-3 font-medium">ITBIS</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((inv) => {
                  const meta = invoiceStatusMeta(inv.status);
                  return (
                    <tr
                      key={inv.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setViewing(inv)}
                          className="text-indigo-600 hover:underline"
                          title="Ver detalle"
                        >
                          {shortId(inv.id)}
                        </button>
                        <p className="text-[10px] text-gray-400">
                          {formatDateTime(inv.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {inv.client_name || '—'}
                        {inv.plate && (
                          <p className="text-xs text-gray-400 font-mono">
                            🚗 {inv.plate}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">{inv.service_name || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatMoney(inv.subtotal)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatMoney(inv.tax)}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {formatMoney(inv.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={meta.cls}>{meta.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          {inv.status === 'pendiente' && (
                            <ActionButton
                              onClick={() => {
                                setPayingId(inv.id);
                                setPaymentMethod('efectivo');
                              }}
                              className="!text-xs !py-1 !px-2 !bg-green-600 hover:!bg-green-700"
                            >
                              Cobrar
                            </ActionButton>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeletingId(inv.id)}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="Detalle de factura"
      >
        {viewing && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">ID</dt>
              <dd className="font-mono text-xs">{viewing.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Cliente</dt>
              <dd className="font-medium">{viewing.client_name}</dd>
            </div>
            {viewing.plate && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Vehículo</dt>
                <dd className="font-mono">{viewing.plate}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Servicio</dt>
              <dd>{viewing.service_name}</dd>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between">
                <dt className="text-gray-500">Subtotal</dt>
                <dd>{formatMoney(viewing.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ITBIS (18%)</dt>
                <dd>{formatMoney(viewing.tax)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <dt>Total</dt>
                <dd className="text-indigo-600">{formatMoney(viewing.total)}</dd>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <dt className="text-gray-500">Estado</dt>
              <dd>
                <span className={invoiceStatusMeta(viewing.status).cls}>
                  {invoiceStatusMeta(viewing.status).label}
                </span>
              </dd>
            </div>
            {viewing.payment_method && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Método de pago</dt>
                <dd className="capitalize">{viewing.payment_method}</dd>
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
              <dt>Emitida</dt>
              <dd>{formatDateTime(viewing.created_at)}</dd>
            </div>
          </dl>
        )}
      </Modal>

      {/* Modal de cobro */}
      <Modal
        open={!!payingId}
        onClose={() => !busy && setPayingId(null)}
        title="Cobrar factura"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Selecciona el método de pago utilizado por el cliente.
        </p>
        <fieldset className="space-y-2 mb-4">
          <legend className="sr-only">Método de pago</legend>
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.value}
              className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition ${
                paymentMethod === m.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={m.value}
                checked={paymentMethod === m.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">{m.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="flex justify-end gap-2">
          <ActionButton
            variant="secondary"
            onClick={() => setPayingId(null)}
            disabled={busy}
          >
            Cancelar
          </ActionButton>
          <ActionButton onClick={handlePay} loading={busy}>
            Confirmar cobro
          </ActionButton>
        </div>
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!deletingId}
        title="Eliminar factura"
        message="Esta acción no se puede deshacer. La factura quedará fuera del registro."
        confirmLabel="Eliminar"
        variant="danger"
        loading={busy}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}