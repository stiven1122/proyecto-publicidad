const express = require('express')
const router = express.Router()
const reporteController = require('../controllers/reporteControllers')

router.get('/', reporteController.obtenerReportes)
router.post('/', reporteController.crearReporte)

router.get('/campanas', reporteController.obtenerReporteCampana)

module.exports = router