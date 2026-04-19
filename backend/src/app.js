const express = require('express')
const cors = require('cors')

const clienteRoutes = require('./routes/clienteRoutes')
const usuariosRoutes = require('./routes/usuariosRoutes')
const campanaRoutes = require('./routes/campanaRoutes')
const anuncioRoutes = require('./routes/anuncioRoutes')
const pagoRoutes = require('./routes/pagoRoutes')
const reporteRoutes = require('./routes/reporteRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ mensaje: 'Bienvenido a la API de Publicidad. El servidor está funcionando.' }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'API funcionando correctamente' }))

app.use('/api/clientes', clienteRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/campanas', campanaRoutes)
app.use('/api/anuncios', anuncioRoutes)
app.use('/api/pagos', pagoRoutes)
app.use('/api/reportes', reporteRoutes)

module.exports = app