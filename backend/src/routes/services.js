const express = require('express');
const { v4: uuid } = require('uuid');
const { getDb } = require('../database/init');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY name').all();
  res.json(services);
});

router.get('/all', authenticate, (req, res) => {
  const db = getDb();
  const services = db.prepare('SELECT * FROM services ORDER BY name').all();
  res.json(services);
});

router.post('/', authenticate, (req, res) => {
  const { name, description, price, duration_minutes } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Nombre y precio requeridos' });
  }

  const db = getDb();
  const id = uuid();
  db.prepare(`INSERT INTO services (id, name, description, price, duration_minutes) VALUES (?, ?, ?, ?, ?)`)
    .run(id, name, description || '', price, duration_minutes || 30);

  res.status(201).json({ id, name, description, price, duration_minutes: duration_minutes || 30 });
});

router.put('/:id', authenticate, (req, res) => {
  const { name, description, price, duration_minutes, is_active } = req.body;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Servicio no encontrado' });

  db.prepare(`UPDATE services SET name = ?, description = ?, price = ?, duration_minutes = ?, is_active = ? WHERE id = ?`)
    .run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      price || existing.price,
      duration_minutes || existing.duration_minutes,
      is_active !== undefined ? is_active : existing.is_active,
      req.params.id
    );

  res.json({ message: 'Servicio actualizado' });
});

module.exports = router;
