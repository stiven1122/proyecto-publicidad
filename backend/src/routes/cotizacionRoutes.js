const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
    listarCotizacionesCampana,
    crearCotizacionCampana,
    cotizarCotizacionCampana,
    actualizarEstadoCotizacionCampana,
    listarCotizacionesProducto,
    crearCotizacionProducto,
    actualizarEstadoCotizacionProducto
} = require('../controllers/cotizacionControllers')

// Cotizaciones de Campaña
router.get('/campanas', authMiddleware, listarCotizacionesCampana)
router.post('/campanas', authMiddleware, crearCotizacionCampana)
router.put('/campanas/:id/cotizar', authMiddleware, adminMiddleware, cotizarCotizacionCampana)
router.put('/campanas/:id/estado', authMiddleware, actualizarEstadoCotizacionCampana)

// Cotizaciones de Producto
router.get('/productos', authMiddleware, listarCotizacionesProducto)
router.post('/productos', authMiddleware, crearCotizacionProducto)
router.put('/productos/:id/estado', authMiddleware, adminMiddleware, actualizarEstadoCotizacionProducto)

module.exports = router
