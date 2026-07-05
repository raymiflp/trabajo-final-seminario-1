const express = require('express');
const { v4: uuid } = require('uuid');
const { getDb } = require('../database/init');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM menu_items WHERE is_available = 1 ORDER BY category, name').all();
  res.json(items);
});

router.get('/all', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
  res.json(items);
});

router.post('/', authenticate, (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nombre, precio y categoría requeridos' });
  }

  const validCategories = ['bebidas', 'comidas', 'postres', 'otros'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Categoría inválida' });
  }

  const db = getDb();
  const id = uuid();
  db.prepare(`INSERT INTO menu_items (id, name, description, price, category) VALUES (?, ?, ?, ?, ?)`)
    .run(id, name, description || '', price, category);

  res.status(201).json({ id, name, description, price, category });
});

router.put('/:id', authenticate, (req, res) => {
  const { name, description, price, category, is_available } = req.body;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Item no encontrado' });

  db.prepare(`UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, is_available = ? WHERE id = ?`)
    .run(
      name || existing.name,
      description !== undefined ? description : existing.description,
      price || existing.price,
      category || existing.category,
      is_available !== undefined ? is_available : existing.is_available,
      req.params.id
    );

  res.json({ message: 'Item actualizado' });
});

module.exports = router;
