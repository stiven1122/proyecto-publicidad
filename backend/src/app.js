const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./routes/clientesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const campanaRoutes = require('./routes/campanaRoutes');
const anuncioRoutes = require('./routes/anuncioRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Prefijos claros por módulo
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/campanas', campanaRoutes);
app.use('/api/anuncios', anuncioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/reportes', reporteRoutes);

module.exports = app;