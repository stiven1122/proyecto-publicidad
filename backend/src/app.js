const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const clienteRoutes = require('./routes/clienteRoutes')
const campanaRoutes = require('./routes/campanaRoutes')
const productoRoutes = require('./routes/productoRoutes')
const metricaRoutes = require('./routes/metricaRoutes')
const reporteRoutes = require('./routes/reporteRoutes')
const integracionRoutes = require('./routes/integracionRoutes')
const notificacionRoutes = require('./routes/notificacionRoutes')
const panelRoutes = require('./routes/panelRoutes')
const cotizacionRoutes = require('./routes/cotizacionRoutes')
const campanaProductoRoutes = require('./routes/campanaProductoRoutes')
const { authMiddleware, adminMiddleware } = require('./middlewares/auth')
const authController = require('./controllers/authControllers')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ 
  mensaje: 'Bienvenido a la API de AdManager Pro', 
  estado: 'Servidor funcionando correctamente',
  version: '1.0.0',
  documentacion: '/api/health'
}))

app.get('/api/health', (req, res) => res.json({ 
  mensaje: 'API funcionando correctamente',
  estado: 'ok',
  timestamp: new Date().toISOString()
}))

app.use('/api/auth', authRoutes)
app.get('/api/usuarios', authMiddleware, adminMiddleware, authController.obtenerUsuarios)
app.use('/api/clientes', clienteRoutes)
app.use('/api/campanas', campanaProductoRoutes) // Debe ir antes de campanaRoutes para evitar conflictos de rutas
app.use('/api/campanas', campanaRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/metricas', metricaRoutes)
app.use('/api/reportes', reporteRoutes)
app.use('/api/integraciones', integracionRoutes)
app.use('/api/notificaciones', notificacionRoutes)
app.use('/api/panel', panelRoutes)
app.use('/api/cotizaciones', cotizacionRoutes)

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe en esta API. Verifica la documentación.`
  })
})

// 500 - Error global del servidor
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err)
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.'
  })
})

module.exports = app
