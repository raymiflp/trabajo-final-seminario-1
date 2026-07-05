const express = require('express');
const { v4: uuid } = require('uuid');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const invoices = db.prepare(`
    SELECT i.*, v.plate, v.client_name, s.name as service_name
    FROM invoices i
    JOIN wash_turns wt ON wt.id = i.wash_turn_id
    JOIN vehicles v ON v.id = wt.vehicle_id
    JOIN services s ON s.id = wt.service_id
    ORDER BY i.created_at DESC
  `).all();
  res.json(invoices);
});

router.post('/', authenticate, (req, res) => {
  const { wash_turn_id, cafe_order_id, payment_method } = req.body;
  if (!wash_turn_id) {
    return res.status(400).json({ error: 'ID de turno requerido' });
  }

  const db = getDb();
  const turn = db.prepare(`
    SELECT wt.*, s.price as service_price
    FROM wash_turns wt
    JOIN services s ON s.id = wt.service_id
    WHERE wt.id = ?
  `).get(wash_turn_id);

  if (!turn) return res.status(404).json({ error: 'Turno no encontrado' });

  let cafeTotal = 0;
  if (cafe_order_id) {
    const order = db.prepare('SELECT total FROM cafe_orders WHERE id = ?').get(cafe_order_id);
    if (order) cafeTotal = order.total;
  }

  const subtotal = turn.service_price + cafeTotal;
  const tax = subtotal * 0.18; // ITBIS 18%
  const total = subtotal + tax;
  const id = uuid();

  db.prepare(`
    INSERT INTO invoices (id, wash_turn_id, cafe_order_id, subtotal, tax, total, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
  `).run(id, wash_turn_id, cafe_order_id || null, subtotal, tax, total, payment_method || 'efectivo');

  res.status(201).json({ id, subtotal, tax, total });
});

router.delete('/:id', authenticate, (req, res) => {
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

  db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
  res.json({ message: 'Factura eliminada' });
});

router.patch('/:id/pay', authenticate, (req, res) => {
  const { payment_method } = req.body;
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

  db.prepare('UPDATE invoices SET status = ?, payment_method = COALESCE(?, payment_method) WHERE id = ?')
    .run('pagado', payment_method, req.params.id);

  res.json({ message: 'Factura pagada' });
});

module.exports = router;
