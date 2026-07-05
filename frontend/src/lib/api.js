const API = '/api';
const DEFAULT_TIMEOUT_MS = 10_000;

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

/**
 * Dispara un evento global cuando la sesión expira.
 * AuthProvider escucha este evento para limpiar storage y redirigir.
 */
function emitSessionExpired() {
  window.dispatchEvent(new CustomEvent('auth:expired'));
}

async function request(path, options = {}) {
  const { timeout = DEFAULT_TIMEOUT_MS, retries = 0, ...fetchOptions } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API}${path}`, {
      ...fetchOptions,
      headers: { ...authHeaders(), ...(fetchOptions.headers || {}) },
      signal: controller.signal,
    });

    // 401 = sesión expirada o token inválido → aviso global, NO retry
    if (res.status === 401) {
      emitSessionExpired();
      const err = new Error('Sesión expirada. Vuelve a iniciar sesión.');
      err.status = 401;
      throw err;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.error || `Error ${res.status}`);
      err.status = res.status;
      throw err;
    }

    return data;
  } catch (err) {
    // Reintento solo para errores de red (no para HTTP 4xx/5xx)
    const isNetworkError = err.name === 'AbortError' || err.name === 'TypeError';
    if (isNetworkError && retries > 0) {
      await new Promise((r) => setTimeout(r, 400));
      return request(path, { ...options, retries: retries - 1 });
    }
    if (err.name === 'AbortError') {
      throw new Error('La petición tardó demasiado. Revisa tu conexión.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Dashboard
  dashboard: () => request('/dashboard/resumen', { retries: 2 }),

  // Services
  getServices: () => request('/services'),
  getAllServices: () => request('/services/all'),
  createService: (data) =>
    request('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) =>
    request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Menu
  getMenu: () => request('/menu'),
  getAllMenu: () => request('/menu/all'),
  createMenuItem: (data) =>
    request('/menu', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id, data) =>
    request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Turns
  getActiveTurns: () => request('/turns/active'),
  getTurns: (status) =>
    request(`/turns${status ? `?status=${status}` : ''}`, { retries: 2 }),
  getTurnByQr: (token) => request(`/turns/qr/${token}`, { retries: 2 }),
  createTurn: (data) =>
    request('/turns', { method: 'POST', body: JSON.stringify(data) }),
  updateTurnStatus: (id, status) =>
    request(`/turns/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  softDeleteTurn: (id) =>
    request(`/turns/${id}/soft-delete`, { method: 'PATCH' }),
  getTurnQr: (id) => request(`/turns/${id}/qr`),

  // Orders
  getActiveOrders: () => request('/orders/active', { retries: 2 }),
  getTurnOrders: (turnId) => request(`/orders/turn/${turnId}`),
  createOrder: (data) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getOrder: (id) => request(`/orders/${id}`),

  // Invoices
  getInvoices: () => request('/invoices'),
  createInvoice: (data) =>
    request('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  payInvoice: (id, method) =>
    request(`/invoices/${id}/pay`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_method: method }),
    }),
  deleteInvoice: (id) =>
    request(`/invoices/${id}`, { method: 'DELETE' }),
};