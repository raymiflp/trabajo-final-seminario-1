# ✅ Smoke Test — Flujo crítico

Este documento describe el flujo crítico de validación manual del sistema **CarWash & Café El Punto**. Es la **evidencia funcional** que demuestra que cada módulo del backend y frontend opera correctamente en conjunto.

---

## Pre-requisitos

- Sistema instalado y corriendo (`npm run dev` desde la raíz).
- Base de datos recién inicializada (o con datos del seed).
- Credenciales admin: `admin@carwash.com` / `admin123`
- Al menos un servicio activo y un item del menú disponibles.

---

## Flujo paso a paso

### 1. Login

**Acción:** Abrir `http://localhost:5174/login` y autenticarse como admin.

**Resultado esperado:**
- Redirección automática a `/admin` (Dashboard).
- Header con el nombre del usuario y rol "admin" en el sidebar.

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

---

### 2. Crear un servicio de lavado (opcional, ya hay 4 del seed)

**Acción:** Ir a `/admin/services`, llenar el formulario con:
- Nombre: "Lavado Test"
- Descripción: "Servicio de prueba"
- Precio: 500
- Duración: 25

Click "Crear".

**Resultado esperado:**
- Banner verde "Servicio creado."
- El nuevo servicio aparece en la tabla.

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

---

### 3. Crear un turno

**Acción:** Ir a `/admin/turns`, click "+ Nuevo turno", llenar:
- Placa: `TEST-001`
- Cliente: "Cliente de Prueba"
- Teléfono: 809-555-1234
- Marca: "Toyota"
- Modelo: "Corolla"
- Color: "Blanco"
- Servicio: "Lavado Completo"

Click "Registrar turno".

**Resultado esperado:**
- Banner verde "Turno registrado correctamente."
- El turno aparece en el banner "Turnos activos" en la parte superior.
- Aparece también en la tabla de historial con estado "Pendiente".

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

---

### 4. Obtener QR del turno

**Acción:** En el turno recién creado, click "QR".

**Resultado esperado:**
- Modal centrado con código QR visible.
- URL legible debajo del QR.
- Botón "Descargar QR" funcional.

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/05-turn-qr.png`

---

### 5. Abrir vista del cliente (móvil)

**Acción:** Copiar la URL del QR (formato `http://localhost:5174/cliente?token=XXXXX`). Abrirla en una pestaña nueva.

**Resultado esperado:**
- Header con "CarWash & Café El Punto"
- Datos del cliente y vehículo correctos
- Estado "Pendiente" con badge amarillo
- Tabs de categorías (Bebidas, Comidas, Postres)
- Items del menú con botón "+"

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/06-client-view.png`

---

### 6. Hacer un pedido desde el cliente

**Acción:** Agregar 2 items al carrito desde la vista del cliente. Click "Enviar pedido".

**Resultado esperado:**
- Banner inferior cambia a "✅ Pedido enviado con éxito"
- El carrito se vacía.

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/07-client-cart.png`

---

### 7. Gestionar pedido como barista

**Acción:** Ir a `/admin/orders`. El pedido recién creado debe aparecer como tarjeta. Click "Preparando" → "Listo" → "Entregado".

**Resultado esperado:**
- La tarjeta cambia de color de estado en cada click.
- Después de "Entregado", desaparece de la vista de pedidos activos.

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/08-orders.png`

---

### 8. Iniciar y completar el turno

**Acción:** Volver a `/admin/turns`. En el turno TEST-001:
1. Click "Iniciar" → cambia a "En Progreso"
2. Click "Completar" → cambia a "Completado" y se genera la factura automáticamente

**Resultado esperado:**
- Banner verde "Turno iniciado" / "Turno completado".
- El turno desaparece del banner "Turnos activos".

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

---

### 9. Verificar factura generada

**Acción:** Ir a `/admin/invoices`.

**Resultado esperado:**
- Aparece una nueva factura con:
  - Subtotal = precio del servicio + total del pedido de cafetería
  - ITBIS = 18% del subtotal
  - Total = subtotal + ITBIS
  - Estado: "Pendiente"

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/11-invoices.png`

---

### 10. Cobrar la factura

**Acción:** En la factura pendiente, click "Cobrar". Seleccionar método de pago (Efectivo por defecto). Click "Confirmar cobro".

**Resultado esperado:**
- Modal se cierra.
- Banner verde "Factura cobrada (efectivo)."
- El estado de la factura cambia a "Pagado".

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

---

### 11. Verificar métricas en Dashboard

**Acción:** Volver a `/admin`.

**Resultado esperado:**
- Las tarjetas reflejan la actividad del flujo:
  - "Hoy": +1 turno
  - "Pagado hoy": monto de la factura cobrada
  - "Total facturado hoy": mismo monto (pagado)
  - "Pendiente de cobro": 0 (o menor)

✅ **Pasa** / ❌ **Falla** — Observación: _______________________

✅ Captura guardada: `docs/screenshots/02-dashboard.png`

---

## Resumen de resultados

| Paso | Estado |
|------|--------|
| 1. Login | ☐ |
| 2. Crear servicio | ☐ |
| 3. Crear turno | ☐ |
| 4. Generar QR | ☐ |
| 5. Vista cliente | ☐ |
| 6. Pedido del cliente | ☐ |
| 7. Gestión barista | ☐ |
| 8. Completar turno | ☐ |
| 9. Factura generada | ☐ |
| 10. Cobrar factura | ☐ |
| 11. Métricas dashboard | ☐ |

**Resultado global:** ☐ APROBADO  ☐ RECHAZADO

**Observaciones generales:**

_______________________________________________________________
_______________________________________________________________

**Fecha de ejecución:** _____________________
**Ejecutado por:** _____________________
**Entorno:** ☐ Local  ☐ Staging  ☐ Producción
**Versión del código (commit):** _____________________