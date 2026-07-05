import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import { formatMoney, MENU_CATEGORIES } from '../lib/format';
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
  category: 'bebidas',
};

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getAllMenu();
      setItems(data || []);
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
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.updateMenuItem(editingId, payload);
        setSuccess('Item actualizado.');
      } else {
        await api.createMenuItem(payload);
        setSuccess('Item creado.');
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (id, isAvailable) => {
    setTogglingId(id);
    setError('');
    try {
      await api.updateMenuItem(id, { is_available: isAvailable ? 0 : 1 });
      setSuccess(isAvailable ? 'Item desactivado.' : 'Item activado.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // Agrupa items por categoría, preservando el orden declarado en MENU_CATEGORIES
  const grouped = useMemo(() => {
    const acc = Object.fromEntries(MENU_CATEGORIES.map((c) => [c.value, []]));
    items.forEach((item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
    });
    return acc;
  }, [items]);

  if (loading) return <LoadingScreen label="Cargando menú…" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <SuccessBanner message={success} onClose={() => setSuccess('')} />

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {editingId ? 'Editar item' : 'Nuevo item del menú'}
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
            <label htmlFor="m-name" className="block text-sm text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="m-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="m-desc" className="block text-sm text-gray-600 mb-1">Descripción</label>
            <input
              id="m-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="m-price" className="block text-sm text-gray-600 mb-1">
              Precio (RD$) <span className="text-red-500">*</span>
            </label>
            <input
              id="m-price"
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
            <label htmlFor="m-cat" className="block text-sm text-gray-600 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="m-cat"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {MENU_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton type="submit" loading={submitting}>
            {editingId ? 'Actualizar' : 'Crear'}
          </ActionButton>
        </div>
      </form>

      {items.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="El menú está vacío"
          description="Crea el primer item con el formulario de arriba."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MENU_CATEGORIES.map((cat) => {
            const list = grouped[cat.value] || [];
            if (list.length === 0) return null;
            return (
              <section
                key={cat.value}
                className="card overflow-hidden p-0"
                aria-labelledby={`cat-${cat.value}`}
              >
                <header className="bg-gray-50 px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-200 flex items-center justify-between">
                  <span id={`cat-${cat.value}`}>{cat.label}</span>
                  <span className="text-xs font-normal text-gray-400">
                    {list.length} item{list.length === 1 ? '' : 's'}
                  </span>
                </header>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs">
                      <th className="px-4 py-2 font-medium">Nombre</th>
                      <th className="px-4 py-2 font-medium">Precio</th>
                      <th className="px-4 py-2 font-medium">Disp.</th>
                      <th className="px-4 py-2 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2.5">
                          <span className="font-medium text-gray-800">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-gray-400">{item.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 font-semibold">
                          {formatMoney(item.price)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={
                              item.is_available
                                ? 'badge badge-done'
                                : 'badge badge-cancelled'
                            }
                          >
                            {item.is_available ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200 transition"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggle(item.id, item.is_available)}
                              disabled={togglingId === item.id}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition disabled:opacity-50"
                            >
                              {togglingId === item.id
                                ? '…'
                                : item.is_available
                                ? 'Desactivar'
                                : 'Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}