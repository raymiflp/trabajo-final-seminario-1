const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', '..', 'carwash.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    seedDefaults();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin' CHECK(role IN ('admin','cashier','barista')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 30,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('bebidas','comidas','postres','otros')),
      is_available INTEGER DEFAULT 1,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      plate TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      color TEXT,
      client_name TEXT NOT NULL,
      client_phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wash_turns (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pendiente' CHECK(status IN ('pendiente','en_progreso','completado','cancelado')),
      assigned_to TEXT,
      qr_token TEXT UNIQUE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS cafe_orders (
      id TEXT PRIMARY KEY,
      wash_turn_id TEXT,
      table_number INTEGER,
      client_name TEXT,
      status TEXT NOT NULL DEFAULT 'pendiente' CHECK(status IN ('pendiente','preparando','listo','entregado','cancelado')),
      total REAL NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wash_turn_id) REFERENCES wash_turns(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      menu_item_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (order_id) REFERENCES cafe_orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      wash_turn_id TEXT NOT NULL,
      cafe_order_id TEXT,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT CHECK(payment_method IN ('efectivo','tarjeta','transferencia')),
      status TEXT DEFAULT 'pendiente' CHECK(status IN ('pendiente','pagado','anulado')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wash_turn_id) REFERENCES wash_turns(id),
      FOREIGN KEY (cafe_order_id) REFERENCES cafe_orders(id)
    );
  `);

  // Migration: add deleted_at to wash_turns if not exists
  const turnColumns = db.prepare("PRAGMA table_info(wash_turns)").all();
  if (!turnColumns.find(col => col.name === 'deleted_at')) {
    db.exec("ALTER TABLE wash_turns ADD COLUMN deleted_at DATETIME DEFAULT NULL");
  }
}

function seedDefaults() {
  const adminExists = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (adminExists) return;

  const { v4: uuid } = require('uuid');
  const hash = bcrypt.hashSync('admin123', 10);

  db.prepare(`INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`).run(
    uuid(), 'Admin', 'admin@carwash.com', hash, 'admin'
  );

  const defaultServices = [
    { name: 'Lavado Básico', desc: 'Lavado exterior con champú y enjuague', price: 350, mins: 20 },
    { name: 'Lavado Completo', desc: 'Lavado exterior + interior + aspirado', price: 600, mins: 40 },
    { name: 'Lavado Premium', desc: 'Lavado completo + encerado + aromatizante', price: 900, mins: 60 },
    { name: 'Lavado de Motor', desc: 'Limpieza profunda del motor', price: 500, mins: 30 },
  ];

  const stmt = db.prepare(`INSERT INTO services (id, name, description, price, duration_minutes) VALUES (?, ?, ?, ?, ?)`);
  defaultServices.forEach(s => stmt.run(uuid(), s.name, s.desc, s.price, s.mins));

  const defaultMenu = [
    { name: 'Café Americano', desc: 'Café negro recién colado', price: 80, cat: 'bebidas' },
    { name: 'Café Latte', desc: 'Espresso con leche vaporizada', price: 110, cat: 'bebidas' },
    { name: 'Capuchino', desc: 'Espresso con leche y espuma', price: 120, cat: 'bebidas' },
    { name: 'Jugo Natural', desc: 'Jugo de fruta natural del día', price: 90, cat: 'bebidas' },
    { name: 'Botella de Agua', desc: 'Agua mineral 500ml', price: 40, cat: 'bebidas' },
    { name: 'Refresco', desc: 'Refresco en lata 355ml', price: 50, cat: 'bebidas' },
    { name: 'Sándwich Club', desc: 'Pan tostado con pollo, lechuga y tomate', price: 180, cat: 'comidas' },
    { name: 'Empanada de Queso', desc: 'Empanada horneada rellena de queso', price: 70, cat: 'comidas' },
    { name: 'Pastelito de Carne', desc: 'Pastelito horneado relleno de carne', price: 75, cat: 'comidas' },
    { name: 'Brownie', desc: 'Brownie de chocolate con nueces', price: 95, cat: 'postres' },
    { name: 'Fruta Picada', desc: 'Taza de fruta fresca variada', price: 85, cat: 'postres' },
  ];

  const menuStmt = db.prepare(`INSERT INTO menu_items (id, name, description, price, category) VALUES (?, ?, ?, ?, ?)`);
  defaultMenu.forEach(m => menuStmt.run(uuid(), m.name, m.desc, m.price, m.cat));
}

module.exports = { getDb };
