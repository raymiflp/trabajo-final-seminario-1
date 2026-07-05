import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { formatMoney } from '../lib/format';
import {
  EmptyState,
  LoadingScreen,
  ErrorBanner,
  SuccessBanner,
  ActionButton,
} from '../components/ui';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  duration_minutes: '30',
};

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getAllServices();
      setServices(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration_minutes: Number(form.duration_minutes) || 30,
      };
      if (editingId) {
        await api.updateService(editingId, payload);
        setSuccess('Servicio actualizado.');
      } else {
        await api.createService(payload);
        setSuccess('Servicio creado.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      description: s.description || '',
      price: String(s.price),
      duration_minutes: String(s.duration_minutes),
    });
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id, isActive) => {
    setTogglingId(id);
    setError('');
    try {
      await api.updateService(id, { is_active: isActive ? 0 : 1 });
      setSuccess(isActive ? 'Servicio desactivado.' : 'Servicio activado.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <LoadingScreen label="Cargando servicios…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <SuccessBanner message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="s-name" className="block text-sm text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="s-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="s-desc" className="block text-sm text-gray-600 mb-1">Descripción</label>
            <input
              id="s-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="s-price" className="block text-sm text-gray-600 mb-1">
              Precio (RD$) <span className="text-red-500">*</span>
            </label>
            <input
              id="s-price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="s-dur" className="block text-sm text-gray-600 mb-1">Duración (min)</label>
            <input
              id="s-dur"
              type="number"
              min="1"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton type="submit" loading={submitting}>
            {editingId ? 'Actualizar' : 'Crear'}
          </ActionButton>
        </div>
      </form>

      {services.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="No hay servicios registrados"
          description="Crea el primero con el formulario de arriba."
        />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium">Duración</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {s.description || '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatMoney(s.price)}</td>
                    <td className="px-4 py-3 text-gray-500">{s.duration_minutes} min</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          s.is_active
                            ? 'badge badge-done'
                            : 'badge badge-cancelled'
                        }
                      >
                        {s.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200 transition"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(s.id, s.is_active)}
                          disabled={togglingId === s.id}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition disabled:opacity-50"
                        >
                          {togglingId === s.id
                            ? '…'
                            : s.is_active
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}