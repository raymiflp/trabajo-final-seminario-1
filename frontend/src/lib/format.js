/**
 * Utilidades de formato compartidas en todo el frontend.
 * Centralizamos para no repetir lógica en cada página.
 */

const LOCALE = 'es-DO';

const moneyFmt = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
});

const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'short',
  timeStyle: 'short',
});

const dateFmt = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
});

/** Formatea un monto en pesos dominicanos: 12500 → "RD$12,500.00" */
export function formatMoney(n) {
  if (n == null || Number.isNaN(Number(n))) return 'RD$0.00';
  return `RD$${moneyFmt.format(Number(n))}`;
}

/** Formatea fecha + hora corta: "5/7/2026, 8:42 p. m." */
export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return dateTimeFmt.format(d);
}

/** Formatea solo fecha: "5 jul 2026" */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return dateFmt.format(d);
}

/**
 * Trunca un UUID/ID para mostrar de forma compacta en tablas.
 * Mantiene los primeros N caracteres con elipsis.
 */
export function shortId(id, chars = 8) {
  if (!id) return '—';
  return id.length > chars ? `${id.slice(0, chars)}…` : id;
}

/* ============================================================
 * StatusBadge helpers
 * Una sola fuente de verdad para los nombres y clases de estado.
 * ============================================================ */

const TURN_STATUS_META = {
  pendiente:   { label: 'Pendiente',   cls: 'badge badge-pending' },
  en_progreso: { label: 'En progreso', cls: 'badge badge-progress' },
  completado:  { label: 'Completado',  cls: 'badge badge-done' },
  cancelado:   { label: 'Cancelado',   cls: 'badge badge-cancelled' },
};

const ORDER_STATUS_META = {
  pendiente:   { label: 'Pendiente',   cls: 'badge badge-pending' },
  preparando:  { label: 'Preparando',  cls: 'badge badge-progress' },
  listo:       { label: 'Listo',       cls: 'badge badge-done' },
  entregado:   { label: 'Entregado',   cls: 'badge bg-gray-100 text-gray-600' },
  cancelado:   { label: 'Cancelado',   cls: 'badge badge-cancelled' },
};

const INVOICE_STATUS_META = {
  pendiente: { label: 'Pendiente', cls: 'badge badge-pending' },
  pagado:    { label: 'Pagado',    cls: 'badge badge-done' },
  anulado:   { label: 'Anulado',   cls: 'badge badge-cancelled' },
};

export function turnStatusMeta(status) {
  return TURN_STATUS_META[status] || { label: status, cls: 'badge' };
}

export function orderStatusMeta(status) {
  return ORDER_STATUS_META[status] || { label: status, cls: 'badge' };
}

export function invoiceStatusMeta(status) {
  return INVOICE_STATUS_META[status] || { label: status, cls: 'badge' };
}

export const PAYMENT_METHODS = [
  { value: 'efectivo',      label: 'Efectivo' },
  { value: 'tarjeta',       label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
];

export const MENU_CATEGORIES = [
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'comidas', label: 'Comidas' },
  { value: 'postres', label: 'Postres' },
  { value: 'otros',   label: 'Otros' },
];