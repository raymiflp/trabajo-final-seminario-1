const express = require('express');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/resumen', authenticate, (req, res) => {
  const db = getDb();

  const pendingTurns = db.prepare("SELECT COUNT(*) as count FROM wash_turns WHERE status = 'pendiente'").get().count;
  const inProgressTurns = db.prepare("SELECT COUNT(*) as count FROM wash_turns WHERE status = 'en_progreso'").get().count;
  const todayTurns = db.prepare("SELECT COUNT(*) as count FROM wash_turns WHERE date(created_at) = date('now')").get().count;

  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM cafe_orders WHERE status IN ('pendiente','preparando')").get().count;

  const todayRevenue = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as total
    FROM invoices
    WHERE status = 'pagado' AND date(created_at) = date('now')
  `).get().total;

  const pendingRevenue = db.prepare(`
    SELECT COALESCE(SUM(total), 0) as total
    FROM invoices
    WHERE status = 'pendiente' AND date(created_at) = date('now')
  `).get().total;

  const totalTodayRevenue = todayRevenue + pendingRevenue;

  const recentTurns = db.prepare(`
    SELECT wt.*, v.plate, v.client_name, v.brand, v.model, s.name as service_name
    FROM wash_turns wt
    JOIN vehicles v ON v.id = wt.vehicle_id
    JOIN services s ON s.id = wt.service_id
    ORDER BY wt.created_at DESC LIMIT 10
  `).all();

  res.json({
    pendingTurns,
    inProgressTurns,
    todayTurns,
    pendingOrders,
    todayRevenue,
    pendingRevenue,
    totalTodayRevenue,
    recentTurns
  });
});

module.exports = router;
