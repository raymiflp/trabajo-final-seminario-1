import { useEffect } from 'react';

/**
 * Modal base con backdrop, cierre por click fuera y tecla Escape.
 * Reemplaza los overlays inline que había en Turns.jsx.
 */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  // Cierre con Escape + bloqueo de scroll del body
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeCls = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size] || 'max-w-lg';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${sizeCls} animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * Diálogo de confirmación. Reemplaza al `confirm()` nativo.
 *
 * Uso:
 *   const [pending, setPending] = useState(null);
 *   <ConfirmDialog
 *     open={!!pending}
 *     title="Eliminar turno"
 *     message="¿Seguro que quieres eliminar este turno?"
 *     confirmLabel="Eliminar"
 *     variant="danger"
 *     onCancel={() => setPending(null)}
 *     onConfirm={async () => { await api.delete(...); setPending(null); }}
 *   />
 */
export function ConfirmDialog({
  open,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const confirmCls =
    variant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <Modal open={open} onClose={onCancel} size="sm" title={title}>
      {message && <p className="text-gray-600 mb-6">{message}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={confirmCls}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Procesando…
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </Modal>
  );
}

/**
 * Estado vacío amigable para listas sin datos.
 *
 * Uso:
 *   <EmptyState icon="🚗" title="No hay turnos" description="Crea el primero con el botón superior." />
 */
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="card text-center py-12">
      <div className="text-5xl mb-3" aria-hidden="true">{icon}</div>
      {title && <p className="font-semibold text-gray-700 mb-1">{title}</p>}
      {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
      {action}
    </div>
  );
}

/**
 * Indicador de carga centrado. Reemplaza al "Cargando..." plano.
 */
export function LoadingScreen({ label = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center py-20 text-gray-500">
      <div className="spinner-dark mr-3" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/**
 * Banner de error inline (reemplaza los `alert()` para errores de formulario).
 */
export function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-start justify-between gap-2"
    >
      <span>⚠️ {message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-red-500 hover:text-red-700 shrink-0"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Banner de éxito (para confirmar mutaciones exitosas).
 */
export function SuccessBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg text-sm flex items-start justify-between gap-2"
    >
      <span>✅ {message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-green-500 hover:text-green-700 shrink-0"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Botón con estado de carga automático.
 * Pasa `loading` mientras la mutación está en curso para deshabilitar y mostrar spinner.
 */
export function ActionButton({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...rest
}) {
  const cls =
    variant === 'danger'  ? 'btn-danger'  :
    variant === 'secondary' ? 'btn-secondary' :
    'btn-primary';
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`${cls} ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {rest.loadingLabel || 'Procesando…'}
        </>
      ) : (
        children
      )}
    </button>
  );
}