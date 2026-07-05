import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import {
  formatMoney,
  formatDateTime,
  turnStatusMeta,
} from '../lib/format';
import {
  Modal,
  ConfirmDialog,
  EmptyState,
  LoadingScreen,
  ErrorBanner,
  SuccessBanner,
  ActionButton,
} from '../components/ui';

const EMPTY_FORM = {
  plate: '',
  brand: '',
  model: '',
  color: '',
  client_name: '',
  client_phone: '',
  service_id: '',
  notes: '',
};

export default function Turns() {
  const [turns, setTurns] = useState([]);
  const [activeTurns, setActiveTurns] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Estado de mutaciones
  const [submitting, setSubmitting] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [qrForId, setQrForId] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Banners
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filtros
  const [filter, setFilter] = useState('todos');

  const load = useCallback(async () => {
    try {
      const [t, a, s] = await Promise.all([
        api.getTurns(),
        api.getActiveTurns(),
        api.getServices(),
      ]);
      setTurns(t || []);
      setActiveTurns(a || []);
      setServices(s || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh cada 20 s para mantener la vista viva
    const iv = setInterval(load, 20_000);
    return () => clearInterval(iv);
  }, [load]);

  // Carga el QR cuando se solicita
  useEffect(() => {
    if (!qrForId) {
      setQrData(null);
      return;
    }
    setQrLoading(true);
    api.getTurnQr(qrForId)
      .then(setQrData)
      .catch((err) => setError(err.message))
      .finally(() => setQrLoading(false));
  }, [qrForId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.createTurn(form);
      setSuccess('Turno registrado correctamente.');
      setShowForm(false);
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    setStatusBusyId(id);
    setError('');
    try {
      await api.updateTurnStatus(id, status);
      const verb = status === 'en_progreso' ? 'iniciado' :
                   status === 'completado'  ? 'completado' :
                   status === 'cancelado'   ? 'cancelado'  : 'actualizado';
      setSuccess(`Turno ${verb}.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    setError('');
    try {
      await api.softDeleteTurn(deletingId);
      setSuccess('Turno eliminado.');
      setDeletingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const visibleTurns = filter === 'todos'
    ? turns
    : turns.filter((t) => t.status === filter);

  if (loading) return <LoadingScreen label="Cargando turnos…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banners */}
      <ErrorBanner message={error} onClose={() => setError('')} />
      <SuccessBanner message={success} onClose={() => setSuccess('')} />

      {/* Turnos activos (banner destacado) */}
      {activeTurns.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-indigo-800">
              🚗 Turnos activos ({activeTurns.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTurns.map((t) => {
              const meta = turnStatusMeta(t.status);
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-lg p-3 border border-indigo-100 flex justify-between items-start gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{t.client_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {t.plate} — {t.service_name}
                    </p>
                    <span className={`${meta.cls} mt-1.5`}>{meta.label}</span>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {t.status === 'pendiente' && (
                      <ActionButton
                        onClick={() => handleStatus(t.id, 'en_progreso')}
                        loading={statusBusyId === t.id}
                        className="!py-1 !px-2 !text-xs"
                      >
                        ▶ Iniciar
                      </ActionButton>
                    )}
                    {t.status === 'en_progreso' && (
                      <ActionButton
                        onClick={() => handleStatus(t.id, 'completado')}
                        loading={statusBusyId === t.id}
                        className="!py-1 !px-2 !text-xs !bg-green-600 hover:!bg-green-700"
                      >
                        ✓ Completar
                      </ActionButton>
                    )}
                    <button
                      type="button"
                      onClick={() => setQrForId(t.id)}
                      className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition"
                    >
                      QR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header con acción */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Historial de turnos</h2>
          <p className="text-sm text-gray-500">
            {turns.length} turno{turns.length === 1 ? '' : 's'} registrado{turns.length === 1 ? '' : 's'}
          </p>
        </div>
        <ActionButton onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Nuevo turno'}
        </ActionButton>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { v: 'todos',         l: 'Todos' },
          { v: 'pendiente',     l: 'Pendientes' },
          { v: 'en_progreso',   l: 'En progreso' },
          { v: 'completado',    l: 'Completados' },
          { v: 'cancelado',     l: 'Cancelados' },
        ].map((f) => (
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

      {/* Formulario de nuevo turno */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="card space-y-4 animate-fade-in"
        >
          <h3 className="font-semibold text-gray-800">Registrar nuevo turno</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="plate" className="block text-sm text-gray-600 mb-1">
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                id="plate"
                required
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="ABC-123"
                maxLength={10}
              />
            </div>
            <div>
              <label htmlFor="client_name" className="block text-sm text-gray-600 mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              <input
                id="client_name"
                required
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label htmlFor="client_phone" className="block text-sm text-gray-600 mb-1">
                Teléfono
              </label>
              <input
                id="client_phone"
                type="tel"
                value={form.client_phone}
                onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="809-555-5555"
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm text-gray-600 mb-1">Marca</label>
              <input
                id="brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm text-gray-600 mb-1">Modelo</label>
              <input
                id="model"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Corolla"
              />
            </div>
            <div>
              <label htmlFor="color" className="block text-sm text-gray-600 mb-1">Color</label>
              <input
                id="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Rojo"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="service_id" className="block text-sm text-gray-600 mb-1">
                Servicio <span className="text-red-500">*</span>
              </label>
              <select
                id="service_id"
                required
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Seleccionar…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatMoney(s.price)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label htmlFor="notes" className="block text-sm text-gray-600 mb-1">Notas</label>
              <input
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Observaciones"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <ActionButton type="submit" loading={submitting}>
              Registrar turno
            </ActionButton>
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
            >
              Cancelar
            </ActionButton>
          </div>
        </form>
      )}

      {/* Tabla de historial */}
      {visibleTurns.length === 0 ? (
        <EmptyState
          icon="🚗"
          title="No hay turnos para mostrar"
          description={
            filter === 'todos'
              ? 'Crea el primer turno con el botón superior.'
              : 'No hay turnos con este estado. Prueba otro filtro.'
          }
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Vehículo</th>
                  <th className="px-4 py-3 font-medium">Servicio</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Creado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleTurns.map((turn) => {
                  const meta = turnStatusMeta(turn.status);
                  const isBusy = statusBusyId === turn.id;
                  return (
                    <tr
                      key={turn.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {turn.client_name}
                        {turn.client_phone && (
                          <p className="text-xs text-gray-400">{turn.client_phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs">{turn.plate}</span>
                        {(turn.brand || turn.model) && (
                          <p className="text-xs text-gray-400">
                            {turn.brand} {turn.model}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {turn.service_name}
                        <p className="text-xs text-gray-400">{formatMoney(turn.service_price)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={meta.cls}>
                          {meta.label}
                          {turn.deleted_at && (
                            <span className="ml-1 text-gray-400 text-[10px]">(eliminado)</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDateTime(turn.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end flex-wrap">
                          {turn.status === 'pendiente' && (
                            <ActionButton
                              onClick={() => handleStatus(turn.id, 'en_progreso')}
                              loading={isBusy}
                              className="!py-1 !px-2 !text-xs !bg-blue-600 hover:!bg-blue-700"
                            >
                              Iniciar
                            </ActionButton>
                          )}
                          {turn.status === 'en_progreso' && (
                            <ActionButton
                              onClick={() => handleStatus(turn.id, 'completado')}
                              loading={isBusy}
                              className="!py-1 !px-2 !text-xs !bg-green-600 hover:!bg-green-700"
                            >
                              Completar
                            </ActionButton>
                          )}
                          {(turn.status === 'pendiente' || turn.status === 'en_progreso') && (
                            <button
                              type="button"
                              onClick={() => handleStatus(turn.id, 'cancelado')}
                              disabled={isBusy}
                              className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition disabled:opacity-50"
                            >
                              Cancelar
                            </button>
                          )}
                          {turn.status === 'completado' && !turn.deleted_at && (
                            <button
                              type="button"
                              onClick={() => setDeletingId(turn.id)}
                              className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded hover:bg-orange-200 transition"
                            >
                              Eliminar
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setQrForId(turn.id)}
                            className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition"
                          >
                            QR
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

      {/* Modal de QR */}
      <Modal
        open={!!qrForId}
        onClose={() => setQrForId(null)}
        title="Código QR del turno"
      >
        {qrLoading ? (
          <div className="flex justify-center py-8">
            <div className="spinner-dark" />
          </div>
        ) : qrData ? (
          <div className="text-center">
            <img
              src={qrData.qr_code}
              alt="Código QR del turno"
              className="mx-auto w-56 h-56 border border-gray-200 rounded-lg p-2"
            />
            <p className="text-xs text-gray-500 mt-3 break-all font-mono">
              {qrData.url}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <a
                href={qrData.qr_code}
                download="qr-turno.png"
                className="btn-primary !text-xs"
              >
                Descargar QR
              </a>
              <ActionButton
                variant="secondary"
                onClick={() => setQrForId(null)}
                className="!text-xs"
              >
                Cerrar
              </ActionButton>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={!!deletingId}
        title="Eliminar turno completado"
        message="Esta acción no se puede deshacer. El turno quedará marcado como eliminado."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        loading={submitting}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}