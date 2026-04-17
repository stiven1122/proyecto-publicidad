const express = require('express')
const router = express.Router()
const reporteController = require('../controllers/reporteController')

router.get('/reportes', reporteController.obtenerReportes)
router.post('/reportes', reporteController.crearReporte)

router.get('/reportes/campanas', reporteController.obtenerReporteCampana)

module.exports = router