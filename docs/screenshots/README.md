# 📸 Capturas de pantalla — Evidencia funcional

Esta carpeta contiene las capturas de pantalla que evidencian el funcionamiento del sistema **CarWash & Café El Punto**.

---

## Cómo tomar las capturas

1. Asegúrate de tener el sistema corriendo: `npm run dev` desde la raíz.
2. Backend en `http://localhost:3000`
3. Frontend en `http://localhost:5174`
4. Inicia sesión con `admin@carwash.com` / `admin123`
5. Toma cada captura en una ventana del navegador en resolución 1280×800 o superior.

> 💡 **Tip:** usa la extensión **GoFullPage** (Chrome/Edge) para capturas de página completa si necesitas mostrar scroll.

---

## Lista de capturas requeridas

| # | Archivo | Pantalla | URL | Qué debe verse |
|---|---------|----------|-----|----------------|
| 1 | `01-login.png` | Inicio de sesión | `/login` | Pantalla con logo 🚗☕, campos de email/contraseña, botón "Entrar", texto de demo credentials. |
| 2 | `02-dashboard.png` | Dashboard principal | `/admin` | 7 tarjetas de métricas (turnos pendientes, en progreso, hoy, pedidos activos, pagado hoy, pendiente cobro, total hoy) + tabla de últimos turnos. |
| 3 | `03-turns-list.png` | Listado de turnos | `/admin/turns` | Banner "Turnos activos" + tabla de historial con badges de estado. |
| 4 | `04-turn-new.png` | Formulario nuevo turno | `/admin/turns` (con form abierto) | Formulario con campos: placa, cliente, teléfono, marca, modelo, color, servicio, notas. |
| 5 | `05-turn-qr.png` | Modal de QR | `/admin/turns` (con modal abierto) | Modal con código QR generado + URL + botones "Descargar QR" y "Cerrar". |
| 6 | `06-client-view.png` | Vista móvil del cliente | `/cliente?token=XXXX` | Vista mobile-first con header del turno (estado, vehículo, servicio) + categorías tabs (Bebidas, Comidas, Postres) + items del menú. |
| 7 | `07-client-cart.png` | Carrito del cliente | `/cliente?token=XXXX` (con carrito) | Barra inferior flotante con items agregados, total y botón "Enviar pedido". |
| 8 | `08-orders.png` | Gestión de pedidos | `/admin/orders` | Grid de tarjetas con pedidos activos (mesa, cliente, productos, total, botones de cambio de estado). |
| 9 | `09-services.png` | Gestión de servicios | `/admin/services` | Formulario de crear/editar + tabla con 4 servicios (Básico, Completo, Premium, Motor) con precios y duraciones. |
| 10 | `10-menu.png` | Gestión del menú | `/admin/menu` | Formulario + grid de 4 categorías (Bebidas, Comidas, Postres, Otros) con items y badges de disponibilidad. |
| 11 | `11-invoices.png` | Facturación | `/admin/invoices` | Tarjetas de totales agregados + filtros + tabla con facturas (subtotal, ITBIS 18%, total, estado). |
| 12 | `12-invoice-detail.png` | Detalle de factura | `/admin/invoices` (con modal abierto) | Modal con detalle completo: cliente, vehículo, servicio, desglose subtotal + ITBIS + total, método de pago. |
| 13 | `13-invoice-payment.png` | Modal de cobro | `/admin/invoices` (con modal de pago) | Modal con radios de método de pago (Efectivo, Tarjeta, Transferencia) + botones "Cancelar" / "Confirmar cobro". |

---

## Capturas opcionales recomendadas

| # | Archivo | Pantalla | Cuándo |
|---|---------|----------|--------|
| O1 | `14-mobile-login.png` | Login en móvil | Para evidenciar responsive |
| O2 | `15-mobile-dashboard.png` | Dashboard en móvil | Para evidenciar responsive |
| O3 | `16-health-check.png` | Health check API | Abrir `http://localhost:3000/api/health` en el navegador |

---

## Convención de nombres

- Numeradas con dos dígitos: `01-`, `02-`, etc.
- Nombre en kebab-case en español.
- Extensión `.png` (o `.jpg` si la captura es muy pesada).

---

## Plantilla de caption (para incluir en el trabajo final)

```
Figura N. [Nombre de la pantalla].
La pantalla "[descripción]" muestra [qué se ve]. Esta vista permite al rol
[admin/cajero/barista/cliente] [acción principal] desde [dispositivo].
Capturada el [fecha] sobre [entorno: dev local / staging / producción].
```