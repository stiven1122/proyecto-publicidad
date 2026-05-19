const express = require('express')
const router = express.Router()
const pagoController = require('../controllers/pagoControllers')

router.get('/', pagoController.obtenerPagos)
router.get('/:id', pagoController.obtenerPagoPorId)
router.post('/', pagoController.crearPago)
router.put('/:id', pagoController.actualizarPago)
router.delete('/:id', pagoController.eliminarPago)

module.exports = router