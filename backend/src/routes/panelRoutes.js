const express = require('express')
const router = express.Router()
const { authMiddleware } = require('../middlewares/auth')
const { obtenerEstadisticas, obtenerGraficaProductos, obtenerGraficaClientes } = require('../controllers/panelControllers')

router.get('/estadisticas', authMiddleware, obtenerEstadisticas)
router.get('/graficas/productos', authMiddleware, obtenerGraficaProductos)
router.get('/graficas/clientes', authMiddleware, obtenerGraficaClientes)

module.exports = router
