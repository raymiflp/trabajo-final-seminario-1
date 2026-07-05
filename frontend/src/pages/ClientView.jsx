import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

// PDF sección 8.4.3: "Actualización en tiempo real cada 10 segundos"
const POLL_INTERVAL_MS = 10_000;

const STATUS_META = {
  pendiente:   { label: 'Pendiente',   cls: 'badge badge-pending',  icon: '🕐' },
  en_progreso: { label: 'En progreso', cls: 'badge badge-progress', icon: '🔄' },
  completado:  { label: 'Completado',  cls: 'badge badge-done',     icon: '✅' },
  cancelado:   { label: 'Cancelado',   cls: 'badge badge-cancelled',icon: '❌' },
};

const CATEGORY_LABELS = {
  bebidas: 'Bebidas',
  comidas: 'Comidas',
  postres: 'Postres',
  otros:   'Otros',
};
const CATEGORY_ORDER = ['bebidas', 'comidas', 'postres', 'otros'];

function formatMoney(n) {
  return `RD$${(n || 0).toLocaleString('es-DO')}`;
}

export default function ClientView() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const tableParam = parseInt(searchParams.get('mesa'), 10);

  const [turn, setTurn] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderSent, setOrderSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ORDER[0]);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  // Carga inicial: turno + menú
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([api.getTurnByQr(token), api.getMenu()])
      .then(([turnData, menuData]) => {
        setTurn(turnData);
        setMenu(menuData);
      })
      .catch(() => setError('Token inválido o turno no encontrado.'))
      .finally(() => setLoading(false));
  }, [token]);

  // Polling: actualiza el turno cada 10 s (solo mientras esté pendiente o en progreso)
  useEffect(() => {
    if (!token) return;
    const stillLive = !turn || ['pendiente', 'en_progreso'].includes(turn.status);
    if (!stillLive) return;

    intervalRef.current = setInterval(async () => {
      try {
        setRefreshing(true);
        const data = await api.getTurnByQr(token);
        setTurn(data);
      } catch {
        /* silencioso: el siguiente intento reintentará */
      } finally {
        setRefreshing(false);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [token, turn?.status]);

  const addToCart = (item) =>
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menu_item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });

  const removeFromCart = (itemId) =>
    setCart((prev) => prev.filter((c) => c.menu_item_id !== itemId));

  const updateQty = (itemId, qty) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menu_item_id === itemId ? { ...c, quantity: qty } : c))
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const sendOrder = async () => {
    if (!cart.length || sending) return;
    setSending(true);
    setError('');
    try {
      await api.createOrder({
        wash_turn_id: turn?.id,
        // PDF no exige número de mesa, pero si viene en el QR lo respetamos;
        // si no, usamos 1 por defecto (mesa del área de cafetería)
        table_number: Number.isFinite(tableParam) && tableParam > 0 ? tableParam : 1,
        client_name: turn?.client_name || 'Cliente',
        items: cart.map((c) => ({
          menu_item_id: c.menu_item_id,
          quantity: c.quantity,
        })),
      });
      setOrderSent(true);
      setCart([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  // ============== Render states ==============

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-4" aria-hidden="true">📱</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Escanea el código QR
          </h1>
          <p className="text-gray-500">
            Usa la cámara de tu teléfono para escanear el código QR de tu mesa
            y acceder al menú y al estado de tu lavado.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="flex items-center text-gray-500">
          <div className="spinner-dark mr-3" />
          Cargando…
        </div>
      </div>
    );
  }

  if (error && !turn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-4" aria-hidden="true">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">No encontrado</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const status = STATUS_META[turn?.status] || STATUS_META.pendiente;
  const availableMenu = menu.filter((i) => i.is_available);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-lg mx-auto p-4 pb-32">
        {/* Header con estado del lavado */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🚗☕</span>
              <div>
                <h1 className="text-base font-bold text-gray-800 leading-tight">
                  CarWash &amp; Café
                </h1>
                <p className="text-[11px] text-gray-400">El Punto</p>
              </div>
            </div>
            {refreshing && (
              <span
                className="text-[11px] text-indigo-500 flex items-center gap-1"
                title="Actualizando estado"
              >
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-soft" />
                Sync
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Cliente:</span> {turn?.client_name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Vehículo:</span> {turn?.plate} —{' '}
              {turn?.brand} {turn?.model}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Servicio:</span>{' '}
              {turn?.service_name}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className={status.cls}>
                <span aria-hidden="true">{status.icon}</span> {status.label}
              </span>
              {Number.isFinite(tableParam) && tableParam > 0 && (
                <span className="badge bg-gray-100 text-gray-600">
                  Mesa {tableParam}
                </span>
              )}
            </div>

            {turn?.cafe_orders?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Pedidos en cafetería
                </p>
                <ul className="space-y-1">
                  {turn.cafe_orders.map((o) => (
                    <li
                      key={o.id}
                      className="text-xs text-gray-600 flex justify-between"
                    >
                      <span className="truncate mr-2">
                        {o.items_summary || 'Pedido'}
                      </span>
                      <span className="text-gray-400 whitespace-nowrap">
                        {o.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tabs de categorías */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CATEGORY_ORDER.filter((cat) =>
            availableMenu.some((i) => i.category === cat)
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Items de la categoría activa */}
        {(() => {
          const items = availableMenu.filter((i) => i.category === activeCategory);
          if (items.length === 0) {
            return (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
                <div className="text-4xl mb-2" aria-hidden="true">🍽️</div>
                No hay items disponibles en esta categoría.
              </div>
            );
          }
          return (
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 animate-fade-in">
              <h2 className="font-semibold text-gray-800 mb-3">
                {CATEGORY_LABELS[activeCategory]}
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const inCart = cart.find((c) => c.menu_item_id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b last:border-0 border-gray-50"
                    >
                      <div className="pr-3">
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-semibold text-indigo-600">
                          {formatMoney(item.price)}
                        </span>
                        {inCart ? (
                          <div className="flex items-center gap-1 bg-indigo-100 rounded-full px-1">
                            <button
                              onClick={() =>
                                updateQty(item.id, inCart.quantity - 1)
                              }
                              className="w-7 h-7 text-indigo-700 font-bold"
                              aria-label={`Quitar un ${item.name}`}
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold w-5 text-center text-indigo-700">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, inCart.quantity + 1)}
                              className="w-7 h-7 text-indigo-700 font-bold"
                              aria-label={`Agregar un ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-indigo-600 text-white w-8 h-8 rounded-full text-lg hover:bg-indigo-700 transition active:scale-95"
                            aria-label={`Agregar ${item.name}`}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Barra flotante del carrito */}
      {cart.length > 0 && !orderSent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 animate-fade-in">
          <div className="max-w-lg mx-auto">
            <div className="max-h-32 overflow-y-auto mb-3 space-y-1">
              {cart.map((c) => (
                <div
                  key={c.menu_item_id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 truncate mr-2">{c.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-400 text-xs">
                      {c.quantity}×
                    </span>
                    <span className="text-indigo-600 font-medium">
                      {formatMoney(c.price * c.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">{cartCount} items</p>
                <p className="font-bold text-gray-800">
                  Total: {formatMoney(total)}
                </p>
              </div>
              <button
                onClick={sendOrder}
                disabled={sending}
                className="btn-primary"
              >
                {sending ? (
                  <>
                    <span className="spinner" />
                    Enviando…
                  </>
                ) : (
                  'Enviar pedido'
                )}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-600 mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Confirmación de pedido enviado */}
      {orderSent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 animate-fade-in">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-green-600 font-medium mb-1">
              ✅ Pedido enviado con éxito
            </p>
            <p className="text-sm text-gray-500">
              Estamos preparando tu pedido. Lo llevaremos a tu mesa.
            </p>
            <button
              onClick={() => setOrderSent(false)}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Hacer otro pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}