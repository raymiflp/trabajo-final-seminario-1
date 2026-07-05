const express = require('express');
const { v4: uuid } = require('uuid');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Obtener pedidos activos (para barista)
router.get('/active', authenticate, (req, res) => {
  const db = getDb();
  const orders = db.prepare(`
    SELECT co.*, v.plate, v.client_name,
           GROUP_CONCAT(oi.quantity || 'x ' || mi.name, ', ') as items_list
    FROM cafe_orders co
    LEFT JOIN wash_turns wt ON wt.id = co.wash_turn_id
    LEFT JOIN vehicles v ON v.id = wt.vehicle_id
    LEFT JOIN order_items oi ON oi.order_id = co.id
    LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE co.status IN ('pendiente', 'preparando')
    GROUP BY co.id
    ORDER BY co.created_at ASC
  `).all();
  res.json(orders);
});

// Obtener pedidos de un turno
router.get('/turn/:turnId', (req, res) => {
  const db = getDb();
  const orders = db.prepare(`
    SELECT co.*,
           GROUP_CONCAT(json_object('id', oi.id, 'name', mi.name, 'quantity', oi.quantity, 'unit_price', oi.unit_price, 'notes', oi.notes)) as items
    FROM cafe_orders co
    LEFT JOIN order_items oi ON oi.order_id = co.id
    LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE co.wash_turn_id = ?
    GROUP BY co.id
    ORDER BY co.created_at DESC
  `).all(req.params.turnId);
  res.json(orders);
});

// Crear pedido (público - desde QR)
router.post('/', (req, res) => {
  const { wash_turn_id, table_number, client_name, items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Debe incluir al menos un item' });
  }

  const db = getDb();
  const orderId = uuid();
  let total = 0;

  const insertItem = db.prepare(`
    INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertOrder = db.prepare(`
    INSERT INTO cafe_orders (id, wash_turn_id, table_number, client_name, total)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transact = db.transaction(() => {
    // Primero crear la orden
    insertOrder.run(orderId, wash_turn_id || null, table_number || null, client_name || '', 0);
    // Luego insertar items (ya existe la orden, foreign key OK)
    for (const item of items) {
      const menuItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(item.menu_item_id);
      if (!menuItem) throw new Error(`Item ${item.menu_item_id} no encontrado`);
      const unitPrice = menuItem.price;
      total += unitPrice * (item.quantity || 1);
      insertItem.run(uuid(), orderId, item.menu_item_id, item.quantity || 1, unitPrice, item.notes || '');
    }
    // Actualizar total
    db.prepare('UPDATE cafe_orders SET total = ? WHERE id = ?').run(total, orderId);
  });

  try {
    transact();
    res.status(201).json({ id: orderId, total });
  } catch (err) {
    console.error('❌ Error al crear pedido:', {
      message: err.message,
      body: req.body,
    });
    res.status(400).json({ error: err.message });
  }
});

// Actualizar estado del pedido
router.patch('/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  const db = getDb();
  const order = db.prepare('SELECT * FROM cafe_orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

  db.prepare('UPDATE cafe_orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: `Pedido actualizado a ${status}` });
});

// Obtener detalle de un pedido
router.get('/:id', (req, res) => {
  const db = getDb();
  const order = db.prepare(`
    SELECT co.*, v.plate, v.client_name
    FROM cafe_orders co
    LEFT JOIN wash_turns wt ON wt.id = co.wash_turn_id
    LEFT JOIN vehicles v ON v.id = wt.vehicle_id
    WHERE co.id = ?
  `).get(req.params.id);

  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

  const items = db.prepare(`
    SELECT oi.*, mi.name, mi.category
    FROM order_items oi
    JOIN menu_items mi ON mi.id = oi.menu_item_id
    WHERE oi.order_id = ?
  `).all(req.params.id);

  res.json({ ...order, items });
});

module.exports = router;
