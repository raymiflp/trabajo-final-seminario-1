const express = require('express');
const { v4: uuid } = require('uuid');
const QRCode = require('qrcode');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

function generateQrToken() {
  return uuid().replace(/-/g, '').substring(0, 12);
}

// Obtener turnos activos (público)
router.get('/active', (req, res) => {
  const db = getDb();
  const turns = db.prepare(`
    SELECT wt.*, v.plate, v.brand, v.model, v.color, v.client_name, v.client_phone,
           s.name as service_name, s.price as service_price
    FROM wash_turns wt
    JOIN vehicles v ON v.id = wt.vehicle_id
    JOIN services s ON s.id = wt.service_id
    WHERE wt.status IN ('pendiente', 'en_progreso')
      AND wt.deleted_at IS NULL
    ORDER BY wt.created_at ASC
  `).all();
  res.json(turns);
});

// Obtener turno por QR token (público)
router.get('/qr/:token', (req, res) => {
  const db = getDb();
  const turn = db.prepare(`
    SELECT wt.*, v.plate, v.brand, v.model, v.color, v.client_name,
           s.name as service_name, s.price as service_price
    FROM wash_turns wt
    JOIN vehicles v ON v.id = wt.vehicle_id
    JOIN services s ON s.id = wt.service_id
    WHERE wt.qr_token = ? AND wt.deleted_at IS NULL
  `).get(req.params.token);

  if (!turn) return res.status(404).json({ error: 'Turno no encontrado' });

  // Obtener pedidos de cafetería asociados
  const orders = db.prepare(`
    SELECT co.*, GROUP_CONCAT(oi.quantity || 'x ' || mi.name) as items_summary
    FROM cafe_orders co
    LEFT JOIN order_items oi ON oi.order_id = co.id
    LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE co.wash_turn_id = ?
    GROUP BY co.id
    ORDER BY co.created_at DESC
  `).all(turn.id);

  res.json({ ...turn, cafe_orders: orders });
});

// Obtener todos los turnos
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const { status, deleted } = req.query;
  let query = `
    SELECT wt.*, v.plate, v.brand, v.model, v.color, v.client_name, v.client_phone,
           s.name as service_name, s.price as service_price
    FROM wash_turns wt
    JOIN vehicles v ON v.id = wt.vehicle_id
    JOIN services s ON s.id = wt.service_id
  `;
  const conditions = [];

  if (status) {
    conditions.push(`wt.status = ?`);
  }

  if (deleted !== 'true') {
    conditions.push(`wt.deleted_at IS NULL`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  const params = status ? [status] : [];
  const turns = db.prepare(query + ` ORDER BY wt.created_at DESC`).all(...params);
  res.json(turns);
});

// Crear turno
router.post('/', authenticate, (req, res) => {
  const { plate, brand, model, color, client_name, client_phone, service_id, notes } = req.body;
  if (!plate || !client_name || !service_id) {
    return res.status(400).json({ error: 'Placa, nombre del cliente y servicio requeridos' });
  }

  const db = getDb();

  // Buscar o crear vehículo
  let vehicle = db.prepare('SELECT * FROM vehicles WHERE plate = ?').get(plate);
  if (!vehicle) {
    vehicle = { id: uuid(), plate, brand, model, color, client_name, client_phone };
    db.prepare(`INSERT INTO vehicles (id, plate, brand, model, color, client_name, client_phone) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(vehicle.id, plate, brand || '', model || '', color || '', client_name, client_phone || '');
  }

  const turnId = uuid();
  const qrToken = generateQrToken();

  db.prepare(`
    INSERT INTO wash_turns (id, vehicle_id, service_id, status, qr_token, notes)
    VALUES (?, ?, ?, 'pendiente', ?, ?)
  `).run(turnId, vehicle.id, service_id, qrToken, notes || '');
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

  const qrUrl = `${baseUrl}/cliente?token=${qrToken}`;

  res.status(201).json({
    id: turnId,
    qr_token: qrToken,
    qr_url: qrUrl,
    client_name,
    plate
  });
});

// Actualizar estado del turno
router.patch('/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pendiente', 'en_progreso', 'completado', 'cancelado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT * FROM wash_turns WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Turno no encontrado' });

  const completedAt = status === 'completado' ? new Date().toISOString() : null;
  db.prepare('UPDATE wash_turns SET status = ?, completed_at = COALESCE(?, completed_at) WHERE id = ?')
    .run(status, completedAt, req.params.id);

  // Si se completa el turno, generar factura automática
  if (status === 'completado') {
    const service = db.prepare('SELECT price FROM services WHERE id = ?').get(existing.service_id);
    const cafeOrders = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM cafe_orders WHERE wash_turn_id = ? AND status != ?')
      .get(existing.id, 'cancelado');

    const subtotal = (service?.price || 0) + (cafeOrders?.total || 0);
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // ITBIS 18%
    const total = subtotal + tax;

    // Verificar si ya existe factura para este turno
    const existingInvoice = db.prepare('SELECT id FROM invoices WHERE wash_turn_id = ?').get(existing.id);
    if (!existingInvoice && total > 0) {
      const { v4: uuid } = require('uuid');
      db.prepare(`
        INSERT INTO invoices (id, wash_turn_id, subtotal, tax, total, status, payment_method)
        VALUES (?, ?, ?, ?, ?, 'pendiente', 'efectivo')
      `).run(uuid(), existing.id, subtotal, tax, total);
    }
  }

  res.json({ message: `Turno actualizado a ${status}` });
});

// Soft delete turno completado
router.patch('/:id/soft-delete', authenticate, (req, res) => {
  const db = getDb();
  const turn = db.prepare('SELECT * FROM wash_turns WHERE id = ?').get(req.params.id);
  if (!turn) return res.status(404).json({ error: 'Turno no encontrado' });

  if (turn.status !== 'completado') {
    return res.status(400).json({ error: 'Solo se pueden eliminar turnos completados' });
  }

  db.prepare("UPDATE wash_turns SET deleted_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ message: 'Turno eliminado correctamente' });
});

// Generar QR para un turno
router.get('/:id/qr', authenticate, (req, res) => {
  const db = getDb();
  const turn = db.prepare('SELECT * FROM wash_turns WHERE id = ?').get(req.params.id);
  if (!turn) return res.status(404).json({ error: 'Turno no encontrado' });

  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
  const qrUrl = `${baseUrl}/cliente?token=${turn.qr_token}`;

  QRCode.toDataURL(qrUrl, (err, url) => {
    if (err) return res.status(500).json({ error: 'Error generando QR' });
    res.json({ qr_code: url, url: qrUrl });
  });
});

module.exports = router;
