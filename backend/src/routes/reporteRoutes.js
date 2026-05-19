const express = require('express')
const router = express.Router()
const { authMiddleware, adminMiddleware } = require('../middlewares/auth')
const {
  obtenerReportes,
  generarReporte,
  reporteCampana
} = require('../controllers/reporteControllers')

router.get('/', authMiddleware, obtenerReportes)
router.post('/generar', authMiddleware, adminMiddleware, generarReporte)
router.get('/campana/resumen', authMiddleware, reporteCampana)

module.exports = router
