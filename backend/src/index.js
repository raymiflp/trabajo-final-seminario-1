const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const menuRoutes = require('./routes/menu');
const turnsRoutes = require('./routes/turns');
const ordersRoutes = require('./routes/orders');
const invoicesRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/turns', turnsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'CarWash & Café El Punto' });
});

// Error handler global — evita que el server se caiga
app.use((err, req, res, next) => {
  console.error('❌ Error no capturado:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Catch de promesas rechazadas no capturadas
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
});

app.listen(PORT, () => {
  console.log(`🚗 CarWash & Café El Punto API corriendo en http://localhost:${PORT}`);
});
