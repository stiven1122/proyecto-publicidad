const express = require('express')
const router = express.Router()
const reporteController = require('../controllers/reporteControllers')

router.get('/', reporteController.obtenerReportes)
router.get('/:id', reporteController.obtenerReportePorId)
router.post('/', reporteController.crearReporte)
router.put('/:id', reporteController.actualizarReporte) 
router.delete('/:id', reporteController.eliminarReporte)
router.get('/campanas', reporteController.obtenerReporteCampana)

module.exports = router